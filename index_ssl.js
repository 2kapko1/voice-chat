// Import dependencies
const express = require('express');
const https = require('https');
const socketIO = require('socket.io');
const cors = require('cors');
const fs = require("fs");

// Create the app and server
const app = express();
app.use(express.static('public'));
app.use(cors({
    origin: '*' // Allow only the client with entering the url of client
}));
const privateKey = fs.readFileSync("ssl/client-key.pem", "utf8");
const certificate = fs.readFileSync("ssl/client-cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
const io = socketIO(server);

app.get("/", (req, res) => {
    res.send("Server is running.");
});

const rooms = {};

// Handle new socket connections
io.on('connection', (socket) => {

    socket.on('joinRoom', (room) => {
        if (rooms.hasOwnProperty(socket.id)) {
            socket.leave(rooms[socket.id]);
        }

        rooms[socket.id] = room;
        socket.join(room)
    });

    socket.on('audioStream', (audioData) => {
        if (rooms.hasOwnProperty(socket.id)) {
            socket.to(rooms[socket.id]).emit('audioStream', audioData);
        }
    });

    socket.on('disconnect', () => {
        if (rooms.hasOwnProperty(socket.id)) {
            delete rooms[socket.id];
        }
    });
});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});