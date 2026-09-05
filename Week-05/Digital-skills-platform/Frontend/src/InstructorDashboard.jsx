



import { useEffect, useState } from "react";
import "./InstructorDashboard.css";

// =====================================================
// STUDENT PROGRESS CARD
// =====================================================
function StudentProgressCard({ student, courses }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/progress/${student.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgress(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Progress fetch error:", err);
        setProgress([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [student.id]);

  const getCourseName = (item) => {
    if (item.course) {
      return item.course;
    }

    const course = courses.find(
      (c) => Number(c.id) === Number(item.course_id)
    );

    return course ? course.title : "Unknown Course";
  };

  return (
    <div className="detail-card">
      <div className="student-card-header">
        <h3>{student.name}</h3>
        <span className="student-role">Student</span>
      </div>

      <p>
        <strong>Email:</strong> {student.email}
      </p>

      <hr />

      <h4>Course Progress</h4>

      {loading ? (
        <p className="empty-message">Loading progress...</p>
      ) : progress.length === 0 ? (
        <p className="empty-message">No progress available.</p>
      ) : (
        <div className="progress-list">
          {progress.map((item) => (
            <div className="progress-item" key={item.id}>
              <div className="progress-top">
                <span>{getCourseName(item)}</span>
                <strong>{item.progress}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      Math.max(Number(item.progress) || 0, 0),
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// STUDENT GRADE CARD
// =====================================================
function StudentGradeCard({ student, courses }) {
  const [grades, setGrades] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [assignment, setAssignment] = useState("");
  const [marks, setMarks] = useState("");
  const [message, setMessage] = useState("");

  const fetchGrades = () => {
    fetch(`http://127.0.0.1:8000/grades/${student.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGrades(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Grades fetch error:", err);
        setGrades([]);
      });
  };

  useEffect(() => {
    fetchGrades();
  }, [student.id]);

  // ADD GRADE
  const addGrade = async () => {
    setMessage("");

    if (!courseId || !assignment.trim() || marks === "") {
      setMessage("Please fill all grade fields.");
      return;
    }

    const numericMarks = Number(marks);

    if (numericMarks < 0 || numericMarks > 100) {
      setMessage("Marks must be between 0 and 100.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: student.id,
          course_id: Number(courseId),
          assignment: assignment.trim(),
          marks: numericMarks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Failed to add grade.");
        return;
      }

      setMessage("Grade added successfully!");

      setCourseId("");
      setAssignment("");
      setMarks("");

      fetchGrades();
    } catch (error) {
      console.error("Add grade error:", error);
      setMessage("Server error. Please check backend.");
    }
  };

  // DELETE GRADE
  const deleteGrade = async (gradeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/grades/${gradeId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Failed to delete grade.");
        return;
      }

      setMessage("Grade deleted successfully!");

      fetchGrades();
    } catch (error) {
      console.error("Delete grade error:", error);
      setMessage("Server error.");
    }
  };

  const getCourseName = (grade) => {
    const course = courses.find(
      (c) => Number(c.id) === Number(grade.course_id)
    );

    return course ? course.title : "Unknown Course";
  };

  return (
    <div className="detail-card grading-card">
      <div className="student-card-header">
        <h3>{student.name}</h3>
        <span className="student-role">Student</span>
      </div>

      <p>
        <strong>Email:</strong> {student.email}
      </p>

      {/* ADD GRADE */}
      <div className="grade-form">
        <h4>Add Grade</h4>

        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select Course</option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Assignment / Exam Name"
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
        />

        <input
          type="number"
          min="0"
          max="100"
          placeholder="Marks (0-100)"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />

        <button
          type="button"
          className="primary-button"
          onClick={addGrade}
        >
          Add Grade
        </button>

        {message && <p className="form-message">{message}</p>}
      </div>

      {/* GRADE HISTORY */}
      <div className="grade-history">
        <h4>Grade History</h4>

        {grades.length === 0 ? (
          <p className="empty-message">No grades added yet.</p>
        ) : (
          grades.map((grade) => (
            <div className="grade-item" key={grade.id}>
              <div className="grade-info">
                <strong>{getCourseName(grade)}</strong>

                <span>{grade.assignment}</span>

                <span className="grade-marks">
                  {grade.marks}/100
                </span>
              </div>

              <button
                type="button"
                className="delete-grade-button"
                onClick={() => deleteGrade(grade.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// =====================================================
// MAIN INSTRUCTOR DASHBOARD
// =====================================================
function InstructorDashboard({ name, role, userId, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // COURSE FORM STATES
  // ===================================================
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseContent, setCourseContent] = useState("");

  const [courseMessage, setCourseMessage] = useState("");

  const [editingCourseId, setEditingCourseId] = useState(null);

  // ===================================================
  // FETCH COURSES
  // ===================================================
  const fetchCourses = async () => {
    if (!userId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/courses/instructor/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch courses.");
      }

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH STUDENTS
  // ===================================================
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/students"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch students.");
      }

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch students error:", err);
      setError("Unable to load students.");
    }
  };

  // ===================================================
  // INITIAL FETCH
  // ===================================================
  useEffect(() => {
    if (userId) {
      fetchCourses();
      fetchStudents();
    }
  }, [userId]);

  // ===================================================
  // OPEN SECTION
  // ===================================================
  const openSection = (section) => {
    setActiveSection(section);
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // RESET COURSE FORM
  // ===================================================
  const resetCourseForm = () => {
    setCourseTitle("");
    setCourseDescription("");
    setCourseContent("");
    setEditingCourseId(null);
    setCourseMessage("");
  };

  // ===================================================
  // ADD / UPDATE COURSE
  // ===================================================
  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    setCourseMessage("");
    setError("");

    // Validation
    if (
      !courseTitle.trim() ||
      !courseDescription.trim()
    ) {
      setCourseMessage(
        "Please fill course title and description."
      );
      return;
    }

    // Check instructor ID
    if (!userId) {
      setCourseMessage(
        "Instructor ID is missing. Please login again."
      );
      return;
    }

    try {
      let response;

      // =================================================
      // UPDATE COURSE
      // =================================================
      if (editingCourseId !== null) {
        response = await fetch(
          `http://127.0.0.1:8000/courses/${editingCourseId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              title: courseTitle.trim(),
              description: courseDescription.trim(),
              content: courseContent.trim(),

              // IMPORTANT
              // Backend requires instructor_id
              instructor_id: Number(userId),
            }),
          }
        );
      }

      // =================================================
      // ADD COURSE
      // =================================================
      else {
        response = await fetch(
          "http://127.0.0.1:8000/courses",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              title: courseTitle.trim(),
              description: courseDescription.trim(),
              content: courseContent.trim(),
              instructor_id: Number(userId),
            }),
          }
        );
      }

      // Read response
      const data = await response.json();

      console.log("Course API response:", data);

      // API error
      if (!response.ok) {
        setCourseMessage(
          data.detail || "Course operation failed."
        );
        return;
      }

      // Success message
      if (editingCourseId !== null) {
        setCourseMessage(
          "Course updated successfully!"
        );
      } else {
        setCourseMessage(
          "Course added successfully!"
        );
      }

      // Clear form
      setCourseTitle("");
      setCourseDescription("");
      setCourseContent("");
      setEditingCourseId(null);

      // Reload courses
      await fetchCourses();

    } catch (err) {
      console.error("Course submit error:", err);

      setCourseMessage(
        "Server error. Please make sure backend is running."
      );
    }
  };

  // ===================================================
  // EDIT COURSE
  // ===================================================
  const handleEditCourse = (course) => {
    console.log("Editing course:", course);

    setEditingCourseId(course.id);

    setCourseTitle(course.title || "");
    setCourseDescription(course.description || "");
    setCourseContent(course.content || "");

    setCourseMessage("");

    setActiveSection("courses");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // DELETE COURSE
  // ===================================================
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Failed to delete course."
        );
        return;
      }

      await fetchCourses();

    } catch (err) {
      console.error("Delete course error:", err);
      setError("Server error.");
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================
  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  // ===================================================
  // RETURN UI
  // ===================================================
  return (
    <div className="instructor-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}
      <header className="dashboard-header">
        <div className="header-inner">

          <div className="logo">
            🎓 Instructor Panel
          </div>

          {/* Mobile Menu */}
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation */}
          <nav
            className={`nav-links ${
              menuOpen ? "mobile-open" : ""
            }`}
          >

            <button
              type="button"
              className="nav-button"
              onClick={() =>
                openSection("dashboard")
              }
            >
              Dashboard
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() =>
                openSection("courses")
              }
            >
              Courses
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() =>
                openSection("students")
              }
            >
              Students
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() =>
                openSection("progress")
              }
            >
              Progress
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() =>
                openSection("grading")
              }
            >
              Grading
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </nav>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}
      <main className="dashboard-main">

        {/* =================================================
            DASHBOARD
        ================================================= */}
        {activeSection === "dashboard" && (
          <section className="dashboard-home">

            <div className="welcome-section">

              <h1>
                Welcome, {name}! 👋
              </h1>

              <p>
                Role: <strong>{role}</strong>
              </p>

              <p>
                Manage your courses, students,
                progress and grades from here.
              </p>

            </div>

            <div className="dashboard-cards">

              {/* Courses Card */}
              <div
                className="dashboard-card"
                onClick={() =>
                  openSection("courses")
                }
              >
                <div className="card-icon">
                  📚
                </div>

                <h2>Courses</h2>

                <p>
                  Add, update and manage your
                  courses.
                </p>

                <span className="card-count">
                  {courses.length} Courses
                </span>
              </div>

              {/* Students Card */}
              <div
                className="dashboard-card"
                onClick={() =>
                  openSection("students")
                }
              >
                <div className="card-icon">
                  👨‍🎓
                </div>

                <h2>Students</h2>

                <p>
                  View all registered students.
                </p>

                <span className="card-count">
                  {students.length} Students
                </span>
              </div>

              {/* Progress Card */}
              <div
                className="dashboard-card"
                onClick={() =>
                  openSection("progress")
                }
              >
                <div className="card-icon">
                  📈
                </div>

                <h2>Progress</h2>

                <p>
                  Check student course progress.
                </p>
              </div>

              {/* Grading Card */}
              <div
                className="dashboard-card"
                onClick={() =>
                  openSection("grading")
                }
              >
                <div className="card-icon">
                  📝
                </div>

                <h2>Grading</h2>

                <p>
                  Add and manage student grades.
                </p>
              </div>

            </div>
          </section>
        )}

        {/* =================================================
            COURSES
        ================================================= */}
        {activeSection === "courses" && (
          <section className="dashboard-panel">

            <h2>
              📚 Manage Courses
            </h2>

            <p className="section-subtitle">
              Add new courses or update existing
              courses.
            </p>

            {/* COURSE FORM */}
            <form
              className="course-form"
              onSubmit={handleCourseSubmit}
            >

              <h3>
                {editingCourseId !== null
                  ? "Edit Course"
                  : "Add New Course"}
              </h3>

              <input
                type="text"
                placeholder="Course Title"
                value={courseTitle}
                onChange={(e) =>
                  setCourseTitle(e.target.value)
                }
              />

              <textarea
                placeholder="Course Description"
                value={courseDescription}
                onChange={(e) =>
                  setCourseDescription(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Course Content"
                value={courseContent}
                onChange={(e) =>
                  setCourseContent(
                    e.target.value
                  )
                }
              />

              {/* FORM BUTTONS */}
              <div className="form-buttons">

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingCourseId !== null
                    ? "Update Course"
                    : "Add Course"}
                </button>

                {/* CANCEL ONLY WHEN EDITING */}
                {editingCourseId !== null && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={resetCourseForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

              {/* MESSAGE */}
              {courseMessage && (
                <p className="form-message">
                  {courseMessage}
                </p>
              )}

            </form>

            {/* COURSE LIST */}
            <div className="course-grid">

              {loading ? (
                <p className="empty-message">
                  Loading courses...
                </p>
              ) : courses.length === 0 ? (
                <p className="empty-message">
                  No courses found.
                </p>
              ) : (
                courses.map((course) => (

                  <div
                    className="course-card"
                    key={course.id}
                  >

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.description}
                    </p>

                    {course.content && (
                      <div className="course-content">

                        <strong>
                          Content:
                        </strong>

                        <p>
                          {course.content}
                        </p>

                      </div>
                    )}

                    {/* COURSE ACTIONS */}
                    <div className="course-actions">

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          handleEditCourse(course)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDeleteCourse(
                            course.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))
              )}

            </div>

            {/* BACK BUTTON */}
            <div className="back-button-container">

              <button
                type="button"
                className="back-button"
                onClick={() =>
                  openSection("dashboard")
                }
              >
                Back to Dashboard
              </button>

            </div>

          </section>
        )}

        {/* =================================================
            STUDENTS
        ================================================= */}
        {activeSection === "students" && (
          <section className="dashboard-panel">

            <h2>
              👨‍🎓 Students
            </h2>

            <p className="section-subtitle">
              View all registered students.
            </p>

            <div className="student-grid">

              {students.length === 0 ? (
                <p className="empty-message">
                  No students found.
                </p>
              ) : (
                students.map((student) => (

                  <div
                    className="student-card"
                    key={student.id}
                  >

                    <div className="student-icon">
                      👨‍🎓
                    </div>

                    <h3>
                      {student.name}
                    </h3>

                    <p>
                      {student.email}
                    </p>

                    <span className="student-role">
                      {student.role ||
                        "Student"}
                    </span>

                  </div>
                ))
              )}

            </div>

            <div className="back-button-container">

              <button
                type="button"
                className="back-button"
                onClick={() =>
                  openSection("dashboard")
                }
              >
                Back to Dashboard
              </button>

            </div>

          </section>
        )}

        {/* =================================================
            PROGRESS
        ================================================= */}
        {activeSection === "progress" && (
          <section className="dashboard-panel">

            <h2>
              📈 Student Progress
            </h2>

            <p className="section-subtitle">
              Monitor student progress in
              different courses.
            </p>

            <div className="detail-grid">

              {students.length === 0 ? (
                <p className="empty-message">
                  No students found.
                </p>
              ) : (
                students.map((student) => (

                  <StudentProgressCard
                    key={student.id}
                    student={student}
                    courses={courses}
                  />

                ))
              )}

            </div>

            <div className="back-button-container">

              <button
                type="button"
                className="back-button"
                onClick={() =>
                  openSection("dashboard")
                }
              >
                Back to Dashboard
              </button>

            </div>

          </section>
        )}

        {/* =================================================
            GRADING
        ================================================= */}
        {activeSection === "grading" && (
          <section className="dashboard-panel">

            <h2>
              📝 Student Grading
            </h2>

            <p className="section-subtitle">
              Add, view and delete student grades.
            </p>

            <div className="detail-grid">

              {students.length === 0 ? (
                <p className="empty-message">
                  No students found.
                </p>
              ) : (
                students.map((student) => (

                  <StudentGradeCard
                    key={student.id}
                    student={student}
                    courses={courses}
                  />

                ))
              )}

            </div>

            <div className="back-button-container">

              <button
                type="button"
                className="back-button"
                onClick={() =>
                  openSection("dashboard")
                }
              >
                Back to Dashboard
              </button>

            </div>

          </section>
        )}

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}
      <footer className="dashboard-footer">
        <p>
          © 2026 Digital Skills Platform |
          Instructor Dashboard
        </p>
      </footer>

    </div>
  );
}

export default InstructorDashboard;




// import { useEffect, useState } from "react";
// import "./InstructorDashboard.css";

// function InstructorDashboard({
//   name,
//   role,
//   userId,
//   onLogout,
// }) {
//   const [activeSection, setActiveSection] = useState("dashboard");

//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);

//   const [showCourseForm, setShowCourseForm] = useState(false);

//   const [courseTitle, setCourseTitle] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [courseContent, setCourseContent] = useState("");

//   const [message, setMessage] = useState("");
//   const [loadingCourses, setLoadingCourses] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);

//   // =========================
//   // FETCH COURSES
//   // =========================
//   const fetchCourses = async () => {
//     try {
//       setLoadingCourses(true);

//       const response = await fetch(
//         `http://127.0.0.1:8000/courses/instructor/${userId}`
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.detail || "Failed to fetch courses."
//         );
//       }

//       setCourses(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Courses fetch error:", error);
//       setCourses([]);
//     } finally {
//       setLoadingCourses(false);
//     }
//   };

//   // =========================
//   // FETCH STUDENTS
//   // =========================
//   const fetchStudents = async () => {
//     try {
//       setLoadingStudents(true);

//       const response = await fetch(
//         "http://127.0.0.1:8000/students"
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.detail || "Failed to fetch students."
//         );
//       }

//       setStudents(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Students fetch error:", error);
//       setStudents([]);
//     } finally {
//       setLoadingStudents(false);
//     }
//   };

//   // =========================
//   // INITIAL DATA
//   // =========================
//   useEffect(() => {
//     if (userId) {
//       fetchCourses();
//       fetchStudents();
//     }
//   }, [userId]);

//   // =========================
//   // ADD COURSE
//   // =========================
//   const handleAddCourse = async (e) => {
//     e.preventDefault();

//     setMessage("");

//     if (!courseTitle.trim()) {
//       setMessage("Please enter course title.");
//       return;
//     }

//     if (!courseDescription.trim()) {
//       setMessage("Please enter course description.");
//       return;
//     }

//     if (!courseContent.trim()) {
//       setMessage("Please enter course content.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:8000/courses",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title: courseTitle,
//             description: courseDescription,
//             content: courseContent,
//             instructor_id: Number(userId),
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setMessage(
//           data.detail || "Failed to add course."
//         );
//         return;
//       }

//       setMessage("Course added successfully!");

//       setCourseTitle("");
//       setCourseDescription("");
//       setCourseContent("");

//       setShowCourseForm(false);

//       await fetchCourses();
//     } catch (error) {
//       console.error("Add course error:", error);

//       setMessage(
//         "Server error. Please make sure backend is running."
//       );
//     }
//   };

//   // =========================
//   // DELETE COURSE
//   // =========================
//   const handleDeleteCourse = async (courseId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this course?"
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/courses/${courseId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         alert(
//           data.detail || "Failed to delete course."
//         );
//         return;
//       }

//       alert("Course deleted successfully!");

//       await fetchCourses();
//     } catch (error) {
//       console.error("Delete course error:", error);

//       alert(
//         "Server error. Please make sure backend is running."
//       );
//     }
//   };

//   // =========================
//   // DASHBOARD
//   // =========================
//   const renderDashboard = () => {
//     return (
//       <>
//         <section className="welcome-section">
//           <h1>Instructor Dashboard</h1>

//           <p>
//             Welcome, <strong>{name}</strong>! 👋
//           </p>

//           <span>
//             Role: <strong>{role}</strong>
//           </span>
//         </section>

//         <section className="dashboard-cards">
//           <div
//             className="dashboard-card"
//             onClick={() => setActiveSection("courses")}
//           >
//             <div className="card-icon">📚</div>

//             <h3>My Courses</h3>

//             <p className="card-count">
//               {courses.length}
//             </p>

//             <p>
//               Manage your courses
//             </p>
//           </div>

//           <div
//             className="dashboard-card"
//             onClick={() => setActiveSection("students")}
//           >
//             <div className="card-icon">👨‍🎓</div>

//             <h3>Students</h3>

//             <p className="card-count">
//               {students.length}
//             </p>

//             <p>
//               View registered students
//             </p>
//           </div>

//           <div
//             className="dashboard-card"
//             onClick={() => setActiveSection("progress")}
//           >
//             <div className="card-icon">📈</div>

//             <h3>Progress</h3>

//             <p className="card-count">
//               {students.length}
//             </p>

//             <p>
//               Manage student progress
//             </p>
//           </div>

//           <div
//             className="dashboard-card"
//             onClick={() => setActiveSection("grading")}
//           >
//             <div className="card-icon">📝</div>

//             <h3>Grading</h3>

//             <p className="card-count">
//               {courses.length}
//             </p>

//             <p>
//               Manage student grades
//             </p>
//           </div>
//         </section>
//       </>
//     );
//   };

//   // =========================
//   // COURSES
//   // =========================
//   const renderCourses = () => {
//     return (
//       <section className="dashboard-panel">

//         <div className="section-header">
//           <div>
//             <h2>My Courses</h2>

//             <p className="section-subtitle">
//               Manage courses created by you.
//             </p>
//           </div>

//           <button
//             className="primary-button"
//             onClick={() => {
//               setShowCourseForm(!showCourseForm);
//               setMessage("");
//             }}
//           >
//             {showCourseForm
//               ? "Close Form"
//               : "+ Add Course"}
//           </button>
//         </div>

//         {showCourseForm && (
//           <form
//             className="course-form"
//             onSubmit={handleAddCourse}
//           >
//             <h3>Add New Course</h3>

//             <input
//               type="text"
//               placeholder="Course Title"
//               value={courseTitle}
//               onChange={(e) =>
//                 setCourseTitle(e.target.value)
//               }
//             />

//             <textarea
//               placeholder="Course Description"
//               value={courseDescription}
//               onChange={(e) =>
//                 setCourseDescription(e.target.value)
//               }
//             />

//             <textarea
//               placeholder="Course Content"
//               value={courseContent}
//               onChange={(e) =>
//                 setCourseContent(e.target.value)
//               }
//             />

//             <div className="form-buttons">
//               <button
//                 type="submit"
//                 className="primary-button"
//               >
//                 Add Course
//               </button>

//               <button
//                 type="button"
//                 className="cancel-button"
//                 onClick={() => {
//                   setShowCourseForm(false);
//                   setMessage("");
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>

//             {message && (
//               <p className="form-message">
//                 {message}
//               </p>
//             )}
//           </form>
//         )}

//         {loadingCourses ? (
//           <p className="empty-message">
//             Loading courses...
//           </p>
//         ) : courses.length === 0 ? (
//           <p className="empty-message">
//             No courses available.
//           </p>
//         ) : (
//           <div className="course-grid">
//             {courses.map((course) => (
//               <div
//                 className="course-card"
//                 key={course.id}
//               >
//                 <h3>{course.title}</h3>

//                 <p>
//                   {course.description}
//                 </p>

//                 <div className="course-content">
//                   <strong>Content:</strong>

//                   <p>
//                     {course.content}
//                   </p>
//                 </div>

//                 <div className="course-actions">
//                   <button
//                     className="delete-button"
//                     onClick={() =>
//                       handleDeleteCourse(course.id)
//                     }
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     );
//   };

//   // =========================
//   // STUDENTS
//   // =========================
//   const renderStudents = () => {
//     return (
//       <section className="dashboard-panel">

//         <h2>Students</h2>

//         <p className="section-subtitle">
//           View all registered students.
//         </p>

//         {loadingStudents ? (
//           <p className="empty-message">
//             Loading students...
//           </p>
//         ) : students.length === 0 ? (
//           <p className="empty-message">
//             No students registered yet.
//           </p>
//         ) : (
//           <div className="students-grid">
//             {students.map((student) => (
//               <div
//                 className="student-card"
//                 key={student.id}
//               >
//                 <div className="student-card-header">
//                   <h3>{student.name}</h3>

//                   <span className="student-role">
//                     Student
//                   </span>
//                 </div>

//                 <p>
//                   <strong>Email:</strong>{" "}
//                   {student.email}
//                 </p>

//                 <p>
//                   <strong>ID:</strong>{" "}
//                   {student.id}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     );
//   };

//   // =========================
//   // PROGRESS
//   // =========================
//   const renderProgress = () => {
//     return (
//       <section className="dashboard-panel">

//         <h2>Student Progress</h2>

//         <p className="section-subtitle">
//           Add or update progress for your students.
//         </p>

//         {loadingStudents ? (
//           <p className="empty-message">
//             Loading students...
//           </p>
//         ) : students.length === 0 ? (
//           <p className="empty-message">
//             No students available.
//           </p>
//         ) : (
//           <div className="detail-grid">
//             {students.map((student) => (
//               <StudentProgressCard
//                 key={student.id}
//                 student={student}
//                 courses={courses}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     );
//   };

//   // =========================
//   // GRADING
//   // =========================
//   const renderGrading = () => {
//     return (
//       <section className="dashboard-panel">

//         <h2>Student Grading</h2>

//         <p className="section-subtitle">
//           Add, view and delete student grades.
//         </p>

//         {loadingStudents ? (
//           <p className="empty-message">
//             Loading students...
//           </p>
//         ) : students.length === 0 ? (
//           <p className="empty-message">
//             No students available.
//           </p>
//         ) : (
//           <div className="detail-grid">
//             {students.map((student) => (
//               <StudentGradeCard
//                 key={student.id}
//                 student={student}
//                 courses={courses}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     );
//   };

//   // =========================
//   // PROFILE
//   // =========================
//   const renderProfile = () => {
//     return (
//       <section className="dashboard-panel">

//         <h2>My Profile</h2>

//         <div className="profile-card">
//           <h3>{name}</h3>

//           <p>
//             <strong>Role:</strong>{" "}
//             {role}
//           </p>

//           <p>
//             <strong>User ID:</strong>{" "}
//             {userId}
//           </p>

//           <p>
//             <strong>Total Courses:</strong>{" "}
//             {courses.length}
//           </p>

//           <p>
//             <strong>Total Students:</strong>{" "}
//             {students.length}
//           </p>
//         </div>
//       </section>
//     );
//   };

//   // =========================
//   // MAIN RETURN
//   // =========================
//   return (
//     <div className="instructor-dashboard">

//       {/* HEADER */}
//       <header className="dashboard-header">
//         <div className="header-inner">

//           <div className="logo">
//             Digital Skills Platform
//           </div>

//           <nav className="nav-links">

//             <button
//               className={`nav-button ${
//                 activeSection === "dashboard"
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() =>
//                 setActiveSection("dashboard")
//               }
//             >
//               Dashboard
//             </button>

//             <button
//               className={`nav-button ${
//                 activeSection === "courses"
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() =>
//                 setActiveSection("courses")
//               }
//             >
//               Courses
//             </button>

//             <button
//               className={`nav-button ${
//                 activeSection === "students"
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() =>
//                 setActiveSection("students")
//               }
//             >
//               Students
//             </button>

//             <button
//               className={`nav-button ${
//                 activeSection === "progress"
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() =>
//                 setActiveSection("progress")
//               }
//             >
//               Progress
//             </button>

//             <button
//               className={`nav-button ${
//                 activeSection === "grading"
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() =>
//                 setActiveSection("grading")
//               }
//             >
//               Grading
//             </button>

//             <button
//               className={`nav-button ${
//                 activeSection === "profile"
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() =>
//                 setActiveSection("profile")
//               }
//             >
//               Profile
//             </button>

//             <button
//               className="logout-button"
//               onClick={onLogout}
//             >
//               Logout
//             </button>

//           </nav>

//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="dashboard-main">

//         {/* DASHBOARD */}
//         {activeSection === "dashboard" &&
//           renderDashboard()}

//         {/* COURSES */}
//         {activeSection === "courses" &&
//           renderCourses()}

//         {/* STUDENTS */}
//         {activeSection === "students" &&
//           renderStudents()}

//         {/* PROGRESS */}
//         {activeSection === "progress" &&
//           renderProgress()}

//         {/* GRADING */}
//         {activeSection === "grading" &&
//           renderGrading()}

//         {/* PROFILE */}
//         {activeSection === "profile" &&
//           renderProfile()}

//         {/* BACK BUTTON */}
//         {activeSection !== "dashboard" && (
//           <div className="back-button-container">
//             <button
//               className="back-button"
//               onClick={() =>
//                 setActiveSection("dashboard")
//               }
//             >
//               ← Back to Dashboard
//             </button>
//           </div>
//         )}

//       </main>

//       {/* FOOTER */}
//       <footer className="dashboard-footer">
//         <p>
//           © 2026 Digital Skills Platform. All
//           rights reserved.
//         </p>
//       </footer>

//     </div>
//   );
// }


// // ======================================================
// // STUDENT PROGRESS CARD
// // ======================================================

// function StudentProgressCard({
//   student,
//   courses,
// }) {
//   const [progress, setProgress] = useState([]);

//   const [courseId, setCourseId] =
//     useState("");

//   const [progressValue, setProgressValue] =
//     useState("");

//   const [message, setMessage] =
//     useState("");

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   // =========================
//   // FETCH STUDENT PROGRESS
//   // =========================
//   const fetchProgress = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `http://127.0.0.1:8000/progress/${student.id}`
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             "Failed to fetch progress."
//         );
//       }

//       setProgress(
//         Array.isArray(data) ? data : []
//       );

//     } catch (error) {
//       console.error(
//         "Progress fetch error:",
//         error
//       );

//       setProgress([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProgress();
//   }, [student.id]);

//   // =========================
//   // COURSE NAME
//   // =========================
//   const getCourseName = (item) => {

//     if (item.course_title) {
//       return item.course_title;
//     }

//     if (item.course) {
//       return item.course;
//     }

//     const course = courses.find(
//       (c) =>
//         Number(c.id) ===
//         Number(item.course_id)
//     );

//     return course
//       ? course.title
//       : "Unknown Course";
//   };

//   // =========================
//   // ADD / UPDATE PROGRESS
//   // =========================
//   const addProgress = async (e) => {
//     e.preventDefault();

//     setMessage("");

//     if (!courseId) {
//       setMessage(
//         "Please select a course."
//       );
//       return;
//     }

//     if (progressValue === "") {
//       setMessage(
//         "Please enter progress."
//       );
//       return;
//     }

//     const numericProgress =
//       Number(progressValue);

//     if (
//       Number.isNaN(numericProgress) ||
//       numericProgress < 0 ||
//       numericProgress > 100
//     ) {
//       setMessage(
//         "Progress must be between 0 and 100."
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       const response = await fetch(
//         "http://127.0.0.1:8000/progress",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             student_id: Number(
//               student.id
//             ),

//             course_id: Number(
//               courseId
//             ),

//             progress:
//               numericProgress,
//           }),
//         }
//       );

//       const data =
//         await response.json();

//       console.log(
//         "Progress API response:",
//         data
//       );

//       if (!response.ok) {
//         setMessage(
//           data.detail ||
//             "Failed to update progress."
//         );

//         return;
//       }

//       setMessage(
//         "Progress updated successfully!"
//       );

//       setCourseId("");
//       setProgressValue("");

//       await fetchProgress();

//     } catch (error) {
//       console.error(
//         "Add progress error:",
//         error
//       );

//       setMessage(
//         "Server error. Please make sure backend is running."
//       );

//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="detail-card">

//       <div className="student-card-header">

//         <h3>{student.name}</h3>

//         <span className="student-role">
//           Student
//         </span>

//       </div>

//       <p>
//         <strong>Email:</strong>{" "}
//         {student.email}
//       </p>

//       <p>
//         <strong>Student ID:</strong>{" "}
//         {student.id}
//       </p>

//       <hr />

//       <h4>Course Progress</h4>

//       {loading ? (
//         <p className="empty-message">
//           Loading progress...
//         </p>
//       ) : progress.length === 0 ? (
//         <p className="empty-message">
//           No progress available.
//         </p>
//       ) : (
//         <div className="progress-list">

//           {progress.map((item) => {

//             const progressNumber = Math.min(
//               Math.max(
//                 Number(item.progress) || 0,
//                 0
//               ),
//               100
//             );

//             return (
//               <div
//                 className="progress-item"
//                 key={item.id}
//               >

//                 <div className="progress-top">

//                   <span>
//                     {getCourseName(item)}
//                   </span>

//                   <strong>
//                     {progressNumber}%
//                   </strong>

//                 </div>

//                 <div className="progress-bar">

//                   <div
//                     className="progress-fill"
//                     style={{
//                       width: `${progressNumber}%`,
//                     }}
//                   ></div>

//                 </div>

//               </div>
//             );
//           })}

//         </div>
//       )}

//       {/* ADD / UPDATE PROGRESS */}
//       <div className="grade-form">

//         <h4>
//           Add / Update Progress
//         </h4>

//         <select
//           value={courseId}
//           onChange={(e) =>
//             setCourseId(
//               e.target.value
//             )
//           }
//         >

//           <option value="">
//             Select Course
//           </option>

//           {courses.length === 0 ? (
//             <option disabled>
//               No courses available
//             </option>
//           ) : (
//             courses.map((course) => (
//               <option
//                 key={course.id}
//                 value={course.id}
//               >
//                 {course.title}
//               </option>
//             ))
//           )}

//         </select>

//         <input
//           type="number"
//           min="0"
//           max="100"
//           placeholder="Progress (0-100)"
//           value={progressValue}
//           onChange={(e) =>
//             setProgressValue(
//               e.target.value
//             )
//           }
//         />

//         <button
//           type="button"
//           className="primary-button"
//           onClick={addProgress}
//           disabled={saving}
//         >
//           {saving
//             ? "Updating..."
//             : "Update Progress"}
//         </button>

//         {message && (
//           <p className="form-message">
//             {message}
//           </p>
//         )}

//       </div>

//     </div>
//   );
// }


// // ======================================================
// // STUDENT GRADE CARD
// // ======================================================

// function StudentGradeCard({
//   student,
//   courses,
// }) {
//   const [grades, setGrades] =
//     useState([]);

//   const [courseId, setCourseId] =
//     useState("");

//   const [assignment, setAssignment] =
//     useState("");

//   const [marks, setMarks] =
//     useState("");

//   const [message, setMessage] =
//     useState("");

//   const [saving, setSaving] =
//     useState(false);

//   // =========================
//   // FETCH GRADES
//   // =========================
//   const fetchGrades = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/grades/${student.id}`
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.detail ||
//             "Failed to fetch grades."
//         );
//       }

//       setGrades(
//         Array.isArray(data)
//           ? data
//           : []
//       );

//     } catch (error) {
//       console.error(
//         "Grades fetch error:",
//         error
//       );

//       setGrades([]);
//     }
//   };

//   useEffect(() => {
//     fetchGrades();
//   }, [student.id]);

//   // =========================
//   // COURSE NAME
//   // =========================
//   const getCourseName = (item) => {

//     if (item.course_title) {
//       return item.course_title;
//     }

//     if (item.course) {
//       return item.course;
//     }

//     const course = courses.find(
//       (c) =>
//         Number(c.id) ===
//         Number(item.course_id)
//     );

//     return course
//       ? course.title
//       : "Unknown Course";
//   };

//   // =========================
//   // ADD GRADE
//   // =========================
//   const addGrade = async (e) => {
//     e.preventDefault();

//     setMessage("");

//     if (!courseId) {
//       setMessage(
//         "Please select a course."
//       );
//       return;
//     }

//     if (!assignment.trim()) {
//       setMessage(
//         "Please enter assignment name."
//       );
//       return;
//     }

//     if (marks === "") {
//       setMessage(
//         "Please enter marks."
//       );
//       return;
//     }

//     const numericMarks =
//       Number(marks);

//     if (
//       Number.isNaN(numericMarks) ||
//       numericMarks < 0
//     ) {
//       setMessage(
//         "Please enter valid marks."
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       const response = await fetch(
//         "http://127.0.0.1:8000/grades",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             student_id: Number(
//               student.id
//             ),

//             course_id: Number(
//               courseId
//             ),

//             assignment:
//               assignment,

//             marks:
//               numericMarks,
//           }),
//         }
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         setMessage(
//           data.detail ||
//             "Failed to add grade."
//         );

//         return;
//       }

//       setMessage(
//         "Grade added successfully!"
//       );

//       setCourseId("");
//       setAssignment("");
//       setMarks("");

//       await fetchGrades();

//     } catch (error) {
//       console.error(
//         "Add grade error:",
//         error
//       );

//       setMessage(
//         "Server error. Please make sure backend is running."
//       );

//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================
//   // DELETE GRADE
//   // =========================
//   const deleteGrade = async (
//     gradeId
//   ) => {

//     const confirmDelete =
//       window.confirm(
//         "Are you sure you want to delete this grade?"
//       );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/grades/${gradeId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         alert(
//           data.detail ||
//             "Failed to delete grade."
//         );

//         return;
//       }

//       alert(
//         "Grade deleted successfully!"
//       );

//       await fetchGrades();

//     } catch (error) {
//       console.error(
//         "Delete grade error:",
//         error
//       );

//       alert(
//         "Server error. Please make sure backend is running."
//       );
//     }
//   };

//   return (
//     <div className="detail-card">

//       <div className="student-card-header">

//         <h3>{student.name}</h3>

//         <span className="student-role">
//           Student
//         </span>

//       </div>

//       <p>
//         <strong>Email:</strong>{" "}
//         {student.email}
//       </p>

//       <hr />

//       <h4>Grades</h4>

//       {grades.length === 0 ? (
//         <p className="empty-message">
//           No grades available.
//         </p>
//       ) : (
//         <div className="grade-history">

//           {grades.map((grade) => (
//             <div
//               className="grade-item"
//               key={grade.id}
//             >

//               <div className="grade-info">

//                 <strong>
//                   {grade.assignment}
//                 </strong>

//                 <span>
//                   {getCourseName(grade)}
//                 </span>

//               </div>

//               <div className="grade-marks">
//                 {grade.marks}
//               </div>

//               <button
//                 className="delete-grade-button"
//                 onClick={() =>
//                   deleteGrade(
//                     grade.id
//                   )
//                 }
//               >
//                 Delete
//               </button>

//             </div>
//           ))}

//         </div>
//       )}

//       {/* ADD GRADE FORM */}
//       <div className="grade-form">

//         <h4>
//           Add Grade
//         </h4>

//         <select
//           value={courseId}
//           onChange={(e) =>
//             setCourseId(
//               e.target.value
//             )
//           }
//         >

//           <option value="">
//             Select Course
//           </option>

//           {courses.length === 0 ? (
//             <option disabled>
//               No courses available
//             </option>
//           ) : (
//             courses.map((course) => (
//               <option
//                 key={course.id}
//                 value={course.id}
//               >
//                 {course.title}
//               </option>
//             ))
//           )}

//         </select>

//         <input
//           type="text"
//           placeholder="Assignment name"
//           value={assignment}
//           onChange={(e) =>
//             setAssignment(
//               e.target.value
//             )
//           }
//         />

//         <input
//           type="number"
//           min="0"
//           placeholder="Marks"
//           value={marks}
//           onChange={(e) =>
//             setMarks(
//               e.target.value
//             )
//           }
//         />

//         <button
//           type="button"
//           className="primary-button"
//           onClick={addGrade}
//           disabled={saving}
//         >
//           {saving
//             ? "Adding..."
//             : "Add Grade"}
//         </button>

//         {message && (
//           <p className="form-message">
//             {message}
//           </p>
//         )}

//       </div>

//     </div>
//   );
// }

// export default InstructorDashboard;
