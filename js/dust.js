/* Dust particle effect — mouse interactive */
(function () {
  const canvas = document.getElementById('dust-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const COUNT = isTouch ? 60 : 200;
  const INFLUENCE_RADIUS = 120;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* mouse tracking — solo su dispositivi non-touch */
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };
  if (!isTouch) {
    window.addEventListener('mousemove', e => {
      mouse.vx = e.clientX - mouse.px;
      mouse.vy = e.clientY - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x  = e.clientX;
      mouse.y  = e.clientY + window.scrollY;
    });
  }

  const particles = Array.from({ length: COUNT }, () => ({
    x:       Math.random() * window.innerWidth,
    y:       Math.random() * window.innerHeight * 3,
    size:    Math.random() * 1.6 + 0.3,
    baseVX:  (Math.random() - 0.5) * 0.18,
    baseVY:  -(Math.random() * 0.22 + 0.05),
    vx: 0, vy: 0,
    opacity: Math.random() * 0.22 + 0.04,
    flicker: Math.random() * Math.PI * 2,
  }));

  /* Pausa quando la tab non è visibile — risparmio batteria */
  let paused = false;
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) draw();
  });

  function draw() {
    if (paused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    particles.forEach(p => {
      if (!isTouch) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS) {
          const force   = (INFLUENCE_RADIUS - dist) / INFLUENCE_RADIUS;
          const speed   = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
          const impulse = force * Math.min(speed * 0.06, 1.2);
          p.vx += (dx / dist) * impulse;
          p.vy += (dy / dist) * impulse;
        }
      }

      p.vx += (p.baseVX - p.vx) * 0.04;
      p.vy += (p.baseVY - p.vy) * 0.04;

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10)          { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < 0)            p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(t + p.flicker));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,220,${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
