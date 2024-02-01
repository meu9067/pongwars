// Source palette: https://twitter.com/AlexCristache/status/1738610343499157872
const colorPalette = {
    TyLee: "#AE2F24",
    TyLeeBall: "#BB7169",

    IrohBall: "#737E44",
    Iroh: "#1E3414",

    Aang: "#EE7223",
    AangBall: "#F39C65",

    SokaBall: "#488ECB",
    Soka: "#244766",


};

// Idea for Pong wars: https://twitter.com/nicolasdnl/status/1749715070928433161

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreIroh = document.getElementById("iroh");
const scoreAang = document.getElementById("aang");
const scoreTylee = document.getElementById("tylee");
const scoreSoka = document.getElementById("soka");

const IROH_COLOR = colorPalette.Iroh;
const IROH_BALL_COLOR = colorPalette.IrohBall;

const AANG_COLOR = colorPalette.Aang;
const AANG_BALL_COLOR = colorPalette.AangBall;

const SOKA_COLOR = colorPalette.Soka;
const SOKA_BALL_COLOR = colorPalette.SokaBall;

const TYLEE_COLOR = colorPalette.TyLee;
const TYLEE_BALL_COLOR = colorPalette.TyLeeBall;

const SQUARE_SIZE = 20;

const numSquaresX = Math.round(canvas.width / SQUARE_SIZE);
const numSquaresY = Math.round(canvas.height / SQUARE_SIZE);

let squares = [];

let speed = document.querySelector('input[name="speed"]:checked').value;
const speedForm = document.getElementById('speed');


// Draw of the teams fields

for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
        if (i < numSquaresX / 2) {
            squares[i][j] = j < numSquaresY / 2 ? IROH_COLOR : AANG_COLOR;
        } else {
            squares[i][j] = j < numSquaresY / 2 ? SOKA_COLOR : TYLEE_COLOR;
        }
    }
}

// Random Function used for speed and direction
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Ball position, velocity and direction

let x1 = canvas.width / 4;
let y1 = canvas.height / 4;
let dx1 = randomIntFromInterval(5, 15);
let dy1 = randomIntFromInterval(5, 15);

let x2 = (canvas.width / 4) * 3;
let y2 = canvas.height / 4;
let dx2 = randomIntFromInterval(5, 15);
let dy2 = randomIntFromInterval(5, 15);

let x3 = canvas.width / 4;
let y3 = (canvas.height / 4) * 3;
let dx3 = randomIntFromInterval(5, 15);
let dy3 = randomIntFromInterval(5, 15);

let x4 = (canvas.width / 4) * 3;
let y4 = (canvas.height / 4) * 3;
let dx4 = randomIntFromInterval(5, 12.5);
let dy4 = randomIntFromInterval(5, 12.5);


function drawBall(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}


function drawSquares() {
    for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
            ctx.fillStyle = squares[i][j];
            ctx.fillRect(
                i * SQUARE_SIZE,
                j * SQUARE_SIZE,
                SQUARE_SIZE,
                SQUARE_SIZE
            );
        }
    }
}

function updateSquareAndBounce(x, y, dx, dy, color) {
    let updatedDx = dx;
    let updatedDy = dy;

    // Check multiple points around the ball's circumference
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        let checkX = x + Math.cos(angle) * (SQUARE_SIZE / 2);
        let checkY = y + Math.sin(angle) * (SQUARE_SIZE / 2);

        let i = Math.floor(checkX / SQUARE_SIZE);
        let j = Math.floor(checkY / SQUARE_SIZE);

        if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
            if (squares[i][j] !== color) {
                squares[i][j] = color;

                // Determine bounce direction based on the angle
                if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
                    updatedDx = -updatedDx;
                } else {
                    updatedDy = -updatedDy;
                }
            }
        }
    }

    return {dx: updatedDx, dy: updatedDy};
}

function percentage(x){
    return Math.round((x * 100) / (numSquaresX * numSquaresY));
}

let IrohScoreMax = 0;
let SokaScoreMax = 0;
let TyLeeScoreMax = 0;
let AangScoreMax = 0;

function updateScoreElement() {
    let IrohScore = 0;
    let SokaScore = 0;
    let TyLeeScore = 0;
    let AangScore = 0;
    for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
            if (squares[i][j] === IROH_COLOR) {
                IrohScore++;
                if (IrohScore > IrohScoreMax) {
                    IrohScoreMax = IrohScore
                }



            } else if (squares[i][j] === SOKA_COLOR) {
                SokaScore++;
                if (SokaScore >  SokaScoreMax) {
                    SokaScoreMax = SokaScore
                }


            } else if (squares[i][j] === TYLEE_COLOR) {
                TyLeeScore++;
                if (TyLeeScore > TyLeeScoreMax) {
                    TyLeeScoreMax = TyLeeScore
                }


            } else if (squares[i][j] === AANG_COLOR) {
                AangScore++;
                if (AangScore > AangScoreMax) {
                    AangScoreMax = AangScore
                }

            }
        }
    }

    scoreIroh.innerHTML = `Earth: ${percentage(IrohScore)}% <small><b>(${percentage(IrohScoreMax)}% Max) </b></small>`;
    scoreAang.innerHTML = `Air: ${percentage(AangScore)}% <small><b>(${percentage(AangScoreMax)}% Max) </b></small>`;
    scoreTylee.innerHTML = `Fire: ${percentage(TyLeeScore)}% <small><b>(${percentage(TyLeeScoreMax)}% Max) </b></small>`;
    scoreSoka.innerHTML = `Water: ${percentage(AangScore)}% <small><b>(${percentage(AangScoreMax)}% Max) </b></small>`;
    }

function checkBoundaryCollision(x, y, dx, dy) {
    if (x + dx > canvas.width - SQUARE_SIZE / 2 || x + dx < SQUARE_SIZE / 2) {
        dx = -dx;
    }
    if (
        y + dy > canvas.height - SQUARE_SIZE / 2 ||
        y + dy < SQUARE_SIZE / 2
    ) {
        dy = -dy;
    }

    return {dx: dx, dy: dy};
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares();
    //
    drawBall(x1, y1, IROH_BALL_COLOR);
    let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, IROH_COLOR);
    dx1 = bounce1.dx;
    dy1 = bounce1.dy;

    drawBall(x2, y2, SOKA_BALL_COLOR);
    let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, SOKA_COLOR);
    dx2 = bounce2.dx;
    dy2 = bounce2.dy;

    drawBall(x3, y3, AANG_BALL_COLOR);
    let bounce3 = updateSquareAndBounce(x3, y3, dx3, dy3, AANG_COLOR);
    dx3 = bounce3.dx;
    dy3 = bounce3.dy;

    drawBall(x4, y4, TYLEE_BALL_COLOR);
    let bounce4 = updateSquareAndBounce(x4, y4, dx4, dy4, TYLEE_COLOR);
    dx4 = bounce4.dx;
    dy4 = bounce4.dy;

    let boundary1 = checkBoundaryCollision(x1, y1, dx1, dy1);
    dx1 = boundary1.dx;
    dy1 = boundary1.dy;
    x1 += dx1;
    y1 += dy1;


    let boundary2 = checkBoundaryCollision(x2, y2, dx2, dy2);
    dx2 = boundary2.dx;
    dy2 = boundary2.dy;
    x2 += dx2;
    y2 += dy2;
    //
    let boundary3 = checkBoundaryCollision(x3, y3, dx3, dy3);
    dx3 = boundary3.dx;
    dy3 = boundary3.dy;
    x3 += dx3;
    y3 += dy3;
    //
    //
    let boundary4 = checkBoundaryCollision(x4, y4, dx4, dy4);
    dx4 = boundary4.dx;
    dy4 = boundary4.dy;
    x4 += dx4;
    y4 += dy4;


    updateScoreElement();


    // Change the speed of the animation

    speedForm.addEventListener('change', (event) => {
        speed = event.target.value;
    });

    window.requestAnimationFrame(() => {
        setTimeout(this.draw.bind(this), (1000 / Number(speed)));
    });

}

requestAnimationFrame(draw);


// Timer

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var hoursLabel = document.getElementById("hours");

var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
    ++totalSeconds;
    d = Number(totalSeconds);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    secondsLabel.innerHTML = sDisplay;
    minutesLabel.innerHTML = mDisplay;
    hoursLabel.innerHTML = hDisplay;
}

setTime();