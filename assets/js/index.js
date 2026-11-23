setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 3000);

document.querySelector(".vinyl").addEventListener("click", () => {
  const loader = document.getElementById("invite-loader");
  loader.style.display = "flex";

  setTimeout(() => {
    window.location.href = "Inicio.html";
  }, 1600);
});

const canvas = document.getElementById("leavesCanvas");
const ctx = canvas.getContext("2d");

let w, h, dpr = Math.min(window.devicePixelRatio, 1.5);

function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

/* 🍂 Paletas otoñales */
const leafPalettes = [
  ["#7a2e12", "#c65b28"],
  ["#8a4a1e", "#d38b3a"],
  ["#6e3b1f", "#b86b2d"],
  ["#5c2a14", "#a14f22"]
];

const noteSymbols = ["♪", "♫", "♬", "♩"];

const noteColors = [
  "#f3e6d0",
  "#e8d2a8",
  "#cfa97a",
  "#b48b5a"
];



/* 🍁 FORMAS HOJAS */
function drawLeafShape(type, size, ctx) {
  ctx.beginPath();
  switch (type) {
    case 0:
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.5, -size * 0.3);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.4, size);
      ctx.lineTo(0, size * 0.4);
      ctx.lineTo(-size * 0.4, size);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.5, -size * 0.3);
      break;
    case 1:
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size, -size * 0.6, size, size * 0.4, 0, size);
      ctx.bezierCurveTo(-size, size * 0.4, -size, -size * 0.6, 0, -size);
      break;
    case 2:
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.6, -size * 0.4, size * 0.4, size, 0, size);
      ctx.bezierCurveTo(-size * 0.4, size, -size * 0.6, -size * 0.4, 0, -size);
      break;
    case 3:
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size, 0, size * 0.4, size, 0, size * 0.5);
      ctx.bezierCurveTo(-size * 0.6, size, -size, 0, 0, -size);
  }
  ctx.closePath();
}

/* 🎨 TEXTURAS HOJAS */
function createLeafTexture(type, size, palette) {
  const off = document.createElement("canvas");
  off.width = off.height = size * 4;
  const c = off.getContext("2d");
  c.translate(off.width / 2, off.height / 2);

  const grad = c.createLinearGradient(0, -size, 0, size);
  grad.addColorStop(0, palette[1]);
  grad.addColorStop(1, palette[0]);

  c.fillStyle = grad;
  drawLeafShape(type, size, c);
  c.fill();

  return off;
}

/* 🎵 NOTAS MUSICALES */



/* 🍃 HOJAS */
class Leaf {
  constructor() {
    this.type = Math.floor(Math.random() * 4);
    this.size = 10 + Math.random() * 14;
    this.texture = createLeafTexture(
      this.type,
      this.size,
      leafPalettes[Math.floor(Math.random() * leafPalettes.length)]
    );
    this.reset();
  }

  reset() {
    this.x = Math.random() * w;
    this.y = -100 - Math.random() * h;
    this.speed = 0.6 + Math.random() * 1.2;
    this.swing = 0.5 + Math.random();
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin(this.y * 0.01) * this.swing;
    this.angle += this.spin;
    if (this.y > h + 120) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.texture, -this.texture.width / 2, -this.texture.height / 2);
    ctx.restore();
  }
}

/* 🎶 NOTAS */
/* 🎶 NOTAS (UNICODE, LIGERAS Y ELEGANTES) */
class Note {
  constructor() {
    this.size = 14 + Math.random() * 10;
    this.symbol = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
    this.color = noteColors[Math.floor(Math.random() * noteColors.length)];
    this.reset();
  }

  reset() {
    this.x = Math.random() * w;
    this.y = -80 - Math.random() * h;
    this.speed = 0.35 + Math.random() * 0.7;
    this.swing = 0.25 + Math.random() * 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.01;
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin(this.y * 0.012) * this.swing;
    this.angle += this.spin;
    if (this.y > h + 100) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.85;
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

/* 🔢 CANTIDADES */
const leafCount = window.innerWidth < 768 ? 35 : 55;
const noteCount = window.innerWidth < 768 ? 10 : 18;

const leaves = Array.from({ length: leafCount }, () => new Leaf());
const notes = Array.from({ length: noteCount }, () => new Note());



function animate() {
  ctx.clearRect(0, 0, w, h);
  leaves.forEach(l => { l.update(); l.draw(); });
  notes.forEach(n => { n.update(); n.draw(); });
  requestAnimationFrame(animate);
}
animate();
