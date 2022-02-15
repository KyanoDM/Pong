var canvas;
var canvasContext;
var ballX = 750;
var ballY = 384;
var ballSpeedX = 10;
var ballSpeedY = 0;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 0;
var paddle2Y = 0;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 200;

var bottem = 768;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
		location.reload();
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 60;
	setInterval(function() {
			moveEverything();
			drawEverything();	
		}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
		document.getElementById("humanScore").innerHTML = 0;
		document.getElementById("botScore").innerHTML = 0;
}

function ballReset() {
	if(player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {

		showingWinScreen = true;

	}
	ballSpeedY = 0;
	ballSpeedX = 10;
	if(player2Score >= player1Score) {
		ballSpeedX = -ballSpeedX;
	}
	
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}
function ballSpawn() {
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = 10;
 	ballSpeedY = 4;
}

function computerMovement() {
	if(paddle2Y <= 0) {
		paddle2Y = 0;
    }
	if(paddle2Y >= 576) {
		paddle2Y = 576;
	}

	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2) + 5;
	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 15;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 15;
	}
}
function moveEverything() {
	if(showingWinScreen) {
		return;
	}
	computerMovement();
	
	if(paddle1Y <= 0) {
		paddle1Y = 0;
    }
	if(paddle1Y >= 576) {
		paddle1Y = 576;
	}
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX < 30) {
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY
					-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.25;
		} else {
			player2Score++; // must be BEFORE ballReset()
            document.getElementById("botScore").innerHTML = player2Score;

			ballReset();
		}
	}
	if(ballX > canvas.width - 30) {
		if(ballY > paddle2Y &&
			ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY
					-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.20;
		} else {
			player1Score++; // must be BEFORE ballReset()
            document.getElementById("humanScore").innerHTML = player1Score;
			ballReset();	
		}
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'#0b0b0f');

	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Player Won", canvas.width/2, 200);
			ballSpawn;
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Bot Won", canvas.width/2, 200);
		}

		canvasContext.fillText("click to continue", canvas.width/2, 500);
		return;
	}

	drawNet();

	// this is left player paddle
	colorRect(10,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS - 10,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// next line draws the ball
	
	var img = new Image(); 
	var div = document.getElementById('x'); 
	
	
	img.onload = function() { 
 
 
}; 
 
 
img.src = 'image.jpg'; 
	colorCircle(ballX, ballY, 10, 'white');
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}

function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}