from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "register_number",
            "email",
            "department",
            "year",
            "cgpa",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must contain at least 2 characters.")
        return value

    def validate_register_number(self, value):
        return value.strip().upper()

    def validate_department(self, value):
        value = value.strip().upper()
        if len(value) < 2:
            raise serializers.ValidationError("Department must contain at least 2 characters.")
        return value
