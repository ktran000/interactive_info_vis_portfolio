registerSketch('sk5', function (p) {
  let table;
  let plotData = []; // [{decade: 1950, count: 6}, ...]
  let maxCount = 0;
  let maxDecade = null;

  let dominanceStartDecade = 2000; // Big 4 era highlight start (2000s)

  p.preload = function () {
    // CSV must be in the project ROOT (same level as index.html), which you did ✅
    table = p.loadTable("Mens_Tennis_Grand_Slam_Winner.csv", "csv", "header");
  };

  p.setup = function () {
    // Match your p5 editor sizing so the layout looks identical
    p.createCanvas(1080, 1350);
    p.textFont("Arial");

    buildDecadeCounts();

    // Find max for narrative callout
    for (let d of plotData) {
      if (d.count > maxCount) {
        maxCount = d.count;
        maxDecade = d.decade;
      }
    }

    p.noLoop(); // static “image” feel
  };

  function buildDecadeCounts() {
    let decadeSets = {}; // decade -> Set of nationalities

    for (let i = 0; i < table.getRowCount(); i++) {
      let yearStr = table.getString(i, "YEAR");
      let nat = table.getString(i, "WINNER_NATIONALITY");

      if (!yearStr || !nat) continue;

      // Use plain JS parseInt to avoid any "int not defined" issues
      let year = parseInt(yearStr, 10);
      let decade = Math.floor(year / 10) * 10;

      if (!decadeSets[decade]) decadeSets[decade] = new Set();
      decadeSets[decade].add(nat);
    }

    plotData = [];
    for (let d in decadeSets) {
      plotData.push({ decade: parseInt(d, 10), count: decadeSets[d].size });
    }

    plotData.sort((a, b) => a.decade - b.decade);
  }

  p.draw = function () {
    // --- Background “card” ---
    p.background(245); // soft off-white
    p.noStroke();
    p.fill(255);
    p.rect(40, 40, p.width - 80, p.height - 80, 24); // rounded white card

    // --- Title area (story first) ---
    let titleX = 90;
    let titleY = 110;

    p.fill(20);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(46);
    p.text("Grand Slam winners got less diverse", titleX, titleY);

    p.textSize(22);
    p.fill(60);
    p.text(
      "Distinct winner nationalities per decade (men’s singles).",
      titleX,
      titleY + 70
    );

    // --- Big takeaway callout (story) ---
    let last = plotData[plotData.length - 1];
    let peakText = `Peak: ${maxCount} countries (${decadeLabel(maxDecade)})`;
    let nowText = `Now: ${last.count} (${decadeLabel(last.decade)})`;

    let callX = 90, callY = 220, callW = p.width - 180, callH = 120;

    p.noStroke();
    p.fill(235);
    p.rect(callX, callY, callW, callH, 18);

    p.fill(20);
    p.textSize(28);
    p.text(peakText, callX + 24, callY + 20);
    p.text(nowText, callX + 24, callY + 62);

    // --- Narrative sentence ---
    let narrativeX = 90;
    let narrativeY = 370;

    p.fill(180, 30, 30);
    p.textSize(22);
    p.textLeading(28);
    p.text(
      "After the 1990s, diversity declines as a small group of repeat champions dominates Grand Slams.",
      narrativeX,
      narrativeY
    );

    // --- Chart area ---
    let chart = {
      left: 110,
      right: p.width - 110,
      top: 520,
      bottom: p.height - 160,
    };

    drawChart(chart);

    // --- Footer ---
    p.fill(120);
    p.textSize(16);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(
      "Source: Mens_Tennis_Grand_Slam_Winner.csv • Metric: distinct winner nationalities per decade",
      90,
      p.height - 95
    );
  };

  function drawChart(chart) {
    // Compute y range
    let yMax = 0;
    for (let d of plotData) yMax = Math.max(yMax, d.count);

    // Axes
    p.stroke(40);
    p.strokeWeight(2);
    p.line(chart.left, chart.bottom, chart.right, chart.bottom);
    p.line(chart.left, chart.top, chart.left, chart.bottom);

    // Big 4 shaded region
    let domIndex = plotData.findIndex((d) => d.decade === dominanceStartDecade);
    if (domIndex !== -1) {
      let domX = p.map(domIndex, 0, plotData.length - 1, chart.left, chart.right);

      p.noStroke();
      p.fill(70, 130, 255, 90);
      p.rect(domX, chart.top, chart.right - domX, chart.bottom - chart.top, 16);

      // Label box inside region
      let boxPadding = 14;
      let boxX = domX + boxPadding;
      let boxY = chart.top + boxPadding;
      let boxW = (chart.right - domX) - boxPadding * 2;
      let boxH = 86;

      p.fill(255, 255, 255, 210);
      p.noStroke();
      p.rect(boxX, boxY, boxW, boxH, 14);

      p.fill(30);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(18);
      p.textLeading(22);
      p.text(
        "Big 4 era:\nFederer • Nadal • Djokovic • Murray",
        boxX + 12,
        boxY + 10,
        boxW - 24,
        boxH - 20
      );
    }

    // Line
    p.stroke(30, 90, 180);
    p.strokeWeight(5);
    p.noFill();

    p.beginShape();
    for (let i = 0; i < plotData.length; i++) {
      let x = p.map(i, 0, plotData.length - 1, chart.left, chart.right);
      let y = p.map(plotData[i].count, 0, yMax, chart.bottom, chart.top);
      p.vertex(x, y);
    }
    p.endShape();

    // Points
    for (let i = 0; i < plotData.length; i++) {
      let x = p.map(i, 0, plotData.length - 1, chart.left, chart.right);
      let y = p.map(plotData[i].count, 0, yMax, chart.bottom, chart.top);

      p.noStroke();
      p.fill(30, 90, 180);
      p.circle(x, y, 14);
    }

    // X labels
    p.fill(40);
    p.textSize(16);
    p.textAlign(p.CENTER, p.TOP);
    for (let i = 0; i < plotData.length; i++) {
      let x = p.map(i, 0, plotData.length - 1, chart.left, chart.right);
      p.text(decadeLabel(plotData[i].decade), x, chart.bottom + 14);
    }

    // Y label
    p.fill(90);
    p.textSize(16);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Distinct winner nationalities", chart.left, chart.top - 16);

    // Peak callout
    let peakIndex = plotData.findIndex((d) => d.decade === maxDecade);
    if (peakIndex !== -1) {
      let px = p.map(peakIndex, 0, plotData.length - 1, chart.left, chart.right);
      let py = p.map(maxCount, 0, yMax, chart.bottom, chart.top);

      p.stroke(180, 30, 30);
      p.strokeWeight(2);
      p.line(px, py, px + 60, py - 60);

      p.noStroke();
      p.fill(180, 30, 30);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(18);
      p.text(`Peak: ${maxCount}`, px + 66, py - 60);
    }
  }

  function decadeLabel(decade) {
    return `${decade}s`;
  }

  p.windowResized = function () {
  };
});


