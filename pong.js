// Selctor Canvas
const canvas = document.querySelector("#pong");
const ctx = canvas.getContext("2d");
// Game Variables ==========================
const COM_LEVEL = 0.1;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 20;
const BALL_START_SPEED = 0.5;
const BALL_DELTA_SPEED = 0.1;
// Game Objects ==========================
const net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: "#59CE8F",
};
const player = {
  x: 0,
  y: canvas.height / 2 - PLAYER_HEIGHT / 2,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  color: "#3AB0FF",
  score: 0,
};
const cumputer = {
  x: canvas.width - PLAYER_WIDTH,
  y: canvas.height / 2 - PLAYER_HEIGHT / 2,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  color: "#FF1E00",
  score: 0,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: BALL_START_SPEED,
  velocityX: 5,
  velocityY: 5,
  color: "#3AB0FF",
};
// Draw Shapes & Text Function ===========
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

drawRect(0, 0, canvas.clientWidth, canvas.clientHeight, "black");

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.fill();
}
drawCircle(100, 100, 50, "WHITE");
function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "45px fantasy";
  ctx.fillText(text, x, y);
}
// drawText('Korsat X Parmaga', 200, 300, 'WHITE');
function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

// Redraw Canvas ===========

function render() {
  //  Clear The Canvas
  drawRect(0, 0, canvas.clientWidth, canvas.clientHeight, "#E8F9FD");

  // Draw the Net
  drawNet();
  //   Draw Score
  drawText(player.score, canvas.width / 4.5, canvas.height / 5, "#59CE8F");
  drawText(
    cumputer.score,
    (3 * canvas.width) / 4,
    canvas.height / 5,
    "#59CE8F"
  );

  //   Draw The Player & Cumputer
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(
    cumputer.x,
    cumputer.y,
    cumputer.width,
    cumputer.height,
    cumputer.color
  );
  // draw The Ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
// Check Collision
function collision(b, p) {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return (
    b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
  );
}
// Reset Ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = BALL_START_SPEED;
  ball.velocityX = -ball.velocityX;
}
// Player Movment
canvas.addEventListener("mousemove", (e) => {
  if (paused) return;
  let rect = canvas.getBoundingClientRect();

  player.y = e.clientY - rect.top - player.height / 2;
});
function lerp(a, b, t) {
  return a + (b - a) * t; // t = 0 (a), t = 1 (b)
}
// Update Pos, Mov, Score .......================
let paused = false;
function update() {
  if (paused) return;
  // Ball Movment
  ball.x += ball.velocityX * ball.speed;
  ball.y += ball.velocityY * ball.speed;

  // Ball Collision With Top & Bottom Borders
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  // Ball Collision With Players
  // Which Player
  let SelectedPlayer = ball.x < canvas.width / 2 ? player : cumputer;
  if (collision(ball, SelectedPlayer)) {
    ball.velocityX = -ball.velocityX;
    // Every Time Ball Hits A Player, Ve Incerease it's Speed
    ball.speed += BALL_DELTA_SPEED;
  }
  // Computer Movement (Simple AI)
  let targetPos = ball.y - cumputer.height / 2;
  let currentPos = cumputer.y;
  cumputer.y = lerp(currentPos, targetPos, COM_LEVEL);

  // Update Score
  if (ball.x - ball.radius < 0) {
    //  Increase Computer Score
    cumputer.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    //  Increase Player Score
    player.score++;
    resetBall();
  }
}
// Game Init ********************
function game() {
  update();
  render();
}
// Loop
const FPS = 60;
setInterval(game, 1000 / FPS);
const pauseBtn = document.querySelector("#pause");
pauseBtn.addEventListener("click", () => {
  if (pauseBtn.innerHTML === "Resume") {
    pauseBtn.innerHTML = "Paused";
    paused = false;
  } else {
    pauseBtn.innerHTML = "Resume";
    paused = true;
  }
});
