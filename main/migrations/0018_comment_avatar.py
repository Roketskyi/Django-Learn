# Generated by Django 5.0.3 on 2024-05-14 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_alter_comment_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
