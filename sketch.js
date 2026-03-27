let centerX, centerY;
let nodes = [];
let exploded = false;

let baseSpeed = 0.02;

let mapImg, flowerImg;
let fragmentImgs = [];

let activeFragment = null;

function preload() {
  mapImg = loadImage("assets/map_center.png");
  flowerImg = loadImage("assets/Flower.png");

  fragmentImgs = [
    { img: loadImage("assets/note1.png"), type: "note", description: "" },
    { img: loadImage("assets/note2.png"), type: "note", description: "" },
    { img: loadImage("assets/note3.png"), type: "note", description: "" },

    { img: loadImage("assets/archive1.png"), type: "archive", description: "Short description for archive 1." },
    { img: loadImage("assets/archive2.png"), type: "archive", description: "Short description for archive 2." },
    { img: loadImage("assets/archive3.png"), type: "archive", description: "Short description for archive 3." },
    { img: loadImage("assets/archive4.png"), type: "archive", description: "A group photo of my grandma Leika and her sister Lellet's Armenian school photo from Massachusettes. - Peri Halajian, New York, U.S.A." },
    { img: loadImage("assets/archive5.png"), type: "archive", description: "The American naturalization photo of my great-aunt, Rose Vartuhe Yeremian. - Peri Halajian, New York, U.S.A." },
    { img: loadImage("assets/archive6.png"), type: "archive", description: "This is a note my father, Levon, once gave me. I never had the chance to ask him what he truly meant by it, and that absence has become part of its meaning. The photograph shows me having coffee with my mom at her kitchen table in Queens, New York. I’m holding the Japanese teacup she treasured, originally given to her by her father, though in our home it always held coffee. Though it came from elsewhere, it became part of our Armenian home, carrying memory across places and generations. The words he left me read: At least once in your life try, not to be late for a final appointment. I have carried that line with me ever since—unanswered and quietly shaped by loss, inheritance, and the distance between where we are and where we come from. It urges me to pay attention to the moments that do not come around again. - Harry B., New York, U.S.A." },

    { img: loadImage("assets/fragment1.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment2.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment3.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment4.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment5.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment6.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment7.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment8.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment9.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment10.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment11.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment12.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment13.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment14.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment15.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment16.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment17.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment18.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment19.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment20.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment21.png"), type: "fragment", description: "" },
    { img: loadImage("assets/fragment22.png"), type: "fragment", description: "" }
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(10);

  if (!exploded) {
    drawFullScreenMap();
    drawInstruction();
    return;
  }

  background(10);
  drawExplosionNetwork();
  drawCenterFlower();

  if (activeFragment) {
    drawExpandedFragment(activeFragment);
  }
}

function drawInstruction() {
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("click to fragment", width / 2, height - 40);
}

function drawFullScreenMap() {
  imageMode(CORNER);

  let imgRatio = mapImg.width / mapImg.height;
  let canvasRatio = width / height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = width;
    drawHeight = width / imgRatio;
    offsetX = 0;
    offsetY = (height - drawHeight) / 2;
  }

  image(mapImg, offsetX, offsetY, drawWidth, drawHeight);
}

function drawCenterFlower() {
  imageMode(CENTER);
  image(flowerImg, centerX, centerY, 90, 90);
}

function drawExplosionNetwork() {
  for (let n of nodes) {
    if (n.t < 1) {
      n.t += baseSpeed * n.speedFactor;
    }

    let x = lerp(centerX, n.targetX, n.t);
    let y = lerp(centerY, n.targetY, n.t);

    let hovering = distToSegment(mouseX, mouseY, centerX, centerY, x, y) < 6;

    stroke(hovering ? color(255, 180, 120) : 160);
    strokeWeight(hovering ? 2.5 : 1.2);
    line(centerX, centerY, x, y);

    noStroke();

    if (n.img) {
      imageMode(CENTER);

      let aspect = n.img.width / n.img.height;
      let drawW, drawH;

      if (aspect >= 1) {
        drawW = n.size;
        drawH = n.size / aspect;
      } else {
        drawH = n.size;
        drawW = n.size * aspect;
      }

      image(n.img, x, y, drawW, drawH);
    } else {
      fill(220);
      ellipse(x, y, 18, 18);
    }
  }
}

function mousePressed() {
  if (!exploded) {
    explodeMap();
    return;
  }

  for (let n of nodes) {
    let x = lerp(centerX, n.targetX, n.t);
    let y = lerp(centerY, n.targetY, n.t);

    if (dist(mouseX, mouseY, x, y) < n.size / 2) {
      if (n.img) {
        activeFragment = n;
      }
      return;
    }
  }

  activeFragment = null;
}

function explodeMap() {
  exploded = true;
  nodes = [];

  for (let i = 0; i < fragmentImgs.length; i++) {
    let item = fragmentImgs[i];

    let nodeSize;

    if (item.type === "note") {
      nodeSize = random(85, 110);
    } else if (item.type === "archive") {
      nodeSize = random(75, 100);
    } else {
      nodeSize = random(55, 80);
    }

    nodes.push({
      targetX: random(80, width - 80),
      targetY: random(80, height - 80),
      t: 0,
      speedFactor: random(0.6, 1.4),
      img: item.img,
      type: item.type,
      description: item.description,
      size: nodeSize
    });
  }
}

function drawExpandedFragment(n) {
  fill(0, 220);
  noStroke();
  rect(0, 0, width, height);

  if (n.img) {
    imageMode(CENTER);

    let maxW = width * 0.75;
    let maxH = height * 0.6;
    let aspect = n.img.width / n.img.height;

    let drawW, drawH;

    if (aspect >= 1) {
      drawW = maxW;
      drawH = maxW / aspect;

      if (drawH > maxH) {
        drawH = maxH;
        drawW = maxH * aspect;
      }
    } else {
      drawH = maxH;
      drawW = maxH * aspect;

      if (drawW > maxW) {
        drawW = maxW;
        drawH = maxW / aspect;
      }
    }

    image(n.img, width / 2, height / 2 - 30, drawW, drawH);

    if (n.type === "archive" && n.description) {
      fill(255);
      textAlign(CENTER, TOP);
      textSize(18);
      textLeading(26);

      let textBoxWidth = width * 0.65;
      text(
        n.description,
        width / 2 - textBoxWidth / 2,
        height / 2 + drawH / 2,
        textBoxWidth,
        200
      );
    }
  }
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let l2 = dist(x1, y1, x2, y2) ** 2;
  if (l2 === 0) return dist(px, py, x1, y1);

  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = constrain(t, 0, 1);

  let projX = x1 + t * (x2 - x1);
  let projY = y1 + t * (y2 - y1);

  return dist(px, py, projX, projY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}