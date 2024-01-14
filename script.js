const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

var gameOver = false;

const ship = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  speed: 10,
};
let obstacles = [];
let score = 0;

let obstacleSpeed = 5 + Math.sqrt(score) / 2;


function drawShip() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function generateObstacle() {
  const obstacleHeight = Math.floor(Math.random() * (canvas.height / 2 - 40)) + 10;
  const obstacle = {
    x: canvas.width,
    y: Math.random() > 0.5 ? 0 : canvas.height - obstacleHeight,
    width: 20,
    height: obstacleHeight,
  };
  obstacles.push(obstacle);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

var movingUp = false;

//spacebar listener
document.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    event.preventDefault();
    movingUp = !movingUp;
  }
});

//on click listener
canvas.addEventListener('click', function(event) {
  event.preventDefault();
  movingUp = !movingUp;
});

//mobile compatibility
canvas.addEventListener('touchstart', function(event) {
  event.preventDefault();
  movingUp = !movingUp;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    if (movingUp && ship.y > 0) {
      ship.y -= ship.speed;
    } else if (!movingUp && ship.y < canvas.height - ship.height) {
      ship.y += ship.speed;
    }

    if (ship.y > canvas.height - ship.height) {
      ship.y = canvas.height - ship.height;
    } else if (ship.y < 0) {
      ship.y = 0;
    }

    if (Math.random() < 0.001 * Math.log2(score)) {
      generateObstacle();
    }

    obstacles.forEach(obstacle => {
      obstacle.x -= obstacleSpeed;
    });

    drawShip();

  
    drawObstacles();
  
    obstacles.forEach(obstacle => {
      if (
        ship.x < obstacle.x + obstacle.width &&
        ship.x + ship.width > obstacle.x &&
        ship.y < obstacle.y + obstacle.height &&
        ship.y + ship.height > obstacle.y
      ) {
        gameOver = true;
        document.addEventListener('keydown', function (event) {
          if (event.code === 'Space') {
            location.reload();
          }
        });
        canvas.addEventListener('click', function(event) {
          location.reload();
        });
        canvas.addEventListener('touchstart', function(event) {
          location.reload();
        });
      }
    });

  } else {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
    ctx.fillText('Score: ' + score, canvas.width / 2 - 60, canvas.height / 2 + 40);
  }
 
  if (!gameOver) score++;

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, canvas.width - 150, 30);

  requestAnimationFrame(gameLoop);
}

gameLoop();