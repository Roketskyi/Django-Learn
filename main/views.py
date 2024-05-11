from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.core import serializers
from .models import News, Base
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

class IndexView(View):
    def get(self, request):
        news = News.objects.all()
        return render(request, 'main/index.html', {'title': 'Головна сторінка сайту', 'News': news })

class AboutView(View):
    def get(self, request):
        return render(request, 'main/about.html')

class NewsDetailView(View):
    def get(self, request, pk):
        news_item = get_object_or_404(News, pk=pk)
        return render(request, 'main/news_detail.html', {'news_item': news_item})

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
        if request.session.get('user_id') and request.session.get('user_role') == '4':
            return render(request, 'main/admin_panel.html')
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
    def delete(self, request, news_id):
        if request.session.get('user_role') == '4':  # Перевірка чи є користувач адміністратором
            try:
                news = News.objects.get(id=news_id)
                news.delete()
                return JsonResponse({'success': 'Новину видалено'}, status=200)
            except News.DoesNotExist:
                return JsonResponse({'error': 'Новину не знайдено'}, status=404)
        else:
            return JsonResponse({'error': 'Недозволено'}, status=401)

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
        # Логіка для отримання сторінки налаштувань профілю
        return render(request, 'main/settings_profile.html')
    
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
