document.getElementById('upload').addEventListener('change', handleImage, false);

const canvas = document.getElementById('puzzle');
const solutionImage = document.getElementById('solutionImage');
const ctx = canvas.getContext('2d');
let img = new Image();
let tiles = [];
const tileCount = 3;
const tileSize = 100;
canvas.width = tileSize * tileCount;
canvas.height = tileSize * tileCount;

let moveCount = 0;
let timer = 0;
let timerInterval;

const defaultImageSrc = 'default.jpg'; 

function loadDefaultImage() {
    img.src = defaultImageSrc;
}

loadDefaultImage(); 
img.onload = () => {
    drawImage();
    setupPuzzle();
    startTimer();
    resizeSolutionImage();
};

function handleImage(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function drawImage() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    
    const resizedWidth = 500; 
    const resizedHeight = 500; 
    
    
    tempCanvas.width = resizedWidth;
    tempCanvas.height = resizedHeight;
    
    
    tempCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, resizedWidth, resizedHeight);
    
    
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}


function setupPuzzle() {
    tiles = [];
    for (let i = 0; i < tileCount; i++) {
        tiles[i] = [];
        for (let j = 0; j < tileCount; j++) {
            tiles[i][j] = { x: i, y: j };
        }
    }
    tiles[tileCount - 1][tileCount - 1] = null;
    shuffle(tiles);
    drawPuzzle();
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    const resizedWidth = 500; 
    const resizedHeight = 500; 

   
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = resizedWidth;
    tempCanvas.height = resizedHeight;

    
    tempCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, resizedWidth, resizedHeight);

    
    const tileWidth = resizedWidth / tileCount;
    const tileHeight = resizedHeight / tileCount;

    
    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
            if (tiles[i][j]) {
                const x = tiles[i][j].x * tileWidth;
                const y = tiles[i][j].y * tileHeight;
                ctx.drawImage(tempCanvas, x, y, tileWidth, tileHeight, j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        for (let j = array[i].length - 1; j > 0; j--) {
            const m = Math.floor(Math.random() * (i + 1));
            const n = Math.floor(Math.random() * (j + 1));
            [array[i][j], array[m][n]] = [array[m][n], array[i][j]];
        }
    }
}

canvas.addEventListener('click', handleClick);

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);

    if (isValidMove(x, y)) {
        moveTile(x, y);
        drawPuzzle();
        updateMoveCount();
    }
}

function isValidMove(x, y) {
    if (tiles[y][x] === null) return false;

    const moves = [
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
    ];

    for (const move of moves) {
        if (move.x >= 0 && move.x < tileCount && move.y >= 0 && move.y < tileCount && tiles[move.y][move.x] === null) {
            return true;
        }
    }

    return false;
}

function moveTile(x, y) {
    const moves = [
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
    ];

    for (const move of moves) {
        if (move.x >= 0 && move.x < tileCount && move.y >= 0 && move.y < tileCount && tiles[move.y][move.x] === null) {
            tiles[move.y][move.x] = tiles[y][x];
            tiles[y][x] = null;
            break;
        }
    }
}

function updateMoveCount() {
    moveCount++;
    document.getElementById('moveCount').textContent = moveCount;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timer = 0;
    document.getElementById('timer').textContent = '0:00';
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function resizeSolutionImage() {
    const solutionCanvas = document.createElement('canvas');
    const solutionCtx = solutionCanvas.getContext('2d');
    solutionCanvas.width = canvas.width;
    solutionCanvas.height = canvas.height;

    solutionCtx.drawImage(img, 0, 0, solutionCanvas.width, solutionCanvas.height);
    solutionImage.src = solutionCanvas.toDataURL();
}
