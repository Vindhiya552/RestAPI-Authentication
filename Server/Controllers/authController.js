const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const con = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Register a new user
exports.register = async (req, res) => {
   
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username and password required" });

  const hashedPassword = await bcrypt.hash(password, 10);
   
  con.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "User already exists or DB error" });

      res.status(201).json({ success: true, message: "User registered successfully" });
    }
  );
};

// Login user
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username and password required" });

  con.query("SELECT * FROM users WHERE username = ?", [username], async (err, rows) => {
    console.log(rows);
    if (err || rows.length === 0)
      return res.status(401).json({ success: false, message: "Invalid data" });

    const user = rows[0];
    // const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch)
    //   return res.status(401).json({ success: false, message: "Invalid pwd" });

    // Generate token
    const token = jwt.sign({ id: 'vindhiya', username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  });
};
