# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from database import SessionLocal
# from models import User as UserModel, Course, Progress, Grade

# app = FastAPI()

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # User Request Model
# class User(BaseModel):
#     name: str
#     email: str
#     password: str
#     role: str

# # Course Request Model
# class CourseCreate(BaseModel):
#     title: str
#     description: str
#     content: str
#     instructor_id: int

# # Progress Request Model
# class ProgressCreate(BaseModel):
#     student_id: int
#     course_id: int
#     progress: int

# # Grade Request Model
# class GradeCreate(BaseModel):
#     student_id: int
#     course_id: int
#     assignment: str
#     marks: int

# # Home Route
# @app.get("/")
# def home():
#     return {
#         "message": "Digital Skills Platform API is running"
#     }

# # Register API
# @app.post("/register")
# def register(user: User):

#     db = SessionLocal()

#     try:
        
#         # Password validation
#         if len(user.password) < 6:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Password must be at least 6 characters"
#             )
        
#         # Role validation
#         if user.role not in ["Student", "Instructor"]:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Role must be Student or Instructor"
#             )

#         # Check existing email
#         existing_user = db.query(UserModel).filter(
#             UserModel.email == user.email
#         ).first()

#         if existing_user:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Email already registered"
#             )

#         # Create new user
#         new_user = UserModel(
#             name=user.name,
#             email=user.email,
#             password=user.password,
#             role=user.role
#         )

#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)

#         return {
#             "message": "Registration successful"
#         }

#     finally:
#         db.close()

# # Login API
# @app.post("/login")
# def login(user: User):

#     db = SessionLocal()

#     try:

#         # Find user by email
#         existing_user = db.query(UserModel).filter(
#             UserModel.email == user.email
#         ).first()

#         if not existing_user:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Email not registered"
#             )

#         # Check password
#         if existing_user.password != user.password:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Incorrect password"
#             )

#         # Return user data
#         return {
#             "message": "Login successful",
#             "id": existing_user.id,
#             "name": existing_user.name,
#             "email": existing_user.email,
#             "role": existing_user.role
#         }

#     finally:
#         db.close()

# # Get All Students
# @app.get("/students")
# def get_students():

#     db = SessionLocal()

#     try:

#         students = db.query(UserModel).filter(
#             UserModel.role == "Student"
#         ).all()

#         return [
#             {
#                 "id": student.id,
#                 "name": student.name,
#                 "email": student.email,
#                 "role": student.role
#             }
#             for student in students
#         ]

#     finally:
#         db.close()

# # Create Course API
# @app.post("/courses")
# def create_course(course: CourseCreate):

#     db = SessionLocal()

#     try:

#         # Check instructor exists
#         instructor = db.query(UserModel).filter(
#             UserModel.id == course.instructor_id,
#             UserModel.role == "Instructor"
#         ).first()

#         if not instructor:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Instructor not found"
#             )

#         # Create course
#         new_course = Course(
#             title=course.title,
#             description=course.description,
#             content=course.content,
#             instructor_id=course.instructor_id
#         )

#         db.add(new_course)
#         db.commit()
#         db.refresh(new_course)

#         return {
#             "message": "Course created successfully",
#             "course": {
#                 "id": new_course.id,
#                 "title": new_course.title,
#                 "description": new_course.description,
#                 "content": new_course.content,
#                 "instructor_id": new_course.instructor_id
#             }
#         }

#     finally:
#         db.close()

# # Get All Courses API
# @app.get("/courses")
# def get_courses():

#     db = SessionLocal()

#     try:

#         courses = db.query(Course).all()

#         return [
#             {
#                 "id": course.id,
#                 "title": course.title,
#                 "description": course.description,
#                 "content": course.content,
#                 "instructor_id": course.instructor_id
#             }
#             for course in courses
#         ]

#     finally:
#         db.close()

# # Get Instructor Courses API
# @app.get("/courses/instructor/{instructor_id}")
# def get_instructor_courses(instructor_id: int):

#     db = SessionLocal()

#     try:

#         courses = db.query(Course).filter(
#             Course.instructor_id == instructor_id
#         ).all()

#         return [
#             {
#                 "id": course.id,
#                 "title": course.title,
#                 "description": course.description,
#                 "content": course.content,
#                 "instructor_id": course.instructor_id
#             }
#             for course in courses
#         ]

#     finally:
#         db.close()

# # Update Course API
# @app.put("/courses/{course_id}")
# def update_course(course_id: int, course: CourseCreate):

#     db = SessionLocal()

#     try:

#         existing_course = db.query(Course).filter(
#             Course.id == course_id
#         ).first()

#         if not existing_course:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Course not found"
#             )

#         # Check instructor exists
#         instructor = db.query(UserModel).filter(
#             UserModel.id == course.instructor_id,
#             UserModel.role == "Instructor"
#         ).first()

#         if not instructor:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Instructor not found"
#             )

#         # Update course
#         existing_course.title = course.title
#         existing_course.description = course.description
#         existing_course.content = course.content
#         existing_course.instructor_id = course.instructor_id

#         db.commit()
#         db.refresh(existing_course)

#         return {
#             "message": "Course updated successfully",
#             "course": {
#                 "id": existing_course.id,
#                 "title": existing_course.title,
#                 "description": existing_course.description,
#                 "content": existing_course.content,
#                 "instructor_id": existing_course.instructor_id
#             }
#         }

#     finally:
#         db.close()

# # Delete Course API
# @app.delete("/courses/{course_id}")
# def delete_course(course_id: int):

#     db = SessionLocal()

#     try:

#         course = db.query(Course).filter(
#             Course.id == course_id
#         ).first()

#         if not course:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Course not found"
#             )

#         db.delete(course)
#         db.commit()

#         return {
#             "message": "Course deleted successfully"
#         }

#     finally:
#         db.close()

# # Update Student Progress API
# @app.post("/progress")
# def update_progress(data: ProgressCreate):

#     db = SessionLocal()

#     try:

#         # Check student
#         student = db.query(UserModel).filter(
#             UserModel.id == data.student_id,
#             UserModel.role == "Student"
#         ).first()

#         if not student:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Student not found"
#             )

#         # Check course
#         course = db.query(Course).filter(
#             Course.id == data.course_id
#         ).first()

#         if not course:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Course not found"
#             )

#         # Validate progress
#         if data.progress < 0 or data.progress > 100:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Progress must be between 0 and 100"
#             )

#         # Check existing progress
#         existing_progress = db.query(Progress).filter(
#             Progress.student_id == data.student_id,
#             Progress.course_id == data.course_id
#         ).first()

#         if existing_progress:

#             existing_progress.progress = data.progress

#         else:

#             new_progress = Progress(
#                 student_id=data.student_id,
#                 course_id=data.course_id,
#                 progress=data.progress
#             )

#             db.add(new_progress)

#         db.commit()

#         return {
#             "message": "Progress updated successfully",
#             "student_id": data.student_id,
#             "course_id": data.course_id,
#             "progress": data.progress
#         }

#     finally:
#         db.close()

# # Get Student Progress API
# @app.get("/progress/{student_id}")
# def get_student_progress(student_id: int):

#     db = SessionLocal()

#     try:

#         progress_records = db.query(Progress).filter(
#             Progress.student_id == student_id
#         ).all()

#         return [
#             {
#                 "id": record.id,
#                 "student_id": record.student_id,
#                 "course_id": record.course_id,
#                 "course_title": record.course.title if record.course else "Unknown Course",
#                 "progress": record.progress
#             }
#             for record in progress_records
#         ]

#     finally:
#         db.close()

# # Add Grade API
# @app.post("/grades")
# def add_grade(data: GradeCreate):

#     db = SessionLocal()

#     try:

#         # Check student
#         student = db.query(UserModel).filter(
#             UserModel.id == data.student_id,
#             UserModel.role == "Student"
#         ).first()

#         if not student:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Student not found"
#             )

#         # Check course
#         course = db.query(Course).filter(
#             Course.id == data.course_id
#         ).first()

#         if not course:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Course not found"
#             )

#         # Validate marks
#         if data.marks < 0 or data.marks > 100:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Marks must be between 0 and 100"
#             )

#         # Create grade
#         new_grade = Grade(
#             student_id=data.student_id,
#             course_id=data.course_id,
#             assignment=data.assignment,
#             marks=data.marks
#         )

#         db.add(new_grade)
#         db.commit()
#         db.refresh(new_grade)

#         return {
#             "message": "Grade added successfully",
#             "grade": {
#                 "id": new_grade.id,
#                 "student_id": new_grade.student_id,
#                 "course_id": new_grade.course_id,
#                 "assignment": new_grade.assignment,
#                 "marks": new_grade.marks
#             }
#         }

#     finally:
#         db.close()

# # Get Student Grades API
# @app.get("/grades/{student_id}")
# def get_student_grades(student_id: int):

#     db = SessionLocal()

#     try:

#         grades = db.query(Grade).filter(
#             Grade.student_id == student_id
#         ).all()

#         return [
#             {
#                 "id": grade.id,
#                 "student_id": grade.student_id,
#                 "course_id": grade.course_id,
#                 "assignment": grade.assignment,
#                 "marks": grade.marks
#             }
#             for grade in grades
#         ]

#     finally:
#         db.close()

# # Delete Grade API
# @app.delete("/grades/{grade_id}")
# def delete_grade(grade_id: int):

#     db = SessionLocal()

#     try:

#         # Find grade
#         grade = db.query(Grade).filter(
#             Grade.id == grade_id
#         ).first()

#         if not grade:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Grade not found"
#             )

#         # Delete grade
#         db.delete(grade)
#         db.commit()

#         return {
#             "message": "Grade deleted successfully"
#         }

#     finally:
#         db.close()











from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import SessionLocal
from models import User as UserModel, Course, Enrollment, Progress, Grade


app = FastAPI()


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# REQUEST MODELS
# =====================================================

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str


class CourseCreate(BaseModel):
    title: str
    description: str
    content: str
    instructor_id: int


class ProgressCreate(BaseModel):
    student_id: int
    course_id: int
    progress: int


class GradeCreate(BaseModel):
    student_id: int
    course_id: int
    assignment: str
    marks: int


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "Digital Skills Platform API is running"
    }


# =====================================================
# REGISTER
# =====================================================

@app.post("/register")
def register(user: User):

    db = SessionLocal()

    try:

        if len(user.password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 6 characters"
            )

        if user.role not in ["Student", "Instructor"]:
            raise HTTPException(
                status_code=400,
                detail="Role must be Student or Instructor"
            )

        existing_user = db.query(UserModel).filter(
            UserModel.email == user.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        new_user = UserModel(
            name=user.name,
            email=user.email,
            password=user.password,
            role=user.role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "Registration successful"
        }

    finally:
        db.close()


# =====================================================
# LOGIN
# =====================================================

@app.post("/login")
def login(user: User):

    db = SessionLocal()

    try:

        existing_user = db.query(UserModel).filter(
            UserModel.email == user.email
        ).first()

        if not existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email not registered"
            )

        if existing_user.password != user.password:
            raise HTTPException(
                status_code=400,
                detail="Incorrect password"
            )

        return {
            "message": "Login successful",
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role
        }

    finally:
        db.close()


# =====================================================
# GET ALL STUDENTS
# =====================================================

@app.get("/students")
def get_students():

    db = SessionLocal()

    try:

        students = db.query(UserModel).filter(
            UserModel.role == "Student"
        ).all()

        return [
            {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "role": student.role
            }
            for student in students
        ]

    finally:
        db.close()


# =====================================================
# CREATE COURSE
# =====================================================

@app.post("/courses")
def create_course(course: CourseCreate):

    db = SessionLocal()

    try:

        # Check instructor
        instructor = db.query(UserModel).filter(
            UserModel.id == course.instructor_id,
            UserModel.role == "Instructor"
        ).first()

        if not instructor:
            raise HTTPException(
                status_code=400,
                detail="Instructor not found"
            )

        # Create course
        new_course = Course(
            title=course.title,
            description=course.description,
            content=course.content,
            instructor_id=course.instructor_id
        )

        db.add(new_course)
        db.commit()
        db.refresh(new_course)

        # =================================================
        # IMPORTANT:
        # Automatically create 0% progress for every student
        # for this NEW course.
        # =================================================

        students = db.query(UserModel).filter(
            UserModel.role == "Student"
        ).all()

        for student in students:

            existing_progress = db.query(Progress).filter(
                Progress.student_id == student.id,
                Progress.course_id == new_course.id
            ).first()

            if not existing_progress:

                new_progress = Progress(
                    student_id=student.id,
                    course_id=new_course.id,
                    progress=0
                )

                db.add(new_progress)

        db.commit()

        return {
            "message": "Course created successfully",
            "course": {
                "id": new_course.id,
                "title": new_course.title,
                "description": new_course.description,
                "content": new_course.content,
                "instructor_id": new_course.instructor_id
            }
        }

    finally:
        db.close()


# =====================================================
# GET ALL COURSES
# =====================================================

@app.get("/courses")
def get_courses():

    db = SessionLocal()

    try:

        courses = db.query(Course).all()

        return [
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "content": course.content,
                "instructor_id": course.instructor_id
            }
            for course in courses
        ]

    finally:
        db.close()


# =====================================================
# GET INSTRUCTOR COURSES
# =====================================================

@app.get("/courses/instructor/{instructor_id}")
def get_instructor_courses(instructor_id: int):

    db = SessionLocal()

    try:

        courses = db.query(Course).filter(
            Course.instructor_id == instructor_id
        ).all()

        return [
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "content": course.content,
                "instructor_id": course.instructor_id
            }
            for course in courses
        ]

    finally:
        db.close()


# =====================================================
# UPDATE COURSE
# =====================================================

@app.put("/courses/{course_id}")
def update_course(
    course_id: int,
    course: CourseCreate
):

    db = SessionLocal()

    try:

        existing_course = db.query(Course).filter(
            Course.id == course_id
        ).first()

        if not existing_course:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        instructor = db.query(UserModel).filter(
            UserModel.id == course.instructor_id,
            UserModel.role == "Instructor"
        ).first()

        if not instructor:
            raise HTTPException(
                status_code=400,
                detail="Instructor not found"
            )

        existing_course.title = course.title
        existing_course.description = course.description
        existing_course.content = course.content
        existing_course.instructor_id = course.instructor_id

        db.commit()
        db.refresh(existing_course)

        return {
            "message": "Course updated successfully",
            "course": {
                "id": existing_course.id,
                "title": existing_course.title,
                "description": existing_course.description,
                "content": existing_course.content,
                "instructor_id": existing_course.instructor_id
            }
        }

    finally:
        db.close()


# =====================================================
# DELETE COURSE
# =====================================================

@app.delete("/courses/{course_id}")
def delete_course(course_id: int):

    db = SessionLocal()

    try:

        course = db.query(Course).filter(
            Course.id == course_id
        ).first()

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # Delete progress records of this course first
        db.query(Progress).filter(
            Progress.course_id == course_id
        ).delete(
            synchronize_session=False
        )

        # Delete grades of this course
        db.query(Grade).filter(
            Grade.course_id == course_id
        ).delete(
            synchronize_session=False
        )

        db.delete(course)
        db.commit()

        return {
            "message": "Course deleted successfully"
        }

    finally:
        db.close()


# =====================================================
# UPDATE STUDENT PROGRESS
# =====================================================

@app.post("/progress")
def update_progress(data: ProgressCreate):

    db = SessionLocal()

    try:

        # Check student
        student = db.query(UserModel).filter(
            UserModel.id == data.student_id,
            UserModel.role == "Student"
        ).first()

        if not student:
            raise HTTPException(
                status_code=400,
                detail="Student not found"
            )

        # Check course
        course = db.query(Course).filter(
            Course.id == data.course_id
        ).first()

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # Validate progress
        if data.progress < 0 or data.progress > 100:
            raise HTTPException(
                status_code=400,
                detail="Progress must be between 0 and 100"
            )

        # Find existing progress
        existing_progress = db.query(Progress).filter(
            Progress.student_id == data.student_id,
            Progress.course_id == data.course_id
        ).first()

        if existing_progress:

            existing_progress.progress = data.progress

        else:

            new_progress = Progress(
                student_id=data.student_id,
                course_id=data.course_id,
                progress=data.progress
            )

            db.add(new_progress)

        db.commit()

        return {
            "message": "Progress updated successfully",
            "student_id": data.student_id,
            "course_id": data.course_id,
            "progress": data.progress
        }

    finally:
        db.close()


# =====================================================
# GET STUDENT PROGRESS
# =====================================================

@app.get("/progress/{student_id}")
def get_student_progress(student_id: int):
    db = SessionLocal()

    try:
        progress_records = db.query(Progress).filter(
            Progress.student_id == student_id
        ).all()

        result = []

        for record in progress_records:
            course = db.query(Course).filter(
                Course.id == record.course_id
            ).first()

            result.append({
                "id": record.id,
                "student_id": record.student_id,
                "course_id": record.course_id,
                "course_title": course.title if course else "Unknown Course",
                "progress": record.progress
            })

        return result

    finally:
        db.close()
# =====================================================
# ADD GRADE
# =====================================================

@app.post("/grades")
def add_grade(data: GradeCreate):

    db = SessionLocal()

    try:

        # Check student
        student = db.query(UserModel).filter(
            UserModel.id == data.student_id,
            UserModel.role == "Student"
        ).first()

        if not student:
            raise HTTPException(
                status_code=400,
                detail="Student not found"
            )

        # Check course
        course = db.query(Course).filter(
            Course.id == data.course_id
        ).first()

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # Validate marks
        if data.marks < 0 or data.marks > 100:
            raise HTTPException(
                status_code=400,
                detail="Marks must be between 0 and 100"
            )

        new_grade = Grade(
            student_id=data.student_id,
            course_id=data.course_id,
            assignment=data.assignment,
            marks=data.marks
        )

        db.add(new_grade)
        db.commit()
        db.refresh(new_grade)

        return {
            "message": "Grade added successfully",
            "grade": {
                "id": new_grade.id,
                "student_id": new_grade.student_id,
                "course_id": new_grade.course_id,
                "assignment": new_grade.assignment,
                "marks": new_grade.marks
            }
        }

    finally:
        db.close()


# =====================================================
# GET STUDENT GRADES
# =====================================================

@app.get("/grades/{student_id}")
def get_student_grades(student_id: int):

    db = SessionLocal()

    try:

        grades = db.query(Grade).filter(
            Grade.student_id == student_id
        ).all()

        return [
            {
                "id": grade.id,
                "student_id": grade.student_id,
                "course_id": grade.course_id,
                "assignment": grade.assignment,
                "marks": grade.marks
            }
            for grade in grades
        ]

    finally:
        db.close()


# =====================================================
# DELETE GRADE
# =====================================================

@app.delete("/grades/{grade_id}")
def delete_grade(grade_id: int):

    db = SessionLocal()

    try:

        grade = db.query(Grade).filter(
            Grade.id == grade_id
        ).first()

        if not grade:
            raise HTTPException(
                status_code=404,
                detail="Grade not found"
            )

        db.delete(grade)
        db.commit()

        return {
            "message": "Grade deleted successfully"
        }

    finally:
        db.close()

  
# =====================================================
# DELETE INSTRUCTOR + HIS COURSES
# =====================================================

@app.delete("/instructors/{instructor_id}")
def delete_instructor(instructor_id: int):

    db = SessionLocal()

    try:

        # Check instructor
        instructor = db.query(UserModel).filter(
            UserModel.id == instructor_id,
            UserModel.role == "Instructor"
        ).first()

        if not instructor:
            raise HTTPException(
                status_code=404,
                detail="Instructor not found"
            )

        # Find all courses created by this instructor
        courses = db.query(Course).filter(
            Course.instructor_id == instructor_id
        ).all()

        # Delete data related to each course
        for course in courses:

            # Delete Progress
            db.query(Progress).filter(
                Progress.course_id == course.id
            ).delete(
                synchronize_session=False
            )

            # Delete Grades
            db.query(Grade).filter(
                Grade.course_id == course.id
            ).delete(
                synchronize_session=False
            )

            # Delete Enrollments
            db.query(Enrollment).filter(
                Enrollment.course_id == course.id
            ).delete(
                synchronize_session=False
            )

            # Delete Course
            db.delete(course)

        # Delete Instructor
        db.delete(instructor)

        db.commit()

        return {
            "message": "Instructor and all his courses deleted successfully",
            "instructor_id": instructor_id
        }

    finally:
        db.close()

