const rainInstances = {};

function initializeRain(canvasId, density = 175) { // Aumentando a densidade padrão para 75
  // Avoid initializing multiple times for the same canvas
  if (rainInstances[canvasId]) {
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas com ID ${canvasId} não encontrado.`);
    return;
  }

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function setSize() {
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    // No explicit ctx.scale to avoid cumulative scaling (optional)
  }

  setSize();

  const drops = [];
  for (let i = 0; i < density; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 40 + 5, // Reduzindo o tamanho das gotas
      speed: Math.random() * 5 + 5 // Reduzindo a velocidade das gotas
    });
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.97)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    drops.forEach(drop => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speed;
      if (drop.y > canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * canvas.width;
      }
    });

    rainInstances[canvasId].rafId = requestAnimationFrame(drawRain);
  }

  // start animation
  rainInstances[canvasId] = { canvas, ctx, drops, rafId: null, setSize };
  rainInstances[canvasId].rafId = requestAnimationFrame(drawRain);

  // Recalculate size/density on resize to avoid stretching issues
  const onResize = () => {
    setSize();
    // Optional: Recalculate drop positions to fit new size
    drops.forEach(drop => {
      drop.x = Math.random() * canvas.width;
      drop.y = Math.random() * canvas.height;
    });
  };

  window.addEventListener('resize', onResize);

  // Provide a way to stop later if needed
  rainInstances[canvasId].stop = () => {
    cancelAnimationFrame(rainInstances[canvasId].rafId);
    window.removeEventListener('resize', onResize);
    delete rainInstances[canvasId];
  };
}