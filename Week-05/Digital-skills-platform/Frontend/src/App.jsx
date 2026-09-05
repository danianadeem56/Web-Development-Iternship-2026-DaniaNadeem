import { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState("signup");
  const [user, setUser] = useState(null);

  // Signup Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Signup Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        setFormData({
          name: "",
          email: "",
          password: "",
          role: "Student",
        });
      } else {
        setError(data.detail || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    }
  };

  // Login Successful
  const handleLoginSuccess = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setPage("login");

    setMessage("");
    setError("");
  };

  // Show Dashboard
  if (user) {
    // Instructor Dashboard
    if (user.role === "Instructor") {
      return (
        <InstructorDashboard
          name={user.name}
          role={user.role}
          userId={user.id}
          onLogout={handleLogout}
        />
      );
    }

    // Student Dashboard
    return (
      <StudentDashboard
        name={user.name}
        role={user.role}
        email={user.email}
        userId={user.id}
        onLogout={handleLogout}
      />
    );
  }

  // Login Page
  if (page === "login") {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />

        <div
          style={{
            textAlign: "center",
            marginTop: "-80px",
          }}
        >
          <button
            onClick={() => {
              setPage("signup");
              setMessage("");
              setError("");
            }}
            style={{
              border: "none",
              background: "none",
              color: "blue",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              fontFamily: "Arial, sans-serif",
              marginTop: "1px",
              padding: "0",
            }}
          >
            Create a new account
          </button>
        </div>
      </>
    );
  }

  // Signup Page
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create Account</h1>

        <p className="para">Join Digital Skills Platform</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          {/* Email */}
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          {/* Password */}
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {/* Role */}
          <label>Role</label>

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>

            <option value="Instructor">Instructor</option>
          </select>

          {/* Signup Button */}
          <button type="submit">Sign Up</button>
        </form>

        {/* Success Message */}
        {message && <p className="success">{message}</p>}

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Login Link */}
        <p className="login-text">
          Already have an account?{" "}
          <button
            type="button"
            className="login-link"
            onClick={() => {
              setPage("login");
              setMessage("");
              setError("");
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
