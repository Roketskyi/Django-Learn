from django.db import models

class User(models.Model):
    login = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.IntegerField()

    def __str__(self):
        return self.login
    
    class Meta:
        verbose_name = 'Користувача'
        verbose_name_plural = 'Користувачі'


class News(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    byte_content = models.TextField(null=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='news_images/')

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Новину'
        verbose_name_plural = 'Новини'
