const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const wss = new WebSocket.Server({ server });

app.use(express.json());

let latestOTPs = {
    MathiBuri: { login: '', payment: '' },
    DaruhBuri: { login: '', payment: '' }
};

app.post('/send-otp', (req, res) => {
    const { otp, source, type } = req.body;

    console.log(`Received OTP: ${otp} from ${source} (${type})`);

    if (source && type && latestOTPs[source]) {
        latestOTPs[source][type] = otp;

        // Send to WebSocket clients
        const message = JSON.stringify({ source, type, otp });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        // Optional: keep emitting for Socket.IO clients
        io.emit(`otp-${source}-${type}`, otp);
    }

    res.sendStatus(200);
});

server.listen(3111, '192.168.1.40', () => {
    console.log('Server running on http://192.168.1.40:3111');
});
