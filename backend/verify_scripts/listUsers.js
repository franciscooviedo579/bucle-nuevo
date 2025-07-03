const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

db.all('SELECT id, username, email, password, role FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error consultando usuarios:', err.message);
  } else {
    console.log('Usuarios registrados:');
    rows.forEach(user => {
      console.log(user);
    });
  }
  db.close();
});
