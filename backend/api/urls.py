from django.contrib import admin
from django.urls import path,include
from api.views import *

urlpatterns = [
    # path('admin/', admin.site.urls),
    path("test/",HealthCheckView.as_view(),name="checkHealth"),
    path("login/",LoginView.as_view(),name="login"),
    path("register/",RegisterView.as_view(),name="register"),
    path("addQuestionPaper/",AddQuestionPaper.as_view(),name="add question paper"),
    path("question-paper/", AddQuestionPaper.as_view(), name="add-question-paper"),
    path("question-paper-list/", QuestionPaperList.as_view(), name="question-paper-drafts"),
    path("question-paper/<int:paper_id>/questions/", QuestionList.as_view(), name="question-paper-questions"),
    path("questions/", AddQuestion.as_view(), name="add-question"),
    path("questions/<int:question_id>/", UpdateQuestion.as_view(), name="update-question"),
    path("start-exam/",StartExam.as_view(),name="start exam"),
    path("stop-exam/",StopExam.as_view(),name="stop exam"),
    path("question-paper/published/",Exam.as_view(),name="Exam list"),


    path("sumbit-question-paper/",SubmitQuestionPaper.as_view(),name="submit question paper user side"),

    path("results/",QuestionPaperResultsView.as_view(),name="student result")

    
]