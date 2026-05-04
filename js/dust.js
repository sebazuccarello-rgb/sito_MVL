/* Dust particle effect for Laboratory page */
(function () {
  const canvas = document.getElementById('dust-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 180;
  const particles = Array.from({ length: COUNT }, () => ({
    x:       Math.random() * window.innerWidth,
    y:       Math.random() * window.innerHeight * 4,
    size:    Math.random() * 1.6 + 0.3,
    speedX:  (Math.random() - 0.5) * 0.18,
    speedY:  -(Math.random() * 0.22 + 0.05),
    opacity: Math.random() * 0.22 + 0.04,
    flicker: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    particles.forEach(p => {
      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(t + p.flicker));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,220,${alpha})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0)              p.x = canvas.width;
      if (p.x > canvas.width)   p.x = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
