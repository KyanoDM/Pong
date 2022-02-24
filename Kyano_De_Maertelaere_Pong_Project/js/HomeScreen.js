var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 7;
var ballSpeedY = 1;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var paddle1Y = 0;
var paddle2Y = 0;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 80;


window.onload = function() {
	canvas = document.getElementById('homeCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 60;
	setInterval(function() {
			moveEverything();
			drawEverything();	
		}, 1000/framesPerSecond);
		window.alert("Gebruik Fullscreen voor de beste ervaring!");
}

function computerMovement() {
	var paddle1YCenter = paddle1Y + (PADDLE_HEIGHT/2);
	if(paddle1YCenter < ballY - 35) {
		paddle1Y = paddle1Y + 7;
	} else if(paddle1YCenter > ballY + 35) {
		paddle1Y = paddle1Y - 7;
	}
}
function computerMovement2() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 7;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 7;
	}
}

function moveEverything() {
	computerMovement();
    computerMovement2();
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX < 30) {
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY
					-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.12;
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
			ballSpeedY = deltaY * 0.12;
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
	drawNet();

	// this is left player paddle
	colorRect(10,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS - 10,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	// next line draws the ball
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
