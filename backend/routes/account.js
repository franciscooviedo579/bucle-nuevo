const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/auth');

// Actualizar email, username y/o contraseña
router.put('/update', authenticateToken, async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // Verifica la contraseña actual para cualquier cambio
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    // Verifica unicidad de username/email si se cambian
    if (username && username !== user.username) {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, existingUser) => {
        if (existingUser) return res.status(409).json({ message: 'Nombre de usuario en uso' });
        // Si no hay conflicto, continúa...
        actualizarUsuario();
      });
    } else if (email && email !== user.email) {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
        if (existingUser) return res.status(409).json({ message: 'Email en uso' });
        // Si no hay conflicto, continúa...
        actualizarUsuario();
      });
    } else {
      actualizarUsuario();
    }

    async function actualizarUsuario() {
      let query = 'UPDATE users SET ';
      const params = [];
      if (username && username !== user.username) {
        query += 'username = ?, ';
        params.push(username);
      }
      if (email && email !== user.email) {
        query += 'email = ?, ';
        params.push(email);
      }
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        query += 'password = ?, ';
        params.push(hashedPassword);
      }
      // Quitar la última coma y espacio
      query = query.replace(/, $/, ' ');
      query += 'WHERE id = ?';
      params.push(userId);

      db.run(query, params, function (err) {
        if (err) return res.status(500).json({ message: 'Error actualizando usuario' });
        db.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, updatedUser) => {
          if (err) return res.status(500).json({ message: 'Error obteniendo usuario actualizado' });
          res.json({ user: updatedUser });
        });
      });
    }
  });
});

module.exports = router;
