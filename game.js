const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

function createGrid(initialSpawn) {
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

function updateGrid(minNeighbors, maxNeighbors, reproduction, minFood, minInfection) {
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
            newGrid[n.y][n.x] = 3; // Infecção
          });
        } else {
          newGrid[y][x] = 0; // Elimina a infecção
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

function loop(minNeighbors, maxNeighbors, reproduction, minFood, minInfection, foodPerTurn, enemyPerTurn, timing) {
  const interval = setInterval(() => {
    spawnFood(foodPerTurn);
    spawnEnemy(enemyPerTurn);
    drawGrid();
    updateGrid(minNeighbors, maxNeighbors, reproduction, minFood, minInfection);
    
    if (isGameOver()) {
      clearInterval(interval);
      alert("Game over!");
    }
  }, timing);
}

function startGame() {
  const minNeighbors = parseInt(document.getElementById("minNeighbors").value, 10);
  const maxNeighbors = parseInt(document.getElementById("maxNeighbors").value, 10);
  const reproduction = parseInt(document.getElementById("reproduction").value, 10);
  const minFood = parseInt(document.getElementById("minFood").value, 10);
  const minInfection = parseInt(document.getElementById("minInfection").value, 10);
  const foodPerTurn = parseInt(document.getElementById("foodPerTurn").value, 10);
  const enemyPerTurn = parseInt(document.getElementById("enemyPerTurn").value, 10);
  const initialSpawn = parseInt(document.getElementById("initialSpawn").value, 10);
  const timing = parseFloat(document.getElementById("timing").value, 0.5) * 1000;

  grid = createGrid(initialSpawn);

  loop(minNeighbors, maxNeighbors, reproduction, minFood, minInfection, foodPerTurn, enemyPerTurn, timing);
}
