const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Cambia estos datos por los que quieras para el usuario de prueba
const username = 'admin';
const email = 'admin@ejemplo.com';
const rawPassword = 'admin123';
const role = 'admin';

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Crear tabla si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

  // Hashear la contraseña
  const password = bcrypt.hashSync(rawPassword, 10);

  // Insertar el usuario solo si no existe
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (row) {
      console.log('El usuario ya existe. No se insertó nada.');
      db.close();
    } else {
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, password, role],
        function (err) {
          if (err) {
            console.error('Error al insertar usuario:', err.message);
          } else {
            console.log('Usuario insertado con ID:', this.lastID);
          }
          db.close();
        }
      );
    }
  });
});
