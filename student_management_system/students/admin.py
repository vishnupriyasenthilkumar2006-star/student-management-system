from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("register_number", "name", "email", "department", "year", "cgpa")
    search_fields = ("register_number", "name", "email", "department")
