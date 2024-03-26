# Generated by Django 5.0.3 on 2024-03-22 21:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'Користувачі', 'verbose_name_plural': 'Користувачі'},
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('image', models.ImageField(upload_to='news_images/')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.user')),
            ],
            options={
                'verbose_name': 'Новини',
                'verbose_name_plural': 'Новини',
            },
        ),
    ]