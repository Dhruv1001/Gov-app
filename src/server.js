const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

const authMiddleware = require('../Middleware/middleware'); // ✅ Correct import path

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/SupremeCourt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB (SupremeCourt)'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Define Schema & Model (Unified Users Collection)
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['client', 'judge', 'lawyer'] }
});

const User = mongoose.model('users', userSchema); // ✅ Use a single collection

// ✅ Role-based Registration
app.post('/api/register', async (req, res) => {
  const { fullname, username, password, role } = req.body;

  if (!fullname || !username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ fullname, username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// ✅ Role-based Login (Returns JWT Token)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Protected Dashboard Route (For Any Role)
app.post('/api/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username} (${req.user.role})`, user: req.user });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config({ path: './.env' });

//  const authMiddleware = require('../Middleware/middleware');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/SupremeCourt', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('✅ Connected to MongoDB (SupremeCourt)'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Define Schemas for Clients, Judges, and Lawyers
// const userSchema = new mongoose.Schema({
//   fullname: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true, enum: ['client', 'judge', 'lawyer'] }
// });

// // Define Models
// const Client = mongoose.model('clients', userSchema);
// const Judge = mongoose.model('judges', userSchema);
// const Lawyer = mongoose.model('lawyers', userSchema);

// // Authentication Middleware
// //  const authMiddleware = (req, res, next) => {
// //   const authHeader = req.header("Authorization");

// //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //     return res.status(401).json({ message: "Access denied. No token provided." });
// //   }

// //   const token = authHeader.split(" ")[1]; // Extract token
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (err) {
// //     return res.status(401).json({ message: "Invalid token." });
// //   }
// // };

// // ✅ Role-based Registration
// app.post('/api/register', async (req, res) => {
//   const { fullname, username, password, role } = req.body;

//   if (!fullname || !username || !password || !role) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     // Check if username exists in any role schema
//     const existingUser = await Promise.all([
//       Client.findOne({ username }),
//       Judge.findOne({ username }),
//       Lawyer.findOne({ username })
//     ]);

//     if (existingUser.some(user => user)) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     let newUser;

//     if (role === 'client') {
//       newUser = new Client({ fullname, username, password: hashedPassword, role });
//     } else if (role === 'judge') {
//       newUser = new Judge({ fullname, username, password: hashedPassword, role });
//     } else if (role === 'lawyer') {
//       newUser = new Lawyer({ fullname, username, password: hashedPassword, role });
//     } else {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     await newUser.save();
//     res.status(201).json({ message: 'Registration successful' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error registering user' });
//   }
// });

// // ✅ Role-based Login (Returns JWT Token)
// app.post('/api/log', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find user across all role collections
//     const user = await Promise.all([
//       Client.findOne({ username }),
//       Judge.findOne({ username }),
//       Lawyer.findOne({ username })
//     ]).then(results => results.find(user => user)); // Get the first non-null result

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate JWT Token
//     const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

//     res.status(200).json({ message: 'Login successful', token, role: user.role });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ✅ Protected Dashboard Route (For Any Role)
// // app.get('/api/dashboard', authMiddleware, (req, res) => {
// //   res.status(200).json({ message: `Welcome ${req.user.username} (${req.user.role})`, user: req.user });
// // });
// app.post('/api/dashboard', authMiddleware, (req, res) => {
//   res.status(200).json({ message: `Welcome ${req.user.username} (${req.user.role})`, user: req.user });
// });


// // ✅ Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

