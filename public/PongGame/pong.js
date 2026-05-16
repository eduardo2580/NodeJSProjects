// Board configuration
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// Game state
let gameRunning = true;
let gamePaused = false;
let gameOverCondition = false;
let frameCount = 0;
let maxScore = 5; // First to reach this score wins

// Player configuration
const playerWidth = 10;
const playerHeight = 50;
const playerSpeed = 3;
const cornerRadius = 2;

let player1 = {
    x: 10,
    y: 0,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

let player2 = {
    x: 0,
    y: 0,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

// Ball configuration
const ballSize = 10;
const ballSpeedIncrease = 1.02; // Ball gets faster each paddle hit

let ball = {
    x: 0,
    y: 0,
    width: ballSize,
    height: ballSize,
    velocityX: 3,
    velocityY: 3,
    baseSpeed: 3
};

let player1Score = 0;
let player2Score = 0;

// Input handling
const keys = {};
let isTouchDevice = false;
let touchActive = { player1: false, player2: false };

window.addEventListener("load", function() {
    initializeGame();
    setupEventListeners();
    detectTouchDevice();
    resizeCanvas();
});

function initializeGame() {
    board = document.getElementById("board");
    resizeCanvas();
    context = board.getContext("2d");
    resetPositions();
    requestAnimationFrame(update);
}

function resizeCanvas() {
    const container = board.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight, 600);
    
    // Calculate scale
    const scale = size / 500;
    boardWidth = 500;
    boardHeight = 500;
    
    board.width = size;
    board.height = size;
    
    // Store scale for canvas drawing
    board.scale = scale;
}

function detectTouchDevice() {
    isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };
    
    if (isTouchDevice()) {
        document.getElementById("touchControls").classList.remove("hidden");
    }
}

function setupEventListeners() {
    // Keyboard events
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    
    // Touch events
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    document.addEventListener("touchend", handleTouchEnd, false);
    
    // Mouse events (for desktop testing)
    document.addEventListener("mousemove", handleMouseMove, false);
    
    // Pause button
    document.getElementById("pauseBtn").addEventListener("click", togglePause);
    
    // Restart button
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    
    // Window resize
    window.addEventListener("resize", () => {
        resizeCanvas();
    });
}

function handleKeyDown(e) {
    keys[e.code] = true;
    
    // Space to pause
    if (e.code === "Space") {
        e.preventDefault();
        togglePause();
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
}

function handleTouchStart(e) {
    if (!isTouchDevice()) return;
    
    for (let touch of e.touches) {
        const rect = board.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        
        if (x < rect.width / 2) {
            touchActive.player1 = true;
        } else {
            touchActive.player2 = true;
        }
    }
}

function handleTouchMove(e) {
    if (!isTouchDevice()) return;
    e.preventDefault();
    
    for (let touch of e.touches) {
        const rect = board.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = ((touch.clientY - rect.top) / rect.height) * boardHeight;
        
        if (x < rect.width / 2) {
            touchActive.player1 = true;
            // Update player1 position based on touch Y
            const targetY = Math.max(0, Math.min(y, boardHeight - playerHeight));
            player1.y = targetY;
        } else {
            touchActive.player2 = true;
            // Update player2 position based on touch Y
            const targetY = Math.max(0, Math.min(y, boardHeight - playerHeight));
            player2.y = targetY;
        }
    }
}

function handleTouchEnd(e) {
    if (e.touches.length === 0) {
        touchActive.player1 = false;
        touchActive.player2 = false;
    } else {
        let hasLeft = false;
        let hasRight = false;
        
        for (let touch of e.touches) {
            const rect = board.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            if (x < rect.width / 2) {
                hasLeft = true;
            } else {
                hasRight = true;
            }
        }
        
        touchActive.player1 = hasLeft;
        touchActive.player2 = hasRight;
    }
}

function handleMouseMove(e) {
    // Only use mouse for touch zone feedback on desktop
    const rect = board.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * boardHeight;
    const x = e.clientX - rect.left;
    
    // Visual feedback for touch zones (optional)
    if (isTouchDevice()) {
        if (x < rect.width / 2 && e.buttons === 1) {
            player1.y = Math.max(0, Math.min(y, boardHeight - playerHeight));
        } else if (x >= rect.width / 2 && e.buttons === 1) {
            player2.y = Math.max(0, Math.min(y, boardHeight - playerHeight));
        }
    }
}

function togglePause() {
    if (!gameOverCondition) {
        gamePaused = !gamePaused;
        const btn = document.getElementById("pauseBtn");
        btn.textContent = gamePaused ? "Resume (Space)" : "Pause (Space)";
        btn.style.background = gamePaused ? "#ff6b6b" : "#00d4ff";
    }
}

function update() {
    requestAnimationFrame(update);
    
    if (!gameRunning || gameOverCondition) return;
    
    if (gamePaused) {
        drawGame();
        return;
    }
    
    // Update player movements
    updatePlayerMovement();
    
    // Update ball
    updateBall();
    
    // Check collisions
    checkCollisions();
    
    // Check game over
    checkGameOver();
    
    // Draw everything
    drawGame();
}

function updatePlayerMovement() {
    // Player 1 keyboard control
    if (keys["KeyW"]) {
        player1.velocityY = -playerSpeed;
    } else if (keys["KeyS"]) {
        player1.velocityY = playerSpeed;
    } else if (!touchActive.player1) {
        player1.velocityY = 0;
    }
    
    // Player 2 keyboard control
    if (keys["ArrowUp"]) {
        player2.velocityY = -playerSpeed;
    } else if (keys["ArrowDown"]) {
        player2.velocityY = playerSpeed;
    } else if (!touchActive.player2) {
        player2.velocityY = 0;
    }
    
    // Apply movement with boundary checking
    const nextPlayer1Y = player1.y + player1.velocityY;
    if (nextPlayer1Y >= 0 && nextPlayer1Y + playerHeight <= boardHeight) {
        player1.y = nextPlayer1Y;
    }
    
    const nextPlayer2Y = player2.y + player2.velocityY;
    if (nextPlayer2Y >= 0 && nextPlayer2Y + playerHeight <= boardHeight) {
        player2.y = nextPlayer2Y;
    }
}

function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // Top and bottom collision
    if (ball.y <= 0 || ball.y + ballSize >= boardHeight) {
        ball.velocityY *= -1;
        
        // Keep ball in bounds
        ball.y = Math.max(0, Math.min(ball.y, boardHeight - ballSize));
    }
}

function checkCollisions() {
    // Player 1 collision
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX = Math.abs(ball.velocityX) * ballSpeedIncrease;
            
            // Add spin based on where ball hits paddle
            const paddleCenter = player1.y + playerHeight / 2;
            const ballCenter = ball.y + ballSize / 2;
            const deltaY = ballCenter - paddleCenter;
            ball.velocityY = (deltaY / (playerHeight / 2)) * ball.velocityX * 0.75;
        }
    }
    
    // Player 2 collision
    if (detectCollision(ball, player2)) {
        if (ball.x + ballSize >= player2.x) {
            ball.velocityX = -Math.abs(ball.velocityX) * ballSpeedIncrease;
            
            // Add spin based on where ball hits paddle
            const paddleCenter = player2.y + playerHeight / 2;
            const ballCenter = ball.y + ballSize / 2;
            const deltaY = ballCenter - paddleCenter;
            ball.velocityY = (deltaY / (playerHeight / 2)) * Math.abs(ball.velocityX) * 0.75;
        }
    }
}

function checkGameOver() {
    if (ball.x < 0) {
        player2Score++;
        updateScoreDisplay();
        
        if (player2Score >= maxScore) {
            endGame("Player 2 Wins!");
        } else {
            resetBall(-1);
        }
    } else if (ball.x + ballSize > boardWidth) {
        player1Score++;
        updateScoreDisplay();
        
        if (player1Score >= maxScore) {
            endGame("Player 1 Wins!");
        } else {
            resetBall(1);
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function endGame(message) {
    gameOverCondition = true;
    document.getElementById("overlayTitle").textContent = message;
    document.getElementById("overlayText").textContent = `Final Score: ${player1Score} - ${player2Score}`;
    document.getElementById("gameOverlay").classList.remove("hidden");
}

function restartGame() {
    player1Score = 0;
    player2Score = 0;
    gameOverCondition = false;
    gamePaused = false;
    
    updateScoreDisplay();
    document.getElementById("gameOverlay").classList.add("hidden");
    document.getElementById("pauseBtn").textContent = "Pause (Space)";
    document.getElementById("pauseBtn").style.background = "#00d4ff";
    
    resetPositions();
}

function resetPositions() {
    player1.y = boardHeight / 2 - playerHeight / 2;
    player1.x = 10;
    
    player2.x = boardWidth - playerWidth - 10;
    player2.y = boardHeight / 2 - playerHeight / 2;
    
    resetBall(1);
}

function resetBall(direction) {
    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;
    ball.velocityX = direction * 3;
    ball.velocityY = (Math.random() - 0.5) * 3;
    ball.baseSpeed = 3;
}

function updateScoreDisplay() {
    document.getElementById("player1-wins").textContent = `Wins: ${player1Score}`;
    document.getElementById("player2-wins").textContent = `Wins: ${player2Score}`;
}

function drawRoundedRect(x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

function drawGame() {
    const scale = board.scale || (board.width / 500);
    
    // Clear canvas
    context.fillStyle = "#0f0f0f";
    context.fillRect(0, 0, board.width, board.height);
    
    // Draw border
    context.strokeStyle = "#00d4ff";
    context.lineWidth = 3;
    context.strokeRect(0, 0, board.width, board.height);
    
    // Draw paddles
    drawRoundedRect(player1.x * scale, player1.y * scale, playerWidth * scale, playerHeight * scale, cornerRadius);
    context.fillStyle = "#00d4ff";
    context.fill();
    
    drawRoundedRect(player2.x * scale, player2.y * scale, playerWidth * scale, playerHeight * scale, cornerRadius);
    context.fillStyle = "#00d4ff";
    context.fill();
    
    // Draw ball
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(
        (ball.x + ballSize / 2) * scale,
        (ball.y + ballSize / 2) * scale,
        (ballSize / 2) * scale,
        0,
        Math.PI * 2
    );
    context.fill();
    
    // Draw center line
    context.strokeStyle = "rgba(0, 212, 255, 0.3)";
    context.lineWidth = 2;
    context.setLineDash([10, 10]);
    context.beginPath();
    context.moveTo(board.width / 2, 0);
    context.lineTo(board.width / 2, board.height);
    context.stroke();
    context.setLineDash([]);
    
    // Draw scores
    context.fillStyle = "#00d4ff";
    context.font = `bold ${40 * scale}px Arial`;
    context.textAlign = "center";
    context.fillText(player1Score, board.width / 4, 60 * scale);
    context.fillText(player2Score, (board.width * 3) / 4, 60 * scale);
    
    // Draw pause indicator
    if (gamePaused) {
        context.fillStyle = "rgba(255, 107, 107, 0.8)";
        context.font = `bold ${32 * scale}px Arial`;
        context.textAlign = "center";
        context.fillText("PAUSED", board.width / 2, board.height / 2);
    }
}