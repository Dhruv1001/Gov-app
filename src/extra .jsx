const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth-demo', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// JWT secret key (use an environment variable in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('All fields are required.');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('User already exists.');
  }

  // Hash the password and save the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).send('User registered successfully.');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('All fields are required.');
  }

  // Find the user
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('Invalid username or password.');
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid username or password.');
  }

  // Create a JWT and set it as a cookie
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true }).send('Login successful.');
});

// Logout route (clears the token)
app.post('/logout', (req, res) => {
  res.clearCookie('token').send('Logout successful.');
});

// Protected route example
app.get('/profile', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Not authenticated');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    res.json(user);
  } catch (error) {
    res.status(401).send('Invalid token');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
