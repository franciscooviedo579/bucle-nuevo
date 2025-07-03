const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/account', accountRoutes);

app.listen(4000, () => {
  console.log('Servidor backend en http://localhost:4000');
});
