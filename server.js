const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

app.use(express.json());

let latestOTPs = {
    MathiBuri: { login: '', payment: '' },
    DaruhBuri: { login: '', payment: '' }
};

// Endpoint to receive OTP from Android app or any client
app.post('/send-otp', (req, res) => {
    const { otp, source, type } = req.body;

    console.log(`Received OTP: ${otp} from ${source} (${type})`);

    if (source && type && latestOTPs[source]) {
        latestOTPs[source][type] = otp;
        io.emit(`otp-${source}-${type}`, otp);
    }

    res.sendStatus(200);
});

// WebSocket for extensions or frontend to receive OTPs in real-time
io.on('connection', (socket) => {
    console.log('Client connected');

    // Send latest OTPs to newly connected client
    for (const source in latestOTPs) {
        for (const type in latestOTPs[source]) {
            socket.emit(`otp-${source}-${type}`, latestOTPs[source][type]);
        }
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Use dynamic port for cloud hosting like Render.com
const PORT = process.env.PORT || 3111;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
