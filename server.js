const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const winston = require('winston');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ],
});

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`Request URL: ${req.originalUrl}, Method: ${req.method}`);
  next();
});

// Set up middleware for JSON parsing and CORS
app.use(express.json());
app.use(cors({
  origin: 'https://codestandoff.com', 
  methods: ['POST', 'GET'],
}));


// MongoDB connection
const userDb = mongoose.createConnection('mongodb+srv://amanku22mar:Abc1234@standoff.lztpe.mongodb.net/database?retryWrites=true&w=majority');
const problemsDb = mongoose.createConnection('mongodb+srv://amanku22mar:Abc1234@standoff.lztpe.mongodb.net/Problems?retryWrites=true&w=majority');

userDb.on('connected', () => logger.info('User database connected'));
problemsDb.on('connected', () => logger.info('Problems database connected'));

userDb.on('error', err => logger.error('User DB connection error:', err));
problemsDb.on('error', err => logger.error('Problems DB connection error:', err));

// Optional: Disconnect event
userDb.on('disconnected', () => logger.warn('User database disconnected'));
problemsDb.on('disconnected', () => logger.warn('Problems database disconnected'));

// Define schemas and models
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  contact: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  'Question ID': { type: Number, required: true },
  'Question Title': { type: String, required: true },
  'Question Text': { type: String, required: true },
  'Difficulty Level': { type: String, required: true },
  'Input': { type: String, required: true },
  'Expected Output': { type: String, required: true },
});

const User = userDb.model('User', userSchema);
const Question = problemsDb.model('Question', questionSchema);

// Routes for signup
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, contact, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, username, contact, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    logger.error('Error during signup:', error);
    res.status(500).json({ message: 'Error during signup' });
  }
});

// Routes for login
app.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Check if the input is an email or username
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail }, // Check by email
        { username: usernameOrEmail } // Check by username
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/username or password' });
    }

    // Compare the hashed password with the input password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

app.get('/questions/:id/output', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Question ID format' });
    }

    // Attempt to find the question by ID
    const question = await Question.findById(id);
    
    // If the question does not exist, return a 404 error
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Attempt to retrieve the expected output
    const expectedOutput = question['Expected Output']; // Ensure you're using the correct field name

    // If expected output does not exist, return a 404 error
    if (!expectedOutput) {
      return res.status(404).json({ message: 'Expected output not found for this question' });
    }

    // If everything is fine, return the expected output
    res.status(200).json({ expectedOutput });
  } catch (error) {
    logger.error('Error fetching expected output:', error); // Log the error
    res.status(500).json({ message: 'Error fetching expected output', error: error.message });
  }
});


// Route to fetch questions with pagination
app.get('/questions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 25;
    const skip = (page - 1) * limit;

    const total = await Question.countDocuments();
    const questions = await Question.find().skip(skip).limit(limit);

    res.status(200).json({ questions, total });
  } catch (error) {
    logger.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

app.get('/random-questions', async (req, res) => {
  try {
    const questionsCount = await Question.countDocuments();
    const randomIndexes = Array.from({ length: 3 }, () => Math.floor(Math.random() * questionsCount));
    
    const questions = await Promise.all(
      randomIndexes.map(index => Question.findOne().skip(index))
    );

    res.status(200).json(questions);
  } catch (error) {
    logger.error('Error fetching random questions:', error);
    res.status(500).json({ message: 'Error fetching random questions' });
  }
});

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let waitingPlayer = null;
let roomCounter = 0; // To generate unique room IDs
const rooms = {}; // Track rooms and players

// Function to create a room for a pair of players
const createRoom = async (player1, player2) => {
  const roomName = `gameRoom_${++roomCounter}`;
  player1.join(roomName);
  player2.join(roomName);
  player1.room = roomName;
  player2.room = roomName;
  rooms[roomName] = [player1, player2];

  try {
    // Fetch random questions and emit to both players
    const response = await fetch(`http://localhost:5000/random-questions`);
    const questions = await response.json();

    // Emit the same questions to both players
    io.to(roomName).emit("bothPlayersReady", { roomId: roomName, questions });
    console.log(`Both players are in room ${roomName} and received the same questions.`);
  } catch (error) {
    console.error("Error fetching questions:", error);
    io.to(roomName).emit("errorFetchingQuestions", { message: "Failed to fetch questions" });
  }

  io.to(roomName).emit("gameStart", { message: "Game has started!" });
  return roomName;
};

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle player joining the game
  socket.on("joinGame", () => {
    if (waitingPlayer) {
      // Pair with the waiting player and create a room
      createRoom(waitingPlayer, socket);
      socket.emit("joinRoom", { room: waitingPlayer.room });
      waitingPlayer.emit("joinRoom", { room: waitingPlayer.room });
      waitingPlayer = null; // Reset waiting player
    } else {
      // Set this player as waiting for a partner
      waitingPlayer = socket;
      socket.emit("waiting", { message: "Waiting for another player to join..." });
    }
  });

  // Handle chat message
  socket.on("sendMessage", (message) => {
    const room = socket.room;
    if (room) {
      io.to(room).emit("receiveMessage", { player: socket.id, message });
    }
  });

  // Handle player surrender
  socket.on("surrender", () => {
    const room = socket.room;
    if (room) {
      io.to(room).emit("gameOver", { message: "Player has surrendered. Game over!" });
      io.to(room).emit("redirect", { destination: "/rank-rating" });
      io.in(room).socketsLeave(room); // Disconnect all players in the room
    }
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
    const room = socket.room;
    if (room) {
      io.to(room).emit("gameOver", { message: "Player disconnected. Game over!" });
      io.to(room).emit("redirect", { destination: "/rank-rating" });
      io.in(room).socketsLeave(room); // Disconnect all players in the room
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  
