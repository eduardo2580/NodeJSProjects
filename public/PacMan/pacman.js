//board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount*tileSize;
const boardHeight = rowCount*tileSize;
let context;

let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X.       X       .X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X.               .X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const powerPellets = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']; //up down left right
let score = 0;
let lives = 3;
let gameOver = false;
let powerMode = false;
let powerTicks = 0;
const powerDuration = 120;
let touchStartX = null;
let touchStartY = null;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    loadImages();
    loadMap();
    // console.log(walls.size)
    // console.log(foods.size)
    // console.log(ghosts.size)
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random()*4)];
        ghost.updateDirection(newDirection);
    }
    update();
    document.addEventListener("keyup", movePacman);
    board.addEventListener("touchstart", handleTouchStart, { passive: true });
    board.addEventListener("touchend", handleTouchEnd, { passive: true });
}

function loadImages() {
    wallImage = new Image();
    wallImage.src = "./wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueGhost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeGhost.png"
    pinkGhostImage = new Image()
    pinkGhostImage.src = "./pinkGhost.png";
    redGhostImage = new Image()
    redGhostImage.src = "./redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./pacmanUp.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "./pacmanDown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./pacmanLeft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./pacmanRight.png";
}

function loadMap() {
    walls.clear();
    foods.clear();
    powerPellets.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c*tileSize;
            const y = r*tileSize;

            if (tileMapChar == 'X') { //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);  
            }
            else if (tileMapChar == 'b') { //blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') { //orange ghost
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') { //pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') { //red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') { //pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') { //empty is food
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
            else if (tileMapChar == '.') { //power pellet
                const pellet = new Block(null, x + 12, y + 12, 8, 8);
                powerPellets.add(pellet);
            }
        }
    }
}

function update() {
    if (gameOver) {
        return;
    }
    move();
    draw();
    setTimeout(update, 50); //1000/50 = 20 FPS
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
        if (powerMode) {
            context.fillStyle = "rgba(0, 128, 255, 0.35)";
            context.fillRect(ghost.x, ghost.y, ghost.width, ghost.height);
        }
    }
    
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    context.fillStyle = "yellow";
    for (let pellet of powerPellets.values()) {
        context.beginPath();
        context.arc(pellet.x + pellet.width/2, pellet.y + pellet.height/2, 4, 0, Math.PI*2);
        context.fill();
    }

    //score
    context.fillStyle = "white";
    context.font="14px sans-serif";
    if (gameOver) {
        context.fillText("Game Over: " + String(score), tileSize/2, tileSize/2);
    }
    else {
        context.fillText("x" + String(lives) + " " + String(score), tileSize/2, tileSize/2);
    }
}

function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    //check wall collisions
    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    wrapEntity(pacman);

    //check power pellet collision
    let pelletEaten = null;
    for (let pellet of powerPellets.values()) {
        if (collision(pacman, pellet)) {
            pelletEaten = pellet;
            powerMode = true;
            powerTicks = powerDuration;
            score += 50;
            break;
        }
    }
    if (pelletEaten) {
        powerPellets.delete(pelletEaten);
    }

    if (powerMode) {
        powerTicks -= 1;
        if (powerTicks <= 0) {
            powerMode = false;
        }
    }

    //check ghosts collision
    for (let ghost of ghosts.values()) {
        if (collision(ghost, pacman)) {
            if (powerMode) {
                ghost.reset();
                score += 100;
            } else {
                lives -= 1;
                if (lives == 0) {
                    gameOver = true;
                    return;
                }
                powerMode = false;
                powerTicks = 0;
                resetPositions();
                return;
            }
        }

        if (ghostIsAligned(ghost)) {
            const available = getAvailableDirections(ghost);
            const opposite = oppositeDirection(ghost.direction);
            const straightOK = available.includes(ghost.direction);
            const nonReverse = available.filter(d => d !== opposite);
            if (!straightOK || nonReverse.length > 1) {
                const chooseFrom = straightOK && nonReverse.length > 0 ? nonReverse : available;
                const nextDirection = chooseFrom[Math.floor(Math.random() * chooseFrom.length)];
                ghost.updateDirection(nextDirection);
            }
        }

        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        let hitWall = false;
        for (let wall of walls.values()) {
            if (collision(ghost, wall)) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                hitWall = true;
                break;
            }
        }

        if (hitWall) {
            const newDirection = directions[Math.floor(Math.random()*4)];
            ghost.updateDirection(newDirection);
        }

        wrapEntity(ghost);
    }

    //check food collision
    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            score += 10;
            break;
        }
    }
    foods.delete(foodEaten);

    //next level
    if (foods.size == 0 && powerPellets.size == 0) {
        loadMap();
        resetPositions();
    }
}

function movePacman(e) {
    if (gameOver) {
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver = false;
        update(); //restart game loop
        return;
    }

    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection('U');
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection('D');
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection('L');
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection('R');
    }

    //update pacman images
    if (pacman.direction == 'U') {
        pacman.image = pacmanUpImage;
    }
    else if (pacman.direction == 'D') {
        pacman.image = pacmanDownImage;
    }
    else if (pacman.direction == 'L') {
        pacman.image = pacmanLeftImage;
    }
    else if (pacman.direction == 'R') {
        pacman.image = pacmanRightImage;
    }
    
}

function handleTouchStart(event) {
    if (!event.changedTouches || event.changedTouches.length == 0) return;
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
    if (gameOver) {
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver = false;
        update();
        return;
    }

    if (!event.changedTouches || event.changedTouches.length == 0) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) pacman.updateDirection('R');
        else if (dx < -20) pacman.updateDirection('L');
    } else {
        if (dy > 20) pacman.updateDirection('D');
        else if (dy < -20) pacman.updateDirection('U');
    }

    //update pacman images
    if (pacman.direction == 'U') {
        pacman.image = pacmanUpImage;
    }
    else if (pacman.direction == 'D') {
        pacman.image = pacmanDownImage;
    }
    else if (pacman.direction == 'L') {
        pacman.image = pacmanLeftImage;
    }
    else if (pacman.direction == 'R') {
        pacman.image = pacmanRightImage;
    }
}

function collision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function resetPositions() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    powerMode = false;
    powerTicks = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random()*4)];
        ghost.updateDirection(newDirection);
    }
}

function getTile(row, col) {
    if (row < 0 || row >= rowCount || col < 0 || col >= columnCount) {
        return 'X';
    }
    return tileMap[row][col];
}

function canMoveToTile(row, col) {
    const tile = getTile(row, col);
    return tile !== 'X';
}

function getEntityGridPosition(entity) {
    const centerX = entity.x + entity.width/2;
    const centerY = entity.y + entity.height/2;
    return {
        row: Math.round(centerY / tileSize),
        col: Math.round(centerX / tileSize)
    };
}

function getAvailableDirections(entity) {
    const { row, col } = getEntityGridPosition(entity);
    const options = [];
    if (canMoveToTile(row - 1, col)) options.push('U');
    if (canMoveToTile(row + 1, col)) options.push('D');
    if (canMoveToTile(row, col - 1)) options.push('L');
    if (canMoveToTile(row, col + 1)) options.push('R');
    return options;
}

function oppositeDirection(direction) {
    if (direction == 'U') return 'D';
    if (direction == 'D') return 'U';
    if (direction == 'L') return 'R';
    if (direction == 'R') return 'L';
    return null;
}

function ghostIsAligned(entity) {
    return entity.x % tileSize === 0 && entity.y % tileSize === 0;
}

function wrapEntity(entity) {
    if (entity.x < -entity.width) {
        entity.x = boardWidth;
    }
    else if (entity.x > boardWidth) {
        entity.x = -entity.width;
    }
}

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        const nextX = this.x + this.velocityX;
        const nextY = this.y + this.velocityY;
        const testBlock = new Block(this.image, nextX, nextY, this.width, this.height);
        for (let wall of walls.values()) {
            if (collision(testBlock, wall)) {
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize/4;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize/4;
            this.velocityY = 0;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
};
