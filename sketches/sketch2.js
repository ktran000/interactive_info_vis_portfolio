// sketches/sketch2.js
// Metronome Pendulum Clock (template uses registerSketch)

registerSketch('sk2', function (p) {
  const W = 800;
  const H = 500;

  p.setup = function () {
    p.createCanvas(W, H);
    p.angleMode(p.RADIANS);
    p.textFont("system-ui, -apple-system, Segoe UI, Roboto, sans-serif");
  };

  p.draw = function () {
    p.background(245);

    const hr24 = p.hour();
    const hr12 = ((hr24 % 12) + 12) % 12; // 0..11
    const min = p.minute();
    const sec = p.second();
    const ms = p.millis();

    // Visual "tempo feel" (interactive) — does NOT change time, only the swing speed
    const tempoFeel = p.map(p.mouseX, 0, p.width, 0.6, 1.8);
    const swingSpeed = tempoFeel;

    // Time mappings
    const minuteProgress = (min + sec / 60) / 60; // 0..1

    // Layout
    const cx = p.width * 0.5;
    const cy = p.height * 0.18;
    const rodLen = 260;

    // Title
    p.noStroke();
    p.fill(20);
    p.textSize(18);
    p.text("Metronome Pendulum Clock", 20, 30);

    // Minute ring (progress)
    p.push();
    p.translate(cx, cy);
    p.noFill();
    p.stroke(30);
    p.strokeWeight(10);
    p.arc(0, 0, 240, 240, -p.HALF_PI, -p.HALF_PI + minuteProgress * p.TWO_PI);
    p.stroke(200);
    p.strokeWeight(10);
    p.arc(0, 0, 240, 240, -p.HALF_PI + minuteProgress * p.TWO_PI, -p.HALF_PI + p.TWO_PI);
    p.pop();

    // Pendulum angle: a smooth oscillation
    const swingAmp = p.radians(28);
    const phase = (sec + (ms % 1000) / 1000) * p.TWO_PI * swingSpeed;
    const theta = p.sin(phase) * swingAmp;

    // Tick pulse each second (a subtle flash)
    const pulse = p.pow(1 - ((ms % 1000) / 1000), 4);
    const pulseAlpha = p.map(pulse, 0, 1, 0, 130);

    // Draw metronome body
    p.push();
    p.translate(cx, cy + 310);

    // Base
    p.noStroke();
    p.fill(230);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 320, 120, 18);

    // Metronome housing
    p.fill(235);
    p.rect(0, -150, 240, 300, 22);

    // A small pulse glow
    p.fill(50, 140, 220, pulseAlpha);
    p.rect(0, -150, 240, 300, 22);

    p.pop();

    // Draw pivot + rod + weight
    p.push();
    p.translate(cx, cy);

    // Pivot
    p.noStroke();
    p.fill(30);
    p.circle(0, 0, 10);

    // Rod
    p.stroke(30);
    p.strokeWeight(6);
    const x2 = p.sin(theta) * rodLen;
    const y2 = p.cos(theta) * rodLen;
    p.line(0, 0, x2, y2);

    // Weight position encodes hours
    const hourProgress = hr12 / 12;
    const weightT = 0.25 + 0.55 * hourProgress;
    const wx = p.sin(theta) * rodLen * weightT;
    const wy = p.cos(theta) * rodLen * weightT;

    p.noStroke();
    p.fill(30);
    p.rectMode(p.CENTER);
    p.rect(wx, wy, 44, 30, 8);

    // Small seconds marker at the tip
    p.fill(80);
    p.circle(x2, y2, 12);

    p.pop();

    // Readout (minimal legend)
    p.noStroke();
    p.fill(30);
    p.textSize(14);
    p.text(`Hours → weight height (current: ${hr12 === 0 ? 12 : hr12})`, 20, H - 60);
    p.text(`Minutes → ring progress (${min}m)`, 20, H - 40);
    p.text(`Seconds → swing + tick pulse (${sec}s)`, 20, H - 20);

    // Small tempo hint
    p.fill(80);
    p.textSize(12);
    p.text(`Move mouse horizontally to change visual "tempo feel"`, W - 290, 30);
  };

  // keep the template happy on resize
  p.windowResized = function () {
    // optional: keep fixed size, or uncomment next line to adapt
    // p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});

