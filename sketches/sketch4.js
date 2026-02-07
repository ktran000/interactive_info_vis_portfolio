// sketches/sketch4.js
// Dynamics Wave Clock (registerSketch template)

registerSketch('sk4', function (p) {
  const W = 800;
  const H = 500;

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont("system-ui, -apple-system, Segoe UI, Roboto, sans-serif");
  };

  p.draw = function () {
    p.background(250);

    const hr12 = ((p.hour() % 12) + 12) % 12 || 12;
    const min = p.minute();
    const sec = p.second();
    const ms = p.millis();

    // ---- Time mappings ----
    // Hours → dynamics (amplitude)
    const amp = p.map(hr12, 1, 12, 8, 40);

    // Minutes → number of phrase bars (1–6)
    const phrases = p.floor(p.map(min, 0, 59, 1, 6));

    // Seconds → dot travel along wave
    const t = (sec + (ms % 1000) / 1000) / 60; // 0..1

    // ---- Title ----
    p.noStroke();
    p.fill(20);
    p.textSize(18);
    p.text("Dynamics Wave Clock", 20, 30);

    p.fill(100);
    p.textSize(12);
    p.text("Tip: watch how the 'phrase bars' change as minutes pass.", 260, 32);

    // ---- Wave layout ----
    const left = 100;
    const right = W - 80;
    const usableW = right - left;
    const spacing = 55;
    const top = 90;

    // ---- Draw phrase waves ----
    for (let i = 0; i < phrases; i++) {
      const yMid = top + i * spacing;

      // baseline
      p.stroke(220);
      p.strokeWeight(1);
      p.line(left, yMid, right, yMid);

      // wave
      p.noFill();
      p.stroke(30);
      p.strokeWeight(3);
      p.beginShape();
      for (let x = 0; x <= usableW; x += 8) {
        const phase = p.map(x, 0, usableW, 0, p.TWO_PI * 2);
        const y = yMid + p.sin(phase) * amp;
        p.vertex(left + x, y);
      }
      p.endShape();

      // moving dot (seconds)
      const dotX = left + t * usableW;
      const dotPhase = p.map(dotX - left, 0, usableW, 0, p.TWO_PI * 2);
      const dotY = yMid + p.sin(dotPhase) * amp;

      p.noStroke();
      p.fill(70, 130, 210);
      p.circle(dotX, dotY, 10);
    }

    // ---- Legend ----
    p.noStroke();
    p.fill(30);
    p.textSize(14);
    p.text(`Hours → dynamics (amplitude): ${hr12}`, 20, H - 60);
    p.text(`Minutes → phrase bars: ${phrases}`, 20, H - 40);
    p.text(`Seconds → dot travel (${sec}s)`, 20, H - 20);
  };

  p.windowResized = function () {
    // fixed size canvas
  };
});

