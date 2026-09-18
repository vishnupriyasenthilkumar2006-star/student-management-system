from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

class Student(models.Model):
    YEAR_CHOICES = [
        (1, "1st Year"),
        (2, "2nd Year"),
        (3, "3rd Year"),
        (4, "4th Year"),
    ]

    name = models.CharField(max_length=100)
    register_number = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)
    year = models.PositiveSmallIntegerField(choices=YEAR_CHOICES)
    cgpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["register_number"]

    def __str__(self):
        return f"{self.register_number} - {self.name}"
