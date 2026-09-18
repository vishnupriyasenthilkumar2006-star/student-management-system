# Student Management System

A complete CRUD-based full-stack web application built with:

- Frontend: HTML, CSS, JavaScript
- Backend: Django + Django REST Framework
- Database: SQLite
- API style: REST
- Version control: Git / GitHub

## Features

- Create student records
- Read/list all student records
- Update student records
- Delete student records
- Search students
- Client-side validation
- Server-side validation
- Responsive interface
- Clear success and error messages
- REST API endpoints suitable for Postman testing

## Student Fields

- Name
- Register Number
- Email
- Department
- Year
- CGPA

## Setup

1. Create and activate a virtual environment.
2. Keep the included `.env` file locally. Do not upload it to GitHub.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create migrations:
   ```bash
   python manage.py makemigrations
   ```
5. Apply migrations:
   ```bash
   python manage.py migrate
   ```
6. Run the application:
   ```bash
   python manage.py runserver
   ```
7. Open:
   `http://127.0.0.1:8000/`

## REST API

- Create: `POST /api/students/`
- Read all: `GET /api/students/`
- Read one: `GET /api/students/<id>/`
- Update: `PUT /api/students/<id>/`
- Delete: `DELETE /api/students/<id>/`
- Search: `GET /api/students/?search=value`

## Example JSON for POST / PUT

```json
{
  "name": "Vishnu Priya",
  "register_number": "23ECE001",
  "email": "vishnu@example.com",
  "department": "ECE",
  "year": 2,
  "cgpa": "8.04"
}
```

## GitHub

Do not upload:
- `venv/`
- `.env`
- passwords or secret keys intended for production

The included `.gitignore` already excludes common local files.
