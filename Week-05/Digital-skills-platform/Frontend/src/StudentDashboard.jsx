import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ name, role, email, userId, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [grades, setGrades] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const [error, setError] = useState("");

  // Navigation
  const openSection = (section) => {
    setActiveSection(section);
    setError("");

    // Mobile menu close
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Logout
  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  // Fetch All Courses
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/courses");

      if (!response.ok) {
        throw new Error("Failed to load courses");
      }

      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError("Unable to load courses.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch Student Progress
  const fetchProgress = async () => {
    if (!userId) return;

    try {
      setLoadingProgress(true);

      const response = await fetch(`http://127.0.0.1:8000/progress/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to load progress");
      }

      const data = await response.json();
      setProgress(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError("Unable to load progress.");
    } finally {
      setLoadingProgress(false);
    }
  };

  // Fetch Student Grades
  const fetchGrades = async () => {
    if (!userId) return;

    try {
      setLoadingGrades(true);

      const response = await fetch(`http://127.0.0.1:8000/grades/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to load grades");
      }

      const data = await response.json();
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError("Unable to load grades.");
    } finally {
      setLoadingGrades(false);
    }
  };

  // Initial Data Load
  useEffect(() => {
    fetchCourses();
    fetchProgress();
    fetchGrades();
  }, [userId]);

  // Find Course Name
  const getCourseTitle = (courseId) => {
    const course = courses.find((item) => Number(item.id) === Number(courseId));

    return course ? course.title : "Unknown Course";
  };

  // Calculate Overall Progress
  const calculateOverallProgress = () => {
    if (progress.length === 0) {
      return 0;
    }

    const total = progress.reduce(
      (sum, item) => sum + Number(item.progress || 0),
      0,
    );

    return Math.round(total / progress.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="student-header">
        <div className="student-header-inner">
          {/* Logo */}
          <div className="student-logo">🎓 Student Panel</div>

          {/* Mobile Menu Button*/}
          <button
            type="button"
            className="student-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation */}
          <nav className={`student-nav ${menuOpen ? "student-nav-open" : ""}`}>
            <button
              type="button"
              className="student-nav-button"
              onClick={() => openSection("dashboard")}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="student-nav-button"
              onClick={() => openSection("courses")}
            >
              Courses
            </button>

            <button
              type="button"
              className="student-nav-button"
              onClick={() => openSection("progress")}
            >
              Progress
            </button>

            <button
              type="button"
              className="student-nav-button"
              onClick={() => openSection("grades")}
            >
              Grades
            </button>

            <button
              type="button"
              className="student-nav-button"
              onClick={() => openSection("profile")}
            >
              Profile
            </button>

            <button
              type="button"
              className="student-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="student-main">
        {error && <p className="student-error">{error}</p>}

        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <section className="student-home">
            <div className="student-welcome">
              <h1>Welcome, {name}! 👋</h1>

              <p>
                Role: <strong>{role}</strong>
              </p>

              <p>Manage your courses, progress and grades from here.</p>
            </div>

            <div className="student-dashboard-cards">
              {/* Courses */}
              <button
                type="button"
                className="student-dashboard-card"
                onClick={() => openSection("courses")}
              >
                <div className="student-card-icon">📚</div>

                <h2>My Courses</h2>

                <p>{courses.length} available courses</p>
              </button>

              {/* Progress */}
              <button
                type="button"
                className="student-dashboard-card"
                onClick={() => openSection("progress")}
              >
                <div className="student-card-icon">📊</div>

                <h2>My Progress</h2>

                <p>{overallProgress}% overall progress</p>
              </button>

              {/* Grades */}
              <button
                type="button"
                className="student-dashboard-card"
                onClick={() => openSection("grades")}
              >
                <div className="student-card-icon">📝</div>

                <h2>My Grades</h2>

                <p>{grades.length} grade records</p>
              </button>

              {/* Profile */}
              <button
                type="button"
                className="student-dashboard-card"
                onClick={() => openSection("profile")}
              >
                <div className="student-card-icon">👤</div>

                <h2>My Profile</h2>

                <p>View your account information</p>
              </button>
            </div>
          </section>
        )}

        {/* Courses */}
        {activeSection === "courses" && (
          <section className="student-panel">
            <h1>📚 Available Courses</h1>

            {loadingCourses ? (
              <p className="student-loading">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="student-empty">No courses available yet.</p>
            ) : (
              <div className="student-course-grid">
                {courses.map((course) => {
                  const courseProgress = progress.find(
                    (item) => Number(item.course_id) === Number(course.id),
                  );

                  const percentage = courseProgress
                    ? Number(courseProgress.progress || 0)
                    : 0;

                  return (
                    <div className="student-course-card" key={course.id}>
                      <div className="course-icon">📚</div>

                      <h2>{course.title}</h2>

                      <p>{course.description}</p>

                      <div className="course-content-box">
                        <strong>Course Content</strong>

                        <p>{course.content}</p>
                      </div>

                      <div className="student-progress">
                        <div className="student-progress-bar">
                          <div
                            className="student-progress-fill"
                            style={{
                              width: `${Math.min(
                                Math.max(percentage, 0),
                                100,
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <strong>{percentage}% Complete</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              className="student-back-button"
              onClick={() => openSection("dashboard")}
            >
              Back to Dashboard
            </button>
          </section>
        )}

        {/* Progress */}
        {activeSection === "progress" && (
          <section className="student-panel">
            <h1>📊 My Progress</h1>

            {loadingProgress ? (
              <p className="student-loading">Loading progress...</p>
            ) : (
              <>
                <div className="student-overall-card">
                  <div className="student-big-icon">📈</div>

                  <h2>Overall Progress</h2>

                  <strong className="progress-number">
                    {overallProgress}%
                  </strong>

                  <div className="student-progress-bar">
                    <div
                      className="student-progress-fill"
                      style={{
                        width: `${overallProgress}%`,
                      }}
                    ></div>
                  </div>

                  <p>Keep learning and complete your courses! 🎯</p>
                </div>

                {progress.length === 0 ? (
                  <p className="student-empty">No progress available yet.</p>
                ) : (
                  <div className="student-info-grid">
                    {progress.map((item) => {
                      const percentage = Number(item.progress || 0);

                      return (
                        <div className="student-info-card" key={item.id}>
                          <div className="student-big-icon">📚</div>

                          <h2>{getCourseTitle(item.course_id)}</h2>

                          <strong>{percentage}% Complete</strong>

                          <div className="student-progress-bar">
                            <div
                              className="student-progress-fill"
                              style={{
                                width: `${Math.min(
                                  Math.max(percentage, 0),
                                  100,
                                )}%`,
                              }}
                            ></div>
                          </div>

                          <p>
                            {percentage === 100
                              ? "Completed ✅"
                              : "In Progress 📚"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              className="student-back-button"
              onClick={() => openSection("dashboard")}
            >
              Back to Dashboard
            </button>
          </section>
        )}

        {/* Grades */}
        {activeSection === "grades" && (
          <section className="student-panel">
            <h1>📝 My Grades</h1>

            {loadingGrades ? (
              <p className="student-loading">Loading grades...</p>
            ) : grades.length === 0 ? (
              <p className="student-empty">No grades available yet.</p>
            ) : (
              <div className="student-grade-grid">
                {grades.map((grade) => (
                  <div className="student-grade-card" key={grade.id}>
                    <div className="grade-icon">📝</div>

                    <h2>{getCourseTitle(grade.course_id)}</h2>

                    <p>
                      <strong>Assignment:</strong> {grade.assignment}
                    </p>

                    <div className="marks-display">{grade.marks} / 100</div>

                    <p>
                      {grade.marks >= 80
                        ? "Excellent! 🌟"
                        : grade.marks >= 60
                          ? "Good Job! 👍"
                          : "Keep Practicing! 💪"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="student-back-button"
              onClick={() => openSection("dashboard")}
            >
              Back to Dashboard
            </button>
          </section>
        )}

        {/* Profile */}
        {activeSection === "profile" && (
          <section className="student-panel">
            <h1>👤 My Profile</h1>

            <div className="student-profile-card">
              <div className="profile-icon">👨‍🎓</div>

              <h2>{name}</h2>

              <div className="profile-details">
                <p>
                  <strong>Name:</strong> {name}
                </p>

                <p>
                  <strong>Email:</strong> {email || "Not available"}
                </p>

                <p>
                  <strong>Role:</strong> {role}
                </p>

                <p>
                  <strong>Account Type:</strong> Student
                </p>
              </div>
            </div>

            <button
              type="button"
              className="student-back-button"
              onClick={() => openSection("dashboard")}
            >
              Back to Dashboard
            </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="student-footer">
        <p>© 2026 Digital Skills Platform | Student Dashboard</p>
      </footer>
    </div>
  );
}

export default StudentDashboard;
