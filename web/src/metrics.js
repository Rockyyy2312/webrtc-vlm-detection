const records = [];
let processedCount = 0;
let startTs = Date.now();

export function record({
  frame_id,
  capture_ts,
  recv_ts,
  inference_ts,
  display_ts,
  processed,
}) {
  processedCount += processed ? 1 : 0;
  const e2e = display_ts - capture_ts; // overlay_display_ts - capture_ts
  const server = inference_ts - recv_ts; // rough placeholder
  const net = recv_ts - capture_ts; // rough placeholder
  records.push({
    frame_id,
    capture_ts,
    recv_ts,
    inference_ts,
    display_ts,
    e2e,
    server,
    net,
  });
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

export function summary() {
  const e2e = records.map((r) => r.e2e);
  const now = Date.now();
  const seconds = Math.max(1, (now - startTs) / 1000);
  const fps = (processedCount / seconds).toFixed(1);
  return {
    median_e2e_ms: percentile(e2e, 50) | 0,
    p95_e2e_ms: percentile(e2e, 95) | 0,
    processed_fps: parseFloat(fps),
    uplink_kbps: 0, // TODO: estimate via getStats() or inspector
    downlink_kbps: 0, // TODO: same
    frames: records.length,
  };
}

export function summaryString() {
  const s = summary();
  return `E2E median: ${s.median_e2e_ms} ms | P95: ${s.p95_e2e_ms} ms | FPS: ${s.processed_fps}`;
}

export function toJSON() {
  return { ...summary(), raw: records.slice(-300) };
}
