const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Routes

// Render Sign Up page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Render Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Render Upload page
app.get('/upload', (req, res) => {
    res.render('upload');
  });

// Handle Sign Up
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  
  try {
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error signing up');
  }
});

// Handle Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/upload');
    } else {
      res.status(400).send('Invalid email or password');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error logging in');
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));
