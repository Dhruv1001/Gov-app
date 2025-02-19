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
  role: { type: String, required: true, enum: ['client', 'judge', 'lawyer', 'admin'] }
});

// const User = mongoose.model('role', userSchema); // ✅ Use a single collection
const Client = mongoose.model('clients', userSchema);
const Judge = mongoose.model('judges', userSchema);
const Lawyer = mongoose.model('lawyers', userSchema);
const Admin = mongoose.model('admins', userSchema);

// ✅ Role-based Registration
app.post('/api/register', async (req, res) => {
  const { fullname, username, password, role } = req.body;

  if (!fullname || !username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  try {
    let existingUser;
    if (role === 'client') {
      existingUser = await Client.findOne({ username });
    } else if (role === 'judge') {
      existingUser = await Judge.findOne({ username });
    } else if (role === 'lawyer') {
      existingUser = await Lawyer.findOne({ username });
    } else if(role == 'admin'){
      existingUser = await Admin.findOne ({ username});
    }

    if (existingUser) {
      return res.status(400).json({ message: `Username already exists in the ${role} schema` });
    }


  // try {
  //   // Check if username exists in any role schema
  //   const existingUser = await Promise.all([
  //      Client.findOne({ username }),
  //     Judge.findOne({ username }),
  //     Lawyer.findOne({ username })
  //   ]);

  //   if (existingUser.some(user => user)) {
  //     return res.status(400).json({ message: 'Username already exists' });
  //   }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (role === 'client') {
      newUser = new Client({ fullname, username, password: hashedPassword, role });
    } else if (role === 'judge') {
      newUser = new Judge({ fullname, username, password: hashedPassword, role });
    } else if (role === 'lawyer') {
      newUser = new Lawyer({ fullname, username, password: hashedPassword, role });
    }else if (role === 'admin') {
      newUser = new Admin({ fullname, username, password: hashedPassword, role });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});



// ✅ Role-based Login (Returns JWT Token)
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      // Find user across all role collections
      let user;
      if (role === 'client') {
        user = await Client.findOne({ username });
      } else if (role === 'judge') {
        user = await Judge.findOne({ username });
      } else if (role === 'lawyer') {
        user = await Lawyer.findOne({ username });
      } else if (role === 'admin') {
        user = await Admin.findOne({ username });
      }
      // const user = await Promise.all([
      //   Client.findOne({ username }),
      //   Judge.findOne({ username }),
      //   Lawyer.findOne({ username })
      // ]).then(results => results.find(user => user)); // Get the first non-null result
  
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

