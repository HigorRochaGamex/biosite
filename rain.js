const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const drops = [];

for (let i = 0; i < 400; i++) {
  drops.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 4 + 4,
    width: Math.random() * 1.2 + 0.5,
    opacity: Math.random() * 0.5 + 0.3
  });
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let drop of drops) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(173, 216, 230, ${drop.opacity})`;
    ctx.lineWidth = drop.width;
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();
  }
  updateDrops();
  requestAnimationFrame(drawRain);
}

function updateDrops() {
  for (let drop of drops) {
    drop.y += drop.speed;
    if (drop.y > canvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * canvas.width;
    }
  }
}

drawRain();
