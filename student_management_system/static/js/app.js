const API_URL = "/api/students/";

const form = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const registerInput = document.getElementById("registerNumber");
const emailInput = document.getElementById("email");
const departmentInput = document.getElementById("department");
const yearInput = document.getElementById("year");
const cgpaInput = document.getElementById("cgpa");
const tbody = document.getElementById("studentTableBody");
const message = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const searchInput = document.getElementById("searchInput");
const clearSearchButton = document.getElementById("clearSearchButton");
const studentCount = document.getElementById("studentCount");

let students = [];
let searchTimer = null;

function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;
    window.setTimeout(() => {
        message.className = "message hidden";
    }, 4000);
}

function clearFieldErrors() {
    [
        "nameError",
        "registerNumberError",
        "emailError",
        "departmentError",
        "yearError",
        "cgpaError",
    ].forEach(id => {
        document.getElementById(id).textContent = "";
    });
}

function validateForm() {
    clearFieldErrors();
    let valid = true;

    const name = nameInput.value.trim();
    const registerNumber = registerInput.value.trim();
    const email = emailInput.value.trim();
    const department = departmentInput.value.trim();
    const year = Number(yearInput.value);
    const cgpa = Number(cgpaInput.value);

    if (name.length < 2) {
        document.getElementById("nameError").textContent = "Enter at least 2 characters.";
        valid = false;
    }

    if (!registerNumber) {
        document.getElementById("registerNumberError").textContent = "Register number is required.";
        valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email address.";
        valid = false;
    }

    if (department.length < 2) {
        document.getElementById("departmentError").textContent = "Department is required.";
        valid = false;
    }

    if (![1, 2, 3, 4].includes(year)) {
        document.getElementById("yearError").textContent = "Select a valid year.";
        valid = false;
    }

    if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        document.getElementById("cgpaError").textContent = "CGPA must be between 0 and 10.";
        valid = false;
    }

    return valid;
}

function getPayload() {
    return {
        name: nameInput.value.trim(),
        register_number: registerInput.value.trim().toUpperCase(),
        email: emailInput.value.trim().toLowerCase(),
        department: departmentInput.value.trim().toUpperCase(),
        year: Number(yearInput.value),
        cgpa: Number(cgpaInput.value).toFixed(2),
    };
}

function formatApiErrors(data) {
    if (!data || typeof data !== "object") return "Something went wrong.";
    return Object.entries(data)
        .map(([field, errors]) => {
            const text = Array.isArray(errors) ? errors.join(" ") : String(errors);
            return `${field.replaceAll("_", " ")}: ${text}`;
        })
        .join(" | ");
}

async function loadStudents(search = "") {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Loading students...</td></tr>`;
    try {
        const url = search
            ? `${API_URL}?search=${encodeURIComponent(search)}`
            : API_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load students.");
        students = await response.json();
        renderStudents();
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Unable to load records.</td></tr>`;
        showMessage(error.message, "error");
    }
}

function renderStudents() {
    studentCount.textContent = students.length;

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No student records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${escapeHtml(student.register_number)}</td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${escapeHtml(student.department)}</td>
            <td>${student.year}</td>
            <td>${Number(student.cgpa).toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn secondary small" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn danger small" onclick="deleteStudent(${student.id}, '${escapeJs(student.name)}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeJs(value) {
    return String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!validateForm()) {
        showMessage("Please correct the highlighted fields.", "error");
        return;
    }

    const id = studentId.value;
    const isEditing = Boolean(id);
    const url = isEditing ? `${API_URL}${id}/` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    saveButton.disabled = true;
    saveButton.textContent = isEditing ? "Updating..." : "Saving...";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(getPayload()),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(formatApiErrors(data));
        }

        resetForm();
        await loadStudents(searchInput.value.trim());
        showMessage(isEditing ? "Student updated successfully." : "Student added successfully.");
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = studentId.value ? "Update Student" : "Add Student";
    }
});

window.editStudent = function(id) {
    const student = students.find(item => item.id === id);
    if (!student) return;

    studentId.value = student.id;
    nameInput.value = student.name;
    registerInput.value = student.register_number;
    emailInput.value = student.email;
    departmentInput.value = student.department;
    yearInput.value = student.year;
    cgpaInput.value = Number(student.cgpa).toFixed(2);

    formTitle.textContent = "Edit Student";
    saveButton.textContent = "Update Student";
    cancelButton.classList.remove("hidden");
    clearFieldErrors();
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteStudent = async function(id, studentName) {
    const confirmed = window.confirm(`Delete ${studentName}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
        });

        if (!response.ok && response.status !== 204) {
            throw new Error("Unable to delete this student.");
        }

        if (studentId.value === String(id)) resetForm();
        await loadStudents(searchInput.value.trim());
        showMessage("Student deleted successfully.");
    } catch (error) {
        showMessage(error.message, "error");
    }
};

function resetForm() {
    form.reset();
    studentId.value = "";
    formTitle.textContent = "Add Student";
    saveButton.textContent = "Add Student";
    cancelButton.classList.add("hidden");
    clearFieldErrors();
}

cancelButton.addEventListener("click", resetForm);

searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
        loadStudents(searchInput.value.trim());
    }, 300);
});

clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    loadStudents();
    searchInput.focus();
});

function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(`${name}=`)) {
            return decodeURIComponent(trimmed.substring(name.length + 1));
        }
    }
    return "";
}

loadStudents();
