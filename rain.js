function initializeRain(canvasId, density = 175) { // Aumentando a densidade padrão para 75
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas com ID ${canvasId} não encontrado.`);
    return;
  }

  // Ajustar o tamanho do canvas para criar um efeito de zoom
  canvas.width = window.innerWidth * 1.5; // Aumentar a largura do canvas
  canvas.height = window.innerHeight * 1.5; // Aumentar a altura do canvas

  const ctx = canvas.getContext("2d");
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

    requestAnimationFrame(drawRain);
  }

  drawRain();
}