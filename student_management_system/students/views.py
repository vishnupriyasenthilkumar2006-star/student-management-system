from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    search_fields = ["name", "register_number", "email", "department"]
    ordering_fields = ["name", "register_number", "department", "year", "cgpa"]
    ordering = ["register_number"]
