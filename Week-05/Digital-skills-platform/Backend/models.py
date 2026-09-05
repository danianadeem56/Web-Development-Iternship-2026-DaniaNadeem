from sqlalchemy import Column, Integer, String, Text
from database import Base

# User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

# Course Model
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    instructor_id = Column(Integer, nullable=False)

# Enrollment Model
class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    course_id = Column(Integer, nullable=False)

# Progress Model
class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    course_id = Column(Integer, nullable=False)
    progress = Column(Integer, default=0)

# Grade Model
class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    course_id = Column(Integer, nullable=False)
    assignment = Column(String, nullable=False)
    marks = Column(Integer, nullable=False)