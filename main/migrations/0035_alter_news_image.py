# Generated by Django 5.0.3 on 2024-05-16 17:23

import main.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0034_remove_comment_disliked_by_remove_comment_liked_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='image',
            field=models.ImageField(upload_to=main.models.news_image_path),
        ),
    ]