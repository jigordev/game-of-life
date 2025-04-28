const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

const minNeighbors = 3; // Mínimo de vizinhos para sobreviver
const maxNeighbors = 8; // Máximo de vizinhos para morrer de super lotação
const reproduction = 3; // Mínimo de vizinhos para se reproduzir em um espaço vazio
const minFood = 1; // Mínimo de comida para sobreviver sozinho
const minInfection = 6; // Mínimo de vizinhos para sobreviver a uma infecção
const foodPerTurn = 2; // Número de comida que surge a cada atualização
const enemyPerTurn = 5; // Número de inimigos que surge a cada atualização
const initialSpawn = 2 // 2 - Apenas vida, 3 - Vida e comida, 4 - Vida, comida e inimigos

let grid = createGrid();

function createGrid() {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * initialSpawn))
  );
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else if (grid[y][x] === 2) {
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else if (grid[y][x] === 3) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function isGameOver() {
  let count = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        count += 1;
      }
    }
  }
  return count === 0;
}

function updateGrid() {
  const newGrid = grid.map(arr => [...arr]);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = getNeighbors(grid, x, y);
      const foods = getFood(grid, x, y);
      if (grid[y][x] === 1) {
        if (foods.length > minFood) {
          const idx = Math.floor(Math.random() * foods.length);
          const food = foods[idx];
          newGrid[food.y][food.x] = 0;
        } else if (neighbors.length < minNeighbors || neighbors.length > maxNeighbors) {
          newGrid[y][x] = 0; // Morre por solidão ou superpopulação
        }
      } else if (grid[y][x] === 3) {
        if (neighbors.length > 0 && neighbors.length <= minInfection) {
          neighbors.forEach((n) => {
            grid[n.y][n.x] = 3;
          });
        }
      } else {
        if (neighbors.length === reproduction) {
          newGrid[y][x] = 1; // Nasce uma nova célula
        }
      }
    }
  }

  grid = newGrid;
}

function getFood(grid, x, y) {
  const foods = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const newY = y + dy;
      const newX = x + dx;
      if (newY >= 0 && newY < rows && newX >= 0 && newX < cols) {
        if (grid[newY][newX] === 2) {
          foods.push({x: newX, y: newY});
        }
      }
    }
  }
  return foods;
}

function getNeighbors(grid, x, y) {
  const neighbors = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const newY = y + dy;
      const newX = x + dx;
      if (newY >= 0 && newY < rows && newX >= 0 && newX < cols) {
        if (grid[newY][newX] === 1) {
          neighbors.push({x: newX, y: newY});
        }
      }
    }
  }
  return neighbors;
}

function spawnFood(count) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (grid[y][x] === 0) {
      grid[y][x] = 2;
    }
  }
}

function spawnEnemy(count) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (grid[y][x] === 0) {
      grid[y][x] = 3;
    }
  }
}

function loop() {
  spawnFood(foodPerTurn);
  spawnEnemy(enemyPerTurn);
  drawGrid();
  updateGrid();
  if (isGameOver()) {
    alert("Game over!");
    grid = createGrid();
  }
  requestAnimationFrame(loop);
}

loop();
