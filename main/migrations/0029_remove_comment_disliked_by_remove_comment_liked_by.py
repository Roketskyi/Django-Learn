# Generated by Django 5.0.3 on 2024-05-16 15:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0028_remove_comment_disliked_by_remove_comment_liked_by_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='disliked_by',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='liked_by',
        ),
    ]
