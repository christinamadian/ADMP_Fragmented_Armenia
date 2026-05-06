// establishing variables
let centerX, centerY;
let nodes = [];
let exploded = false;

let baseSpeed = 0.09;

let mapImg, flowerImg, backgroundMapImg;
let fragmentImgs = [];
let introFont;

let activeFragment = null;
let flowerInfoOpen = false;
let messageBubbleAnim = 0;

let explosionDelay = 4000;
let flowerBaseSize = 105;
let flowerHoverSize = 125;

// loads visual assets before the sketch starts
function preload() {
  mapImg = loadImage("assets/mapcenter.png");
  flowerImg = loadImage("assets/Flower.png");
  backgroundMapImg = loadImage("assets/backgroundmap.jpg");
  introFont = loadFont("assets/CormorantGaramond-VariableFont_wght.ttf");

// storing the materials 
// handwritten notes
  fragmentImgs = [
    { img: loadImage("assets/note1.png"), type: "note", description: "" },
    { img: loadImage("assets/note2.png"), type: "note", description: "" },
    { img: loadImage("assets/note3.png"), type: "note", description: "" },
    { img: loadImage("assets/note4.jpeg"), type: "note", description: "" },
    { img: loadImage("assets/note5.jpg"), type: "note", description: "" },
    { img: loadImage("assets/note6.png"), type: "note", description: "" },
    { img: loadImage("assets/note7.png"), type: "note", description: "" },
    { img: loadImage("assets/note8.jpg"), type: "note", description: "" },
    { img: loadImage("assets/note9.jpeg"), type: "note", description: "" },
    { img: loadImage("assets/note10.jpeg"), type: "note", description: "" },
    { img: loadImage("assets/note11.jpg"), type: "note", description: "" },
    { img: loadImage("assets/note12.png"), type: "note", description: "" },
    { img: loadImage("assets/note13.png"), type: "note", description: "" },

    // archive images
    { img: loadImage("assets/archive1.jpeg"), type: "archive", description: "My great-great-great-grandfather and his son in their copper factory. - Tiana Nahhas, Los Angeles, U.S.A." },
    { img: loadImage("assets/archive2.jpeg"), type: "archive", description: "My great-great-great-grandfather in Dikranagerd (now Diyarbakir) in the c.1900s. I saw this colorized shot for the first time at my long-lost cousin's apartment in New York (bonus: you can catch my grandfather's smile reflected in the glass). - Cynthia Nahhas, New York City, U.S.A." },
    { img: loadImage("assets/archive3.jpeg"), type: "archive", description: "My great-grandfather Levon Wanesian, to us known as Leon Nahhas, escaped the genocide at the age of 15. we don't know how, we don't know what he might've gone through on the way, but he made it to Aleppo. At 23, he married Bahyia Nahhas, a Syrian woman whose last name we now carry. Out of fear that the Turkish authorities would identify him as Armenian, my great-grandfather changed his name from Levon to Leon and took his wife's last name instead of her taking his. Artin wanesian, his son and my grandfather, known to me as Antoine Nahhas tried to revive our last name. When filling out the details of his Lebanese passport, my grandfather felt safe enough to put in Wanesian. Unfortunately, having settled in Syria, these documents expired taking the name with it. - Cynthia Nahhas, New York City, U.S.A." },
    { img: loadImage("assets/archive4.jpeg"), type: "archive", description: "A group photo of my grandma Leika and her sister Lellet's Armenian school photo from Massachusettes. - Peri Halajian, New York, U.S.A." },
    { img: loadImage("assets/archive5.png"), type: "archive", description: "The American naturalization photo of my great-aunt, Rose Vartuhe Yeremian. - Peri Halajian, New York, U.S.A." },
    { img: loadImage("assets/archive6.jpeg"), type: "archive", description: "This is a note my father, Levon, once gave me. I never had the chance to ask him what he truly meant by it, and that absence has become part of its meaning. The photograph shows me having coffee with my mom at her kitchen table in Queens, New York. I’m holding the Japanese teacup she treasured, originally given to her by her father, though in our home it always held coffee. Though it came from elsewhere, it became part of our Armenian home, carrying memory across places and generations. The words he left me read: At least once in your life try, not to be late for a final appointment. I have carried that line with me ever since—unanswered and quietly shaped by loss, inheritance, and the distance between where we are and where we come from. It urges me to pay attention to the moments that do not come around again. - Harry B., New York, U.S.A." },
    { img: loadImage("assets/archive7.png"), type: "archive", description: "" },
    { img: loadImage("assets/archive8.png"), type: "archive", description: "" },
    { img: loadImage("assets/archive9.png"), type: "archive", description: "" },
    { img: loadImage("assets/archive10.png"), type: "archive", description: "" },
    { img: loadImage("assets/archive11.png"), type: "archive", description: "" },
    { img: loadImage("assets/archive12.png"), type: "archive", description: "" },

    // map fragments
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

// sets up the canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;

  // starts the timed rupture
  startExplosionTimer();
}

// starts the automatic explosion after a short delay
function startExplosionTimer() {
  setTimeout(() => {
    explodeMap();
  }, explosionDelay);
}

// main draw loop - switches between the initial map and exploded network
function draw() {
  background(10);

  if (!exploded) {
    drawFullScreenMap();
    return;
  }

  drawNetworkBackground();
  drawExplosionNetwork();
  drawCenterFlower();

  if (flowerInfoOpen) {
    drawFlowerInfoBox();
  }

  if (activeFragment) {
    drawExpandedFragment(activeFragment);
  }
}

// map before rupture
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

// background image behind the network after rupture
function drawNetworkBackground() {
  background(10);

  imageMode(CORNER);

  let imgRatio = backgroundMapImg.width / backgroundMapImg.height;
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

  push();
  tint(255, 180); // adds tint
  image(backgroundMapImg, offsetX, offsetY, drawWidth, drawHeight);
  pop();

  push();
  fill(0, 80);
  noStroke();
  rect(0, 0, width, height);
  pop();
}

// checks if the mouse is hovering over the central Forget-Me-Not flower
function isHoveringFlower() {
  let d = dist(mouseX, mouseY, centerX, centerY);
  return d < flowerHoverSize / 2;
}

// enlarges flower on hover
function drawCenterFlower() {
  imageMode(CENTER);

  let flowerSize = isHoveringFlower() ? flowerHoverSize : flowerBaseSize;

  if (isHoveringFlower()) {
    cursor(HAND);
  } else if (!activeFragment) {
    cursor(ARROW);
  }

  image(flowerImg, centerX, centerY, flowerSize, flowerSize);
}

// draws the informational text box opened by clicking the flower
function drawFlowerInfoBox() {
  let boxW = min(580, width * 0.5);
  let boxH = 480;

  let boxX = width / 2 - boxW / 2;
  let boxY = height / 2 - boxH / 2;

  push();

  fill(0, 180);
  noStroke();
  rect(0, 0, width, height);

  fill(0, 230);
  stroke(255, 60);
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 14);

  noStroke();
  fill(245, 240, 230);
  textAlign(CENTER, TOP);

  textFont(introFont);
  textSize(28);
  text("Fragmented Armenia", width / 2, boxY + 20); // header

  // font and font size
  textFont("sans-serif");
  textSize(16);
  textLeading(24);

  // text in the box
  text(
    "This project explores Armenian identity as fragments of inherited memory, lived experience, and continuous movement, shaped by genocide, displacement, and diaspora. Armenians carried fragments of memory rather than land; fragments that continue to circulate and connect through digital networks.\n\nAt the centre of this network is the Armenian ‘Forget-Me-Not’ flower, a symbol of the Armenian Genocide of 1915 that represents remembrance and connects the past, present, and future of the Armenian people.\n\nA special thank you to Garod Collective for facilitating connections within the Armenian diaspora, and to Armenian Joy for generously providing the archival images that preserve these shared memories.\n\nClick through the notes and archived images to trace how identity persists, shifts, and reconnects across the diaspora.",
    boxX + 30,
    boxY + 70,
    boxW - 60,
    boxH - 80
  );

  textSize(12);
  fill(200);
  text("\nclick anywhere to close", width / 2, boxY + boxH - 20);

  pop();
}

// animates and establishes the network lines, map fragments, notes and archives
function drawExplosionNetwork() {
  for (let n of nodes) {
    if (n.t < 1) {
      n.t += baseSpeed * n.speedFactor;
    }

    n.currentX = lerp(centerX, n.targetX, n.t);
    n.currentY = lerp(centerY, n.targetY, n.t);
  }

  for (let n of nodes) {
    let hovering = distToSegment(mouseX, mouseY, centerX, centerY, n.currentX, n.currentY) < 6;

    stroke(hovering ? color(255, 180, 120) : 160);
    strokeWeight(hovering ? 2.5 : 1.2);
    line(centerX, centerY, n.currentX, n.currentY);
  }

  noStroke();

  for (let n of nodes) {
    if (n.type !== "fragment" || !n.img) continue;

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

    drawW += 180;
    drawH += 180;

    image(n.img, n.currentX, n.currentY, drawW, drawH);
  }

  for (let n of nodes) {
    if ((n.type === "fragment") || !n.img) continue;

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

    let jitterX = n.currentX + random(-1.5, 1.5);
    let jitterY = n.currentY + random(-1.5, 1.5);

    image(n.img, jitterX, jitterY, drawW, drawH);
  }
}

// handles mouse interaction with the flower and clickable note/archive nodes
function mousePressed() {
  if (!exploded) return;

  if (isHoveringFlower()) {
    flowerInfoOpen = !flowerInfoOpen;
    activeFragment = null;
    messageBubbleAnim = 0;
    return;
  }

  for (let n of nodes) {
    if (n.type === "fragment") continue;

    let x = n.currentX;
    let y = n.currentY;

    if (dist(mouseX, mouseY, x, y) < n.size * 0.6) {
      if (n.img) {
        activeFragment = n;
        flowerInfoOpen = false;
        messageBubbleAnim = 0;
      }
      return;
    }
  }

  activeFragment = null;
  flowerInfoOpen = false;
  messageBubbleAnim = 0;
}

// creates a node for each uploaded fragment, note, and photo
function explodeMap() {
  exploded = true;
  nodes = [];

  for (let i = 0; i < fragmentImgs.length; i++) {
    let item = fragmentImgs[i];
    let nodeSize;

    if (item.type === "note") {
      nodeSize = random(110, 140);
    } else if (item.type === "archive") {
      nodeSize = random(100, 130);
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
      size: nodeSize,
      currentX: centerX,
      currentY: centerY
    });
  }
}

// expanded view on selected images
function drawExpandedFragment(n) {
  fill(0, 220);
  noStroke();
  rect(0, 0, width, height);

  if (!n.img) return;

  imageMode(CENTER);

  let maxW, maxH, imageY;

  if (n.type === "note") {
    maxW = width * 0.82;
    maxH = height * 0.75;
    imageY = height / 2;
  } else if (n.type === "archive" && !n.description) {
    // archives without text: archive7–archive12
    maxW = width * 0.82;
    maxH = height * 0.78;
    imageY = height / 2;
  } else {
    // archives with description text
    maxW = width * 0.72;
    maxH = height * 0.48;
    imageY = height / 2 - 90;
  }

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

  image(n.img, width / 2, imageY, drawW, drawH);

  if (n.type === "archive" && n.description) {
    let parsed = parseArchiveDescription(n.description);
    messageBubbleAnim = min(messageBubbleAnim + 0.06, 1);

    drawMessageBubble(
      parsed.message,
      parsed.sender,
      width / 2,
      imageY + drawH / 2 + 34,
      min(width * 0.58, 620),
      messageBubbleAnim
    );
  }
}

// separates archive description text from contributor name & location
function parseArchiveDescription(desc) {
  let splitIndex = desc.lastIndexOf(" - ");

  if (splitIndex !== -1) {
    return {
      message: desc.substring(0, splitIndex).trim(),
      sender: desc.substring(splitIndex + 3).trim()
    };
  }

  return {
    message: desc,
    sender: ""
  };
}

// draws archive descriptions as animated message bubbles
function drawMessageBubble(message, sender, cx, topY, maxBubbleWidth, animProgress) {
  push();

  let eased = 1 - pow(1 - animProgress, 3);
  let fadeAlpha = 255 * eased;
  let yOffset = (1 - eased) * 18;

  textFont("sans-serif");
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(17);
  textLeading(24);

  let paddingX = 18;
  let paddingY = 14;
  let tailSize = 12;

  let textBoxW = maxBubbleWidth - paddingX * 2;
  let textBoxH = getWrappedTextHeight(message, textBoxW, 24);

  let bubbleW = textBoxW + paddingX * 2;
  let bubbleH = textBoxH + paddingY * 2;

  let bubbleX = cx - bubbleW / 2;
  let bubbleY = topY + yOffset;

  bubbleX = constrain(bubbleX, 24, width - bubbleW - 24);

 

  drawingContext.shadowBlur = 12 * eased;
  drawingContext.shadowColor = `rgba(0,0,0,${0.25 * eased})`;

  noStroke();
  fill(235, 235, 240, fadeAlpha);
  rect(bubbleX, bubbleY, bubbleW, bubbleH, 22);

  triangle(
    bubbleX + 26, bubbleY + bubbleH - 2,
    bubbleX + 38, bubbleY + bubbleH - 2,
    bubbleX + 30, bubbleY + bubbleH + tailSize
  );

  drawingContext.shadowBlur = 0;

  fill(20, fadeAlpha);
  textSize(17);
  textLeading(24);
  text(
    message,
    bubbleX + paddingX,
    bubbleY + paddingY,
    textBoxW,
    textBoxH + 20
  );

  // sender name & city underneath, aligned to the right
  if (sender) {
    fill(180, fadeAlpha);
    textAlign(RIGHT, TOP);
    textSize(15);
    text(
      sender,
      bubbleX + bubbleW - 10,
      bubbleY + bubbleH + tailSize + 10
    );
  }

  pop();
}

// calculates wrapped text height so the message bubble adapts to the text
function getWrappedTextHeight(str, maxWidth, leadingVal) {
  let words = str.split(" ");
  let line = "";
  let lines = 1;

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = textWidth(testLine);

    if (testWidth > maxWidth && i > 0) {
      lines++;
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  return lines * leadingVal;
}

// calculates how close the mouse is to a network line for hover detection
function distToSegment(px, py, x1, y1, x2, y2) {
  let l2 = dist(x1, y1, x2, y2) ** 2;
  if (l2 === 0) return dist(px, py, x1, y1);

  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = constrain(t, 0, 1);

  let projX = x1 + t * (x2 - x1);
  let projY = y1 + t * (y2 - y1);

  return dist(px, py, projX, projY);
}

// resizes the canvas and recentres the network according to browser window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
