function displayDate() {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('output').textContent = `Today is ${dayOfWeek}, ${fullDate}.`;
  }
  
  // Tic Tac Toe logic
  const board = document.getElementById('board');
  const status = document.getElementById('status');
  let currentPlayer = 'X';
  let cells = Array(9).fill(null);
  
  function checkWinner() {
    const winCombos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let combo of winCombos) {
      const [a,b,c] = combo;
      if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
        return cells[a];
      }
    }
    return cells.every(cell => cell) ? 'Draw' : null;
  }
  
  function handleClick(index) {
    if (cells[index] || checkWinner()) return;
    cells[index] = currentPlayer;
    render();
    const winner = checkWinner();
    if (winner) {
      status.textContent = winner === 'Draw' ? "It's a draw!" : `${winner} wins!`;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `It's ${currentPlayer}'s turn.`;
    }
  }
  
  function render() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
      const div = document.createElement('div');
      div.classList.add('cell');
      div.textContent = cell || '';
      div.onclick = () => handleClick(index);
      board.appendChild(div);
    });
  }
  
  function restartGame() {
    cells = Array(9).fill(null);
    currentPlayer = 'X';
    status.textContent = "It's X's turn.";
    render();
  }
  
  // Initial game setup
  restartGame();
  