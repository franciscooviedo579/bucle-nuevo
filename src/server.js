require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Fake DB por ahora
const users = [
  { username: "admin", password: "$2b$10$HqXN...hasedPassword" } // contraseña ya hasheada
];

// Endpoint de login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware de protección
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Rutas protegidas
app.get("/api/admin/data", authMiddleware, (req, res) => {
  res.json({ message: "Contenido secreto del admin" });
});

app.listen(3001, () => console.log("Servidor escuchando en http://localhost:3001"));
