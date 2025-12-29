const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection (Railway / Render)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// API route
app.post("/login", (req, res) => {
  const { email, phone, service } = req.body;

  if (!email || !phone || !service) {
    return res.status(400).json({ error: "All fields required" });
  }

  const sql = "INSERT INTO leads (email, phone, service) VALUES (?, ?, ?)";
  db.query(sql, [email, phone, service], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB insert failed" });
    }
    res.status(201).json({ message: "Lead saved successfully" });
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
