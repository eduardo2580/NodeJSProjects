//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0; 
let velocityY = 0; //doodler jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw doodler
    // context.fillStyle = "green";
    // context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

    //load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("keyup", stopDoodler);

    // Pointer (mouse/touch) and touch events
    board.addEventListener('touchstart', touchStart, {passive:false});
    board.addEventListener('touchmove', touchMove, {passive:false});
    board.addEventListener('touchend', touchEnd, {passive:false});

    // Pointer events for mouse and stylus
    board.addEventListener('pointerdown', pointerDown);
    board.addEventListener('pointermove', pointerMove);
    board.addEventListener('pointerup', pointerUp);

    // On-screen buttons
    let leftBtn = document.getElementById('left-btn');
    let rightBtn = document.getElementById('right-btn');
    if (leftBtn && rightBtn) {
        leftBtn.addEventListener('pointerdown', function(e){ e.preventDefault(); velocityX = -4; doodler.img = doodlerLeftImg; });
        leftBtn.addEventListener('pointerup', function(e){ e.preventDefault(); velocityX = 0; });
        rightBtn.addEventListener('pointerdown', function(e){ e.preventDefault(); velocityX = 4; doodler.img = doodlerRightImg; });
        rightBtn.addEventListener('pointerup', function(e){ e.preventDefault(); velocityX = 0; });
        // also support touchend fallbacks
        leftBtn.addEventListener('touchstart', function(e){ e.preventDefault(); velocityX = -4; doodler.img = doodlerLeftImg; });
        leftBtn.addEventListener('touchend', function(e){ e.preventDefault(); velocityX = 0; });
        rightBtn.addEventListener('touchstart', function(e){ e.preventDefault(); velocityX = 4; doodler.img = doodlerRightImg; });
        rightBtn.addEventListener('touchend', function(e){ e.preventDefault(); velocityX = 0; });
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth/7, boardHeight*7/8);
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        restartGame();
    }
}

function stopDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD" || e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = 0;
    }
}

function restartGame() {
    //reset
    doodler = {
        img : doodlerRightImg,
        x : doodlerX,
        y : doodlerY,
        width : doodlerWidth,
        height : doodlerHeight
    }

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
}

function setDirectionFromClientX(clientX) {
    let rect = board.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < rect.width/2) {
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    } else {
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
}

function touchStart(e) {
    e.preventDefault();
    if (gameOver) {
        restartGame();
        return;
    }
    if (e.touches && e.touches.length > 0) {
        setDirectionFromClientX(e.touches[0].clientX);
    }
}

function touchMove(e) {
    e.preventDefault();
    if (e.touches && e.touches.length > 0) {
        setDirectionFromClientX(e.touches[0].clientX);
    }
}

function touchEnd(e) {
    e.preventDefault();
    // stop horizontal movement when no touches
    if (!e.touches || e.touches.length === 0) {
        velocityX = 0;
    }
}

let isPointerDown = false;
function pointerDown(e) {
    isPointerDown = true;
    if (gameOver) {
        restartGame();
        return;
    }
    setDirectionFromClientX(e.clientX);
}

function pointerMove(e) {
    if (!isPointerDown) return;
    setDirectionFromClientX(e.clientX);
}

function pointerUp(e) {
    isPointerDown = false;
    velocityX = 0;
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}