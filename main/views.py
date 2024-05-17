from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse, HttpResponseForbidden
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.core import serializers
from .models import News, Base, Comment
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.views.generic import DetailView
from django.urls import reverse

class IndexView(View):
    def get(self, request):
        news = News.objects.all()
        user_id = request.session.get('user_id')
        user = None
        if user_id:
            user = Base.objects.get(pk=user_id)
        return render(request, 'main/index.html', {'title': 'Головна сторінка сайту', 'News': news, 'user': user})

class AboutView(View):
    def get(self, request):
        user_id = request.session.get('user_id')
        user = None
        if user_id:
            user = Base.objects.get(pk=user_id)

        return render(request, 'main/about.html', {'user': user})

class NewsListView(View):
    def get(self, request):
        news_items = News.objects.all()
        return render(request, 'main/news_list.html', {'news_items': news_items})

class UserLoginView(View):
    def post(self, request):
        login_username = request.POST.get('login_username')
        login_password = request.POST.get('login_password')
        user = Base.objects.filter(login=login_username).first()

        if user and check_password(login_password, user.password):
            request.session['user_id'] = user.id
            request.session['user_role'] = user.role
            return redirect('/')
        else:
            messages.error(request, 'Невірний логін або пароль')
            return redirect('/')

class UserLogoutView(View):
    def get(self, request):
        if 'user_id' in request.session:
            del request.session['user_id']
            messages.success(request, "You have successfully logged out.")
        return redirect('/')

class UserRegisterView(View):
    def post(self, request):
        username = request.POST.get('register_username')
        email = request.POST.get('register_email')
        password = request.POST.get('register_password')
        password_repeat = request.POST.get('register_password_repeat')

        if password == password_repeat:
            if Base.objects.filter(login=username).exists():
                messages.error(request, 'Користувач з таким логіном вже існує.')
            elif Base.objects.filter(email=email).exists():
                messages.error(request, 'Email вже використовується.')
            else:
                hashed_password = make_password(password)  # Хеширование пароля
                user = Base(login=username, email=email, password=hashed_password, role='2')
                user.save()
                messages.success(request, 'Реєстрація пройшла успішно!')
                return redirect('/')
        else:
            messages.error(request, 'Паролі не співпадають.')
        return render(request, 'main/index.html')

class AdminPanelView(View):
    def get(self, request):
        user_id = request.session.get('user_id')
        user = None
        if user_id:
            user = Base.objects.get(pk=user_id)
        
        if user_id and request.session.get('user_role') == '4':
            return render(request, 'main/admin_panel.html', {'user': user})
        else:
            return redirect('/')

class GetUsersView(View):
    @csrf_exempt
    def get(self, request):
        if request.session.get('user_role') == '4':
            users = Base.objects.all().values('id', 'login', 'email', 'role')
            return JsonResponse(list(users), safe=False)
        else:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        
class GetUserView(View):
    def get(self, request, user_id):
        user = get_object_or_404(Base, pk=user_id)
        user_data = {
            'id': user.id,
            'login': user.login,
            'email': user.email,
            'role': user.role,
        }
        return JsonResponse(user_data)

class DeleteUserView(View):
    @csrf_exempt
    def delete(self, request, user_id):  # Виправлений аргумент user_id
        if request.session.get('user_role') == '4':  # Перевірка чи є користувач адміністратором
            try:
                user = Base.objects.get(id=user_id)  # Змінено news на user
                user.delete()
                return JsonResponse({'success': 'Користувача видалено'}, status=200)  # Змінено текст повідомлення
            except Base.DoesNotExist:  # Змінено News.DoesNotExist на Base.DoesNotExist
                return JsonResponse({'error': 'Користувача не знайдено'}, status=404)  # Змінено текст повідомлення
        else:
            return JsonResponse({'error': 'Недозволено'}, status=401)  # Змінено текст повідомлення

class UpdateUserView(View):
    @csrf_exempt
    def post(self, request, user_id):
        user = get_object_or_404(Base, id=user_id)

        login = request.POST.get('login')
        email = request.POST.get('email')
        password = request.POST.get('password')
        role = request.POST.get('role')

        if login:
            user.login = login
        if email:
            user.email = email
        if password:
            user.password = make_password(password)
        if role:
            user.role = role

        user.save()

        # Отримання списку користувачів після оновлення
        users = Base.objects.all()
        users_data = serializers.serialize('json', users)

        return JsonResponse({'success': 'Дані користувача оновлені', 'users': users_data})

class ForgotPasswordView(View):
    @csrf_exempt
    def post(self, request):
        email = request.POST.get('email')
        user = Base.objects.filter(email=email).first()
        if user:
            # Генеруємо випадковий код для відновлення паролю
            code = get_random_string(length=6)

            # Зберігаємо код для перевірки та електронну пошту користувача
            user.reset_password_code = code
            user.save()

            # Відправляємо код на електронну пошту користувача
            send_mail(
                'Код для відновлення паролю',  # Тема листа
                f'Ваш код для відновлення паролю: {code}',  # Текст повідомлення
                'from@example.com',  # Адреса відправника (може бути будь-яка дійсна адреса електронної пошти)
                [email],  # Список отримувачів (у цьому випадку - один користувач)
                fail_silently=False,  # Параметр, який вказує, чи потрібно виводити повідомлення про помилку
            )

            return JsonResponse({'success': 'Код для відновлення паролю надіслано на вашу електронну пошту.', 'email': email}, status=200)
        else:
            return JsonResponse({'error': 'Користувача з такою електронною поштою не знайдено.'}, status=404)

class VerifyCodeView(View):
    @csrf_exempt
    def post(self, request):
        code = request.POST.get('code')
        user = Base.objects.filter(reset_password_code=code).first()
        if user:
            # Видаляємо код після перевірки
            user.reset_password_code = None
            user.save()
            return JsonResponse({'success': 'Код успішно перевірено.'}, status=200)
        else:
            return JsonResponse({'error': 'Неправильний код для відновлення паролю.'}, status=400)
        
class AddUserView(View):
    def post(self, request):
        username = request.POST.get('add_username')
        password = request.POST.get('add_password')
        email = request.POST.get('add_email')
        role = request.POST.get('add_role')

        if Base.objects.filter(login=username).exists():
            messages.error(request, 'Користувач з таким логіном вже існує.')
        elif Base.objects.filter(email=email).exists():
            messages.error(request, 'Email вже використовується.')
        else:
            hashed_password = make_password(password)
            user = Base(login=username, email=email, password=hashed_password, role=role)
            user.save()
            messages.success(request, 'Реєстрація пройшла успішно!')

        return JsonResponse({'success': 'Новий користувач доданий в базу', 'error': 'Помилка'})
    
class GetNewsView(View):
    def get(self, request):
        news_items = News.objects.all()
        data = list(news_items.values())
        return JsonResponse(data, safe=False)
    
class GetNewsDetailView(View):
    def get(self, request, news_id):
        try:
            news_item = News.objects.get(id=news_id)
            data = {
                'id': news_item.id,
                'title': news_item.title,
                'author_id': news_item.author_id,
                'created_at': news_item.created_at,
                # Додайте інші поля новини, які вам потрібні
            }
            return JsonResponse(data)
        except News.DoesNotExist:
            return JsonResponse({'error': 'Новину не знайдено.'}, status=404)

class AddNewsView(View):
    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            title = request.POST.get('title')
            byte_content = request.POST.get('byte_content')
            author_id = request.POST.get('author')
            html_content = request.POST.get('html_content')
            image = request.FILES.get('image')

            if title and byte_content and author_id and html_content:
                try:
                    author = Base.objects.get(pk=int(author_id))
                except (ValueError, Base.DoesNotExist):
                    return JsonResponse({'error': 'Недійсний ідентифікатор автора'}, status=400)

                news = News(title=title, byte_content=byte_content, author=author, html_content=html_content)
                if image:
                    news.image = image
                news.save()
                return JsonResponse({'success': 'Новину успішно додано.'})
            else:
                return JsonResponse({'error': 'Будь ласка, надайте всі необхідні дані для новини.'}, status=400)

class DeleteNewsView(View):
    def delete(self, request, news_id):
        try:
            news = News.objects.get(id=news_id)
            news.delete()
            return JsonResponse({'success': 'Новину успішно видалено.'}, status=200)
        except News.DoesNotExist:
            return JsonResponse({'error': 'Новину не знайдено.'}, status=404)

class SettingsProfileView(View):
    def get(self, request):
        user_id = request.session.get('user_id')
        user = None
        if user_id:
            user = Base.objects.get(pk=user_id)

        return render(request, 'main/settings_profile.html', {'user': user})

    @csrf_exempt
    def post(self, request):
        user_id = request.session.get('user_id')
        user = get_object_or_404(Base, id=user_id)

        new_avatar = request.FILES.get('avatar')

        if new_avatar:
            user.delete_old_avatar()  # Видалення попередньої аватарки
            user.avatar = new_avatar
            user.save()

            return JsonResponse({'success': 'Фотографію профілю успішно змінено', 'redirect': reverse('settings_profile')})
        else:
            return JsonResponse({'error': 'Файл фотографії не був переданий'}, status=400)
    
class UpdateUserProfileView(View):
    @csrf_exempt
    def post(self, request, user_id):
        new_login = request.POST.get('login')
        user = get_object_or_404(Base, id=user_id)

        if new_login:
            user.update_login(new_login)
            return JsonResponse({'success': 'Логін успішно оновлено'}, status=200)
        else:
            return JsonResponse({'error': 'Новий логін не може бути пустим'}, status=400)

class UpdateUserPasswordView(View):
    @csrf_exempt
    def post(self, request, user_id):
        old_password = request.POST.get('oldPassword')
        new_password = request.POST.get('newPassword')
        user = get_object_or_404(Base, id=user_id)

        if user.check_password(old_password):  # Перевірка старого паролю
            user.set_password(new_password)  # Встановлення нового паролю
            user.save()
            return JsonResponse({'success': 'Пароль успішно оновлено'}, status=200)
        else:
            return JsonResponse({'error': 'Старий пароль неправильний'}, status=400)

class AddCommentView(View):
    @csrf_exempt
    def post(self, request, pk):
        if request.method == 'POST':
            user_id = request.session.get('user_id')
            content = request.POST.get('content')

            if not user_id:
                return JsonResponse({'error': 'Потрібно авторизуватись, щоб залишити коментар.'}, status=401)

            if not content:
                return JsonResponse({'error': 'Будь ласка, введіть текст коментаря.'}, status=400)

            try:
                user = Base.objects.get(pk=user_id)
            except Base.DoesNotExist:
                return JsonResponse({'error': 'Користувач не існує.'}, status=404)

            news_item = get_object_or_404(News, pk=pk)

            comment = Comment.objects.create(user=user, news=news_item, content=content)
            comment.save()

            return JsonResponse({'success': 'Коментар успішно додано.'}, status=201)

class NewsDetailView(DetailView):
    model = News
    template_name = 'main/news_detail.html'  

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        news_item = self.get_object()
        comments = Comment.objects.filter(news=news_item).order_by('created_at')  # Сортування за created_at
        context['comments'] = comments
        context['news_item'] = news_item

        # Отримання інформації про користувача з сесії, якщо він увійшов у систему
        user_id = self.request.session.get('user_id')
        user = None
        if user_id:
            user = Base.objects.get(pk=user_id)
        
        # Передача інформації про користувача у контекст шаблону
        context['user'] = user
        return context
    
class DeleteCommentView(View):
    @csrf_exempt
    def delete(self, request, comment_id):
        if request.session.get('user_role') in ['3', '4']:  # Перевірка чи є користувач адміністратором або модератором
            try:
                comment = Comment.objects.get(id=comment_id)
                comment.delete()
                return JsonResponse({'success': 'Коментар успішно видалено'}, status=200)
            except Comment.DoesNotExist:
                return JsonResponse({'error': 'Коментар не знайдено'}, status=404)
        else:
            return HttpResponseForbidden("Ви не маєте права на видалення коментарів")
        
class UpdateLikesView(View):
    @csrf_exempt
    def post(self, request, comment_id):
        user_id = request.session.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'Потрібно увійти, щоб голосувати.'}, status=401)
        
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Коментар не знайдено'}, status=404)

        user = Base.objects.get(pk=user_id)
        if comment.disliked_by == user:
            comment.dislikes -= 1
            comment.disliked_by = None

        if comment.liked_by == user:
            comment.likes -= 1
            comment.liked_by = None
        else:
            comment.likes += 1
            comment.liked_by = user

        comment.save()
        return JsonResponse({'likes': comment.likes, 'dislikes': comment.dislikes}, status=200)

class UpdateDislikesView(View):
    @csrf_exempt
    def post(self, request, comment_id):
        user_id = request.session.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'Потрібно увійти, щоб голосувати.'}, status=401)
        
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Коментар не знайдено'}, status=404)

        user = Base.objects.get(pk=user_id)
        if comment.liked_by == user:
            comment.likes -= 1
            comment.liked_by = None

        if comment.disliked_by == user:
            comment.dislikes -= 1
            comment.disliked_by = None
        else:
            comment.dislikes += 1
            comment.disliked_by = user

        comment.save()
        return JsonResponse({'likes': comment.likes, 'dislikes': comment.dislikes}, status=200)