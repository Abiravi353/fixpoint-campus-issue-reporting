// =========================
// GET ELEMENTS
// =========================

const role =
    document.getElementById("role");

const studentGroup =
    document.getElementById("studentGroup");

const staffGroup =
    document.getElementById("staffGroup");

const registerNumber =
    document.getElementById("registerNumber");

const staffId =
    document.getElementById("staffId");

const description =
    document.getElementById("description");

const charCount =
    document.getElementById("charCount");

const form =
    document.getElementById("issueForm");

const successMessage =
    document.getElementById("successMessage");
const successClose =
    document.getElementById("successClose");


// =========================
// STUDENT / STAFF
// =========================

role.addEventListener(
    "change",
    function () {

        if (role.value === "Student") {

            studentGroup.classList.remove(
                "hidden"
            );

            staffGroup.classList.add(
                "hidden"
            );

            registerNumber.required = true;

            staffId.required = false;

            staffId.value = "";

        }

        else if (role.value === "Staff") {

            staffGroup.classList.remove(
                "hidden"
            );

            studentGroup.classList.add(
                "hidden"
            );

            staffId.required = true;

            registerNumber.required = false;

            registerNumber.value = "";

        }

        else {

            studentGroup.classList.remove(
                "hidden"
            );

            staffGroup.classList.add(
                "hidden"
            );

            registerNumber.required = false;

            staffId.required = false;

        }

    }
);


// =========================
// CHARACTER COUNTER
// =========================

description.addEventListener(
    "input",
    function () {

        charCount.textContent =
            description.value.length;

    }
);


// =========================
// FORM SUBMISSION
// =========================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const report = {

            name:
                document.getElementById(
                    "name"
                ).value,

            email:
                document.getElementById(
                    "email"
                ).value,

            role:
                role.value,

            registerNumber:
                registerNumber.value,

            staffId:
                staffId.value,

            department:
                document.getElementById(
                    "department"
                ).value,

            issueType:
                document.getElementById(
                    "issueType"
                ).value,

            priority:
                document.getElementById(
                    "priority"
                ).value,

            building:
                document.getElementById(
                    "building"
                ).value,

            room:
                document.getElementById(
                    "room"
                ).value,

            description:
                description.value,

            status:
                "Pending",

            createdAt:
                new Date().toLocaleString()

        };


        // =========================
        // GET PREVIOUS REPORTS
        // =========================

        let reports =
            JSON.parse(
                localStorage.getItem(
                    "fixPointReports"
                )
            ) || [];


        // =========================
        // ADD NEW REPORT
        // =========================

        reports.push(report);


        // =========================
        // SAVE REPORTS
        // =========================

        localStorage.setItem(
            "fixPointReports",
            JSON.stringify(reports)
        );
        fetch("http://localhost:3000/reports", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(report)
})
.then(function (response) {
    return response.text();
})
.then(function (data) {
    console.log(data);
})
.catch(function (error) {
    console.log("Error:", error);
});


        // =========================
        // SHOW SUCCESS MESSAGE
        // =========================

        successMessage.style.display =
            "flex";


        // =========================
        // RESET FORM
        // =========================

        form.reset();

        charCount.textContent = "0";


        studentGroup.classList.remove(
            "hidden"
        );

        staffGroup.classList.add(
            "hidden"
        );

        registerNumber.required = false;

        staffId.required = false;


        // =========================
        // HIDE SUCCESS MESSAGE
        // AFTER 4 SECONDS
        // =========================

        setTimeout(
            function () {

                successMessage.style.display =
                    "none";

            },
            4000
        );

    }
);
successClose.addEventListener(
    "click",
    function () {

        successMessage.style.display = "none";

    }
);