const board = document.getElementById("board");
const scoreLabel = document.getElementById("scoreLabel");
const levelLabel = document.getElementById("levelLabel");
const statusMessage = document.getElementById("statusMessage");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let context;
let boardWidth = 500;
let boardHeight = 500;

const playerWidth = 80;
const playerHeight = 10;
const playerVelocityX = 10;
const ballWidth = 10;
const ballHeight = 10;
const initialBallSpeedX = 3;
const initialBallSpeedY = 2;
const blockColumns = 8;
const blockHeight = 12;
const blockY = 45;
const blockPadding = 10;
const blockMargin = 15;
const blockMaxRows = 10;
const touchButtonSpeed = 6;

let player;
let ball;
let blockArray = [];
let blockWidth = 50;
let blockRows = 3;
let blockCount = 0;
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;
let activeButton = null;
let messageTimer = null;

window.addEventListener("load", init);
window.addEventListener("resize", resizeBoard);

function init() {
    context = board.getContext("2d");
    resizeBoard();
    resetGame();
    createBlocks();
    update();

    document.addEventListener("keydown", handleKeyboard);
    board.addEventListener("pointermove", handlePointerMove);
    board.addEventListener("pointerdown", handlePointerDown);
    board.addEventListener("pointerup", stopTouch);
    board.addEventListener("pointerleave", stopTouch);

    leftBtn.addEventListener("pointerdown", () => activeButton = "left");
    rightBtn.addEventListener("pointerdown", () => activeButton = "right");
    leftBtn.addEventListener("pointerup", stopTouch);
    rightBtn.addEventListener("pointerup", stopTouch);
    leftBtn.addEventListener("pointercancel", stopTouch);
    rightBtn.addEventListener("pointercancel", stopTouch);

    setMessage("Use arrow keys, drag on the board, or tap the buttons to move.");
}

function resizeBoard() {
    const hudHeight = document.querySelector(".hud").offsetHeight;
    const controlsHeight = document.querySelector(".touch-controls").offsetHeight;
    const topBottomPadding = 24 + 24; // page padding + some spacing
    const maxHeight = window.innerHeight - hudHeight - controlsHeight - topBottomPadding;
    const maxWidth = window.innerWidth - 24;
    const newSize = Math.floor(Math.min(maxWidth, maxHeight, 900));
    boardWidth = Math.max(320, newSize);
    boardHeight = boardWidth;
    board.width = boardWidth;
    board.height = boardHeight;

    if (player) {
        player.y = boardHeight - playerHeight - 5;
        clampPlayer();
    }

    blockWidth = Math.floor((boardWidth - blockMargin * 2 - (blockColumns - 1) * blockPadding) / blockColumns);
    if (blockWidth < 30) {
        blockWidth = 30;
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    if (activeButton === "left") {
        movePlayer(-touchButtonSpeed);
    } else if (activeButton === "right") {
        movePlayer(touchButtonSpeed);
    }

    context.clearRect(0, 0, board.width, board.height);

    drawBlocks();
    drawPlayer();
    moveBall();
    drawBall();
    drawHud();
}

function drawPlayer() {
    context.fillStyle = "#72f59d";
    context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    context.fillStyle = "#ffffff";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function drawBlocks() {
    const colors = ["#f25c54", "#febf63", "#63ace5", "#8d93ab", "#a2d5c6"];
    for (let block of blockArray) {
        if (!block.break) {
            context.fillStyle = block.color || colors[block.row % colors.length];
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }
}

function moveBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (detectCollision(ball, player)) {
        ball.y = player.y - ball.height;
        ball.velocityY = -Math.abs(ball.velocityY);
        const hitPosition = (ball.x + ball.width / 2) - (player.x + player.width / 2);
        ball.velocityX = hitPosition * 0.14;
        if (Math.abs(ball.velocityX) < 2) {
            ball.velocityX = ball.velocityX >= 0 ? 2 : -2;
        }
        setMessage("Nice hit! Keep going.", 1400);
    }

    if (ball.y <= 0) {
        ball.y = 0;
        ball.velocityY *= -1;
    }

    if (ball.x <= 0) {
        ball.x = 0;
        ball.velocityX *= -1;
    } else if (ball.x + ball.width >= boardWidth) {
        ball.x = boardWidth - ball.width;
        ball.velocityX *= -1;
    }

    if (ball.y + ball.height >= boardHeight) {
        lives -= 1;
        if (lives > 0) {
            setMessage(`Life lost! ${lives} ${lives === 1 ? "life" : "lives"} remaining.`, 1800);
            resetBall();
        } else {
            endGame();
        }
    }

    for (let block of blockArray) {
        if (block.break) {
            continue;
        }

        if (detectCollision(ball, block)) {
            block.break = true;
            blockCount -= 1;
            score += 100;

            const overlapX = (ball.x + ball.width / 2) - (block.x + block.width / 2);
            const overlapY = (ball.y + ball.height / 2) - (block.y + block.height / 2);
            if (Math.abs(overlapX) > Math.abs(overlapY)) {
                ball.velocityX *= -1;
            } else {
                ball.velocityY *= -1;
            }
            break;
        }
    }

    if (blockCount === 0) {
        score += blockRows * blockColumns * 50;
        level += 1;
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        resetBall(true);
        createBlocks();
        setMessage(`Level ${level} reached!`, 2000);
    }
}

const livesLabel = document.getElementById("livesLabel");

function drawHud() {
    scoreLabel.textContent = `Score: ${score}`;
    levelLabel.textContent = `Level: ${level}`;
    livesLabel.textContent = `Lives: ${lives}`;
}

function handleKeyboard(event) {
    if (gameOver && event.code === "Space") {
        resetGame();
        return;
    }
    if (event.code === "ArrowLeft") {
        movePlayer(-player.velocityX);
    } else if (event.code === "ArrowRight") {
        movePlayer(player.velocityX);
    }
}

function handlePointerMove(event) {
    if (gameOver || !event.isPrimary) {
        return;
    }

    const rect = board.getBoundingClientRect();
    const scaleX = board.width / rect.width;
    const pointerX = (event.clientX - rect.left) * scaleX;
    player.x = pointerX - player.width / 2;
    clampPlayer();
}

function handlePointerDown(event) {
    if (!event.isPrimary) {
        return;
    }
    if (gameOver) {
        resetGame();
        return;
    }
    handlePointerMove(event);
}

function stopTouch() {
    activeButton = null;
}

function movePlayer(deltaX) {
    player.x += deltaX;
    clampPlayer();
}

function movePlayerTo(xPosition) {
    player.x = xPosition;
    clampPlayer();
}

function clampPlayer() {
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > boardWidth) {
        player.x = boardWidth - player.width;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function createBlocks() {
    blockArray = [];
    for (let row = 0; row < blockRows; row++) {
        for (let col = 0; col < blockColumns; col++) {
            const block = {
                x: blockMargin + col * (blockWidth + blockPadding),
                y: blockY + row * (blockHeight + blockPadding),
                width: blockWidth,
                height: blockHeight,
                break: false,
                row
            };
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetBall(preserveLevel = false) {
    if (!preserveLevel) {
        score = 0;
        lives = 3;
        level = 1;
        blockRows = 3;
        createBlocks();
    }

    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    };

    ball = {
        x: boardWidth / 2 - ballWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: initialBallSpeedX + (level - 1) * 0.4,
        velocityY: initialBallSpeedY + (level - 1) * 0.35
    };

    gameOver = false;
    setMessage("Tap or use the controls to play.", 2200);
}

function endGame() {
    gameOver = true;
    setMessage("Game Over! Press Space or tap the board to restart.");
}

function setMessage(text, duration = 0) {
    statusMessage.textContent = text;
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    if (duration > 0) {
        messageTimer = setTimeout(() => {
            if (statusMessage.textContent === text) {
                statusMessage.textContent = "";
            }
        }, duration);
    }
}

function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    blockRows = 3;
    gameOver = false;
    resetBall(true);
    createBlocks();
    setMessage("Game restarted. Good luck!", 2200);
}

