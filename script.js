/*
====================================================
 ALOHA SCHOOL OF ANGELS
 Fake Roleplay School Management Portal

 Frontend only.
 Nothing is saved permanently.
 Refreshing the browser resets records.

 Roles:
 - Admin
 - Teacher
 - Student
====================================================
*/


/* ==================================================
   USERS
================================================== */

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
  },

  /*
    Extra teacher account.

    Change these credentials whenever you want.
  */

  {
    username: "Teacher",
    password: "Teacher123",
    role: "Teacher"
  }

];


/* ==================================================
   RECORDS
================================================== */

/*
 IMPORTANT:

 There are intentionally NO preset
 merits, demerits, detentions,
 suspensions or expulsions.

 Everything starts empty.
*/

let records = [];

let nextRecordId = 1;

let currentUser = null;

let currentRecordType = "merit";

let openedProfile = null;


/* ==================================================
   DOM
================================================== */

const loginPage =
  document.getElementById("loginPage");

const app =
  document.getElementById("app");

const loginForm =
  document.getElementById("loginForm");

const loginError =
  document.getElementById("loginError");

const pageTitle =
  document.getElementById("pageTitle");

const dashboardPage =
  document.getElementById("dashboardPage");

const meritsPage =
  document.getElementById("meritsPage");

const demeritsPage =
  document.getElementById("demeritsPage");

const detentionsPage =
  document.getElementById("detentionsPage");

const suspensionsPage =
  document.getElementById("suspensionsPage");

const expulsionsPage =
  document.getElementById("expulsionsPage");

const studentsPage =
  document.getElementById("studentsPage");

const profilePage =
  document.getElementById("profilePage");

const dashboardContent =
  document.getElementById("dashboardContent");

const meritsList =
  document.getElementById("meritsList");

const demeritsList =
  document.getElementById("demeritsList");

const detentionsList =
  document.getElementById("detentionsList");

const suspensionsList =
  document.getElementById("suspensionsList");

const expulsionsList =
  document.getElementById("expulsionsList");

const studentsGrid =
  document.getElementById("studentsGrid");

const profileContent =
  document.getElementById("profileContent");

const studentSearch =
  document.getElementById("studentSearch");

const recordModal =
  document.getElementById("recordModal");

const recordForm =
  document.getElementById("recordForm");

const recordStudent =
  document.getElementById("recordStudent");

const recordReason =
  document.getElementById("recordReason");

const recordPoints =
  document.getElementById("recordPoints");

const pointsGroup =
  document.getElementById("pointsGroup");

const recordDate =
  document.getElementById("recordDate");

const modalTitle =
  document.getElementById("modalTitle");

const modalEyebrow =
  document.getElementById("modalEyebrow");


/* ==================================================
   LOGIN
================================================== */

loginForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const username =
      document
        .getElementById("username")
        .value
        .trim();

    const password =
      document
        .getElementById("password")
        .value;

    const user =
      users.find(
        account =>
          account.username.toLowerCase() ===
          username.toLowerCase() &&
          account.password === password
      );

    if (!user) {

      loginError.textContent =
        "Incorrect username or password.";

      return;
    }

    currentUser = user;

    loginError.textContent = "";

    loginPage.classList.add("hidden");

    app.classList.remove("hidden");

    setupUser();

    showPage("dashboard");

  }
);


/* ==================================================
   USER SETUP
================================================== */

function setupUser() {

  const initial =
    currentUser.username
      .charAt(0)
      .toUpperCase();

  document.getElementById(
    "sidebarName"
  ).textContent =
    currentUser.username;

  document.getElementById(
    "sidebarRole"
  ).textContent =
    currentUser.role;

  document.getElementById(
    "topName"
  ).textContent =
    currentUser.username;

  document.getElementById(
    "topRole"
  ).textContent =
    currentUser.role;

  document.getElementById(
    "sidebarAvatar"
  ).textContent =
    initial;

  document.getElementById(
    "topAvatar"
  ).textContent =
    initial;


  /*
    Students cannot see
    the student directory.
  */

  document.getElementById(
    "studentsNav"
  ).style.display =
    currentUser.role === "Student"
      ? "none"
      : "";


  /*
    Teacher/Admin buttons.
  */

  document
    .querySelectorAll(".admin-teacher")
    .forEach(button => {

      button.style.display =
        currentUser.role === "Admin" ||
        currentUser.role === "Teacher"
          ? ""
          : "none";

    });


  /*
    Admin-only actions.
  */

  document
    .querySelectorAll(".admin-only")
    .forEach(button => {

      button.style.display =
        currentUser.role === "Admin"
          ? ""
          : "none";

    });


  renderEverything();

}


/* ==================================================
   NAVIGATION
================================================== */

document
  .querySelectorAll(".nav-item")
  .forEach(button => {

    button.addEventListener(
      "click",
      function() {

        showPage(
          this.dataset.page
        );

      }
    );

  });


function showPage(page) {

  const pages = {

    dashboard: dashboardPage,

    merits: meritsPage,

    demerits: demeritsPage,

    detentions: detentionsPage,

    suspensions: suspensionsPage,

    expulsions: expulsionsPage,

    students: studentsPage,

    profile: profilePage

  };


  Object.values(pages)
    .forEach(section => {

      section.classList.remove(
        "active-page"
      );

    });


  if (!pages[page]) return;

  pages[page]
    .classList.add(
      "active-page"
    );


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.remove(
        "active"
      );

    });


  const navButton =
    document.querySelector(
      `.nav-item[data-page="${page}"]`
    );


  if (navButton) {

    navButton.classList.add(
      "active"
    );

  }


  const titles = {

    dashboard: "Dashboard",

    merits: "Merits",

    demerits: "Demerits",

    detentions: "Detentions",

    suspensions: "Suspensions",

    expulsions: "Expulsions",

    students: "Students",

    profile: "Student Profile"

  };


  pageTitle.textContent =
    titles[page] || "Dashboard";

}


/* ==================================================
   RECORD FILTERING
================================================== */

function getVisibleRecords() {

  if (
    currentUser.role === "Admin" ||
    currentUser.role === "Teacher"
  ) {

    return records;

  }

  return records.filter(
    record =>
      record.username ===
      currentUser.username
  );

}


function getUserRecords(username) {

  return records.filter(
    record =>
      record.username === username
  );

}


/* ==================================================
   DASHBOARD
================================================== */

function renderDashboard() {

  if (
    currentUser.role === "Admin"
  ) {

    renderAdminDashboard();

    return;

  }


  if (
    currentUser.role === "Teacher"
  ) {

    renderTeacherDashboard();

    return;

  }


  renderStudentDashboard();

}


/* ==================================================
   ADMIN DASHBOARD
================================================== */

function renderAdminDashboard() {

  const students =
    users.filter(
      user =>
        user.role === "Student"
    );

  const merits =
    records.filter(
      record =>
        record.type === "merit"
    ).length;

  const demerits =
    records.filter(
      record =>
        record.type === "demerit"
    ).length;

  const detentions =
    records.filter(
      record =>
        record.type === "detention"
    ).length;

  const suspensions =
    records.filter(
      record =>
        record.type === "suspension"
    ).length;


  dashboardContent.innerHTML = `

    <div class="dashboard-welcome">

      <div>

        <p class="eyebrow">
          ADMINISTRATOR
        </p>

        <h1>
          Welcome back, ${escapeHTML(currentUser.username)}.
        </h1>

        <p>
          Manage students, behaviour and school records.
        </p>

      </div>

      <div class="dashboard-icon">
        ✦
      </div>

    </div>


    <div class="stats-grid">

      ${statCard(
        "blue",
        "♙",
        "Students",
        students.length
      )}

      ${statCard(
        "green",
        "★",
        "Merits",
        merits
      )}

      ${statCard(
        "red",
        "!",
        "Demerits",
        demerits
      )}

      ${statCard(
        "yellow",
        "◷",
        "Detentions",
        detentions
      )}

    </div>


    <div class="dashboard-grid">

      <div class="panel">

        <div class="panel-header">

          <h3>
            Recent Activity
          </h3>

          <p>
            Latest school records
          </p>

        </div>

        ${renderRecentActivitiesHTML()}

      </div>


      <div class="panel">

        <div class="panel-header">

          <h3>
            Administration
          </h3>

          <p>
            Quick actions
          </p>

        </div>

        <div class="teacher-actions">

          <button
            class="teacher-action"
            onclick="openRecordModal('merit')"
          >
            ★ Add Merit
          </button>

          <button
            class="teacher-action"
            onclick="openRecordModal('demerit')"
          >
            ! Add Demerit
          </button>

          <button
            class="teacher-action"
            onclick="openRecordModal('detention')"
          >
            ◷ Detention
          </button>

          <button
            class="teacher-action"
            onclick="showPage('students')"
          >
            ♙ View Students
          </button>

        </div>

      </div>

    </div>

  `;

}


/* ==================================================
   TEACHER DASHBOARD
================================================== */

function renderTeacherDashboard() {

  const students =
    users.filter(
      user =>
        user.role === "Student"
    );

  const merits =
    records.filter(
      record =>
        record.type === "merit"
    ).length;

  const demerits =
    records.filter(
      record =>
        record.type === "demerit"
    ).length;

  const detentions =
    records.filter(
      record =>
        record.type === "detention"
    ).length;


  dashboardContent.innerHTML = `

    <div class="dashboard-welcome">

      <div>

        <p class="eyebrow">
          TEACHER PORTAL
        </p>

        <h1>
          Good day, ${escapeHTML(currentUser.username)}.
        </h1>

        <p>
          Review your students and manage classroom records.
        </p>

      </div>

      <div class="dashboard-icon">
        ♙
      </div>

    </div>


    <div class="stats-grid">

      ${statCard(
        "blue",
        "♙",
        "Students",
        students.length
      )}

      ${statCard(
        "green",
        "★",
        "Merits",
        merits
      )}

      ${statCard(
        "red",
        "!",
        "Demerits",
        demerits
      )}

      ${statCard(
        "yellow",
        "◷",
        "Detentions",
        detentions
      )}

    </div>


    <div class="dashboard-grid">

      <div class="panel">

        <div class="panel-header">

          <h3>
            Recent Records
          </h3>

          <p>
            Student behaviour activity
          </p>

        </div>

        ${renderRecentActivitiesHTML()}

      </div>


      <div class="panel">

        <div class="panel-header">

          <h3>
            Teacher Actions
          </h3>

          <p>
            Quickly create a record
          </p>

        </div>

        <div class="teacher-actions">

          <button
            class="teacher-action"
            onclick="openRecordModal('merit')"
          >
            ★ Merit
          </button>

          <button
            class="teacher-action"
            onclick="openRecordModal('demerit')"
          >
            ! Demerit
          </button>

          <button
            class="teacher-action"
            onclick="openRecordModal('detention')"
          >
            ◷ Detention
          </button>

          <button
            class="teacher-action"
            onclick="showPage('students')"
          >
            ♙ Students
          </button>

        </div>

      </div>

    </div>

  `;

}


/* ==================================================
   STUDENT DASHBOARD
================================================== */

function renderStudentDashboard() {

  const myRecords =
    getUserRecords(
      currentUser.username
    );

  const merits =
    myRecords.filter(
      record =>
        record.type === "merit"
    );

  const demerits =
    myRecords.filter(
      record =>
        record.type === "demerit"
    );

  const detentions =
    myRecords.filter(
      record =>
        record.type === "detention"
    );

  const suspensions =
    myRecords.filter(
      record =>
        record.type === "suspension"
    );


  const meritPoints =
    merits.reduce(
      (sum, record) =>
        sum + Number(record.points || 0),
      0
    );

  const demeritPoints =
    demerits.reduce(
      (sum, record) =>
        sum + Number(record.points || 0),
      0
    );


  const totalPoints =
    meritPoints -
    demeritPoints;


  let standing =
    "Good Standing";


  if (totalPoints >= 10) {

    standing =
      "Outstanding";

  } else if (totalPoints < 0) {

    standing =
      "Review Required";

  }


  dashboardContent.innerHTML = `

    <div class="dashboard-welcome">

      <div>

        <p class="eyebrow">
          STUDENT PORTAL
        </p>

        <h1>
          Welcome, ${escapeHTML(currentUser.username)}.
        </h1>

        <p>
          View your school records and current standing.
        </p>

      </div>

      <div class="dashboard-icon">
        ✦
      </div>

    </div>


    <div class="stats-grid">

      ${statCard(
        "green",
        "★",
        "Merit Points",
        meritPoints
      )}

      ${statCard(
        "red",
        "!",
        "Demerit Points",
        demeritPoints
      )}

      ${statCard(
        "yellow",
        "◷",
        "Detentions",
        detentions.length
      )}

      ${statCard(
        "blue",
        "✓",
        "Standing",
        standing
      )}

    </div>


    <div class="dashboard-grid">

      <div class="panel">

        <div class="panel-header">

          <h3>
            My Recent Activity
          </h3>

          <p>
            Your latest school records
          </p>

        </div>

        ${renderRecentActivitiesHTML(
          currentUser.username
        )}

      </div>


      <div class="panel">

        <div class="panel-header">

          <h3>
            Record Summary
          </h3>

          <p>
            Current school record
          </p>

        </div>

        <div class="student-record-summary">

          <p>
            Merits:
            <strong>${merits.length}</strong>
          </p>

          <p>
            Demerits:
            <strong>${demerits.length}</strong>
          </p>

          <p>
            Detentions:
            <strong>${detentions.length}</strong>
          </p>

          <p>
            Suspensions:
            <strong>${suspensions.length}</strong>
          </p>

        </div>

      </div>

    </div>

  `;

}


/* ==================================================
   STAT CARD
================================================== */

function statCard(
  color,
  icon,
  label,
  value
) {

  return `

    <div class="stat-card stat-${color}">

      <div class="stat-card-icon">
        ${icon}
      </div>

      <span>
        ${escapeHTML(label)}
      </span>

      <strong>
        ${escapeHTML(value)}
      </strong>

    </div>

  `;

}


/* ==================================================
   RECENT ACTIVITY
================================================== */

function renderRecentActivitiesHTML(
  username = null
) {

  let visible =
    username
      ? getUserRecords(username)
      : getVisibleRecords();


  visible =
    visible
      .slice()
      .reverse()
      .slice(0, 7);


  if (!visible.length) {

    return `

      <div class="empty-state">
        No records have been added yet.
      </div>

    `;

  }


  return visible.map(
    record => {

      const icon =
        getRecordIcon(
          record.type
        );

      return `

        <div class="activity">

          <div class="activity-icon ${record.type}">
            ${icon}
          </div>

          <div>

            <strong>
              ${escapeHTML(record.reason)}
            </strong>

            <span>
              ${escapeHTML(
                record.username
              )}
              ·
              ${formatRecordType(
                record.type
              )}
              ·
              ${formatDate(
                record.date
              )}
            </span>

          </div>

        </div>

      `;

    }
  ).join("");

}


/* ==================================================
   RECORD PAGES
================================================== */

function renderRecordPages() {

  const visible =
    getVisibleRecords();


  renderTypedRecords(
    meritsList,
    visible,
    "merit"
  );

  renderTypedRecords(
    demeritsList,
    visible,
    "demerit"
  );

  renderTypedRecords(
    detentionsList,
    visible,
    "detention"
  );

  renderTypedRecords(
    suspensionsList,
    visible,
    "suspension"
  );

  renderTypedRecords(
    expulsionsList,
    visible,
    "expulsion"
  );

}


function renderTypedRecords(
  container,
  allRecords,
  type
) {

  const list =
    allRecords.filter(
      record =>
        record.type === type
    );


  if (!list.length) {

    container.innerHTML = `

      <div class="empty-state">

        No ${escapeHTML(
          formatRecordType(type)
        ).toLowerCase()}
        records yet.

      </div>

    `;

    return;

  }


  container.innerHTML =
    list
      .slice()
      .reverse()
      .map(record => {

        const isPoints =
          type === "merit" ||
          type === "demerit";


        return `

          <div class="record">

            <div class="record-left">

              <div class="record-icon ${type}">
                ${getRecordIcon(type)}
              </div>

              <div>

                <h4>
                  ${escapeHTML(
                    record.reason
                  )}
                </h4>

                <p>

                  ${currentUser.role !== "Student"
                    ? `${escapeHTML(record.username)} · `
                    : ""
                  }

                  ${formatRecordType(type)}

                  ·

                  ${formatDate(
                    record.date
                  )}

                </p>

              </div>

            </div>


            ${
              isPoints
              ? `
                <div
                  class="record-points ${
                    type === "merit"
                      ? "positive"
                      : "negative"
                  }"
                >
                  ${type === "merit" ? "+" : "-"}
                  ${record.points}
                </div>
              `
              : ""
            }

          </div>

        `;

      })
      .join("");

}


/* ==================================================
   STUDENT DIRECTORY
================================================== */

function renderStudents() {

  const search =
    studentSearch.value
      .trim()
      .toLowerCase();


  const students =
    users
      .filter(
        user =>
          user.role === "Student"
      )
      .filter(
        user =>
          user.username
            .toLowerCase()
            .includes(search)
      );


  if (!students.length) {

    studentsGrid.innerHTML = `

      <div class="empty-state">
        No students found.
      </div>

    `;

    return;

  }


  studentsGrid.innerHTML =
    students.map(
      student => {

        const userRecords =
          getUserRecords(
            student.username
          );


        const merits =
          userRecords.filter(
            r =>
              r.type === "merit"
          ).length;


        const demerits =
          userRecords.filter(
            r =>
              r.type === "demerit"
          ).length;


        const detentions =
          userRecords.filter(
            r =>
              r.type === "detention"
          ).length;


        return `

          <div class="student-card">

            <div class="student-header">

              <div class="avatar">
                ${escapeHTML(
                  student.username
                    .charAt(0)
                )}
              </div>

              <div>

                <h3>
                  ${escapeHTML(
                    student.username
                  )}
                </h3>

                <small>
                  Student
                </small>

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
                <strong>${detentions}</strong>
                <span>Detentions</span>
              </div>

            </div>


            <button
              class="profile-button"
              onclick="openStudentProfile('${escapeJS(student.username)}')"
            >
              Open Profile
            </button>

          </div>

        `;

      }
    ).join("");

}


studentSearch.addEventListener(
  "input",
  renderStudents
);


/* ==================================================
   STUDENT PROFILE
================================================== */

function openStudentProfile(
  username
) {

  const student =
    users.find(
      user =>
        user.username === username
    );


  if (!student) return;


  openedProfile =
    username;


  const userRecords =
    getUserRecords(username);


  const merits =
    userRecords.filter(
      r =>
        r.type === "merit"
    );

  const demerits =
    userRecords.filter(
      r =>
        r.type === "demerit"
    );

  const detentions =
    userRecords.filter(
      r =>
        r.type === "detention"
    );

  const suspensions =
    userRecords.filter(
      r =>
        r.type === "suspension"
    );

  const expulsions =
    userRecords.filter(
      r =>
        r.type === "expulsion"
    );


  const meritPoints =
    merits.reduce(
      (sum, record) =>
        sum + Number(record.points || 0),
      0
    );


  const demeritPoints =
    demerits.reduce(
      (sum, record) =>
        sum + Number(record.points || 0),
      0
    );


  const totalPoints =
    meritPoints -
    demeritPoints;


  profileContent.innerHTML = `

    <div class="profile-header">

      <div class="profile-person">

        <div class="profile-avatar">
          ${escapeHTML(
            username.charAt(0)
          )}
        </div>

        <div>

          <h1>
            ${escapeHTML(username)}
          </h1>

          <p>
            Student · Aloha School of Angels
          </p>

        </div>

      </div>


      ${
        currentUser.role === "Admin" ||
        currentUser.role === "Teacher"

        ? `

          <button
            class="primary-button"
            onclick="openRecordModal(
              'demerit',
              '${escapeJS(username)}'
            )"
          >
            + Add Record
          </button>

        `

        : ""
      }

    </div>


    <div class="profile-stats">

      <div class="profile-stat">
        <span>Merit Points</span>
        <strong>${meritPoints}</strong>
      </div>

      <div class="profile-stat">
        <span>Demerit Points</span>
        <strong>${demeritPoints}</strong>
      </div>

      <div class="profile-stat">
        <span>Detentions</span>
        <strong>${detentions.length}</strong>
      </div>

      <div class="profile-stat">
        <span>Standing</span>
        <strong>
          ${
            totalPoints < 0
              ? "Review"
              : "Good"
          }
        </strong>
      </div>

    </div>


    <div class="profile-records">

      <div class="panel-header">

        <h3>
          Complete Record
        </h3>

        <p>
          All merits, demerits and disciplinary actions
        </p>

      </div>


      ${
        userRecords.length
        ? userRecords
            .slice()
            .reverse()
            .map(record => `

              <div class="record">

                <div class="record-left">

                  <div
                    class="record-icon ${record.type}"
                  >
                    ${getRecordIcon(
                      record.type
                    )}
                  </div>

                  <div>

                    <h4>
                      ${escapeHTML(
                        record.reason
                      )}
                    </h4>

                    <p>
                      ${formatRecordType(
                        record.type
                      )}
                      ·
                      ${formatDate(
                        record.date
                      )}
                    </p>

                  </div>

                </div>

                ${
                  record.points
                  ? `
                    <div class="record-points">
                      ${record.type === "merit" ? "+" : "-"}
                      ${record.points}
                    </div>
                  `
                  : ""
                }

              </div>

            `)
            .join("")

        : `

          <div class="empty-state">
            No records for this student.
          </div>

        `
      }

    </div>

  `;


  showPage("profile");

}


/* ==================================================
   BACK TO STUDENTS
================================================== */

document
  .getElementById("backToStudents")
  .addEventListener(
    "click",
    function() {

      showPage("students");

    }
  );


/* ==================================================
   OPEN RECORD MODAL
================================================== */

function openRecordModal(
  type,
  selectedStudent = ""
) {

  if (
    currentUser.role !== "Admin" &&
    currentUser.role !== "Teacher"
  ) {

    return;

  }


  currentRecordType =
    type;


  const names =
    users
      .filter(
        user =>
          user.role === "Student"
      );


  recordStudent.innerHTML =
    names.map(
      user => `

        <option
          value="${escapeHTML(user.username)}"
          ${
            user.username === selectedStudent
              ? "selected"
              : ""
          }
        >
          ${escapeHTML(
            user.username
          )}
        </option>

      `
    ).join("");


  recordReason.value = "";

  recordPoints.value = "1";


  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  recordDate.value =
    today;


  const titles = {

    merit: "Add Merit",

    demerit: "Add Demerit",

    detention: "Add Detention",

    suspension: "Add Suspension",

    expulsion: "Add Expulsion"

  };


  const eyebrow = {

    merit: "POSITIVE RECOGNITION",

    demerit: "BEHAVIOUR RECORD",

    detention: "DISCIPLINE",

    suspension: "DISCIPLINARY ACTION",

    expulsion: "SERIOUS DISCIPLINARY ACTION"

  };


  modalTitle.textContent =
    titles[type];

  modalEyebrow.textContent =
    eyebrow[type];


  /*
    Only merits and demerits
    use points.
  */

  pointsGroup.style.display =
    type === "merit" ||
    type === "demerit"
      ? ""
      : "none";


  recordModal.classList.remove(
    "hidden"
  );

}


document
  .getElementById("addMeritButton")
  .addEventListener(
    "click",
    () =>
      openRecordModal("merit")
  );


document
  .getElementById("addDemeritButton")
  .addEventListener(
    "click",
    () =>
      openRecordModal("demerit")
  );


document
  .getElementById("addDetentionButton")
  .addEventListener(
    "click",
    () =>
      openRecordModal("detention")
  );


document
  .getElementById("addSuspensionButton")
  .addEventListener(
    "click",
    () =>
      openRecordModal("suspension")
  );


document
  .getElementById("addExpulsionButton")
  .addEventListener(
    "click",
    () =>
      openRecordModal("expulsion")
  );


/* ==================================================
   CLOSE MODAL
================================================== */

document
  .getElementById("closeModal")
  .addEventListener(
    "click",
    closeModal
  );


recordModal.addEventListener(
  "click",
  function(event) {

    if (
      event.target === recordModal
    ) {

      closeModal();

    }

  }
);


function closeModal() {

  recordModal.classList.add(
    "hidden"
  );

}


/* ==================================================
   CREATE RECORD
================================================== */

recordForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    if (
      currentUser.role !== "Admin" &&
      currentUser.role !== "Teacher"
    ) {

      return;

    }


    const username =
      recordStudent.value;

    const reason =
      recordReason.value.trim();

    const date =
      recordDate.value;

    const points =
      Number(recordPoints.value);


    if (
      !username ||
      !reason ||
      !date
    ) {

      return;

    }


    records.push({

      id: nextRecordId++,

      username,

      type:
        currentRecordType,

      reason,

      points:
        currentRecordType === "merit" ||
        currentRecordType === "demerit"
          ? points
          : null,

      date

    });


    closeModal();

    renderEverything();


    /*
      If currently viewing
      a student profile, refresh it.
    */

    if (
      openedProfile
    ) {

      openStudentProfile(
        openedProfile
      );

    }

  }
);


/* ==================================================
   LOGOUT
================================================== */

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    function() {

      currentUser = null;

      openedProfile = null;

      app.classList.add(
        "hidden"
      );

      loginPage.classList.remove(
        "hidden"
      );

      loginForm.reset();

      showPage("dashboard");

    }
  );


/* ==================================================
   RENDER EVERYTHING
================================================== */

function renderEverything() {

  renderDashboard();

  renderRecordPages();

  renderStudents();

}


/* ==================================================
   ICONS
================================================== */

function getRecordIcon(type) {

  const icons = {

    merit: "★",

    demerit: "!",

    detention: "◷",

    suspension: "⚠",

    expulsion: "×"

  };


  return icons[type] || "•";

}


/* ==================================================
   TYPE NAMES
================================================== */

function formatRecordType(type) {

  const names = {

    merit: "Merit",

    demerit: "Demerit",

    detention: "Detention",

    suspension: "Suspension",

    expulsion: "Expulsion"

  };


  return names[type] || type;

}


/* ==================================================
   DATE
================================================== */

function formatDate(date) {

  if (!date) {

    return "No date";

  }


  const parsed =
    new Date(
      date + "T00:00:00"
    );


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return date;

  }


  return parsed.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


/* ==================================================
   HTML ESCAPING
================================================== */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ==================================================
   JAVASCRIPT STRING ESCAPING
================================================== */

function escapeJS(value) {

  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', '\\"');

}


/* ==================================================
   INITIAL STATE
================================================== */

/*
  The portal starts with no records.
*/

console.log(
  "Aloha School of Angels loaded."
);
