from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import QuestionPaper, Question
from .models import *

admin.site.register(QuestionPaper)
admin.site.register(Question)
admin.site.register(ExamAttempt)
admin.site.register(UserSubmission)
admin.site.register(User)

