// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());  // Enable CORS for frontend access

// // MongoDB connection string (make sure MongoDB is running on localhost)
// mongoose.connect('mongodb://localhost:27017/SupremeCourt', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB (SupremeCourt)'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Define the schema for the "users" collection
// const clientSchema = new mongoose.Schema({
//   fullname: { type: String, required: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

// // Define the model for the collection
// const Client = mongoose.model('clients', clientSchema);

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find user by username
//     const client = await Client.findOne({ username });
    
//     // Check if the user exists and if the password matches
//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Respond with a success message or user data
//     res.status(200).json({ message: 'Login successful', user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/api/clients', async (req, res) => {
//   const { fullname, username, password } = req.body;  // Get data from the request body
//   try {
//     const newClient = new Client({ fullname, username, password });
//     await newClient.save();  // Save the new user to MongoDB
//     res.status(201).json(newClient);  // Respond with the new user
//   } catch (err) {
//     res.status(500).json({ message: 'Error adding user' });
//   }
// });

// //Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');  // For password hashing
const app = express();
const objectId = new mongoose.Types.ObjectId();


// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for frontend access

// MongoDB connection string (make sure MongoDB is running on localhost)
mongoose.connect('mongodb://localhost:27017/SupremeCourt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB (SupremeCourt)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the schema for the "users" collection
const clientSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Define the model for the collection
const Client = mongoose.model('clients', clientSchema);

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const client = await Client.findOne({ _id: ObjectId(username) });


    // Check if the user exists and if the password matches
    if (!client) {
      return res.status(401).json({ message: 'password and user does not matched' });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, client.password);
    
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Respond with a success message or user data
    res.status(200).json({ message: 'Login successful', client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route (for creating new clients)
app.post('/api/clients', async (req, res) => {
  const { fullname, username, password } = req.body;  // Get data from the request body

  try {
    // Check if the username already exists
    const existingClient = await Client.findOne({ username });
    if (existingClient) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new Client({ fullname, username, password: hashedPassword });
    await newClient.save();  // Save the new user to MongoDB
    res.status(201).json(newClient);  // Respond with the new user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding user' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());  // Enable CORS for frontend access

// // MongoDB connection string (ensure MongoDB is running on localhost)
// mongoose.connect('mongodb://localhost:27017/SupremeCourt', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB (SupremeCourt)'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Define the schema for the "users" collection
// const userSchema = new mongoose.Schema({
//   fullname: { type: String, required: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

// // Define the model for the collection
// const User = mongoose.model('User', userSchema);

// // Route to GET all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();  // Fetch all users from the "users" collection
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Route to POST a new user
// app.post('/api/users', async (req, res) => {
//   const { fullname, username, password } = req.body;  // Get data from the request body

//   // Validate incoming data (basic validation, you can enhance it further)
//   if (!fullname || !username || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     // Create a new user based on the provided data
//     const newUser = new User({ fullname, username, password });

//     // Save the new user to MongoDB
//     await newUser.save();

//     // Respond with the newly created user
//     res.status(201).json(newUser);
//   } catch (err) {
//     console.error('Error saving user:', err);
//     res.status(500).json({ message: 'Error adding user' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
































// const express = require('express');
// const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// // Models
// const User = require('../models/client');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.log('Error connecting to MongoDB:', error));

// // Login route (POST)
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find user by username
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     // Check if the password is correct
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Send the token in the response
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Register route (POST) - Just for testing, you can skip in production
// app.post('/register', async (req, res) => {
//   const { fullname, username, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ fullname, username, password: hashedPassword });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

// // Models
// const user = require('./models/user');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.log('Error connecting to MongoDB:', error));

// // Register route (POST) - To register a new user
// app.post('/register', async (req, res) => {
//   const { fullname, username, password } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({ fullname, username, password: hashedPassword });

//     // Save the user to the database
//     await newUser.save();
    
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login route (POST) - To authenticate a user
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find the user by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     // Compare the password with the stored hash
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Send the token in the response
//     res.json({ token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
