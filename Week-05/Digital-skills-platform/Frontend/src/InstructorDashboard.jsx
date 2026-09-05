// import { useEffect, useState } from "react";
// import "./InstructorDashboard.css";

// // Student Progress Card
// function StudentProgressCard({ student, courses }) {
//   const [progress, setProgress] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`http://127.0.0.1:8000/progress/${student.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProgress(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.error("Progress fetch error:", err);
//         setProgress([]);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [student.id]);

//   const getCourseName = (item) => {
//     if (item.course) {
//       return item.course;
//     }

//     const course = courses.find((c) => Number(c.id) === Number(item.course_id));

//     return course ? course.title : "Unknown Course";
//   };

//   return (
//     <div className="detail-card">
//       <div className="student-card-header">
//         <h3>{student.name}</h3>
//         <span className="student-role">Student</span>
//       </div>

//       <p>
//         <strong>Email:</strong> {student.email}
//       </p>

//       <hr />

//       <h4>Course Progress</h4>

//       {loading ? (
//         <p className="empty-message">Loading progress...</p>
//       ) : progress.length === 0 ? (
//         <p className="empty-message">No progress available.</p>
//       ) : (
//         <div className="progress-list">
//           {progress.map((item) => (
//             <div className="progress-item" key={item.id}>
//               <div className="progress-top">
//                 <span>{getCourseName(item)}</span>
//                 <strong>{item.progress}%</strong>
//               </div>

//               <div className="progress-bar">
//                 <div
//                   className="progress-fill"
//                   style={{
//                     width: `${Math.min(
//                       Math.max(Number(item.progress) || 0, 0),
//                       100,
//                     )}%`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // Student Grade Card
// function StudentGradeCard({ student, courses }) {
//   const [grades, setGrades] = useState([]);
//   const [courseId, setCourseId] = useState("");
//   const [assignment, setAssignment] = useState("");
//   const [marks, setMarks] = useState("");
//   const [message, setMessage] = useState("");

//   const fetchGrades = () => {
//     fetch(`http://127.0.0.1:8000/grades/${student.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setGrades(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.error("Grades fetch error:", err);
//         setGrades([]);
//       });
//   };

//   useEffect(() => {
//     fetchGrades();
//   }, [student.id]);

//   const addGrade = async () => {
//     setMessage("");

//     if (!courseId || !assignment || marks === "") {
//       setMessage("Please fill all grade fields.");
//       return;
//     }

//     const numericMarks = Number(marks);

//     if (numericMarks < 0 || numericMarks > 100) {
//       setMessage("Marks must be between 0 and 100.");
//       return;
//     }

//     const selectedCourse = courses.find(
//       (course) => Number(course.id) === Number(courseId),
//     );

//     try {
//       const response = await fetch("http://127.0.0.1:8000/grades", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           student_id: student.id,
//           course_id: Number(courseId),
//           course: selectedCourse ? selectedCourse.title : "",
//           assignment,
//           marks: numericMarks,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setMessage(data.detail || "Failed to add grade.");
//         return;
//       }

//       setMessage("Grade added successfully!");

//       setCourseId("");
//       setAssignment("");
//       setMarks("");

//       fetchGrades();
//     } catch (error) {
//       console.error(error);
//       setMessage("Server error.");
//     }
//   };

//   const deleteGrade = async (gradeId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this grade?",
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/grades/${gradeId}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setMessage(data.detail || "Failed to delete grade.");
//         return;
//       }

//       setMessage("Grade deleted successfully!");

//       fetchGrades();
//     } catch (error) {
//       console.error(error);
//       setMessage("Server error.");
//     }
//   };

//   const getCourseName = (grade) => {
//     if (grade.course) {
//       return grade.course;
//     }

//     const course = courses.find(
//       (c) => Number(c.id) === Number(grade.course_id),
//     );

//     return course ? course.title : "Unknown Course";
//   };

//   return (
//     <div className="detail-card grading-card">
//       <div className="student-card-header">
//         <h3>{student.name}</h3>
//         <span className="student-role">Student</span>
//       </div>

//       <p>
//         <strong>Email:</strong> {student.email}
//       </p>

//       {/* Add Grade */}
//       <div className="grade-form">
//         <h4>Add Grade</h4>

//         <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//           <option value="">Select Course</option>

//           {courses.map((course) => (
//             <option key={course.id} value={course.id}>
//               {course.title}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="Assignment / Exam Name"
//           value={assignment}
//           onChange={(e) => setAssignment(e.target.value)}
//         />

//         <input
//           type="number"
//           min="0"
//           max="100"
//           placeholder="Marks (0-100)"
//           value={marks}
//           onChange={(e) => setMarks(e.target.value)}
//         />

//         <button type="button" className="primary-button" onClick={addGrade}>
//           Add Grade
//         </button>

//         {message && <p className="form-message">{message}</p>}
//       </div>

//       {/* Grade History */}
//       <div className="grade-history">
//         <h4>Grade History</h4>

//         {grades.length === 0 ? (
//           <p className="empty-message">No grades added yet.</p>
//         ) : (
//           grades.map((grade) => (
//             <div className="grade-item" key={grade.id}>
//               <div className="grade-info">
//                 <strong>{getCourseName(grade)}</strong>

//                 <span>{grade.assignment}</span>

//                 <span className="grade-marks">{grade.marks}/100</span>
//               </div>

//               <button
//                 type="button"
//                 className="delete-grade-button"
//                 onClick={() => deleteGrade(grade.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// // Main Instructor Dashboard
// function InstructorDashboard({ name, role, userId, onLogout }) {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [menuOpen, setMenuOpen] = useState(false);

//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Course Form
//   const [courseTitle, setCourseTitle] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [courseContent, setCourseContent] = useState("");
//   const [courseMessage, setCourseMessage] = useState("");
//   const [editingCourseId, setEditingCourseId] = useState(null);

//   // Fetch Courses
//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `http://127.0.0.1:8000/courses/instructor/${userId}`,
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch courses.");
//       }

//       const data = await response.json();

//       setCourses(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load courses.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Students
//   const fetchStudents = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/students");

//       if (!response.ok) {
//         throw new Error("Failed to fetch students.");
//       }

//       const data = await response.json();

//       setStudents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load students.");
//     }
//   };

//   // Initial Fetch
//   useEffect(() => {
//     if (userId) {
//       fetchCourses();
//       fetchStudents();
//     }
//   }, [userId]);

//   // Open Section
//   const openSection = (section) => {
//     setActiveSection(section);
//     // Mobile menu close
//     setMenuOpen(false);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // Reset Course Form
//   const resetCourseForm = () => {
//     setCourseTitle("");
//     setCourseDescription("");
//     setCourseContent("");
//     setEditingCourseId(null);
//     setCourseMessage("");
//   };

//   // Add / Update Course
//   const handleCourseSubmit = async (e) => {
//     e.preventDefault();

//     setCourseMessage("");

//     if (!courseTitle.trim() || !courseDescription.trim()) {
//       setCourseMessage("Please fill course title and description.");
//       return;
//     }

//     try {
//       let response;

//       if (editingCourseId) {
//         response = await fetch(
//           `http://127.0.0.1:8000/courses/${editingCourseId}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               title: courseTitle,
//               description: courseDescription,
//               content: courseContent,
//             }),
//           },
//         );
//       } else {
//         response = await fetch("http://127.0.0.1:8000/courses", {
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
//         });
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         setCourseMessage(data.detail || "Something went wrong.");
//         return;
//       }

//       setCourseMessage(
//         editingCourseId
//           ? "Course updated successfully!"
//           : "Course added successfully!",
//       );

//       resetCourseForm();

//       fetchCourses();
//     } catch (err) {
//       console.error(err);
//       setCourseMessage("Server error.");
//     }
//   };

//   // Edit Course
//   const handleEditCourse = (course) => {
//     setEditingCourseId(course.id);
//     setCourseTitle(course.title || "");
//     setCourseDescription(course.description || "");
//     setCourseContent(course.content || "");
//     setCourseMessage("");

//     setActiveSection("courses");

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // Delete Course
//   const handleDeleteCourse = async (courseId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this course?",
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/courses/${courseId}`,
//         {
//           method: "DELETE",
//         },
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.detail || "Failed to delete course.");
//         return;
//       }

//       fetchCourses();
//     } catch (err) {
//       console.error(err);
//       setError("Server error.");
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     setMenuOpen(false);
//     onLogout();
//   };

//   return (
//     <div className="instructor-dashboard">
//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-inner">
//           <div className="logo">🎓 Instructor Panel</div>

//           {/* Mobile Menu Button */}
//           <button
//             type="button"
//             className="menu-toggle"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle navigation menu"
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? "✕" : "☰"}
//           </button>

//           {/* Navigation */}
//           <nav className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
//             <button
//               type="button"
//               className="nav-button"
//               onClick={() => openSection("dashboard")}
//             >
//               Dashboard
//             </button>

//             <button
//               type="button"
//               className="nav-button"
//               onClick={() => openSection("courses")}
//             >
//               Courses
//             </button>

//             <button
//               type="button"
//               className="nav-button"
//               onClick={() => openSection("students")}
//             >
//               Students
//             </button>

//             <button
//               type="button"
//               className="nav-button"
//               onClick={() => openSection("progress")}
//             >
//               Progress
//             </button>

//             <button
//               type="button"
//               className="nav-button"
//               onClick={() => openSection("grading")}
//             >
//               Grading
//             </button>

//             <button
//               type="button"
//               className="logout-button"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="dashboard-main">
//         {/* Dashboard */}
//         {activeSection === "dashboard" && (
//           <section className="dashboard-home">
//             <div className="welcome-section">
//               <h1>Welcome, {name}! 👋</h1>

//               <p>
//                 Role: <strong>{role}</strong>
//               </p>

//               <p>
//                 Manage your courses, students, progress and grades from here.
//               </p>
//             </div>

//             <div className="dashboard-cards">
//               <div
//                 className="dashboard-card"
//                 onClick={() => openSection("courses")}
//               >
//                 <div className="card-icon">📚</div>

//                 <h2>Courses</h2>

//                 <p>Add, update and manage your courses.</p>

//                 <span className="card-count">{courses.length} Courses</span>
//               </div>

//               <div
//                 className="dashboard-card"
//                 onClick={() => openSection("students")}
//               >
//                 <div className="card-icon">👨‍🎓</div>

//                 <h2>Students</h2>

//                 <p>View all registered students.</p>

//                 <span className="card-count">{students.length} Students</span>
//               </div>

//               <div
//                 className="dashboard-card"
//                 onClick={() => openSection("progress")}
//               >
//                 <div className="card-icon">📈</div>

//                 <h2>Progress</h2>

//                 <p>Check student course progress.</p>
//               </div>

//               <div
//                 className="dashboard-card"
//                 onClick={() => openSection("grading")}
//               >
//                 <div className="card-icon">📝</div>

//                 <h2>Grading</h2>

//                 <p>Add and manage student grades.</p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Courses */}
//         {activeSection === "courses" && (
//           <section className="dashboard-panel">
//             <h2>📚 Manage Courses</h2>

//             <p className="section-subtitle">
//               Add new courses or update existing courses.
//             </p>

//             {/* Course Form */}
//             <form className="course-form" onSubmit={handleCourseSubmit}>
//               <h3>{editingCourseId ? "Edit Course" : "Add New Course"}</h3>

//               <input
//                 type="text"
//                 placeholder="Course Title"
//                 value={courseTitle}
//                 onChange={(e) => setCourseTitle(e.target.value)}
//               />

//               <textarea
//                 placeholder="Course Description"
//                 value={courseDescription}
//                 onChange={(e) => setCourseDescription(e.target.value)}
//               />

//               <textarea
//                 placeholder="Course Content"
//                 value={courseContent}
//                 onChange={(e) => setCourseContent(e.target.value)}
//               />

//               <div className="form-buttons">
//                 <button type="submit" className="primary-button">
//                   {editingCourseId ? "Update Course" : "Add Course"}
//                 </button>

//                 {editingCourseId && (
//                   <button
//                     type="button"
//                     className="cancel-button"
//                     onClick={resetCourseForm}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>

//               {courseMessage && <p className="form-message">{courseMessage}</p>}
//             </form>

//             {/* Course List */}
//             <div className="course-grid">
//               {loading ? (
//                 <p className="empty-message">Loading courses...</p>
//               ) : courses.length === 0 ? (
//                 <p className="empty-message">No courses found.</p>
//               ) : (
//                 courses.map((course) => (
//                   <div className="course-card" key={course.id}>
//                     <h3>{course.title}</h3>

//                     <p>{course.description}</p>

//                     {course.content && (
//                       <div className="course-content">
//                         <strong>Content:</strong>
//                         <p>{course.content}</p>
//                       </div>
//                     )}

//                     <div className="course-actions">
//                       <button
//                         type="button"
//                         className="edit-button"
//                         onClick={() => handleEditCourse(course)}
//                       >
//                         Edit
//                       </button>

//                       <button
//                         type="button"
//                         className="delete-button"
//                         onClick={() => handleDeleteCourse(course.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="back-button-container">
//               <button
//                 type="button"
//                 className="back-button"
//                 onClick={() => openSection("dashboard")}
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Students */}
//         {activeSection === "students" && (
//           <section className="dashboard-panel">
//             <h2>👨‍🎓 Students</h2>

//             <p className="section-subtitle">View all registered students.</p>

//             <div className="student-grid">
//               {students.length === 0 ? (
//                 <p className="empty-message">No students found.</p>
//               ) : (
//                 students.map((student) => (
//                   <div className="student-card" key={student.id}>
//                     <div className="student-icon">👨‍🎓</div>

//                     <h3>{student.name}</h3>

//                     <p>{student.email}</p>

//                     <span className="student-role">
//                       {student.role || "Student"}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="back-button-container">
//               <button
//                 type="button"
//                 className="back-button"
//                 onClick={() => openSection("dashboard")}
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Progress */}
//         {activeSection === "progress" && (
//           <section className="dashboard-panel">
//             <h2>📈 Student Progress</h2>

//             <p className="section-subtitle">
//               Monitor student progress in different courses.
//             </p>

//             <div className="detail-grid">
//               {students.length === 0 ? (
//                 <p className="empty-message">No students found.</p>
//               ) : (
//                 students.map((student) => (
//                   <StudentProgressCard
//                     key={student.id}
//                     student={student}
//                     courses={courses}
//                   />
//                 ))
//               )}
//             </div>

//             <div className="back-button-container">
//               <button
//                 type="button"
//                 className="back-button"
//                 onClick={() => openSection("dashboard")}
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Grading */}
//         {activeSection === "grading" && (
//           <section className="dashboard-panel">
//             <h2>📝 Student Grading</h2>

//             <p className="section-subtitle">
//               Add, view and delete student grades.
//             </p>

//             <div className="detail-grid">
//               {students.length === 0 ? (
//                 <p className="empty-message">No students found.</p>
//               ) : (
//                 students.map((student) => (
//                   <StudentGradeCard
//                     key={student.id}
//                     student={student}
//                     courses={courses}
//                   />
//                 ))
//               )}
//             </div>

//             <div className="back-button-container">
//               <button
//                 type="button"
//                 className="back-button"
//                 onClick={() => openSection("dashboard")}
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Error */}
//         {error && <div className="error-message">{error}</div>}
//       </main>

//       {/* Footer */}
//       <footer className="dashboard-footer">
//         <p>© 2026 Digital Skills Platform | Instructor Dashboard</p>
//       </footer>
//     </div>
//   );
// }

// export default InstructorDashboard;













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
