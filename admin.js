let allReports = [];


// =========================
// LOAD REPORTS
// =========================

function loadReports() {

    const table =
        document.getElementById("reportsTable");

    table.innerHTML = `
        <tr>
            <td colspan="8" class="loading">
                Loading reports...
            </td>
        </tr>
    `;


    fetch("http://localhost:3000/reports")

        .then(function (response) {

            return response.json();

        })

        .then(function (reports) {

            allReports = reports;

            updateStatistics(reports);

            displayReports(reports);

        })

        .catch(function (error) {

            console.log(
                "Error loading reports:",
                error
            );

            table.innerHTML = `
                <tr>
                    <td colspan="8" class="loading">
                        Unable to load reports.
                    </td>
                </tr>
            `;

        });

}


// =========================
// UPDATE STATISTICS
// =========================

function updateStatistics(reports) {

    let pending = 0;
    let progress = 0;
    let resolved = 0;


    reports.forEach(function (report) {

        if (report.status === "Pending") {

            pending++;

        }


        if (report.status === "In Progress") {

            progress++;

        }


        if (report.status === "Resolved") {

            resolved++;

        }

    });


    document.getElementById(
        "totalReports"
    ).textContent = reports.length;


    document.getElementById(
        "pendingReports"
    ).textContent = pending;


    document.getElementById(
        "progressReports"
    ).textContent = progress;


    document.getElementById(
        "resolvedReports"
    ).textContent = resolved;

}


// =========================
// DISPLAY REPORTS
// =========================

function displayReports(reports) {

    const table =
        document.getElementById("reportsTable");

    const emptyMessage =
        document.getElementById("emptyMessage");


    table.innerHTML = "";


    if (reports.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    reports.forEach(function (report) {

        const row =
            document.createElement("tr");


        let priorityClass =
            "priority-" +
            report.priority.toLowerCase();


        const date =
            formatDate(report.createdAt);


        row.innerHTML = `

            <td>

                <span class="report-id">
                    #${report.id}
                </span>

            </td>


            <td>

                <span class="reporter">
                    ${report.name}
                </span>

                <span class="report-email">
                    ${report.email}
                </span>

            </td>


            <td>

                <span class="issue-name">
                    ${report.issueType}
                </span>

            </td>


            <td>

                <span class="priority ${priorityClass}">
                    ${report.priority}
                </span>

            </td>


            <td>

                <span class="location">
                    ${report.building} - ${report.room}
                </span>

            </td>


            <td>

                ${date}

            </td>


            <td>

                <select
                    class="status-select ${getStatusClass(report.status)}"
                    onchange="updateStatus(${report.id}, this.value)"
                >

                    <option
                        value="Pending"
                        ${report.status === "Pending" ? "selected" : ""}
                    >
                        Pending
                    </option>


                    <option
                        value="In Progress"
                        ${report.status === "In Progress" ? "selected" : ""}
                    >
                        In Progress
                    </option>


                    <option
                        value="Resolved"
                        ${report.status === "Resolved" ? "selected" : ""}
                    >
                        Resolved
                    </option>

                </select>

            </td>


            <td>

                <button
                    type="button"
                    class="view-button"
                    onclick="viewReport(${report.id})"
                >
                    View
                </button>


                <button
                    type="button"
                    class="delete-button"
                    onclick="deleteReport(${report.id})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// =========================
// STATUS CLASS
// =========================

function getStatusClass(status) {

    if (status === "Pending") {

        return "status-pending";

    }


    if (status === "In Progress") {

        return "status-progress";

    }


    if (status === "Resolved") {

        return "status-resolved";

    }


    return "";

}


// =========================
// UPDATE STATUS
// =========================

function updateStatus(id, newStatus) {

    fetch(
        "http://localhost:3000/reports/" + id,
        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: newStatus
            })

        }
    )

    .then(function (response) {

        return response.text();

    })

    .then(function (data) {

        console.log(data);

        loadReports();

    })

    .catch(function (error) {

        console.log(
            "Error updating status:",
            error
        );

    });

}


// =========================
// DELETE REPORT
// =========================

function deleteReport(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this report?"
        );


    if (!confirmDelete) {

        return;

    }


    fetch(
        "http://localhost:3000/reports/" + id,
        {

            method: "DELETE"

        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        return response.text();

    })

    .then(function (data) {

        console.log(data);

        loadReports();

    })

    .catch(function (error) {

        console.log(
            "Error deleting report:",
            error
        );


        alert(
            "Unable to delete the report."
        );

    });

}


// =========================
// VIEW REPORT
// =========================

function viewReport(id) {

    const report =
        allReports.find(function (item) {

            return item.id === id;

        });


    if (!report) {

        return;

    }


    // Report number

    document.getElementById(
        "modalReportTitle"
    ).textContent =
        "Report #" + report.id;


    // Reporter information

    document.getElementById(
        "modalName"
    ).textContent =
        report.name;


    document.getElementById(
        "modalRole"
    ).textContent =
        report.role;


    document.getElementById(
        "modalEmail"
    ).textContent =
        report.email;


    // Student / Staff ID

    if (report.role === "Student") {

        document.getElementById(
            "modalIdLabel"
        ).textContent =
            "Register Number";


        document.getElementById(
            "modalId"
        ).textContent =
            report.registerNumber || "-";

    }

    else {

        document.getElementById(
            "modalIdLabel"
        ).textContent =
            "Staff ID";


        document.getElementById(
            "modalId"
        ).textContent =
            report.staffId || "-";

    }


    // Department

    document.getElementById(
        "modalDepartment"
    ).textContent =
        report.department;


    // Issue information

    document.getElementById(
        "modalIssue"
    ).textContent =
        report.issueType;


    document.getElementById(
        "modalPriority"
    ).textContent =
        report.priority;


    document.getElementById(
        "modalBuilding"
    ).textContent =
        report.building;


    document.getElementById(
        "modalRoom"
    ).textContent =
        report.room;


    document.getElementById(
        "modalStatus"
    ).textContent =
        report.status;


    document.getElementById(
        "modalDate"
    ).textContent =
        formatDate(report.createdAt);


    // Description

    document.getElementById(
        "modalDescription"
    ).textContent =
        report.description;


    // Show modal

    document.getElementById(
        "reportModal"
    ).style.display = "flex";

}


// =========================
// CLOSE REPORT MODAL
// =========================

function closeReportModal() {

    document.getElementById(
        "reportModal"
    ).style.display = "none";

}


// =========================
// CLOSE MODAL OUTSIDE BOX
// =========================

document.getElementById(
    "reportModal"
).addEventListener(
    "click",
    function (event) {

        if (event.target === this) {

            closeReportModal();

        }

    }
);


// =========================
// FORMAT DATE
// =========================

function formatDate(dateValue) {

    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================
// FILTER REPORTS
// =========================

function filterReports() {

    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const priority =
        document.getElementById(
            "priorityFilter"
        ).value;


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const filteredReports =
        allReports.filter(function (report) {


            const matchesSearch =

                report.name
                    .toLowerCase()
                    .includes(search)

                ||

                report.issueType
                    .toLowerCase()
                    .includes(search)

                ||

                report.building
                    .toLowerCase()
                    .includes(search)

                ||

                report.room
                    .toLowerCase()
                    .includes(search);


            const matchesPriority =

                priority === "all"

                ||

                report.priority === priority;


            const matchesStatus =

                status === "all"

                ||

                report.status === status;


            return (
                matchesSearch &&
                matchesPriority &&
                matchesStatus
            );

        });


    displayReports(filteredReports);

}


// =========================
// SEARCH
// =========================

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    filterReports
);


// =========================
// PRIORITY FILTER
// =========================

document.getElementById(
    "priorityFilter"
).addEventListener(
    "change",
    filterReports
);


// =========================
// STATUS FILTER
// =========================

document.getElementById(
    "statusFilter"
).addEventListener(
    "change",
    filterReports
);


// =========================
// CURRENT DATE
// =========================

document.getElementById(
    "currentDate"
).textContent =

    new Date().toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );


// =========================
// INITIAL LOAD
// =========================

loadReports();s