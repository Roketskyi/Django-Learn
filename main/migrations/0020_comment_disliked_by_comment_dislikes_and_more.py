# Generated by Django 5.0.3 on 2024-05-17 00:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0019_base_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='disliked_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='disliked_comments', to='main.base'),
        ),
        migrations.AddField(
            model_name='comment',
            name='dislikes',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='comment',
            name='liked_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='liked_comments', to='main.base'),
        ),
        migrations.AddField(
            model_name='comment',
            name='likes',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='comment',
            name='reply_count',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
