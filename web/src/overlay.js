export function drawBoxes(canvas, boxes) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  (boxes || []).forEach((b) => {
    const x = b.xmin * canvas.width;
    const y = b.ymin * canvas.height;
    const w = (b.xmax - b.xmin) * canvas.width;
    const h = (b.ymax - b.ymin) * canvas.height;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "lime";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(x, y - 18, ctx.measureText(b.label).width + 50, 18);
    ctx.fillStyle = "white";
    ctx.fillText(`${b.label} ${(b.score * 100) | 0}%`, x + 4, y - 5);
  });
}
