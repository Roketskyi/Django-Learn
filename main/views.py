from django.shortcuts import render, get_object_or_404, redirect
from .models import News, Base
from django.contrib import messages

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
        user = Base.objects.filter(login=login_username, password=login_password).first()
        
        if user:
            request.session['user_id'] = user.id  # Збереження ID користувача в сесії
            return redirect('/')  # Redirect to home page
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
                return redirect('register')
            elif Base.objects.filter(email=email).exists():
                messages.error(request, 'Email вже використовується.')
                return redirect('register')
            else:
                # Шифрування пароля перед збереженням
                user = Base(login=username, email=email, password=password, role='2')  # 'role' може бути змінено відповідно до вашої логіки
                user.save()
                messages.success(request, 'Реєстрація пройшла успішно!')
                return redirect('/')
        else:
            messages.error(request, 'Паролі не співпадають.')
            return redirect('register')

    return render(request, 'main/index.html')  # Виправлено повернення шаблону у випадку GET-запиту