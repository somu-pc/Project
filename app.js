const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your_database_url' with your MongoDB connection string)
mongoose.connect('url', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a Lead schema
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Lead = mongoose.model('Lead', leadSchema);

// Middleware for parsing JSON and handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like CSS)
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new lead
    const newLead = new Lead({
      name,
      email,
      message,
    });

    // Save the lead to the database
    await newLead.save();

    // You can add additional logic here, such as sending email notifications

    res.status(200).send('Lead submitted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
