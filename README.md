# OTP Relay Server

A Node.js server using Express and Socket.IO to receive OTPs from an Android app and forward them to browser extensions in real-time.

## API Endpoint
- `POST /send-otp`
    - Body: `{ otp: "123456", source: "MathiBuri", type: "login" }`

## WebSocket Channels
- `otp-MathiBuri-login`
- `otp-MathiBuri-payment`
- `otp-DaruhBuri-login`
- `otp-DaruhBuri-payment`

Developed by: taariq gefelige.

Built for Lakshadweep ship booking automation system.
