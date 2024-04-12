from django.shortcuts import render, get_object_or_404, redirect
from .models import News, Base
from django.contrib import messages
from django.http import JsonResponse

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
            request.session['user_role'] = user.role  # Збереження ролі користувача в сесії
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
            elif Base.objects.filter(email=email).exists():
                messages.error(request, 'Email вже використовується.')
            else:
                # Шифрування пароля перед збереженням
                user = Base(login=username, email=email, password=password, role='2')  # 'role' може бути змінено відповідно до вашої логіки
                user.save()
                messages.success(request, 'Реєстрація пройшла успішно!')
                return redirect('/')
        else:
            messages.error(request, 'Паролі не співпадають.')

    return render(request, 'main/index.html')  # Виправлено повернення шаблону у випадку GET-запиту

def admin_panel(request):
    # Перевіряємо, чи є у користувача ID і роль в сесії
    if request.session.get('user_id') and request.session.get('user_role') == '4':
        return render(request, 'main/admin_panel.html')
    else:
        # Якщо у користувача немає ролі 4, перенаправляємо його на головну сторінку
        return redirect('/')
    
def get_users(request):
    if request.session.get('user_role') == '4':  # Перевірка ролі
        users = Base.objects.all().values('id', 'login', 'email', 'role')
        return JsonResponse(list(users), safe=False)
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

def delete_user(request, user_id):
    if request.session.get('user_role') == '4':  # Перевірка ролі
        try:
            user = Base.objects.get(id=user_id)
            user.delete()
            return JsonResponse({'success': 'Користувач видалений'})
        except Base.DoesNotExist:
            return JsonResponse({'error': 'Користувач не знайдений'}, status=404)
    else:
        return JsonResponse({'error': 'Недозволено'}, status=401)