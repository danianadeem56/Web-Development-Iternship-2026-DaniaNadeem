import { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState("signup");
  const [user, setUser] = useState(null);

  // Signup data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Signup input change
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
        setError(data.detail);
      }
    } catch (error) {
      setError("Unable to connect to the backend");
    }
  };

  // Login successful
  const handleLoginSuccess = (data) => {
    setUser(data);
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  // Dashboard
  if (user) {
    return (
      <StudentDashboard
        name={user.name}
        role={user.role}
        onLogout={handleLogout}
      />
    );
  }

  // Login page
  if (page === "login") {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />

        <div style={{ textAlign: "center", marginTop: "-80px" }}>
          <button
            onClick={() => setPage("signup")}
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

  // Signup page
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create Account</h1>

        <p className="para">Join Digital Skills Platform</p>

        <form onSubmit={handleSubmit}>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <label>Role</label>

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>

        {message && <p className="success">{message}</p>}

        {error && <p className="error">{error}</p>}

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
            // style={{
            //   border: "none",
            //   background: "none",
            //   color: "blue",
            //   cursor: "pointer",
            // }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
