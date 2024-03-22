from django.shortcuts import render
from .models import News

def index(request):
    news = News.objects.all()
    return render(request, 'main/index.html', { 'title': 'Головна сторінка сайту','News': news })

def about(request):
    return render(request, 'main/about.html')