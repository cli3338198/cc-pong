const target = document.getElementById("target");

/**
 * createElement: create element with classname
 * @param {string} element - valid htmll element
 * @param {string[]} classnames - list of classnames
 * @returns {HTMLElement}
 */
function createElement(element, classnames) {
  const newHTMLElement = document.createElement(element);
  classnames.forEach((classname) => newHTMLElement.classList.add(classname));
  return newHTMLElement;
}

// Step 1: Draw the table

let pongTable;
let centerLine;

/**
 * createPongTable: create a pong table
 */
function createPongTable() {
  pongTable = createElement("div", ["pong-table"]);
  centerLine = createElement("div", ["center-line"]);

  pongTable.appendChild(centerLine);

  target.appendChild(pongTable);
}

// Step 2: Create paddles

let leftPaddle;
let rightPaddle;
let rightPaddleDirection = 0; // 0: stationary, -1: moving up: 1: moving down
const rightPaddleSpeed = 5;

/**
 * createPaddles: create paddles
 */
function createPaddles() {
  leftPaddle = createElement("div", ["paddle", "left-paddle"]);
  rightPaddle = createElement("div", ["paddle", "right-paddle"]);

  pongTable.appendChild(leftPaddle);
  pongTable.appendChild(rightPaddle);
}

/**
 * handleKeyDown: event listener for keydown
 * @param {*} event
 */
function handleKeyDown(event) {
  if (event.key === "ArrowUp") {
    rightPaddleDirection = -1;
  } else if (event.key === "ArrowDown") {
    rightPaddleDirection = 1;
  }
}

/**
 * handleKeyUp: event listener for keyup
 * @param {*} event
 */
function handleKeyUp(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    rightPaddleDirection = 0;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

/**
 * updatePaddle: update game based on paddle position
 */
function updatePaddle() {
  const currentTop = rightPaddle.offsetTop;
  const newTop = currentTop + rightPaddleDirection * rightPaddleSpeed;

  if (
    newTop >= 0 &&
    newTop + rightPaddle.clientHeight <= pongTable.clientHeight
  ) {
    rightPaddle.style.top = newTop + "px";
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  // The window.requestAnimationFrame() method tells the browser you wish to perform
  // an animation. It requests the browser to call a user-supplied callback
  // function before the next repaint.
  requestAnimationFrame(updatePaddle);
}

// Step 3: Create the ball

//  1. At the start of play (beginning of the game and after every point), the ball
// will appear at a random point on the central line and move towards a random player
// at a random angle from the horizontal.
//  2. When the ball collides with the top or bottom of the screen/pitch it will
// bounce off, but continue moving in the same horizontal direction.
//  3. When the ball collides with the left or right edge of the screen/pitch a
// point is scored against the player whose side it is and play restarts at 1.
//  4. When the ball collides with a player’s paddle it changes horizontal direction.

let ball;
const ballSpeed = 5;

function createBall() {
  ball = createElement("div", ["ball"]);

  const maxTop = pongTable.clientHeight - ball.clientHeight;
  const newTop = Math.floor(Math.random() * maxTop);
  ball.style.top = newTop + "px";

  const ballAngle = Math.random() * 2 * Math.PI;
  const ballVelocityX = ballSpeed * Math.cos(ballAngle);
  const ballVelocityY = ballSpeed * Math.sin(ballAngle);
  ball.velocity = { x: ballVelocityX, y: ballVelocityY };

  pongTable.appendChild(ball);
}

/**
 * moveBall: Move the ball
 */
function moveBall() {
  const ball = document.querySelector(".ball");
  const leftPaddle = document.querySelector(".left-paddle");
  const rightPaddle = document.querySelector(".right-paddle");

  const leftPaddleRect = leftPaddle.getBoundingClientRect();
  const rightPaddleRect = rightPaddle.getBoundingClientRect();

  const currentTop = ball.offsetTop;
  const currentLeft = ball.offsetLeft;
  const { x: velocityX, y: velocityY } = ball.velocity;

  const newTop = currentTop + velocityY;
  const newLeft = currentLeft + velocityX;

  // ball touches top or bottom walls
  if (newTop <= 0 || newTop + ball.clientHeight >= pongTable.clientHeight) {
    ball.velocity.y *= -1;
  }

  // ball touches left paddle
  if (
    newLeft <= leftPaddleRect.right &&
    newTop + ball.clientHeight >= leftPaddleRect.top &&
    newTop <= leftPaddleRect.bottom
  ) {
    ball.velocity.x *= -1;
  }

  // ball touches right paddle
  if (
    newLeft + ball.clientWidth >= rightPaddleRect.left &&
    newTop + ball.clientHeight >= rightPaddleRect.top &&
    newTop <= rightPaddleRect.bottom
  ) {
    ball.velocity.x *= -1;
  }

  // ball touches left or right walls
  if (newLeft <= 0 || newLeft + ball.clientWidth >= pongTable.clientWidth) {
    // add score: TODO:
    return resetBall();
  }

  ball.style.top = newTop + "px";
  ball.style.left = newLeft + "px";
}

/**
 * resetBall: Reset the ball
 */
function resetBall() {
  ball.remove();
  createBall();
}

function startGame() {
  createPongTable();
  createPaddles();
  updatePaddle();
  createBall();
  gameLoop();

  function gameLoop() {
    moveBall();
    requestAnimationFrame(gameLoop);
  }
}

startGame();
