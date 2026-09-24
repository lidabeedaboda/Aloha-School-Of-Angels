/*
  ALOHA SCHOOL OF ANGELS
  Fake roleplay school portal.

  IMPORTANT:
  This is intentionally frontend-only.
  Nothing is saved to a database.
  Refreshing the page resets the records.
*/

const users = [
  {
    username: "Chase",
    password: "Hmaw4357",
    role: "Admin"
  },
  {
    username: "Alexis",
    password: "Password",
    role: "Student"
  },
  {
    username: "Ela",
    password: "Password1",
    role: "Student"
  },
  {
    username: "Rebecca",
    password: "Password2",
    role: "Student"
  },
  {
    username: "Jonny",
    password: "Password3",
    role: "Student"
  },
  {
    username: "Benjamin",
    password: "Password4",
    role: "Student"
  },
  {
    username: "Asher",
    password: "Love",
    role: "Student"
  }
];

/*
  Starting fake records.
  You can change these however you want.
*/

let records = [
  {
    id: 1,
    username: "Alexis",
    type: "merit",
    reason: "Excellent participation",
    points: 2
  },
  {
    id: 2,
    username: "Ela",
    type: "merit",
    reason: "Helping another student",
    points: 3
  },
  {
    id: 3,
    username: "Rebecca",
    type: "demerit",
    reason: "Late to class",
    points: 1
  },
  {
    id: 4,
    username: "Jonny",
    type: "merit",
    reason: "Outstanding effort",
    points: 2
  },
  {
    id: 5,
    username: "Benjamin",
    type: "demerit",
    reason: "Disruptive behaviour",
    points: 2
  },
  {
    id: 6,
    username: "Asher",
    type: "merit",
    reason: "Kindness and leadership",
    points: 3
  }
];

let currentUser = null;
let nextRecordId = 7;
let currentModalType = "merit";

/* DOM */

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const dashboardPage = document.getElementById("dashboardPage");
const meritsPage = document.getElementById("meritsPage");
const demeritsPage = document.getElementById("demeritsPage");
const studentsPage = document.getElementById("studentsPage");

const pageTitle = document.getElementById("pageTitle");

const welcomeName = document.getElementById("welcomeName");
const sidebarName = document.getElementById("sidebarName");
const sidebarRole = document.getElementById("sidebarRole");
const topName = document.getElementById("topName");
const topRole = document.getElementById("topRole");

const sidebarAvatar = document.getElementById("sidebarAvatar");
const topAvatar = document.getElementById("topAvatar");

const meritCount = document.getElementById("meritCount");
const demeritCount = document.getElementById("demeritCount");
const pointCount = document.getElementById("pointCount");
const standing = document.getElementById("standing");

const recentActivity = document.getElementById("recentActivity");
const meritList = document.getElementById("meritList");
const demeritList = document.getElementById("demeritList");
const studentsList = document.getElementById("studentsList");

const recordModal = document.getElementById("recordModal");
const recordForm = document.getElementById("recordForm");
const recordStudent = document.getElementById("recordStudent");
const recordReason = document.getElementById("recordReason");
const recordPoints = document.getElementById("recordPoints");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");

/* LOGIN */

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document
    .getElementById("username")
    .value
    .trim();

  const password = document
    .getElementById("password")
    .value;

  const foundUser = users.find(
    user =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.password === password
  );

  if (!foundUser) {
    loginError.textContent = "Incorrect username or password.";
    return;
  }

  currentUser = foundUser;

  loginError.textContent = "";

  loginPage.classList.add("hidden");
  app.classList.remove("hidden");

  setupUser();
  showPage("dashboard");
});

/* USER SETUP */

function setupUser() {
  const initial = currentUser.username.charAt(0).toUpperCase();

  welcomeName.textContent = currentUser.username;

  sidebarName.textContent = currentUser.username;
  sidebarRole.textContent = currentUser.role;

  topName.textContent = currentUser.username;
  topRole.textContent = currentUser.role;

  sidebarAvatar.textContent = initial;
  topAvatar.textContent = initial;

  const adminItems = document.querySelectorAll(".admin-only");

  adminItems.forEach(item => {
    item.style.display =
      currentUser.role === "Admin"
        ? ""
        : "none";
  });

  /*
    Students page is only visible to Chase/Admin.
  */

  document.getElementById("studentsNav").style.display =
    currentUser.role === "Admin"
      ? ""
      : "none";

  updateDashboard();
  renderRecords();
  renderStudents();
}

/* NAVIGATION */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", function () {
    showPage(this.dataset.page);
  });
});

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active-page");
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.remove("active");
  });

  const pageMap = {
    dashboard: dashboardPage,
    merits: meritsPage,
    demerits: demeritsPage,
    students: studentsPage
  };

  if (!pageMap[page]) return;

  pageMap[page].classList.add("active-page");

  const activeButton = document.querySelector(
    `.nav-item[data-page="${page}"]`
  );

  if (activeButton) {
    activeButton.classList.add("active");
  }

  const titles = {
    dashboard: "Dashboard",
    merits: "Merits",
    demerits: "Demerits",
    students: "Students"
  };

  pageTitle.textContent = titles[page];
}

/* DASHBOARD */

function getUserRecords(username = currentUser.username) {
  return records.filter(record => record.username === username);
}

function updateDashboard() {
  const userRecords = getUserRecords();

  const merits = userRecords.filter(
    record => record.type === "merit"
  );

  const demerits = userRecords.filter(
    record => record.type === "demerit"
  );

  const meritPoints = merits.reduce(
    (total, record) => total + record.points,
    0
  );

  const demeritPoints = demerits.reduce(
    (total, record) => total + record.points,
    0
  );

  const totalPoints = meritPoints - demeritPoints;

  meritCount.textContent = meritPoints;
  demeritCount.textContent = demeritPoints;
  pointCount.textContent = totalPoints;

  if (totalPoints >= 5) {
    standing.textContent = "Outstanding";
  } else if (totalPoints >= 2) {
    standing.textContent = "Excellent";
  } else if (totalPoints >= 0) {
    standing.textContent = "Good";
  } else {
    standing.textContent = "Review";
  }

  renderRecentActivity();
}

/* RECENT ACTIVITY */

function renderRecentActivity() {
  const userRecords = getUserRecords();

  if (userRecords.length === 0) {
    recentActivity.innerHTML = `
      <div class="activity">
        <div>
          <strong>No activity yet</strong>
          <span>Your school records will appear here.</span>
        </div>
      </div>
    `;
    return;
  }

  recentActivity.innerHTML = userRecords
    .slice()
    .reverse()
    .slice(0, 6)
    .map(record => `
      <div class="activity">
        <div class="activity-icon ${record.type}">
          ${record.type === "merit" ? "★" : "!"}
        </div>

        <div>
          <strong>${escapeHTML(record.reason)}</strong>
          <span>
            ${record.type === "merit" ? "Merit" : "Demerit"}
            · ${record.points} point${record.points === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    `)
    .join("");
}

/* RECORDS */

function renderRecords() {
  const visibleRecords =
    currentUser.role === "Admin"
      ? records
      : getUserRecords();

  const merits = visibleRecords.filter(
    record => record.type === "merit"
  );

  const demerits = visibleRecords.filter(
    record => record.type === "demerit"
  );

  renderRecordList(
    meritList,
    merits,
    "merit"
  );

  renderRecordList(
    demeritList,
    demerits,
    "demerit"
  );
}

function renderRecordList(container, list, type) {
  if (list.length === 0) {
    container.innerHTML = `
      <div class="panel">
        No ${type}s recorded.
      </div>
    `;
    return;
  }

  container.innerHTML = list
    .slice()
    .reverse()
    .map(record => `
      <div class="record">
        <div class="record-left">

          <div class="record-icon ${type}">
            ${type === "merit" ? "★" : "!"}
          </div>

          <div>
            <h4>${escapeHTML(record.reason)}</h4>
            <p>
              ${currentUser.role === "Admin"
                ? `${escapeHTML(record.username)} · `
                : ""
              }
              ${type === "merit" ? "Positive recognition" : "Behaviour record"}
            </p>
          </div>

        </div>

        <div class="points ${type === "merit" ? "positive" : "negative"}">
          ${type === "merit" ? "+" : "-"}${record.points}
        </div>
      </div>
    `)
    .join("");
}

/* STUDENTS */

function renderStudents() {
  studentsList.innerHTML = users
    .filter(user => user.role === "Student")
    .map(user => {
      const userRecords = getUserRecords(user.username);

      const merits = userRecords
        .filter(record => record.type === "merit")
        .reduce((total, record) => total + record.points, 0);

      const demerits = userRecords
        .filter(record => record.type === "demerit")
        .reduce((total, record) => total + record.points, 0);

      const points = merits - demerits;

      return `
        <div class="student-card">

          <div class="student-top">
            <div class="avatar">
              ${user.username.charAt(0)}
            </div>

            <div>
              <h3>${escapeHTML(user.username)}</h3>
              <small>Student</small>
            </div>
          </div>

          <div class="student-stats">

            <div class="student-stat">
              <strong>${merits}</strong>
              <span>Merits</span>
            </div>

            <div class="student-stat">
              <strong>${demerits}</strong>
              <span>Demerits</span>
            </div>

            <div class="student-stat">
              <strong>${points}</strong>
              <span>Points</span>
            </div>

          </div>
        </div>
      `;
    })
    .join("");
}

/* MODAL */

document.getElementById("addMeritBtn").addEventListener(
  "click",
  () => openModal("merit")
);

document.getElementById("addDemeritBtn").addEventListener(
  "click",
  () => openModal("demerit")
);

document.getElementById("closeModal").addEventListener(
  "click",
  closeModal
);

recordModal.addEventListener("click", function (event) {
  if (event.target === recordModal) {
    closeModal();
  }
});

function openModal(type) {
  if (currentUser.role !== "Admin") return;

  currentModalType = type;

  modalTitle.textContent =
    type === "merit"
      ? "Add Merit"
      : "Add Demerit";

  modalEyebrow.textContent =
    type === "merit"
      ? "POSITIVE RECOGNITION"
      : "BEHAVIOUR RECORD";

  recordStudent.innerHTML = users
    .filter(user => user.role === "Student")
    .map(user => `
      <option value="${escapeHTML(user.username)}">
        ${escapeHTML(user.username)}
      </option>
    `)
    .join("");

  recordReason.value = "";
  recordPoints.value = "1";

  recordModal.classList.remove("hidden");
}

function closeModal() {
  recordModal.classList.add("hidden");
}

/* ADD RECORD */

recordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (currentUser.role !== "Admin") return;

  const username = recordStudent.value;
  const reason = recordReason.value.trim();
  const points = Number(recordPoints.value);

  if (!username || !reason || points < 1) {
    return;
  }

  records.push({
    id: nextRecordId++,
    username,
    type: currentModalType,
    reason,
    points
  });

  closeModal();

  renderRecords();
  renderStudents();
  updateDashboard();
});

/* LOGOUT */

document.getElementById("logoutBtn").addEventListener(
  "click",
  function () {
    currentUser = null;

    app.classList.add("hidden");
    loginPage.classList.remove("hidden");

    loginForm.reset();

    showPage("dashboard");
  }
);

/* SECURITY-FRIENDLY HTML ESCAPING */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
