
const API = "/api/students";

let editingStudentId = null;

async function loadStudents() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Unable to fetch students");
        }

        const students = await response.json();
        const studentList = document.getElementById("studentList");

        studentList.innerHTML = "";

        students.forEach(student => {
            studentList.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.age}</td>
                    <td>
                        <button type="button"
                            onclick="editStudent(${student.id})">
                            Edit
                        </button>

                        <button type="button"
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Unable to load student records.");
    }
}


document.getElementById("studentForm")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        age: Number(document.getElementById("age").value)
    };

   
    const isEditing = editingStudentId !== null;

    const url = isEditing
        ? `${API}/${editingStudentId}`
        : API;

    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        alert(isEditing
            ? "Student updated successfully!"
            : "Student added successfully!"
        );

        resetForm();
        loadStudents();

    } catch (error) {
        console.error(error);
        alert("Unable to save student details.");
    }
});


async function editStudent(id) {

    try {
        const response = await fetch(`${API}/${id}`);

        if (!response.ok) {
            throw new Error("Student not found");
        }

        const student = await response.json();

        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("course").value = student.course;
        document.getElementById("age").value = student.age;

        editingStudentId = id;

        document.getElementById("submitBtn").textContent =
            "Update Student";

        document.getElementById("cancelBtn").hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);
        alert("Unable to load student details.");
    }
}


document.getElementById("cancelBtn")
.addEventListener("click", resetForm);

function resetForm() {

    document.getElementById("studentForm").reset();

    editingStudentId = null;

    document.getElementById("submitBtn").textContent =
        "Add Student";

    document.getElementById("cancelBtn").hidden = true;
}

async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Student deleted successfully!");

        loadStudents();

    } catch (error) {
        console.error(error);
        alert("Unable to delete student.");
    }
}

loadStudents();
