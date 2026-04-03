const cells = Array(9).fill(null);
let isXNext = true;
let winner = null;
let winningLine = [];

const boardEl = document.getElementById('board');
const statusEl = document.querySelector('.status');
const resetBtn = document.getElementById('reset');

function checkWinner() {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (const line of lines) {
    const [a,b,c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      winner = cells[a];
      winningLine = line;
      return;
    }
  }
  if (cells.every(cell => cell !== null)) {
    winner = 'draw';
  } else {
    winner = null;
    winningLine = [];
  }
}

function updateUI() {
  // Update status text
  if (winner === 'draw') {
    statusEl.textContent = 'Game Draw!';
  } else if (winner) {
    statusEl.textContent = `Player ${winner.toUpperCase()} Wins!`;
  } else {
    statusEl.textContent = `Next Player: ${isXNext ? 'X' : 'O'}`;
  }

  // Update cells
  const cellDivs = document.querySelectorAll('.cell');
  cellDivs.forEach((div, idx) => {
    const value = cells[idx];
    div.innerHTML = value ? `<div class="symbol ${value}"></div>` : '';
    div.disabled = !!winner || !!cells[idx];
    if (winningLine.includes(idx)) {
      div.classList.add('winning');
    } else {
      div.classList.remove('winning');
    }
  });
}

function handleCellClick(index) {
  if (winner || cells[index]) return;
  cells[index] = isXNext ? 'x' : 'o';
  isXNext = !isXNext;
  checkWinner();
  updateUI();
}

function resetGame() {
  for (let i = 0; i < cells.length; i++) cells[i] = null;
  isXNext = true;
  winner = null;
  winningLine = [];
  updateUI();
}

function createBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const button = document.createElement('button');
    button.className = 'cell';
    button.addEventListener('click', () => handleCellClick(i));
    boardEl.appendChild(button);
  }
}

resetBtn.addEventListener('click', resetGame);
createBoard();
updateUI();