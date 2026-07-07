from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User

class HealthCheckView(APIView):

    def get(self, request):
        return Response(
            {
                "status": "success",
                "message": "Backend is running"
            },
            status=status.HTTP_200_OK
        )
    





class LoginView(APIView):






    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(
            username=username,
            password=password
        )
        print(f"username {request.data.get("username")} password {request.data.get("password")}")
        if not user:
            return Response(
                {
                    "success": False,
                    "message": "Invalid credentials"
                },
                status=401
            )

        return Response(
            {
                "success": True,
                "role": user.role,
                "username": user.username,
                "user id":user.id
            }
        )
    


class RegisterView(APIView):

    def post(self, request):

        user = User.objects.create_user(
            username=request.data["username"],
            password=request.data["password"],
            role=request.data["role"]
        )

        return Response(
            {
                "success": True,
                "user_id": user.id,
                "username": user.username
            },
            status=status.HTTP_201_CREATED
        )




from .models import QuestionPaper


class AddQuestionPaper(APIView):

    def post(self, request):

        question_paper = QuestionPaper.objects.create(
            exam_name=request.data["exam_name"],
            duration=request.data["duration"]
        )

        return Response(
            {
                "success": True,
                "question_paper_id": question_paper.id,
                "exam_name": question_paper.exam_name
            },
            status=status.HTTP_201_CREATED
        )
    

# add questions
from .models import Question, QuestionPaper


class AddQuestion(APIView):

    def post(self, request):

        question_paper = QuestionPaper.objects.get(
            id=request.data["question_paper_id"]
        )

        user = User.objects.get(
            id= request.data["user_id"]
        )

        question = Question.objects.create(
            created_by=user,
            question_paper=question_paper,
            question_text=request.data["question_text"],
            option_a=request.data["option_a"],
            option_b=request.data["option_b"],
            option_c=request.data["option_c"],
            option_d=request.data["option_d"],
            correct_answer=request.data["correct_answer"]
        )

        return Response(
            {
                "success": True,
                "question_id": question.id
            },
            status=status.HTTP_201_CREATED
        )


    

class QuestionPaperList(APIView):

    def get(self, request):

        papers = QuestionPaper.objects.all()

        data = []

        for paper in papers:
            data.append(
                {
                    "id": paper.id,
                    "exam_name": paper.exam_name,
                    "duration": paper.duration
                }
            )

        return Response(data)
    


class QuestionList(APIView):

    def get(self, request, paper_id):

        questions = Question.objects.filter(
            question_paper_id=paper_id
        )

        data = []

        for q in questions:
            data.append(
                {
                    "id": q.id,
                    "question": q.question_text,
                    "a": q.option_a,
                    "b": q.option_b,
                    "c": q.option_c,
                    "d": q.option_d,
                    "correct_answer":q.correct_answer
                }
            )
        print(data)
        return Response(data)
    



class DeleteQuestion(APIView):

    def delete(self, request, question_id):

        question = Question.objects.get(id=question_id)

        question.delete()

        return Response(
            {
                "success": True,
                "message": "Question deleted"
            }
        )
    

class UpdateQuestion(APIView):

    def put(self, request, question_id):

        question = Question.objects.get(id=question_id)

        question.question_text = request.data["question_text"]
        question.option_a = request.data["option_a"]
        question.option_b = request.data["option_b"]
        question.option_c = request.data["option_c"]
        question.option_d = request.data["option_d"]
        question.correct_answer = request.data["correct_answer"]

        question.save()

        return Response(
            {
                "success": True,
                "message": "Question updated"
            }
        )
    
from .models import UserSubmission


class SubmitAnswer(APIView):

    def post(self, request):
        question = Question.objects.get(
            id=request.data["question_id"]
        )

        submission = UserSubmission.objects.create(
            user=request.user,
            question=question,
            selected_option=request.data["selected_option"]
        )

        return Response(
            {
                "success": True,
                "submission_id": submission.id
            }
        )
    


from .models import ExamAttempt, QuestionPaper

class StartExam(APIView):

    def post(self, request):
        print("start exam",request.data)
        question_paper = QuestionPaper.objects.get(
            id=request.data["question_paper_id"]
        
        )
        question_paper.is_started=True
        question_paper.save()
        print("question paper",question_paper)

        # user = User.objects.get(
        #     id= request.data["user_id"]
        # )

        # attempt, created = ExamAttempt.objects.get_or_create(
        #     user=request.user,
        #     question_paper=question_paper
        # )

        if not question_paper:
            return Response(
                {
                    "success": False,
                    "message": "You have already attempted this exam"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "success": True,
                "exam_name": question_paper.exam_name
            }
        )
    


from .models import ExamAttempt, UserSubmission

class FinishExam(APIView):

    def post(self, request):

        attempt = ExamAttempt.objects.get(
            id=request.data["attempt_id"]
        )

        submissions = UserSubmission.objects.filter(
            user=attempt.user,
            question__question_paper=attempt.question_paper
        )

        score = 0

        for submission in submissions:

            if submission.selected_option == submission.question.correct_answer:
                score += 1

        attempt.score = score
        attempt.completed = True
        attempt.save()

        return Response(
            {
                "success": True,
                "score": score,
                "answered": submissions.count()
            }
        )
    

class ExamResult(APIView):

    def get(self, request, attempt_id):

        attempt = ExamAttempt.objects.get(
            id=attempt_id
        )

        return Response(
            {
                "exam_name": attempt.question_paper.exam_name,
                "score": attempt.score,
                "completed": attempt.completed,
                "started_at": attempt.started_at
            }
        )
    

class MyAttempts(APIView):

    def get(self, request):

        attempts = ExamAttempt.objects.filter(
            user=request.user
        )

        data = []

        for attempt in attempts:
            data.append(
                {
                    "attempt_id": attempt.id,
                    "exam_name": attempt.question_paper.exam_name,
                    "score": attempt.score,
                    "completed": attempt.completed
                }
            )

        return Response(data)
    

class Exam(APIView):
    def get(self,request):

        question_paper = QuestionPaper.objects.filter(is_started=True).values()
        for i in question_paper:
            print("i",i)
        print("active paper",question_paper)
        
        return Response(
            question_paper,
            status=status.HTTP_200_OK
        )


class StopExam(APIView):
    def post(self,request):
        question_paper = QuestionPaper.objects.get(
            id=request.data["question_paper_id"]
        
        )
        question_paper.is_started=False
        question_paper.save()
        print("question paper",question_paper)


        return Response(
            {
                "success": True,
                "exam_name": question_paper.exam_name,
                "exam status":question_paper.is_started
            }
        )
    

from datetime import timezone,datetime
class SubmitQuestionPaper(APIView):
    def post(self,request):
        data = request.data
        print("submit answer data:",data)


        user = User.objects.get(
            id= data["user_id"]
        )

        question_paper = QuestionPaper.objects.get(
            id=data["question_paper"]
        )

        attempt = ExamAttempt.objects.create(
            user=user,
            question_paper_id=data["question_paper"],
            completed = True,
            started_at=datetime.now()
        )

        # answers = [
        #     AnswerSubmission(attempt=attempt, question_id=a["question"], selected_option=a["selected_option"])
        #     for a in data["answers"]
        # ]
        # AnswerSubmission.objects.bulk_create(answers)

        correct = Question.objects.filter(
            id__in=[a["question"] for a in data["answers"]],
        ).values("id", "correct_answer")
        correct_map = {c["id"]: c["correct_answer"] for c in correct}

        score = sum(
            1 for a in data["answers"]
            if correct_map.get(a["question"]) == a["selected_option"]
        )
        attempt.score = score
        attempt.save(update_fields=["score"])

        return Response({"score": score, "total": len(data["answers"])})


        



class QuestionPaperResultsView(APIView):
    def get(self, request):
        # paper = get_object_or_404(QuestionPaper, pk=pk)
        attempts = (
            ExamAttempt.objects
            .all()
        )

        data = {
            "title": "paper.title",
            "attempts": [
                {
                    "attempt_id": a.id,
                    "user_name": a.user.username,
                    "score": a.score,
                    # "total": a.question_paper.id,
                    "submitted_at": a.started_at,  # see note below
                }
                for a in attempts
            ],
        }
        print("result data",data)
        return Response(data)