from django.db import models

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