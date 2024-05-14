from django.db import models
from django.conf import settings
from django.urls import reverse

class Base(models.Model):
    id = models.AutoField(primary_key=True)
    login = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.CharField(max_length=50)

    def update_login(self, new_login):
        self.login = new_login
        self.save()

    def __str__(self):
        return self.login

class News(models.Model):
    title = models.CharField(max_length=255)
    byte_content = models.TextField()  # Текст без форматування
    html_content = models.TextField()  # HTML-форматований текст новини
    author = models.ForeignKey('Base', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='news_images/')

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Новину'
        verbose_name_plural = 'Новини'

class Comment(models.Model):
    user = models.ForeignKey(Base, on_delete=models.CASCADE)  # Змінюємо ForeignKey на вашу модель користувача
    news = models.ForeignKey('News', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f'Comment by {self.user} on {self.news}'

    def get_absolute_url(self):
        return reverse('comment_detail', kwargs={'pk': self.pk})