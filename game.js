const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let grid = createGrid();

function createGrid() {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.8 ? 1 : 0)
  );
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = "#00FF00";
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
      if (grid[y][x]) {
        if (neighbors < 2 || neighbors > 3) {
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
        count += grid[newY][newX];
      }
    }
  }
  return count;
}

function loop() {
  drawGrid();
  updateGrid();
  requestAnimationFrame(loop);
}

loop();
