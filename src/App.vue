<template>
  <div>
    <!-- Bouncing Title -->
    <h1>
      <span v-for="(letter, i) in titleLetters" :key="i">{{ letter }}</span>
    </h1>

    <!-- Corner Images -->
    <img src="https://pbs.twimg.com/media/GfkGhe6asAArJ2l?format=jpg&name=large" alt="Top Left"    class="corner-image top-left" />
    <img src="https://pbs.twimg.com/media/GeMg0CGbMAEjAOp?format=jpg&name=large" alt="Top Right"   class="corner-image top-right" />
    <img src="https://pbs.twimg.com/media/Gckr_ZqXUAA7X3f?format=jpg&name=large" alt="Bottom Left" class="corner-image bottom-left" />
    <img src="https://pbs.twimg.com/media/GfkGhe8aEAA0eQF?format=jpg&name=360x360" alt="Bottom Right" class="corner-image bottom-right" />

    <!-- Main Container -->
    <div class="container">

      <!-- Profile Section -->
      <div class="profile">
        <h2></h2>
        <img
          src="https://pbs.twimg.com/media/GoZdeoVWwAAXp_w?format=jpg&name=small"
          alt="Profile Image"
          class="profile-image"
        />
        <p>Hi! My name is Palolol<br />This name is my game name</p>
      </div>

      <!-- Date Checker -->
      <h2>Check Today's Day and Date</h2>
      <button @click="displayDate">Check</button>
      <p id="output">{{ dateOutput }}</p>

      <!-- Tic Tac Toe -->
      <h2>Tic Tac Toe Game</h2>
      <div class="game-board">
        <div
          v-for="(cell, index) in cells"
          :key="index"
          class="cell"
          @click="handleClick(index)"
        >
          {{ cell || '' }}
        </div>
      </div>
      <div class="status">{{ status }}</div>
      <button @click="restartGame">Restart Game</button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Title ──────────────────────────────────────────────
const titleLetters = ['P','A','L','O','L','O','L']

// ── Date Checker ───────────────────────────────────────
const dateOutput = ref('')

function displayDate() {
  const today = new Date()
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' })
  const fullDate  = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  dateOutput.value = `Today is ${dayOfWeek}, ${fullDate}.`
}

// ── Tic Tac Toe ────────────────────────────────────────
const cells        = ref(Array(9).fill(null))
const currentPlayer = ref('X')
const status       = ref("It's X's turn.")

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function checkWinner() {
  for (const [a,b,c] of WIN_COMBOS) {
    if (cells.value[a] && cells.value[a] === cells.value[b] && cells.value[b] === cells.value[c])
      return cells.value[a]
  }
  return cells.value.every(c => c) ? 'Draw' : null
}

function handleClick(index) {
  if (cells.value[index] || checkWinner()) return
  cells.value[index] = currentPlayer.value
  const winner = checkWinner()
  if (winner) {
    status.value = winner === 'Draw' ? "It's a draw!" : `${winner} wins!`
  } else {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    status.value = `It's ${currentPlayer.value}'s turn.`
  }
}

function restartGame() {
  cells.value = Array(9).fill(null)
  currentPlayer.value = 'X'
  status.value = "It's X's turn."
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap");

body {
  background-image: url('https://media.npr.org/assets/img/2023/08/28/_36a8456_sy_nj_wide-8834a4249492d4821e770582082edbe89b89ea2e.jpg');
  background-color: #1220e2;
  background-size: contain;
  font-family: 'Luckiest Guy', cursive;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0;
  overflow-y: scroll;
}

h1 {
  margin: 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

h1 span {
  display: inline-block;
  animation: bounce 0.3s ease infinite alternate;
  font-size: 80px;
  color: #1220e2;
  text-shadow: 0 1px 0 #ccc, 2px 0 #ccc, 0 3px 0 #ccc, 4px 0 #ccc, 0 5px 0 #ccc,
               0 6px 0 transparent, 0 7px 0 transparent, 0 8px 0 transparent,
               0 9px 0 transparent, 0 10px 10px rgba(0,0,0,0.4);
}

@keyframes bounce {
  100% {
    transform: translateY(-20px);
    text-shadow: 0 1px 0 #48ff00, 0 2px 0 hsl(133,100%,50%), 0 3px 0 #00ff00, 0 4px 0 #ccc,
                 0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 8px 0 #ccc, 0 9px 0 #ccc,
                 0 50px 25px rgba(0,0,0,0.2);
  }
}

.container {
  height: auto;
  margin: 0 auto;
  animation: rainbow 5s infinite;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 10px;
  margin-top: -100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

@keyframes rainbow {
  0%   { background-color: red; }
  14%  { background-color: orange; }
  28%  { background-color: yellow; }
  42%  { background-color: green; }
  57%  { background-color: blue; }
  71%  { background-color: indigo; }
  85%  { background-color: violet; }
  100% { background-color: red; }
}

.corner-image {
  width: 150px;
  height: auto;
  position: fixed;
  border-radius: 50%;
  box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
}
.top-left    { top: 10px;    left: 10px; }
.top-right   { top: 10px;   right: 10px; }
.bottom-left { bottom: 10px; left: 10px; }
.bottom-right{ bottom: 10px; right: 10px; }

.profile {
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  color: white;
}
.profile h2 { font-size: 24px; margin-bottom: 10px; }
.profile-image {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-shadow: 0px 4px 10px rgba(255,255,255,0.3);
  margin-bottom: 15px;
}
.profile p {
  font-size: 16px;
  line-height: 1.5;
  font-family: 'Arial', sans-serif;
  margin-top: 10px;
  background-color: rgba(0,0,0,0.336);
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
}

h2 { color: #333; margin-bottom: 20px; }

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
button:hover { background-color: #0056b3; }

#output { margin-top: 30px; font-size: 18px; color: #333; }

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  justify-content: center;
  margin-top: 30px;
}
.cell {
  background-color: white;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
}
.status { margin-top: 20px; font-size: 20px; color: #000; }

@media (max-width: 768px) {
  h1 span { font-size: 60px; }
  .profile-image { width: 200px; height: 200px; }
  .corner-image { width: 100px; }
  button { font-size: 14px; }
  .cell { width: 80px; height: 80px; font-size: 36px; }
}
@media (max-width: 480px) {
  h1 span { font-size: 50px; }
  button { padding: 8px 16px; }
  #output { font-size: 16px; }
}
</style>