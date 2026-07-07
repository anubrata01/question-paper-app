# models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ("SME", "SME"),
        ("USER", "USER"),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES
    )



# from django.db import models
from django.conf import settings

# question paper

class QuestionPaper(models.Model):
    exam_name = models.CharField(max_length=200)
    duration = models.IntegerField()
    is_started = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
# questions 
class Question(models.Model):

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    question_paper = models.ForeignKey(
        QuestionPaper,
        on_delete=models.CASCADE

    )    

    question_text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_answer = models.CharField(
        max_length=1,
        choices=[
            ("A", "A"),
            ("B", "B"),
            ("C", "C"),
            ("D", "D"),
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text[:50]
    



# usesr submission

class UserSubmission(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    question_paper = models.ForeignKey(QuestionPaper,on_delete=models.CASCADE)

    question = models.ForeignKey(Question,on_delete=models.CASCADE)

    selected_option = models.CharField(max_length=2)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "question")


# user attempt

class ExamAttempt(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    question_paper = models.ForeignKey(QuestionPaper,on_delete=models.CASCADE)

    started_at = models.DateField(auto_now_add=True)

    completed = models.BooleanField(default=False)

    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ("user", "question_paper")
        

