# Week-05

Tasks will be uploaded here.

# Digital Skills Platform – Instructor Dashboard

## Project Overview
Digital Skills Platform is a full-stack web application developed to support digital skills learning and management.
This project focuses on the Instructor Dashboard, which allows instructors to manage courses, view registered students, monitor student progress, and manage student grades.

## Objective
The main objective of this project is to develop an Instructor Dashboard where instructors can:
- Manage courses
- Add new courses
- Edit and update existing courses
- Delete courses
- View registered students
- Monitor student course progress
- Add student grades
- View grade history
- Delete grades

## Features

### Instructor Authentication
- Instructor registration
- Instructor login
- Display instructor name and role

### Course Management
- Add new courses
- View courses
- Edit and update courses
- Delete courses

### Student Management
- View registered students
- View student names and email addresses
- View student roles

### Student Progress
- View student course progress
- Display progress percentage
- Display progress bars

### Student Grading
- Select a course
- Add assignment or exam name
- Enter marks from 0 to 100
- View grade history
- Delete grades

### Responsive Design
- Responsive login page
- Responsive registration page
- Responsive instructor dashboard
- Mobile-friendly navigation

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS

### Backend
- FastAPI
- Python
- REST APIs

### Database
- PostgreSQL
- SQLAlchemy

### Tools
- Visual Studio Code
- Git
- GitHub
- Swagger UI

## Database
The project uses PostgreSQL as the database.
The main database tables are:
- users
- courses
- progress
- grades

## Project Architecture
The application follows a full-stack architecture:
React Frontend
       ↓
REST API
       ↓
FastAPI Backend
       ↓
SQLAlchemy
       ↓
PostgreSQL Database

## API Endpoints

### Authentication
- POST `/register`
- POST `/login`

### Students
- GET `/students`

### Courses
- POST `/courses`
- GET `/courses`
- GET `/courses/instructor/{instructor_id}`
- PUT `/courses/{course_id}`
- DELETE `/courses/{course_id}`

### Progress
- POST `/progress`
- GET `/progress/{student_id}`

### Grades
- POST `/grades`
- GET `/grades/{student_id}`
- DELETE `/grades/{grade_id}`


## Backend Setup
Open the backend folder in the terminal.

### 1. Create Virtual Environment
python -m venv venv

### 2. Activate Virtual Environment
For Windows:
venv\Scripts\activate

### 3. Install Dependencies
pip install -r requirements.txt

### 4. Run FastAPI Server
uvicorn main:app --reload
The backend will run at:
http://127.0.0.1:8000

### 5. Open Swagger API Documentation
http://127.0.0.1:8000/docs


## Frontend Setup 

### 1. Install Dependencies
npm install

### 2. Start React Application
npm run dev
The frontend will normally run at:
http://localhost:5173


# How to Run the Complete Project

## How to Run

### Step 1
Start PostgreSQL and make sure the `digital_skills_platform` database is available.

### Step 2
Open the backend folder and activate the virtual environment:
venv\Scripts\activate

### Step 3
Start the FastAPI backend:
uvicorn main:app --reload

### Step 4
Open a new terminal and go to the frontend folder.

### Step 5
Start the React application:
npm run dev

### Step 6
Open the application in the browser:
http://localhost:5173


## Dashboard Workflow
Login
   ↓
Instructor Dashboard
   ↓
Courses
   ├── Add Course
   ├── Edit Course
   └── Delete Course
   ↓
Students
   ↓
Progress
   ↓
Grading
   ├── Add Grade
   ├── View Grade History
   └── Delete Grade

## Testing
The application was tested using both the frontend interface and Swagger UI.
The following functionality was tested:
- Instructor registration
- Instructor login
- Course creation
- Course update
- Course deletion
- Student listing
- Student progress display
- Grade creation
- Grade history
- Grade deletion
- REST API responses


## Challenges
During development, the following challenges were faced:
- Connecting React frontend with FastAPI REST APIs
- Connecting FastAPI with PostgreSQL
- Creating and managing database tables
- Implementing course update functionality
- Implementing course and grade deletion
- Displaying student progress dynamically
- Making the application responsive
These challenges were resolved through debugging, API testing, database testing and frontend/backend integration.

## Future Improvements
- Password hashing
- Stronger authentication and authorization
- Course enrollment system
- Assignment submission system
- Grade editing
- Advanced progress analytics
- Cloud deployment

## Screenshots

### Signup Page
![Signup Page](screenshots/signup.png)

### Login Page
![Login Page](screenshots/login.png)

### Instructor Dashboard
![Instructor Dashboard](screenshots/dashboard.png)

### Course Management
![Course Management](screenshots/courses.png)

### Students
![Students](screenshots/students.png)

### Student Progress
![Student Progress](screenshots/progress.png)

### Student Grading
![Student Grading](screenshots/grading.png)

### Swagger API
![Swagger API](screenshots/swagger.png)

### PostgreSQL Database
![PostgreSQL Database](screenshots/postgresql.png)