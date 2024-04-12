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
            return redirect('/')  # Redirect to home page
        else:
            messages.error(request, 'Невірний логін або пароль')

    return redirect('/')

def user_logout(request):
    if 'user_id' in request.session:
        del request.session['user_id']
        messages.success(request, "You have successfully logged out.")
    return redirect('/')