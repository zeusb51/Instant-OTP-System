const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

let latestOTPs = {
    MathiBuri: { login: '', payment: '' },
    DaruhBuri: { login: '', payment: '' }
};

// API endpoint to receive OTP from Android app
app.post('/send-otp', (req, res) => {
    const { otp, source, type } = req.body;

    console.log(`==== OTP RECEIVED ====`);
    console.log(`OTP: ${otp}`);
    console.log(`Source: ${source}`);
    console.log(`Type: ${type}`);
    console.log(`=======================`);

    if (source && type && latestOTPs[source]) {
        latestOTPs[source][type] = otp;
        io.emit(`otp-${source}-${type}`, otp);
    }

    res.sendStatus(200);
});

// WebSocket connection for browser extensions
io.on('connection', (socket) => {
    console.log('🔌 Client connected via WebSocket');

    // Send latest OTPs to new client
    for (const source in latestOTPs) {
        for (const type in latestOTPs[source]) {
            socket.emit(`otp-${source}-${type}`, latestOTPs[source][type]);
        }
    }

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3111;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
