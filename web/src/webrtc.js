export async function setupViewerPC() {
  const room = "default";
  const ws = new WebSocket(`ws://${location.host}`);
  const pc = new RTCPeerConnection();
  const remoteVideo = document.getElementById("remote");
  const overlay = document.getElementById("overlay");

  let dcMeta = null;

  pc.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0];
  };
  pc.ondatachannel = (e) => {
    if (e.channel.label === "meta") dcMeta = e.channel;
  };

  ws.onopen = () => ws.send(JSON.stringify({ type: "join", room }));

  ws.onmessage = async (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === "offer" && msg.role === "sender") {
      await pc.setRemoteDescription(msg.sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(
        JSON.stringify({ type: "answer", room, sdp: pc.localDescription })
      );
    } else if (msg.type === "candidate") {
      await pc.addIceCandidate(msg.candidate);
    }
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate)
      ws.send(JSON.stringify({ type: "candidate", room, candidate }));
  };

  return { pc, ws, dcMeta, remoteVideo, overlay };
}
