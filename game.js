import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.165.0/examples/jsm/controls/OrbitControls.js";

const boardData = [
  { name: "Salida", type: "corner" },
  { name: "Mediterráneo", type: "property", price: 60, rent: 8, color: 0x8b4513 },
  { name: "Comunidad", type: "event" },
  { name: "Báltica", type: "property", price: 60, rent: 10, color: 0x8b4513 },
  { name: "Impuesto", type: "tax", amount: 100 },
  { name: "Reading RR", type: "property", price: 200, rent: 24, color: 0xffffff },
  { name: "Oriental", type: "property", price: 100, rent: 12, color: 0x8fd3ff },
  { name: "Suerte", type: "event" },
  { name: "Vermont", type: "property", price: 100, rent: 12, color: 0x8fd3ff },
  { name: "Connecticut", type: "property", price: 120, rent: 14, color: 0x8fd3ff },
  { name: "Cárcel", type: "corner" },
  { name: "St. Charles", type: "property", price: 140, rent: 16, color: 0xd38dff },
  { name: "Electric Co.", type: "property", price: 150, rent: 18, color: 0xffffff },
  { name: "States", type: "property", price: 140, rent: 16, color: 0xd38dff },
  { name: "Virginia", type: "property", price: 160, rent: 18, color: 0xd38dff },
  { name: "Penn RR", type: "property", price: 200, rent: 24, color: 0xffffff },
  { name: "St. James", type: "property", price: 180, rent: 20, color: 0xff965e },
  { name: "Comunidad", type: "event" },
  { name: "Tennessee", type: "property", price: 180, rent: 20, color: 0xff965e },
  { name: "New York", type: "property", price: 200, rent: 22, color: 0xff965e },
  { name: "Parking", type: "corner" },
  { name: "Kentucky", type: "property", price: 220, rent: 24, color: 0xff5555 },
  { name: "Suerte", type: "event" },
  { name: "Indiana", type: "property", price: 220, rent: 24, color: 0xff5555 },
  { name: "Illinois", type: "property", price: 240, rent: 26, color: 0xff5555 },
  { name: "B&O RR", type: "property", price: 200, rent: 24, color: 0xffffff },
  { name: "Atlantic", type: "property", price: 260, rent: 28, color: 0xfff878 },
  { name: "Ventnor", type: "property", price: 260, rent: 28, color: 0xfff878 },
  { name: "Water Works", type: "property", price: 150, rent: 18, color: 0xffffff },
  { name: "Marvin", type: "property", price: 280, rent: 30, color: 0xfff878 },
  { name: "Ir a cárcel", type: "corner" },
  { name: "Pacific", type: "property", price: 300, rent: 32, color: 0x42e695 },
  { name: "N Carolina", type: "property", price: 300, rent: 32, color: 0x42e695 },
  { name: "Comunidad", type: "event" },
  { name: "Pennsylvania", type: "property", price: 320, rent: 34, color: 0x42e695 },
  { name: "Short Line", type: "property", price: 200, rent: 24, color: 0xffffff },
  { name: "Suerte", type: "event" },
  { name: "Park Place", type: "property", price: 350, rent: 40, color: 0x4789ff },
  { name: "Impuesto lujo", type: "tax", amount: 100 },
  { name: "Boardwalk", type: "property", price: 400, rent: 48, color: 0x4789ff }
];

const config = {
  startMoney: 1500,
  passGoMoney: 200,
  jailIndex: 10,
  goToJailIndex: 30
};

const ui = {
  setup: document.getElementById("setup"),
  controls: document.getElementById("controls"),
  playerCount: document.getElementById("playerCount"),
  startBtn: document.getElementById("startBtn"),
  rollBtn: document.getElementById("rollBtn"),
  buyBtn: document.getElementById("buyBtn"),
  endBtn: document.getElementById("endBtn"),
  diceText: document.getElementById("diceText"),
  log: document.getElementById("log"),
  turnText: document.getElementById("turnText"),
  canvas: document.getElementById("boardCanvas")
};

const game = {
  players: [],
  currentPlayer: 0,
  started: false,
  diceRolled: false,
  pendingProperty: null
};

const tokenColors = [0xff4d4d, 0x4d7dff, 0xf2f24d, 0x8eff6e];
let scene;
let camera;
let renderer;
let controls;
let tileMeshes = [];

setupThree();
animate();
bindEvents();

function setupThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1020);

  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 22, 20);

  renderer = new THREE.WebGLRenderer({ canvas: ui.canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.target.set(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.7);
  directional.position.set(12, 20, 8);
  scene.add(directional);

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(28, 1, 28),
    new THREE.MeshStandardMaterial({ color: 0x16324f })
  );
  table.position.y = -0.6;
  scene.add(table);

  createBoard();
  onResize();
  window.addEventListener("resize", onResize);
}

function createBoard() {
  const positions = computeBoardPositions(40, 11.5, 2.3);

  boardData.forEach((tile, i) => {
    const isCorner = i % 10 === 0;
    const width = isCorner ? 2.3 : 2.3;
    const depth = isCorner ? 2.3 : 1.5;

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.35, depth),
      new THREE.MeshStandardMaterial({ color: tile.color ?? 0xededed })
    );
    mesh.position.set(positions[i].x, 0, positions[i].z);
    mesh.rotation.y = positions[i].rotation;
    scene.add(mesh);

    tileMeshes.push(mesh);
  });

  const center = new THREE.Mesh(
    new THREE.PlaneGeometry(17, 17),
    new THREE.MeshStandardMaterial({ color: 0x10243f })
  );
  center.rotation.x = -Math.PI / 2;
  center.position.y = 0.01;
  scene.add(center);
}

function computeBoardPositions(size, half, step) {
  const positions = [];

  for (let i = 0; i < size; i += 1) {
    if (i <= 10) {
      positions.push({ x: half - i * step, z: half, rotation: 0 });
    } else if (i <= 20) {
      positions.push({ x: -half, z: half - (i - 10) * step, rotation: Math.PI / 2 });
    } else if (i <= 30) {
      positions.push({ x: -half + (i - 20) * step, z: -half, rotation: Math.PI });
    } else {
      positions.push({ x: half, z: -half + (i - 30) * step, rotation: -Math.PI / 2 });
    }
  }

  return positions;
}

function bindEvents() {
  ui.startBtn.addEventListener("click", startGame);
  ui.rollBtn.addEventListener("click", handleRollDice);
  ui.buyBtn.addEventListener("click", handleBuyProperty);
  ui.endBtn.addEventListener("click", endTurn);
}

function startGame() {
  const count = Number(ui.playerCount.value);
  game.players = Array.from({ length: count }, (_, i) => createPlayer(i));
  game.currentPlayer = 0;
  game.started = true;
  game.diceRolled = false;

  ui.setup.classList.add("hidden");
  ui.controls.classList.remove("hidden");

  log(`Partida iniciada con ${count} jugadores.`);
  updateUI();
  refreshTokenPositions();
}

function createPlayer(index) {
  const token = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 24, 24),
    new THREE.MeshStandardMaterial({ color: tokenColors[index] })
  );
  token.position.y = 0.6;
  scene.add(token);

  return {
    name: `Jugador ${index + 1}`,
    money: config.startMoney,
    position: 0,
    properties: [],
    bankrupt: false,
    token
  };
}

function handleRollDice() {
  if (!game.started || game.diceRolled) return;

  const player = game.players[game.currentPlayer];
  if (player.bankrupt) return;

  const die1 = 1 + Math.floor(Math.random() * 6);
  const die2 = 1 + Math.floor(Math.random() * 6);
  const move = die1 + die2;

  ui.diceText.textContent = `Dados: ${die1} + ${die2} = ${move}`;

  const oldPos = player.position;
  player.position = (player.position + move) % 40;
  if (oldPos + move >= 40) {
    player.money += config.passGoMoney;
    log(`${player.name} pasó por Salida y cobra $${config.passGoMoney}.`);
  }

  applyTileEffect(player);
  game.diceRolled = true;
  ui.rollBtn.disabled = true;
  ui.endBtn.disabled = false;

  refreshTokenPositions();
  updateUI();
  eliminateIfBankrupt(player);
}

function applyTileEffect(player) {
  const tile = boardData[player.position];
  log(`${player.name} cae en ${tile.name}.`);

  if (player.position === config.goToJailIndex) {
    player.position = config.jailIndex;
    log(`${player.name} va directo a la cárcel.`);
    return;
  }

  if (tile.type === "tax") {
    pay(player, tile.amount);
    log(`${player.name} paga impuesto de $${tile.amount}.`);
    return;
  }

  if (tile.type === "event") {
    applyRandomEvent(player);
    return;
  }

  if (tile.type !== "property") {
    return;
  }

  const owner = findOwner(player.position);
  if (!owner) {
    game.pendingProperty = player.position;
    ui.buyBtn.disabled = player.money < tile.price;
    log(`Propiedad libre por $${tile.price}. Puedes comprarla.`);
    return;
  }

  if (owner !== player) {
    pay(player, tile.rent);
    owner.money += tile.rent;
    log(`${player.name} paga $${tile.rent} de renta a ${owner.name}.`);
  }
}

function applyRandomEvent(player) {
  const events = [
    { text: "Cobras dividendos", amount: 100 },
    { text: "Pagas reparación", amount: -80 },
    { text: "Heredas dinero", amount: 150 },
    { text: "Multa municipal", amount: -120 }
  ];
  const e = events[Math.floor(Math.random() * events.length)];
  player.money += e.amount;
  log(`${player.name}: ${e.text} (${e.amount >= 0 ? "+" : ""}$${e.amount}).`);
}

function handleBuyProperty() {
  if (game.pendingProperty === null) return;
  const player = game.players[game.currentPlayer];
  const index = game.pendingProperty;
  const tile = boardData[index];

  if (player.money < tile.price) return;

  player.money -= tile.price;
  player.properties.push(index);
  game.pendingProperty = null;
  ui.buyBtn.disabled = true;

  highlightOwnedTile(index, player);
  log(`${player.name} compra ${tile.name} por $${tile.price}.`);
  updateUI();
}

function highlightOwnedTile(index, owner) {
  tileMeshes[index].material = new THREE.MeshStandardMaterial({
    color: tokenColors[game.players.indexOf(owner)]
  });
}

function endTurn() {
  if (!game.started || !game.diceRolled) return;

  game.pendingProperty = null;
  ui.buyBtn.disabled = true;

  do {
    game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
  } while (game.players[game.currentPlayer].bankrupt && activePlayers() > 1);

  game.diceRolled = false;
  ui.rollBtn.disabled = false;
  ui.endBtn.disabled = true;
  ui.diceText.textContent = "Dados: -";

  checkWinner();
  updateUI();
}

function pay(player, amount) {
  player.money -= amount;
}

function findOwner(tileIndex) {
  return game.players.find((p) => p.properties.includes(tileIndex) && !p.bankrupt);
}

function eliminateIfBankrupt(player) {
  if (player.money >= 0 || player.bankrupt) return;

  player.bankrupt = true;
  player.properties = [];
  player.token.visible = false;
  log(`💥 ${player.name} se declara en bancarrota.`);
}

function activePlayers() {
  return game.players.filter((p) => !p.bankrupt).length;
}

function checkWinner() {
  if (activePlayers() !== 1) return;

  const winner = game.players.find((p) => !p.bankrupt);
  log(`🏆 ${winner.name} gana la partida con $${winner.money}.`);
  ui.rollBtn.disabled = true;
  ui.endBtn.disabled = true;
  ui.buyBtn.disabled = true;
}

function refreshTokenPositions() {
  if (!game.players.length) return;

  const positions = computeBoardPositions(40, 11.5, 2.3);
  game.players.forEach((player, idx) => {
    const base = positions[player.position];
    const offsetX = ((idx % 2) - 0.5) * 0.55;
    const offsetZ = (Math.floor(idx / 2) - 0.5) * 0.55;
    player.token.position.set(base.x + offsetX, 0.65, base.z + offsetZ);
  });
}

function updateUI() {
  const player = game.players[game.currentPlayer];
  if (!player) return;

  ui.turnText.innerHTML = `${player.name} · Dinero: <strong>$${player.money}</strong><br/>Propiedades: ${player.properties.length}`;
}

function log(message) {
  const p = document.createElement("p");
  p.textContent = message;
  ui.log.prepend(p);
}

function onResize() {
  const rect = ui.canvas.getBoundingClientRect();
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height, false);
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
