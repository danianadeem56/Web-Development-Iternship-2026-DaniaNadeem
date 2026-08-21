from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------
# Database Connection
# -------------------------
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()

# Create users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
)
""")

conn.commit()


# -------------------------
# User Model
# -------------------------
class User(BaseModel):
    name: str
    email: str
    password: str
    role: str


# -------------------------
# Home Route
# -------------------------
@app.get("/")
def home():
    return {"message": "Digital Skills Platform API is running"}


# -------------------------
# Register API
# -------------------------
@app.post("/register")
def register(user: User):

    # Password validation
    if len(user.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    # Role validation
    if user.role not in ["Student", "Instructor"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be Student or Instructor"
        )

    # Check existing email
    existing_user = cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (user.email,)
    ).fetchone()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Insert user
    cursor.execute(
        """
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
        """,
        (user.name, user.email, user.password, user.role)
    )

    conn.commit()

    return {
        "message": "Registration successful"
    }


@app.post("/login")
def login(user: User):

    # Find user by email
    existing_user = cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (user.email,)
    ).fetchone()

    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email not registered"
        )

    # Check password
    if existing_user[3] != user.password:
        raise HTTPException(
            status_code=400,
            detail="Incorrect password"
        )

    
    # Return actual user data from database
    return {
        "message": "Login successful",
        "name": existing_user[1],
        "email": existing_user[2],
        "role": existing_user[4]
    }