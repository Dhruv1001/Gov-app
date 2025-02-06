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
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Define the model for the collection
const Client = mongoose.model('clients', clientSchema);

// Login route
app.post('/api/log', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const client = await Client.findOne({username});


    // Check if the user exists and if the password matches
    if (!client) {
      return res.status(401).json({ message: 'password and user does not matched' });
    }

    // Compare the password with the stored hash
    const isMatch = (password == client.password);
    
    
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
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new Client({ fullname, username, password: password });
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







