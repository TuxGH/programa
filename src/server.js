const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./registers');  
const app = express();


app.use(express.json());


app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from React frontend
  methods: 'GET, POST',
  credentials: true
}));


mongoose.connect("mongodb://localhost:27017/employee", {  
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});



// POST Route for Registration
app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then(employee => res.json(employee))  // Return created employee data
    .catch(err => {
      console.error('Error creating employee:', err); // Log error for debugging
      res.status(500).json({ error: 'An error occurred while creating employee' });
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  EmployeeModel.findOne({ email })
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // Check password
          if (user.password === password) {
              return res.json({ message: 'Login successful' });
          
          } else {
              return res.status(401).json({ message: 'Password incorrect' });
          }
      })
      .catch(err => {
          console.error('Login error:', err);
          res.status(500).json({ message: 'Internal server error' });
      });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
