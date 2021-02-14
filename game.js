const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

//!Defining Draw Functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "45px fantasy";
  ctx.fillText(text, x, y);
}

function drawNet() {
  for (let i = 1; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}
//!Objects

const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "cyan",
  score: 0,
};
const com = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "lightgreen",
  score: 0,
};

const net = {
  x: canvas.width / 2 - 2 / 2,
  y: 0,
  width: 2,
  height: 10,
  color: "white",
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  color: "red",
  speed: 5,
  velocityX: 5,
  velocityY: 5,
};
//! Major  Functions
function render() {
  drawRect(0, 0, canvas.width, canvas.height, "black");
  drawText(user.score, canvas.width / 4, canvas.height / 5, "cyan");
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5, "lightgreen");
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.right = p.x + p.width;
  p.left = p.x;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.right = b.x + b.radius;
  b.left = b.x - b.radius;

  return (
    b.right > p.left && b.left < p.right && b.bottom > p.top && b.top < p.bottom
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x < canvas.width / 2 ? user : com;
  //? check for collision and perform deflection
  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / player.height / 2;

    let angleRad = collidePoint * (Math.PI / 4);
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.2;
  }
  //? update scores
  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}

//! controls
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
}
//! simple AI to control com paddle
function moveComPaddle() {
  let computerLevel = 0.02;
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
}

//!check for win
function checkWin() {
  if (user.score === 10) {
    alert("You Won");
  } else if (com.score === 10) {
    alert("You Lose");
  }
}
//! Main Function
function game() {
  update();
  render();
  moveComPaddle();
  checkWin();
}
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
game();
