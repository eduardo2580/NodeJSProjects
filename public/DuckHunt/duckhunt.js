// Game Configuration
let ducks = [];
let duckCount = 3; // Start with 3 ducks
let duckImageNames = ["duck-left.gif", "duck-right.gif"];
let duckWidth = 96;
let duckHeight = 93;
let duckVelocityX = 3;
let duckVelocityY = 3;

// Game Variables
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight * 0.95;
let score = 0;
let gameActive = true;
let gameTime = 60; // 60 seconds
let misses = 0;
const MAX_MISSES = 5;
const TELEPORT_INTERVAL = 3000; // Ducks teleport randomly every 3 seconds
const HEALTH_PER_DUCK = 3; // Each duck takes 3 shots

// Game state
let ducksDefeated = 0;

window.onload = function() {
    // Update game dimensions on window resize
    window.addEventListener('resize', function() {
        gameWidth = window.innerWidth;
        gameHeight = window.innerHeight * 0.95;
    });

    // Start game
    setTimeout(addDucks, 1000);
    setInterval(moveDucks, 1000/60); // 60 FPS
    setInterval(updateTimer, 1000); // Update timer every second
    setInterval(teleportDucks, TELEPORT_INTERVAL); // Teleport ducks
    
    // Track clicks on empty space (misses)
    document.addEventListener('click', function(e) {
        if (gameActive && e.target.tagName !== 'IMG') {
            registerMiss();
        }
    });
};

function addDucks() {
    if (!gameActive) return;
    
    ducks = [];
    for (let i = 0; i < duckCount; i++) {
        let duckImageName = duckImageNames[Math.floor(Math.random() * 2)];
        let duckImage = document.createElement("img");
        duckImage.src = duckImageName;
        duckImage.width = duckWidth;
        duckImage.height = duckHeight;
        duckImage.draggable = false;
        duckImage.style.position = "absolute";
        
        // Create health bar container
        let healthBarContainer = document.createElement("div");
        healthBarContainer.className = "health-bar-container";
        healthBarContainer.style.position = "absolute";
        
        let healthBar = document.createElement("div");
        healthBar.className = "health-bar";
        healthBar.style.width = "100%";
        healthBarContainer.appendChild(healthBar);
        document.body.appendChild(healthBarContainer);

        // Click handler for ducks
        duckImage.onclick = function(e) {
            e.stopPropagation(); // Prevent registering as miss
            if (!gameActive) return;
            
            let duckShotSound = new Audio("duck-shot.mp3");
            duckShotSound.play();
            
            // Find this duck and damage it
            let duckIndex = ducks.findIndex(d => d.image === this);
            if (duckIndex !== -1) {
                let duck = ducks[duckIndex];
                duck.health -= 1;
                
                // Update health bar
                let healthPercent = (duck.health / HEALTH_PER_DUCK) * 100;
                healthBar.style.width = healthPercent + "%";
                
                if (duck.health <= 0) {
                    // Duck defeated
                    score += 10;
                    ducksDefeated += 1;
                    document.getElementById("score").innerHTML = score;
                    document.body.removeChild(duckImage);
                    document.body.removeChild(healthBarContainer);
                    
                    // Remove from array
                    ducks.splice(duckIndex, 1);
                    
                    if (ducks.length === 0) {
                        // Spawn more ducks
                        duckCount = Math.min(duckCount + 1, 5); // Max 5 ducks
                        setTimeout(addDucks, 2000);
                    }
                }
            }
        };

        document.body.appendChild(duckImage);

        let duck = {
            image: duckImage,
            healthBar: healthBar,
            healthBarContainer: healthBarContainer,
            x: randomPosition(gameWidth - duckWidth),
            y: randomPosition(gameHeight - duckHeight),
            velocityX: (Math.random() > 0.5) ? duckVelocityX : -duckVelocityX,
            velocityY: (Math.random() > 0.5) ? duckVelocityY : -duckVelocityY,
            health: HEALTH_PER_DUCK
        };

        duck.image.style.left = String(duck.x) + "px";
        duck.image.style.top = String(duck.y) + "px";
        
        // Update health bar position
        updateHealthBarPosition(duck);

        ducks.push(duck);
    }
}

function moveDucks() {
    if (!gameActive) return;
    
    for (let i = 0; i < ducks.length; i++) {
        let duck = ducks[i];
        duck.x += duck.velocityX;
        
        // Bounce off walls
        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.x -= duck.velocityX;
            duck.velocityX *= -1;
            
            // Update image direction
            if (duck.velocityX < 0) {
                duck.image.src = duckImageNames[0]; // Left
            } else {
                duck.image.src = duckImageNames[1]; // Right
            }
        }
        
        duck.y += duck.velocityY;
        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.y -= duck.velocityY;
            duck.velocityY *= -1;
        }
        
        duck.image.style.left = String(duck.x) + "px";
        duck.image.style.top = String(duck.y) + "px";
        
        updateHealthBarPosition(duck);
    }
}

function teleportDucks() {
    if (!gameActive) return;
    
    for (let i = 0; i < ducks.length; i++) {
        // Random chance for each duck to teleport
        if (Math.random() > 0.5) {
            let duck = ducks[i];
            duck.x = randomPosition(gameWidth - duckWidth);
            duck.y = randomPosition(gameHeight - duckHeight);
            
            duck.image.style.left = String(duck.x) + "px";
            duck.image.style.top = String(duck.y) + "px";
            
            updateHealthBarPosition(duck);
        }
    }
}

function updateHealthBarPosition(duck) {
    // Position health bar above the duck
    let barX = duck.x + (duckWidth - 50) / 2;
    let barY = duck.y - 15;
    
    duck.healthBarContainer.style.left = String(barX) + "px";
    duck.healthBarContainer.style.top = String(barY) + "px";
}

function registerMiss() {
    if (!gameActive) return;
    
    misses++;
    document.getElementById("misses").innerHTML = misses;
    
    if (misses >= MAX_MISSES) {
        endGame("TOO MANY MISSES!");
    }
}

function updateTimer() {
    if (!gameActive) return;
    
    gameTime--;
    document.getElementById("timer").innerHTML = gameTime;
    
    // Change color as time runs low
    let timerElement = document.getElementById("timer");
    if (gameTime <= 10) {
        timerElement.style.animation = "pulse 0.5s infinite";
    }
    
    if (gameTime <= 0) {
        endGame("TIME'S UP!");
    }
}

function endGame(reason) {
    gameActive = false;
    
    // Hide all ducks
    for (let i = 0; i < ducks.length; i++) {
        document.body.removeChild(ducks[i].image);
        document.body.removeChild(ducks[i].healthBarContainer);
    }
    ducks = [];
    
    // Show game over modal
    let modal = document.getElementById("gameOverModal");
    let title = document.getElementById("gameOverTitle");
    let message = document.getElementById("gameOverMessage");
    let finalScore = document.getElementById("finalScore");
    let defeated = document.getElementById("ducksDefeated");
    
    title.textContent = reason;
    message.textContent = `You ${reason === "TIME'S UP!" ? "ran out of time" : "made too many misses"}!`;
    finalScore.textContent = score;
    defeated.textContent = ducksDefeated;
    
    modal.classList.remove("hidden");
}

function randomPosition(limit) {
    return Math.floor((Math.random() * limit));
}

// Add pulse animation for low time warning
let style = document.createElement('style');
style.innerHTML = `
    @keyframes pulse {
        0%, 100% { text-shadow: 0 0 10px #FF6B6B; }
        50% { text-shadow: 0 0 20px #FF0000; }
    }
`;
document.head.appendChild(style);