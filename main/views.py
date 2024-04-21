from django.shortcuts import render, get_object_or_404, redirect
from .models import News, Base
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password

def index(request):
    news = News.objects.all()
    return render(request, 'main/index.html', { 'title': 'Головна сторінка сайту', 'News': news })

def about(request):
    return render(request, 'main/about.html')

def news_detail(request, pk):
    news_item = get_object_or_404(News, pk=pk)
    return render(request, 'main/news_detail.html', {'news_item': news_item})

def news_list(request):
    news_items = News.objects.all()
    return render(request, 'main/news_list.html', {'news_items': news_items})

def user_login(request):
    if request.method == 'POST':
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

def user_logout(request):
    if 'user_id' in request.session:
        del request.session['user_id']
        messages.success(request, "You have successfully logged out.")
    return redirect('/')

def user_register(request):
    if request.method == 'POST':
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

def admin_panel(request):
    if request.session.get('user_id') and request.session.get('user_role') == '4':
        return render(request, 'main/admin_panel.html')
    else:
        return redirect('/')
    
@csrf_exempt
def get_users(request):
    if request.method == 'GET' and request.session.get('user_role') == '4':
        users = Base.objects.all().values('id', 'login', 'email', 'role')
        return JsonResponse(list(users), safe=False)
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

@csrf_exempt
def delete_user(request, user_id):
    if request.method == 'DELETE' and request.session.get('user_role') == '4':
        try:
            user = Base.objects.get(id=user_id)
            user.delete()
            return JsonResponse({'success': 'Користувач видалений'}, status=200)
        except Base.DoesNotExist:
            return JsonResponse({'error': 'Користувач не знайдений'}, status=404)
    else:
        return JsonResponse({'error': 'Недозволено'}, status=401)

from django.core import serializers

@csrf_exempt
@require_POST
def update_user(request, user_id):
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
        # Припускаючи, що ви хочете хешувати паролі перед збереженням
        user.password = make_password(password)
    if role:
        user.role = role

    user.save()  # Збереження змін в базі даних

    # Оновлення сесії користувача
    if request.session.get('user_id') == user_id:
        request.session['user_role'] = role

    # Отримання списку користувачів після оновлення
    users = Base.objects.all()
    users_data = serializers.serialize('json', users)

    return JsonResponse({'success': 'Дані користувача оновлені', 'users': users_data})


# Відновлення паролю

from django.core.mail import send_mail
from django.utils.crypto import get_random_string

@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
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

@csrf_exempt
def verify_code(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        user = Base.objects.filter(reset_password_code=code).first()
        if user:
            # Видаляємо код після перевірки
            user.reset_password_code = None
            user.save()
            return JsonResponse({'success': 'Код успішно перевірено.'}, status=200)
        else:
            return JsonResponse({'error': 'Неправильний код для відновлення паролю.'}, status=400)