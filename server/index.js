import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const MODE = process.env.MODE || "wasm"; // wasm | server | mock

// ----------------------
// 🔎 Get LAN IP helper
// ----------------------
function getLANIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address; // e.g. 10.36.153.246
      }
    }
  }
  return "localhost";
}

// ----------------------
// WebSocket Rooms
// ----------------------
const rooms = new Map();

wss.on("connection", (ws) => {
  let room = null;
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "join") {
      room = data.room;
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(ws);
      ws.send(JSON.stringify({ type: "mode", mode: MODE }));
    } else if (room) {
      // broadcast to others in room
      for (const peer of rooms.get(room)) {
        if (peer !== ws && peer.readyState === 1) {
          peer.send(msg);
        }
      }
    }
  });
  ws.on("close", () => {
    if (room && rooms.has(room)) rooms.get(room).delete(ws);
  });
});

// ----------------------
// Static Frontend
// ----------------------
app.use("/static", express.static(path.join(__dirname, "../web/public")));

// ----------------------
// Landing Page (QR + Links)
// ----------------------
app.get("/", async (req, res) => {
  try {
    const ip = getLANIP();
    const base = `http://${ip}:3000`;

    const phoneURL = `${base}/static/sender.html`;
    const viewerURL = `${base}/static/viewer.html`;
    const qr = await QRCode.toDataURL(phoneURL);

    res.send(`
      <html><body style="font-family: sans-serif">
        <h2>WebRTC Object Detection Demo (${MODE} mode)</h2>
        <p><strong>Laptop (Viewer):</strong> <a href="${viewerURL}">${viewerURL}</a></p>
        <p><strong>Phone (Sender):</strong> Scan this QR:</p>
        <img src="${qr}" width="220" />
        <p>Or open manually: ${phoneURL}</p>
      </body></html>
    `);
  } catch (err) {
    console.error("Error generating landing page:", err);
    res.status(500).send("Server error generating landing page.");
  }
});

// ----------------------
// Start Server
// ----------------------
const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
