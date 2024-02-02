// Source palette: https://twitter.com/AlexCristache/status/1738610343499157872
const colorPalette = {
    Fire: "#AE2F24",
    FireBall: "#BB7169",
    EarthBall: "#737E44",
    Earth: "#1E3414",
    Air: "#EE7223",
    AirBall: "#F39C65",
    WaterBall: "#488ECB",
    Water: "#244766",
};

// Idea for Pong wars: https://twitter.com/nicolasdnl/status/1749715070928433161

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const winner = document.getElementById("winner");
const keysNames = ["Earth", "Water", "Fire", "Air"]

const colors = Object.fromEntries(keysNames.map(k => [k, colorPalette[k]]))
const colorBalls = Object.fromEntries(keysNames.map(k => [k, colorPalette[`${k}Ball`]]))

const SQUARE_SIZE = 20;
const numSquaresX = Math.round(canvas.width / SQUARE_SIZE);
const numSquaresY = Math.round(canvas.height / SQUARE_SIZE);

const valueMin = 0
const valueMax = (numSquaresX * numSquaresY) / 4;
const ScoreMax = Object.fromEntries(keysNames.map(k => [k, valueMin]))
const ScoreMin = Object.fromEntries(keysNames.map(k => [k, valueMax]))

let squares = [];

let speedInput = document.querySelector('input[name="speed"]:checked').value;
const speed = document.getElementById('speed');


// Ball position, velocity and direction
let x1 = canvas.width / 4;
let y1 = canvas.height / 4;
let dx1 = randomNumber(5, 15);
let dy1 = randomNumber(5, 15);

let x2 = (canvas.width / 4) * 3;
let y2 = canvas.height / 4;
let dx2 = randomNumber(5, 15);
let dy2 = randomNumber(5, 15);

let x3 = canvas.width / 4;
let y3 = (canvas.height / 4) * 3;
let dx3 = randomNumber(5, 15);
let dy3 = randomNumber(5, 15);

let x4 = (canvas.width / 4) * 3;
let y4 = (canvas.height / 4) * 3;
let dx4 = randomNumber(5, 15);
let dy4 = randomNumber(5, 15);



//  Function used for speed and direction
function randomNumber(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    var isNegative = Math.random() < 0.5;
    return isNegative ? -num : num;
}

// Function to get the percentage Values
function percentage(x) {
    return Math.round((x * 100) / (numSquaresX * numSquaresY));
}


// Draw of the teams fields
function teamsFields() {
    for (let i = 0; i < numSquaresX; i++) {
        squares[i] = [];
        for (let j = 0; j < numSquaresY; j++) {
            if (i < numSquaresX / 2) {
                squares[i][j] = j < numSquaresY / 2 ? colors.Earth : colors.Air;
            } else {
                squares[i][j] = j < numSquaresY / 2 ? colors.Water : colors.Fire;
            }
        }
    }
}



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

function maxScore(Score) {
    for (key of Object.keys(ScoreMax)) {
        if (Score[key] > ScoreMax[key]) {
            ScoreMax[key] = (Score[key]);
        }
    }
}

function minScore(Score) {
    for (key of Object.keys(ScoreMin)) {
        if (Score[key] < ScoreMin[key]) {
            ScoreMin[key] = (Score[key]);
        }
    }
}

function winnerScore() {
    const maxValue = Math.max(...Object.values(ScoreMax));
    const maxElement = Object.keys(ScoreMax).find(key => ScoreMax[key] === maxValue);
    winner.innerHTML = `<b>${maxElement} with ${percentage(maxValue)}%</b>`;
}

function updateScoreElement() {

    const Score = Object.fromEntries(keysNames.map(k => [k, valueMin]))

    for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {

            // Update Values
            keysNames.map(item => {
                    if (squares[i][j] === colors[item]) {
                        Score[item]++;
                    }
                }
            );

            // Update Scores
            for (key of Object.keys(ScoreMax)) {
                if (Score[key] > ScoreMax[key]) {
                    ScoreMax[key] = (Score[key]);
                }
            }
        }
    }

    for (key of Object.keys(Score)) {
        document.getElementById(String(key)).innerHTML = `${key}: ${percentage(Score[key])}% <small><b>(${percentage(ScoreMax[key])}% Max | ${percentage(ScoreMin[key])}% Min) </b></small>`;
    }

   maxScore(Score);
   minScore(Score);
   winnerScore();
}
function animationSpeed() {
    speed.addEventListener('change', (event) => {
        speedInput = event.target.value;
    });

    window.requestAnimationFrame(() => {
        setTimeout(this.draw.bind(this), (1000 / Number(speedInput)));
    });
}


// Timer

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var hoursLabel = document.getElementById("hours");
var totalSeconds = 0;


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



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSquares();

    drawBall(x1, y1, colorBalls.Earth);
    let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, colors.Earth);
    dx1 = bounce1.dx;
    dy1 = bounce1.dy;

    drawBall(x2, y2, colorBalls.Water);
    let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, colors.Water);
    dx2 = bounce2.dx;
    dy2 = bounce2.dy;

    drawBall(x3, y3, colorBalls.Air);
    let bounce3 = updateSquareAndBounce(x3, y3, dx3, dy3, colors.Air);
    dx3 = bounce3.dx;
    dy3 = bounce3.dy;

    drawBall(x4, y4, colorBalls.Fire);
    let bounce4 = updateSquareAndBounce(x4, y4, dx4, dy4, colors.Fire);
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

    animationSpeed();


}
teamsFields();
requestAnimationFrame(draw);
setTime();
setInterval(setTime, 1000);

