require('dotenv').config(); // To load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const socketIo = require('socket.io');
const http = require('http');
const fileRoutes = require('./routes/fileRoutes'); // File management routes
const authRoutes = require('./routes/authRoutes'); // OAuth2 authentication routes
const path = require('path');
const cron = require('node-cron');
const { cleanupTempFiles } = require('./controllers/fileController'); // Cron job function for cleanup

// Initialize Express app
const app = express();
const server = http.createServer(app); // For WebSocket support
const io = socketIo(server); // Initialize Socket.io

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middlewares
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse form data

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if HTTPS is enabled
}));

// Passport Middleware for OAuth2
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport'); // Passport strategy configuration

// Static files for uploads (optional, if not using cloud directly)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/auth', authRoutes); // OAuth2 authentication routes
app.use('/files', fileRoutes); // File management routes

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection established');

    // WebSocket notifications (example)
    socket.on('fileUploaded', (data) => {
        console.log('File uploaded:', data);
        io.emit('notify', { message: `File ${data.fileName} uploaded successfully!` });
    });

    socket.on('fileDeleted', (data) => {
        console.log('File deleted:', data);
        io.emit('notify', { message: `File ${data.fileName} deleted successfully!` });
    });
});

// Cron Job for Cleaning Temporary Files (e.g., ZIP files)
cron.schedule('0 * * * *', () => {
    console.log('Running cleanup job for temporary files...');
    cleanupTempFiles();
});

// Listen on PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
