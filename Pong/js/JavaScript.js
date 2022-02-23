var canvas;
var canvasContext;
var ballX = 750;
var ballY = 384;
var ballSpeedX = 8;
var ballSpeedY = 0;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;
var showingWinScreen = false;
var paddle1Y = 0;
var paddle2Y = 0;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
var interval = 50;
var audio = new Audio('../vid/point.wav');

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
    location.reload();
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 60;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
  document.getElementById("humanScore").innerHTML = 0;
  document.getElementById("botScore").innerHTML = 0;
};

function ballReset() {
  audio.play();
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedY = 0;
  ballSpeedX = 10;
  if (player2Score >= player1Score) {
    ballSpeedX = -ballSpeedX;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  console.log(paddle1Y);
  if (paddle2Y <= 0) {
    paddle2Y = 0;
  }
  if (paddle2Y >= 661) {
    paddle2Y = 661;
  }

  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 15;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 15;
  }
}
function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  
  computerMovement();
  //paddle can't go off screen
  if (paddle1Y <= 0) {
    paddle1Y = 0;
  }
  if (paddle1Y >= 661) {
    paddle1Y = 661;
  }

 
 
 

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  //speeds up ball when balls hits lower or higher part of the paddle
  if (ballX < 30) {
    if (ballY > paddle1Y - 10 && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be BEFORE ballReset()
      document.getElementById("botScore").innerHTML = player2Score;

      ballReset();
    }
  }
  //speeds up ball when balls hits lower or higher part of the paddle
  if (ballX > canvas.width - 30) {
    if (ballY > paddle2Y - 10 && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be BEFORE ballReset()
      document.getElementById("humanScore").innerHTML = player1Score;
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}
//draws the net
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    drawNet.className = "drawNet";
    colorRect(canvas.width / 2, i, 2, 100, "white");
  }
}

function drawEverything() {
  // next line blanks out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, "#0b0b0f");

  //winscreen text
  var c = document.getElementById("gameCanvas");
  var ctx = c.getContext("2d");
  ctx.font = "50px Georgia";

  if (showingWinScreen) {
    clearInterval(particleInterval);
    canvasContext.fillStyle = "white";
    font = "30px Verdana";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Player Won", canvas.width / 2 - 125, 200);
      canvasContext.fillText("click to continue", canvas.width / 2 - 185, 500);
      document.getElementById("humanScore").innerHTML = player1Score;
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Bot Won", canvas.width / 2 - 125, 200);
      canvasContext.fillText("click to continue", canvas.width / 2 - 185, 500);
    }
    return;
  }
  
  

  drawNet();

  // this is left player paddle
  colorRect(10, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // this is right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS - 10,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  // next line draws the ball
  var img = new Image();
  img.src = "img/fireball.png";
  var div = document.getElementById("x");

  //reload to set score
  img.onload = function () {
    // particles;
  };
  // ball
  drawBall(ballX, ballY, 20);
}
//paints the ball
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function drawBall(centerX, centerY, radius) {
  var img = new Image();
  img.src = "img/fireball.png";
  // get the ball diameter
  var diameter = radius * 2;
  canvasContext.drawImage(
    img,
    // the region of clipping from the img
    0,
    0,
    img.width,
    img.height,
    // the region of drawing the ball on the canvas
    centerX - radius,
    centerY - radius,
    diameter,
    diameter
  );
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

let particleInterval = setInterval(() => {
  if (ballSpeedX >= 0) {
    coordsParticle = 185;
  } else {
    coordsParticle = 235;
  }
  
  if (ballSpeedY > 10 || ballSpeedY < -10) {
    interval = 25;
  } else {
    interval = 50;
  }
  //create a new element (particle)
  let newParticle = document.createElement("span");

  newParticle.className = "particle";

  //set the particles position on screen

  newParticle.style.left = ballX + coordsParticle;
  newParticle.style.top = ballY + 105;

  //set the particles animation (set up the animation in your css file, make sure the name of the animation matches)
  newParticle.style.animation = "fade-out 1s ease";

  //add the particle to the page
  document.getElementsByTagName("content")[0].appendChild(newParticle);

  //remove the particle from the page after the animation ends (notice that the timeout and the animation duration are both 1 seconds
  setTimeout(() => {
    newParticle.remove();
  }, 300);

  //set how many milliseconds the interval should wait before adding another particle (set to 25 milliseconds, but you can change it)
}, interval);
