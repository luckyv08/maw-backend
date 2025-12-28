const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection (Railway)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
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
