import { useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ name, role, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="dashboard">

      {/* Dashboard */}
      {activeSection === "dashboard" && (
        <>
          <h1>{role} Dashboard</h1>

          <h2>Welcome, {name}! 👋</h2>

          <p>
            <strong>Role:</strong> {role}
          </p>

          <div className="dashboard-card">
            <h3>My Courses</h3>
            <p>Explore your digital skills courses.</p>

            <button onClick={() => setActiveSection("courses")}>
              View Courses
            </button>
          </div>

          <div className="dashboard-card">
            <h3>My Progress</h3>
            <p>Track your learning progress.</p>

            <button onClick={() => setActiveSection("progress")}>
              View Progress
            </button>
          </div>
        </>
      )}

      {/* Courses */}
      {activeSection === "courses" && (
        <>
          <h1>My Courses 📚</h1>

          <div className="dashboard-card">
            <h3>Web Development</h3>
            <p>Learn HTML, CSS, JavaScript and React.</p>
            <p>
              <strong>Progress:</strong> 60%
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Python Programming</h3>
            <p>Learn Python programming from basics to advanced.</p>
            <p>
              <strong>Progress:</strong> 40%
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Database Fundamentals</h3>
            <p>Learn SQL, databases and data management.</p>
            <p>
              <strong>Progress:</strong> 25%
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => setActiveSection("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </>
      )}

      {/* Progress */}
      {activeSection === "progress" && (
        <>
          <h1>My Progress 📊</h1>

          <div className="dashboard-card">
            <h3>Overall Progress</h3>
            <p>
              You are making good progress in your learning journey!
            </p>
            <p>
              <strong>Overall Completion:</strong> 42%
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Completed Lessons</h3>
            <p>18 lessons completed</p>
          </div>

          <div className="dashboard-card">
            <h3>Learning Hours</h3>
            <p>24 hours completed</p>
          </div>

          <button
            className="back-button"
            onClick={() => setActiveSection("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </>
      )}

      {/* Logout */}
      <button className="logout" onClick={onLogout}>
        Logout
      </button>

    </div>
  );
}

export default StudentDashboard;