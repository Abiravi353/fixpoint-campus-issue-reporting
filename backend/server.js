require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(function (error) {
    if (error) {
        console.log("Database connection failed:", error.message);
    } else {
        console.log("MySQL connected successfully");
    }
});
app.post("/reports", function (req, res) {

    const report = req.body;

    const sql = `
        INSERT INTO reports
        (name, email, role, registerNumber, staffId, department,
        issueType, priority, building, room, description, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
        report.name,
        report.email,
        report.role,
        report.registerNumber,
        report.staffId,
        report.department,
        report.issueType,
        report.priority,
        report.building,
        report.room,
        report.description,
        report.status
    ];

    db.query(sql, values, function (error, result) {

        if (error) {
            console.log("Error saving report:", error.message);
            res.status(500).send("Failed to save report");
        } else {
            console.log("Report saved successfully");
            res.send("Report saved successfully");
        }

    });

});

app.get("/", function (req, res) {
    res.send("FixPoint Backend is Working!");
});
app.get("/reports", function (req, res) {

    const email = req.query.email;

    if (email) {

        const sql =
            "SELECT * FROM reports WHERE email = ?";

        db.query(
            sql,
            [email],
            function (error, results) {

                if (error) {

                    console.log(
                        "Error getting reports:",
                        error.message
                    );

                    res.status(500).send(
                        "Failed to get reports"
                    );

                } else {

                    res.json(results);

                }

            }
        );

    } else {

        const sql =
            "SELECT * FROM reports";

        db.query(
            sql,
            function (error, results) {

                if (error) {

                    console.log(
                        "Error getting reports:",
                        error.message
                    );

                    res.status(500).send(
                        "Failed to get reports"
                    );

                } else {

                    res.json(results);

                }

            }
        );

    }

});
app.put("/reports/:id", function (req, res) {

    const id = req.params.id;
    const status = req.body.status;

    const sql = "UPDATE reports SET status = ? WHERE id = ?";

    db.query(sql, [status, id], function (error, result) {

        if (error) {
            console.log("Error updating report:", error.message);
            res.status(500).send("Failed to update report");
        } else {
            console.log("Report status updated");
            res.send("Status updated successfully");
        }

    });

});

app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});

app.delete("/reports/:id", function (req, res) {

    const id = req.params.id;

    const sql = "DELETE FROM reports WHERE id = ?";

    db.query(sql, [id], function (error, result) {

        if (error) {
            console.log(
                "Error deleting report:",
                error.message
            );

            res.status(500).send(
                "Failed to delete report"
            );

        } else {

            console.log(
                "Report deleted successfully"
            );

            res.send(
                "Report deleted successfully"
            );

        }

    });

});