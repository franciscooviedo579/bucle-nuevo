const bcrypt = require('bcryptjs');

// Contraseña original
const password = 'admin123';

// Hash guardado en la base de datos
const hash = '$2b$10$BsZR/uN5GdNoyCP6GFyP.eOjCWkw4O3AA1DzhWQqqYbCAC8Ix631G';

// Verificar si la contraseña ingresada corresponde al hash
bcrypt.compare(password, hash, function(err, res) {
  if (res) {
    console.log('¡Contraseña correcta!');
  } else {
    console.log('Contraseña incorrecta');
  }
});
