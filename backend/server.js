const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// HTTP server and Socket.IO initialization
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://192.168.1.4:3000", // Frontend IP
        methods: ["GET", "POST"]
    }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for chat messages
    socket.on('send_message', (data) => {
        io.emit('receive_message', data); // Broadcast message
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Run the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.1.4:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});