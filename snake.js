/**
 * Small snake game inspired by a lot of cool projects!!!
 *
 * author: Thomas Goepfert
 *
 */

const board = document.getElementById('board');
const context = board.getContext('2d');
const scoreText = document.getElementById('scoreText');
const resetBtn = document.getElementById('resetBtn');
const gameWidth = board.getAttribute('width');
const gameHeight = board.getAttribute('height');
const snakeColor = 'Lime'; // https://htmlcolorcodes.com/color-names/
const snakeBorder = 'black';
const foodColor = 'Red';
const unitSize = 25;
let gameID = 0;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [];
let wrap = true;

/**
 * Setup the game
 */
const setup = () => {
  score = 0;
  scoreText.textContent = score;
  createFood();
  drawFood();
  createSnake();
  drawSnake();
};

/**
 * The draw loop
 */
const draw = () => {
  if (running) {
    gameID = setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      draw();
    }, 75);
  } else {
    displayGameOver();
  }
};

/**
 * Draws an empty board
 */
const clearBoard = () => {
  context.fillStyle = getComputedStyle(board).getPropertyValue('--boardBackground');
  console.log(gameWidth, gameHeight);
  context.fillRect(0, 0, gameWidth, gameHeight);
};

/**
 * Yes, it draws the food
 */
const drawFood = () => {
  context.fillStyle = foodColor;
  context.fillRect(foodX, foodY, unitSize, unitSize);
};

/**
 * Move the snake depending on it's current direction
 * Checks if snake has eaten (head overlaps with food)
 */
const moveSnake = () => {
  let newX = snake[0].x + xVelocity;
  let newY = snake[0].y + yVelocity;

  if (wrap) {
    switch (true) {
      case newX < 0:
        newX = gameWidth - unitSize;
        break;
      case newX >= gameWidth:
        newX = 0;
        break;
      case newY < 0:
        newY = gameHeight - unitSize;
        break;
      case newY >= gameHeight:
        newY = 0;
        break;
    }
  }

  const newHead = { x: newX, y: newY };

  snake.unshift(newHead);

  // jummy or not
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score++;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
};

/**
 * Yes, draw da snake!
 */
const drawSnake = () => {
  context.fillStyle = snakeColor;
  context.strokeStyle = snakeBorder;

  snake.forEach((snakepart) => {
    context.fillRect(snakepart.x, snakepart.y, unitSize, unitSize);
    context.strokeRect(snakepart.x, snakepart.y, unitSize, unitSize);
  });
};

/**
 * Checks if snake is still on the board and has not bite itself
 */
const checkGameOver = () => {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
    default:
      // nothing to do
      break;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      running = false;
    }
  }

  if (!running) {
    clearTimeout(gameID);
  }
};

/**
 * Obtain new random position of the food
 */
const createFood = () => {
  function randomFood(min, max) {
    return Math.round((Math.random() * (max - min + min)) / unitSize) * unitSize;
  }

  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);

  // Snakes body may overlap with the new food position
  // In this case: simply try again
  snake.forEach((snakepart) => {
    if (snakepart.x == foodX && snakepart.y == foodY) {
      console.log('try again');
      createFood();
    }
  });
};

/**
 * Change snake's direction if arrow key is pressed
 */
const changeDirection = (event) => {
  const keyPressed = event.keyCode;

  const LEFT = 37;
  const RIGHT = 39;
  const UP = 38;
  const DOWN = 40;

  const movingUp = yVelocity == -unitSize;
  const movingDown = yVelocity == unitSize;
  const movingLeft = xVelocity == -unitSize;
  const movingRight = xVelocity == unitSize;

  switch (true) {
    case keyPressed == LEFT && !movingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == RIGHT && !movingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !movingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == DOWN && !movingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
    default:
      // nothing to do
      break;
  }
};

/**
 * Display Game Over text
 * Enables Restart Button
 */
const displayGameOver = () => {
  context.font = '50px MV Boli';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.fillText('Game Over', gameWidth / 2, gameHeight / 2);
  resetBtn.innerHTML = 'Restart';
  resetBtn.classList.remove('disabled'); // would love to just disable the button, but then it also disables keydown somehow ... :(
};

/**
 * Creates/Resets the snake to defined length, position and direction
 */
const createSnake = () => {
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize * 1, y: 0 },
    { x: 0, y: 0 },
  ];

  xVelocity = unitSize;
  yVelocity = 0;
};

/**
 * Start a fresh game
 * Block Start/Restart Button
 */
const restartGame = () => {
  running = true;
  resetBtn.classList.add('disabled');
  setup();
  draw();
};

setup();

window.addEventListener('keydown', changeDirection, true);
resetBtn.addEventListener('click', restartGame);
