const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Create plain HTTP server (Render handles HTTPS externally)
const server = http.createServer(app);

// WebSocket server using same HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', ws => {
  console.log('🔌 WebSocket client connected');
});

app.post('/send-otp', (req, res) => {
  const { otp, source, type, username } = req.body;
  const userTag = username ? ` (${username})` : '';
  console.log(`[RECEIVED] OTP: ${otp} | Source: ${source} | Type: ${type}${userTag}`);

  if (!otp || !source || !type) {
    return res.status(400).send("Invalid payload");
  }

  const msg = JSON.stringify({ otp, source, type, username });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });

  return res.sendStatus(200);
});

// Use Render's dynamic port assignment
const PORT = process.env.PORT || 3112;
server.listen(PORT, () => {
  console.log(`✅ OTP Server running on port ${PORT}`);
});
