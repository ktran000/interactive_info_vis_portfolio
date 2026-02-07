// sketches/sketch3.js
// Sheet Music Progress Clock (registerSketch template)

registerSketch('sk3', function (p) {
  const W = 800;
  const H = 520;

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont("system-ui, -apple-system, Segoe UI, Roboto, sans-serif");
  };

  p.draw = function () {
    p.background(252);

    const hr12 = ((p.hour() % 12) + 12) % 12 || 12;
    const min = p.minute();
    const sec = p.second();
    const ms = p.millis();

    // Minutes progress across the whole page
    const minuteProgress = (min + sec / 60) / 60; // 0..1

    // Seconds drive a playhead; treat every 4 seconds like a "measure"
    const t = sec + (ms % 1000) / 1000;
    const measureProgress = (t % 4) / 4; // 0..1

    // Layout for the "sheet"
    const margin = 40;
    const sheetX = margin;
    const sheetY = 70;
    const sheetW = W - margin * 2;
    const sheetH = H - 140;

    // Title
    p.noStroke();
    p.fill(20);
    p.textSize(18);
    p.text("Sheet Music Progress Clock", 20, 30);

    // Sheet background
    p.fill(245);
    p.stroke(220);
    p.strokeWeight(2);
    p.rect(sheetX, sheetY, sheetW, sheetH, 18);

    // Staff lines (6 staves, 5 lines each)
    p.stroke(190);
    p.strokeWeight(1);
    const staffCount = 6;
    for (let s = 0; s < staffCount; s++) {
      const yBase = sheetY + 50 + s * 70;
      for (let i = 0; i < 5; i++) {
        const y = yBase + i * 8;
        p.line(sheetX + 30, y, sheetX + sheetW - 30, y);
      }
    }

    // Measures across the page (minutes fill across measures)
    const measures = 12;
    const gap = 8;
    const usableW = sheetW - 80;
    const measureW = (usableW - gap * (measures - 1)) / measures;
    const startX = sheetX + 40;
    const topY = sheetY + 40;
    const bottomY = sheetY + sheetH - 40;

    const filledMeasuresFloat = minuteProgress * measures;
    const filledMeasures = Math.floor(filledMeasuresFloat);
    const partialFill = filledMeasuresFloat - filledMeasures;

    for (let i = 0; i < measures; i++) {
      const x = startX + i * (measureW + gap);

      // Measure boundary
      p.noFill();
      p.stroke(210);
      p.strokeWeight(2);
      p.rect(x, topY, measureW, bottomY - topY, 8);

      // Fill (minutes)
      let fillAmt = 0;
      if (i < filledMeasures) fillAmt = 1;
      else if (i === filledMeasures) fillAmt = partialFill;

      if (fillAmt > 0) {
        p.noStroke();
        p.fill(60, 120, 210, 90);
        p.rect(
          x,
          topY + (1 - fillAmt) * (bottomY - topY),
          measureW,
          fillAmt * (bottomY - topY),
          8
        );
      }
    }

    // Seconds playhead inside the current measure
    const currentMeasureIndex = p.constrain(filledMeasures, 0, measures - 1);
    const mx = startX + currentMeasureIndex * (measureW + gap);
    const playX = mx + measureProgress * measureW;

    p.stroke(30);
    p.strokeWeight(3);
    p.line(playX, topY, playX, bottomY);

    // Small bouncing "note"
    const bounce = p.sin(t * p.TWO_PI) * 10;
    p.noStroke();
    p.fill(30);
    p.circle(playX, sheetY + 45 + bounce, 10);

    // Hours as page number
    p.noStroke();
    p.fill(20);
    p.textSize(14);
    p.text(`Page ${hr12}`, sheetX + sheetW - 85, sheetY + 35);

    // Minimal legend
    p.fill(40);
    p.textSize(14);
    p.text(`Minutes → fill across measures (${min}m)`, 20, H - 60);
    p.text(`Seconds → playhead motion (${sec}s)`, 20, H - 40);
    p.text(`Hours → page number (${hr12})`, 20, H - 20);
  };

  p.windowResized = function () {
    // keep fixed size
  };
});

