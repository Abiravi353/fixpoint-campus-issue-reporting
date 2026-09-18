function loadReports() {

    const container =
        document.getElementById("reportsContainer");

    container.innerHTML =
        "<p>Enter your email and click Check My Reports.</p>";
}


function findMyReports() {

    const email =
        document.getElementById("emailInput").value.trim();

    const container =
        document.getElementById("reportsContainer");

    if (email === "") {

        container.innerHTML =
            "<p>Please enter your email.</p>";

        return;
    }

    fetch(
        "http://localhost:3000/reports?email=" +
        encodeURIComponent(email)
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (reports) {

        container.innerHTML = "";

        if (reports.length === 0) {

            container.innerHTML =
                "<p>No reports found for this email.</p>";

            return;
        }

        reports.forEach(function (report) {

            const reportBox =
                document.createElement("div");

            reportBox.className = "report-box";

            reportBox.innerHTML = `

                <h3>
                    Report #${report.id}
                </h3>

                <p>
                    <strong>Issue:</strong>
                    ${report.issueType}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${report.building} - ${report.room}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(report.createdAt)}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="status ${getStatusClass(report.status)}">
                        ${report.status}
                    </span>

                </p>


                <div class="status-tracker">

                    <h4>Report Progress</h4>


                    <div class="status-step completed">

                        <div class="status-circle"></div>

                        <p>Submitted</p>

                    </div>


                    <div class="status-line ${
                        report.status === "In Progress" ||
                        report.status === "Resolved"
                        ? "completed"
                        : ""
                    }"></div>


                    <div class="status-step ${
                        report.status === "In Progress" ||
                        report.status === "Resolved"
                        ? "completed"
                        : "current"
                    }">

                        <div class="status-circle"></div>

                        <p>In Progress</p>

                    </div>


                    <div class="status-line ${
                        report.status === "Resolved"
                        ? "completed"
                        : ""
                    }"></div>


                    <div class="status-step ${
                        report.status === "Resolved"
                        ? "completed"
                        : ""
                    }">

                        <div class="status-circle"></div>

                        <p>Resolved</p>

                    </div>

                </div>

            `;

            container.appendChild(reportBox);

        });

    })

    .catch(function (error) {

        console.log(
            "Error loading reports:",
            error
        );

        container.innerHTML =
            "<p>Unable to load reports.</p>";

    });
}


function formatDate(dateValue) {

    const date =
        new Date(dateValue);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


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


loadReports();