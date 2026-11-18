
import { useState, useEffect } from "react";

// Sample users
const users = [
  { id: 1, name: "Student 1", role: "Student" },
  { id: 2, name: "Student 2", role: "Student" },
  { id: 3, name: "Student 3", role: "Student" },
  { id: 4, name: "Student 4", role: "Student" },
  { id: 5, name: "Student 5", role: "Student" },
  { id: 6, name: "Admin 1", role: "Admin" },
  { id: 7, name: "Admin 2", role: "Admin" },
];

// Student Dashboard
function StudentDashboard({ user, assignments, onSubmit }) {

  const [confirmingAssignment, setConfirmingAssignment] = useState(null);
  // Show only assignments assigned to this student
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const myAssignments = assignments.filter((assignment) =>
    assignment.assignedTo.includes(user.id)
  );
  const filteredAssignments = myAssignments.filter((assignment) => {
  const matchesSearch = assignment.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const isSubmitted = assignment.submittedBy?.includes(user.id);

  const matchesStatus =
    statusFilter === "All" ||
    (statusFilter === "Pending" && !isSubmitted) ||
    (statusFilter === "Submitted" && isSubmitted);

  return matchesSearch && matchesStatus;
});
  const pendingAssignments = myAssignments.filter(
  (assignment) => !assignment.submittedBy?.includes(user.id)
  );
  const submittedAssignments = myAssignments.length - pendingAssignments.length;

const progressPercentage = myAssignments.length > 0
  ? (submittedAssignments / myAssignments.length) * 100
  : 0;
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Student Dashboard
      </h2>

      <p className="text-gray-500 mt-2">
        Welcome back, {user.name}!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500">Total Assignments</p>
          <h3 className="text-3xl font-bold mt-2">
            {myAssignments.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500">Pending Assignments</p>
          <h3 className="text-3xl font-bold text-orange-500 mt-2">
            {pendingAssignments.length}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-6">
  <div className="flex justify-between mb-2">
    <h3 className="font-semibold">Overall Progress</h3>
    <span className="font-semibold text-blue-600">
      {submittedAssignments} of {myAssignments.length} submitted
    </span>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-3">
    <div
      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
      style={{ width: `${progressPercentage}%` }}
    ></div>
  </div>
</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">

        <h3 className="text-xl font-bold mb-5">
          My Assignments
        </h3>
        
        <input
  type="text"
  placeholder="Search assignments by title..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full border rounded-lg p-3 mb-5"
/>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="w-full border rounded-lg p-3 mb-5"
>
  <option value="All">All Assignments</option>
  <option value="Pending">Pending</option>
  <option value="Submitted">Submitted</option>
</select>
        {filteredAssignments.length === 0 ? (
          <p className="text-gray-500">
  {myAssignments.length === 0
    ? "No assignments available yet."
    : "No assignments match your search or filter."}
</p>
        ) : (

          filteredAssignments.map((assignment) => (

            <div
              key={assignment.id}
              className={`border rounded-lg p-5 mb-4 ${
  new Date(assignment.dueDate + "T23:59:59") < new Date() &&
!assignment.submittedBy?.includes(user.id)
    ? "bg-red-50 border-red-300"
    : "bg-white"
}`}
            >
              <h4 className="font-semibold text-lg">
                {assignment.title}
              </h4>

              <p className="text-gray-500 mt-2">
                {assignment.description}
              </p>

              <p className="text-sm mt-3">
                Due date: {assignment.dueDate}
              </p>
             
              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline block mt-3"
              >
                Open Drive Link
              </a>

              {assignment.submittedBy?.includes(user.id) ? (
  <span className="text-green-600 font-semibold">
    Submitted
  </span>
) : (
  <>
    <span className="text-orange-500 font-semibold mr-3">
      Pending
    </span>

    <button
      onClick={() => setConfirmingAssignment(assignment.id)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Yes, I have submitted
    </button>

    {confirmingAssignment === assignment.id && (
      <div className="mt-3 p-3 border rounded-lg">
        <p className="mb-2">
          Are you sure you want to confirm your submission?
        </p>

        <button
          onClick={() => {
            if (window.confirm("Final confirmation: Have you submitted this assignment?")) {
              onSubmit(assignment.id, user.id);
            }
            setConfirmingAssignment(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          Confirm Submission
        </button>

        <button
          onClick={() => setConfirmingAssignment(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    )}
  </>
)}

            </div>

          ))

        )}

      </div>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard({ user, assignments, onCreate, onUpdate, onDelete }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  // Select or unselect students
  const handleStudentSelection = (studentId) => {

    setSelectedStudents((previous) =>
      previous.includes(studentId)
        ? previous.filter((id) => id !== studentId)
        : [...previous, studentId]
    );

  };

  // Create assignment
  // Reset the form
const resetForm = () => {
  setTitle("");
  setDescription("");
  setDueDate("");
  setDriveLink("");
  setSelectedStudents([]);
  setEditingId(null);
};

// Create or update assignment
const handleSubmit = (event) => {
  event.preventDefault();

  if (selectedStudents.length === 0) {
    alert("Please select at least one student.");
    return;
  }

  const assignmentData = {
    title,
    description,
    dueDate,
    driveLink,
    assignedTo: selectedStudents,
  };

  if (editingId !== null) {
    // Update existing assignment
    onUpdate(editingId, assignmentData);
    alert("Assignment updated successfully!");
  } else {
    // Create new assignment
    const newAssignment = {
      id: Date.now(),
      ...assignmentData,
      createdBy: user.id,
      submittedBy: [],
    };

    onCreate(newAssignment);
    alert("Assignment created successfully!");
  }

  resetForm();
};
  // Edit an existing assignment
const handleEdit = (assignment) => {
  setTitle(assignment.title);
  setDescription(assignment.description);
  setDueDate(assignment.dueDate);
  setDriveLink(assignment.driveLink);
  setSelectedStudents(assignment.assignedTo);
  setEditingId(assignment.id);
};
// Delete an assignment
const handleDelete = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this assignment?"
  );

  if (confirmDelete) {
    onDelete(id);
    alert("Assignment deleted successfully!");
  }
};
  // Show only assignments created by this admin
  const myCreatedAssignments = assignments.filter(
    (assignment) => assignment.createdBy === user.id
  );
  const getSubmissionProgress = (assignment) => {
  const totalStudents = assignment.assignedTo.length;
  const submittedCount = assignment.submittedBy?.length || 0;

  const percentage = totalStudents > 0
    ? (submittedCount / totalStudents) * 100
    : 0;

  return { submittedCount, totalStudents, percentage };
};
  return (
    <div>

      <h2 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h2>

      <p className="text-gray-500 mt-2">
        Welcome, Professor {user.name}!
      </p>

      {/* Create Assignment Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">

        <h3 className="text-xl font-bold mb-5">
          Create New Assignment
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium mb-2">
              Assignment Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assignment description"
              className="w-full border rounded-lg p-3"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Google Drive Link
            </label>

            <input
              type="url"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-3">
              Assign to Students
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {users
                .filter((u) => u.role === "Student")
                .map((student) => (

                  <label
                    key={student.id}
                    className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer"
                  >

                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() =>
                        handleStudentSelection(student.id)
                      }
                      className="w-4 h-4 accent-purple-600"
                    />

                    {student.name}

                  </label>

                ))}

            </div>
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            {editingId !== null ? "Update Assignment" : "Create Assignment"}
          </button>

        </form>
      </div>

      {/* Created Assignments */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">

        <h3 className="text-xl font-bold mb-5">
          My Created Assignments
        </h3>

        {myCreatedAssignments.length === 0 ? (

          <p className="text-gray-500">
            You haven't created any assignments yet.
          </p>

        ) : (

          myCreatedAssignments.map((assignment) => (

            <div
              key={assignment.id}
              className="border rounded-lg p-4 mb-3"
            >
              <h4 className="font-semibold">
                {assignment.title}
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Due: {assignment.dueDate}
              </p>

              <p className="text-sm mt-2">
                Assigned to {assignment.assignedTo.length} student(s)
              </p>
              {(() => {
  const progress = getSubmissionProgress(assignment);

  return (
    <div className="mt-4">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Submission Progress</span>
        <span className="text-blue-600 font-semibold">
          {progress.submittedCount} of {progress.totalStudents} submitted
          ({Math.round(progress.percentage)}%)
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-green-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
    </div>
  );
})()}
              <div className="mt-4 border-t pt-3">
  <h4 className="font-semibold mb-3">
    Student Submission Status
  </h4>

  {assignment.assignedTo.map((studentId) => {
    const student = users.find((u) => u.id === studentId);
    const isSubmitted = assignment.submittedBy?.includes(studentId);

    return (
      <div
        key={studentId}
        className="flex justify-between items-center border-b py-2"
      >
        <span>{student?.name}</span>

        <span
          className={
            isSubmitted
              ? "text-green-600 font-semibold"
              : "text-orange-500 font-semibold"
          }
        >
          {isSubmitted ? "Submitted" : "Pending"}
        </span>
      </div>
    );
  })}
</div>
              <div className="flex gap-3 mt-4">

              <button
              onClick={() => handleEdit(assignment)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
              Edit</button>
              <button
              onClick={() => handleDelete(assignment.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
              Delete</button>

            </div>
            </div>

          ))

        )}

      </div>

    </div>
  );
}

// Main Application
function App() {

  const [selectedUser, setSelectedUser] = useState(users[0]);

  // Store all assignments
  const [assignments, setAssignments] = useState(() => {
  const savedAssignments = localStorage.getItem("assignments");

  return savedAssignments
    ? JSON.parse(savedAssignments)
    : [];
});
useEffect(() => {
  localStorage.setItem("assignments", JSON.stringify(assignments));
}, [assignments]);
  const handleUserChange = (event) => {

    const user = users.find(
      (u) => u.id === Number(event.target.value)
    );

    setSelectedUser(user);

  };

  // Add new assignment to the list
  const handleCreateAssignment = (newAssignment) => {

    setAssignments((previous) => [
      ...previous,
      newAssignment,
    ]);

  };
  const handleUpdateAssignment = (id, updatedData) => {
  setAssignments((previous) =>
    previous.map((assignment) =>
      assignment.id === id
        ? { ...assignment, ...updatedData }
        : assignment
    )
  );
};
  const handleDeleteAssignment = (id) => {
  setAssignments((previous) =>
    previous.filter((assignment) => assignment.id !== id)
  );
};
// Mark assignment as submitted
const handleStudentSubmission = (assignmentId, studentId) => {
  setAssignments((previous) =>
    previous.map((assignment) =>
      assignment.id === assignmentId
        ? {
            ...assignment,
            submittedBy: assignment.submittedBy.includes(studentId)
              ? assignment.submittedBy
              : [...assignment.submittedBy, studentId],
          }
        : assignment
    )
  );
};
  return (

    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-64 min-h-0 md:min-h-screen bg-slate-900 text-white p-4 md:p-6 shrink-0">

        <h1 className="text-2xl font-bold text-purple-400">
          Joineazy
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Assignment Management
        </p>

        <nav className="mt-10 space-y-4">

          <div className="bg-purple-600 p-3 rounded-lg">
            Dashboard
          </div>

          <div className="p-3 rounded-lg">
            Assignments
          </div>

          <div className="p-3 rounded-lg">
            Submissions
          </div>

          <div className="p-3 rounded-lg">
            Settings
          </div>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-5 md:p-8">

        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

          <div>
            <h1 className="text-xl font-bold text-purple-700">
              Joineazy
            </h1>

            <p className="text-sm text-gray-500">
              Assignment Management System
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Switch User
            </label>

            <select
              value={selectedUser.id}
              onChange={handleUserChange}
              className="border rounded-lg p-3 bg-white"
            >

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}

            </select>
          </div>

        </div>

        {/* Display the correct dashboard */}
        {selectedUser.role === "Student" ? (

          <StudentDashboard
  user={selectedUser}
  assignments={assignments}
  onSubmit={handleStudentSubmission}
/>

        ) : (

          <AdminDashboard
  user={selectedUser}
  assignments={assignments}
  onCreate={handleCreateAssignment}
  onUpdate={handleUpdateAssignment}
  onDelete={handleDeleteAssignment}
/>

        )}

      </main>

    </div>

  );

}

export default App;
