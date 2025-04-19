const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let grid = createGrid();

function createGrid() {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 3))
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
      }
    }
  }
}

function updateGrid() {
  const newGrid = grid.map(arr => [...arr]);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(grid, x, y);
      const foods = getFood(grid, x, y);
      if (grid[y][x] === 1) {
        if (foods.length > 0) {
          const idx = Math.floor(Math.random() * foods.length);
          const food = foods[idx];
          newGrid[food.y][food.x] = 0;
        } else if (neighbors < 2 || neighbors > 3) {
          newGrid[y][x] = 0; // Morre por solidão ou superpopulação
        }
      } else {
        if (neighbors === 3) {
          newGrid[y][x] = 1; // Nasce uma nova célula
        }
      }
    }
  }

  grid = newGrid;
}

function countNeighbors(grid, x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const newY = y + dy;
      const newX = x + dx;
      if (newY >= 0 && newY < rows && newX >= 0 && newX < cols) {
        count += grid[newY][newX] === 2 ? 0 : grid[newY][newX];
      }
    }
  }
  return count;
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

function spawnFood(count) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (grid[y][x] === 0) {
      grid[y][x] = 2;
    }
  }
}

function loop() {
  spawnFood(1);
  drawGrid();
  updateGrid();
  requestAnimationFrame(loop);
}

loop();
