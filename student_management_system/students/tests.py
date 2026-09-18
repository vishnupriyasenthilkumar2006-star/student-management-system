from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Student

class StudentAPITests(APITestCase):
    def setUp(self):
        self.student = Student.objects.create(
            name="Test Student",
            register_number="23ECE001",
            email="test@example.com",
            department="ECE",
            year=2,
            cgpa=8.25,
        )

    def test_list_students(self):
        response = self.client.get("/api/students/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_student(self):
        payload = {
            "name": "New Student",
            "register_number": "23ECE002",
            "email": "new@example.com",
            "department": "ECE",
            "year": 2,
            "cgpa": "8.50",
        }
        response = self.client.post("/api/students/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_student(self):
        payload = {
            "name": "Updated Student",
            "register_number": "23ECE001",
            "email": "test@example.com",
            "department": "ECE",
            "year": 3,
            "cgpa": "8.75",
        }
        response = self.client.put(
            f"/api/students/{self.student.id}/", payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_student(self):
        response = self.client.delete(f"/api/students/{self.student.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_cgpa(self):
        payload = {
            "name": "Invalid Student",
            "register_number": "23ECE003",
            "email": "invalid@example.com",
            "department": "ECE",
            "year": 2,
            "cgpa": "11.00",
        }
        response = self.client.post("/api/students/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
