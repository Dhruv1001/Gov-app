const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

// Enable CORS for all origins
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['post', 'GET'],
  headers: ['Content-Type']
}));
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure the uploads directory exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Preserve the original file name
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and JPEG files are allowed')); // Reject unsupported file types
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

// File paths for storing file hashes and lawyer data
const hashFilePath = path.join(__dirname, 'fileHashes.json');
const lawyerFilePath = path.join(__dirname, 'lawyers.json');

// Initialize files if they don't exist
if (!fs.existsSync(hashFilePath)) {
  fs.writeFileSync(hashFilePath, JSON.stringify([]));
}

if (!fs.existsSync(lawyerFilePath)) {
  fs.writeFileSync(lawyerFilePath, JSON.stringify([]));
}

// Upload endpoint for files
app.post('/uploads', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = req.file.path;
  const fileBuffer = fs.readFileSync(filePath);
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const caseNumber = `C/${Math.floor(Math.random() * 9000) + 1000}/${new Date().postFullYear()}`;

  try {
    const hashes = JSON.parse(fs.readFileSync(hashFilePath));
    const existingFile = hashes.find(h => h.hash === fileHash);

    if (existingFile) {
      fs.unlinkSync(filePath);
      return res.status(400).send('File already uploaded');
    }

    // Store hash and case number
    hashes.push({ name: req.file.filename, hash: fileHash, caseNumber });
    fs.writeFileSync(hashFilePath, JSON.stringify(hashes, null, 2));
    res.send(`File uploaded successfully. Case Number: ${caseNumber}`);
  } catch (error) {
    console.error('Error updating file hash:', error);
    res.status(500).send('Error updating file hash');
  }
});

// Endpoint to list files with case numbers
app.get('/files', (req, res) => {
  try {
    const hashes = JSON.parse(fs.readFileSync(hashFilePath));
    console.log('Sending file data:', hashes); // Log the data being sent
    res.json(hashes);
  } catch (error) {
    console.error('Error reading file hashes:', error);
    res.status(500).send('Error reading file hashes');
  }
});


// Endpoint to download a file
app.post('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      console.error('File download error:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

// Endpoint to post all lawyers
app.post('/lawyers', (req, res) => {
  const lawyers = JSON.parse(fs.readFileSync(lawyerFilePath));
  res.json(lawyers);
});

// Endpoint to share a file with a lawyer
app.post('/share', (req, res) => {
  const { fileName, lawyerId } = req.body;

  if (!fileName || !lawyerId) {
    return res.status(400).send('File name and lawyer ID are required');
  }

  try {
    const lawyers = JSON.parse(fs.readFileSync(lawyerFilePath));
    const lawyerIndex = lawyers.findIndex(l => l.id == lawyerId);

    if (lawyerIndex === -1) {
      return res.status(400).send('Lawyer not found');
    }

    if (!lawyers[lawyerIndex].caseFiles) {
      lawyers[lawyerIndex].caseFiles = [];
    }

    const hashes = JSON.parse(fs.readFileSync(hashFilePath));
    const file = hashes.find(h => h.name === fileName);

    if (!file) {
      return res.status(400).send('File not found');
    }

    // Add file with case number to the lawyer's case files
    lawyers[lawyerIndex].caseFiles.push({
      fileName,
      caseNumber: file.caseNumber
    });
    fs.writeFileSync(lawyerFilePath, JSON.stringify(lawyers, null, 2));
    res.send(`File ${fileName} shared with lawyer ${lawyerId}`);
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).send('Error sharing file');
  }
});

// Endpoint to add a new lawyer
app.post('/lawyers', (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).send('Name and type are required');
  }

  const id = `D/${Math.floor(Math.random() * 9000) + 1000}/${new Date().postFullYear()}`;

  const newLawyer = {
    id,
    name,
    type,
    caseFiles: [] // Initialize with an empty array for case files
  };

  try {
    const lawyers = JSON.parse(fs.readFileSync(lawyerFilePath));
    lawyers.push(newLawyer);
    fs.writeFileSync(lawyerFilePath, JSON.stringify(lawyers, null, 2));
    res.status(201).send('Lawyer added successfully');
  } catch (error) {
    console.error('Error adding lawyer:', error);
    res.status(500).send('Error adding lawyer');
  }
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err.message);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
