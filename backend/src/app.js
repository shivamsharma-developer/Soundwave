const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

app.use(cors({
  origin: 'https://soundwave-ebon-chi.vercel.app/', // your React app URL
  credentials: true               // allows cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;