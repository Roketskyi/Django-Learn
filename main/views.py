from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import News, Base
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken

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

def register_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        role = request.POST.get('role')

        user = Base.objects.create_user(email=email, password=password, role=role)
        
        if user:
            return JsonResponse({'message': 'Registration successful'})
        else:
            return JsonResponse({'error': 'Registration failed'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
