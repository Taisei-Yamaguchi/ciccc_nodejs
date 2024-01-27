const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// PostgreSQL connect info
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(bodyParser.json());

// Routes
// GET users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET urls
app.get('/urls', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM urls');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching URLs', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST users
app.post('/users', async (req, res) => {
  const { username, email } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *', [username, email]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST urls
app.post('/urls', async (req, res) => {
  const { userId, url } = req.body;

  try {
    const result = await pool.query('INSERT INTO urls (user_id, url) VALUES ($1, $2) RETURNING *', [userId, url]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating URL', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server start
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
