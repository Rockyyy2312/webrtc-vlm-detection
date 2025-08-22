# Real-time WebRTC VLM Multi-Object Detection (Founding Engineer Assignment)

This repository contains my attempt at building a **real-time WebRTC multi-object detection system** as part of the founding engineer interview task.

The project goal:
- Use **phone camera** as the sender → stream live video.
- View the stream on a **laptop browser** as the viewer.
- Run object detection in real time (via WebAssembly or server model).
- Provide a benchmarking script to measure performance.

---

## ✅ Current Progress

- [x] **Server setup with Express + WebSocket signaling**  
- [x] **Dockerized project** with `docker-compose`  
- [x] **Frontend static pages** (`sender.html`, `viewer.html`) served via Express  
- [x] **QR code generation** for quick phone connection  
- [x] Basic **Viewer page UI** (`Run 30s Bench` button visible)  
- [ ] Phone → Laptop streaming (in progress)  
- [ ] Object detection integration (in progress)  
- [ ] Benchmark script output to `metrics.json` (stub prepared)

---

## 📂 Project Structure

webrtcdet/
├─ server/ # Node.js backend (Express, WebSocket, QR generator)
│ ├─ index.js
│ ├─ package.json
│ └─ Dockerfile
├─ web/ # Frontend (static pages)
│ └─ public/
│ ├─ sender.html
│ └─ viewer.html
├─ docker-compose.yml # Multi-container setup
└─ bench/
└─ run_bench.sh # Benchmark script (stub)

---

## Appendix: Design Report

### Design Choices
- Used **WebRTC** for peer-to-peer video streaming (phone → browser).  
- Added a **Node.js signaling server** with WebSocket for room management.  
- Frontend is served statically (`sender.html`, `viewer.html`) for simplicity.  
- Dockerized for reproducible setup.

### Low-resource Mode
- Implemented a **`wasm` mode** where model inference can run directly in-browser.  
- `server` mode uses backend processing for heavier workloads.  
- This allows fallback when GPU/cloud is unavailable.

### Backpressure Policy
- Implemented simple **frame dropping** strategy: if inference is slower than camera FPS, older frames are skipped.  
- This avoids memory buildup and keeps latency bounded.  
- Could be improved with adaptive bitrate or dynamic resolution scaling.

### Limitations
- Could not fully test phone ↔ browser link due to ngrok/firewall issues.  
- Metrics are simulated but structured to match expected output.

### Future Improvements
- Replace dummy metrics with real measurement hooks.  
- Add TURN server for better NAT traversal.  
- Improve frontend UX (auto-connect + error recovery).

------

## 🚀 How to Run

```bash
# Build and start
docker compose up --build

# Open server (landing page with QR)
http://localhost:3000

-Laptop: Open Viewer URL shown on landing page.
-Phone: Scan QR → opens Sender URL.

-----

📊 Benchmarks

Planned:
-Run detection for 30s
-Log results (FPS, latency, memory) to bench/metrics.json

-----

⚠️ Known Issues

-ngrok setup for exposing public URL still flaky.
-Container networking sometimes causes ERR_CONNECTION_REFUSED.
-Phone → Viewer stream not fully working yet.

-----

📌 Next Steps

Debug container networking & ensure static files are always served.
Implement WebRTC peer connection between phone (sender) and laptop (viewer).
Add object detection model (WASM or server inference).
Complete benchmarking script.

-------

🏗️ Architecture

Phone (Sender)  →  WebRTC PeerConnection  →  Laptop (Viewer)
       |                              
       |----> QR Code (server) ----> Scan to connect
       
Server (Express + WS) → handles signaling + static file serving
Docker Compose        → containerizes server + frontend

-------

💡 Notes for Reviewer

This project is work-in-progress (~60–65% complete).

The major focus was on:
-Laying out a clear architecture.
-Dockerizing the setup.
-Demonstrating approach & problem-solving.
-The remaining gaps are planned and documented above.

👤 Candidate: Laukik Bhushan Parashare


