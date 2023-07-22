// canvas setup
      const canvas1 = document.getElementById("canvas1");
      const ctx1 = canvas1.getContext("2d");
      const canvas2 = document.getElementById("canvas2");
      const ctx2 = canvas2.getContext("2d");
      const width = canvas1.width = canvas2.width = window.innerWidth;
      const height = canvas1.height = canvas2.height = window.innerHeight;
      const cellSize1 = 5;
      const cellSize2 = 10;

// grid setup
      const rows1 = Math.floor(height / cellSize1);
      const cols1 = Math.floor(width / cellSize1);
      let grid1 = new Array(cols1).fill(null).map(() => new Array(rows1).fill(0));

      const rows2 = Math.floor(height / cellSize2);
      const cols2 = Math.floor(width / cellSize2);
      let grid2 = new Array(cols2).fill(null).map(() => new Array(rows2).fill(0));

// brush size
      let brushSize = 0;

// color palettes
      const colorPalettes = {
        random: null,
        palette1: ['#ff0000', '#00ff00', '#0000ff'],
        palette2: ['#ffff00', '#ff00ff', '#00ffff'],
        palette3: ['#ff9900', '#0099ff', '#99ff00'],
        palette4: ['#6C9BF0', '#F07A7C', '#F0BB4A'],
        palette5: ['#222222', '#777777', '#e9e9e9'],
        palette6: ['#b9cefb', '#ffb8ea', '#cafde0']
      };
      let selectedPalette = 'palette4';

// animation variables
        let isPlaying = false;
        let requestId;

// initialize grid with random values
      for (let i = 0; i < cols1; i++) {
        for (let j = 0; j < rows1; j++) {
          grid1[i][j] = Math.floor(Math.random() * 2);
        }
      }
      for (let i = 0; i < cols2; i++) {
        for (let j = 0; j < rows2; j++) {
          grid2[i][j] = Math.floor(Math.random() * 2);
        }
      }

// draw the grid
      function draw(ctx, grid, cellSize, cols, rows) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            if (grid[i][j] === 1) {
              let color;
              if (selectedPalette === 'random') {
                color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
              } else {
                color = colorPalettes[selectedPalette][Math.floor(Math.random() * colorPalettes[selectedPalette].length)];
              }
              ctx.fillStyle = color;
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }
      }

// update the grid
      function update(grid, cols, rows) {
        const nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
        for (let i = 1; i < cols - 1; i++) {
          for (let j = 1; j < rows - 1; j++) {
            let neighbors = 0;
            for (let k = -1; k <= 1; k++) {
              for (let l = -1; l <= 1; l++) {
                neighbors += grid[i + k][j + l];
              }
            }
            neighbors -= grid[i][j];
            if ((grid[i][j] === 1) && (neighbors < 2 || neighbors > 3)) {
              nextGrid[i][j] = 0;
            } else if (grid[i][j] === 0 && neighbors === 3) {
              nextGrid[i][j] = 1;
            } else {
              nextGrid[i][j] = grid[i][j];
            }
          }
        }
        return nextGrid;
      }

// animate the grid
  function animate() {
    if (isPlaying) {
      draw(ctx1, grid1, cellSize1, cols1, rows1);
      grid1 = update(grid1, cols1, rows1);
      draw(ctx2, grid2, cellSize2, cols2, rows2);
      grid2 = update(grid2, cols2, rows2);
      requestId = requestAnimationFrame(animate);
    }
  }

// controls setup
      document.getElementById('brushSize').addEventListener('input', event => {
        brushSize = event.target.value;
      });

      document.getElementById('colorPalette').addEventListener('change', event => {
        selectedPalette = event.target.value;
      });

      document.getElementById('play').addEventListener('click', () => {
        if (!isPlaying) {
          isPlaying = true;
          animate();
        }
      });

      document.getElementById('pause').addEventListener('click', () => {
        isPlaying = false;
        if (requestId) {
          cancelAnimationFrame(requestId);
          requestId = undefined;
        }
      });

// toggle controls visibility
      document.getElementById('controls-toggle').addEventListener('click', () => {
        document.getElementById('controls').classList.toggle('hidden');
      });

// toggle donation visibility
document.getElementById('donate-toggle').addEventListener('click', () => {
    document.getElementById('donate').classList.toggle('hidden');
  });

// handle save button click
        document.getElementById('save').addEventListener('click', () => {

  // Add text
            ctx2.font = "25px Arial";
            ctx2.fillStyle = "#777777";
            ctx2.fillText("ChrisVélez, 2023", 5, 25);


  // Create a new canvas
            const combinedCanvas = document.createElement('canvas');
            combinedCanvas.width = width;
            combinedCanvas.height = height;
            const combinedCtx = combinedCanvas.getContext('2d');



  // Draw the content of both canvases on the new canvas
            combinedCtx.drawImage(canvas1, 0, 0);
            combinedCtx.drawImage(canvas2, 0, 0);

  // Save the combined canvas
            const link = document.createElement('a');
            link.download = 'myLittleGalaxy.png';
            link.href = combinedCanvas.toDataURL();
            link.click();
        });

// mouse and touch events
        let isDrawing = false;
        canvas2.addEventListener("mousedown", function (event) {
            isDrawing = true;
            drawCell(event);
        });
        canvas2.addEventListener("mouseup", function () {
            isDrawing = false;
        });
        canvas2.addEventListener("mousemove", function (event) {
            if (isDrawing) {
                drawCell(event);
            }
        });
        canvas2.addEventListener("touchstart", function (event) {
            isDrawing = true;
            drawCell(event.touches[0]);
        });
        canvas2.addEventListener("touchend", function () {
            isDrawing = false;
        });
        canvas2.addEventListener("touchmove", function (event) {
            event.preventDefault();
            if (isDrawing) {
                drawCell(event.touches[0]);
            }
        });

// draw cell
function drawCell(event) {
  const x2 = Math.floor(event.clientX / cellSize2);
  const y2 = Math.floor(event.clientY / cellSize2);
  const x1 = Math.floor(event.clientX / cellSize1);
  const y1 = Math.floor(event.clientY / cellSize1);

  for (let i = -brushSize; i <= brushSize; i++) {
    for (let j = -brushSize; j <= brushSize; j++) {
      const xi2 = x2 + i;
      const yj2 = y2 + j;
      const xi1 = x1 + i;
      const yj1 = y1 + j;

      if (xi2 >= 0 && xi2 < cols2 && yj2 >= 0 && yj2 < rows2) {
        grid2[xi2][yj2] = 1;
      }

      if (xi1 >= 0 && xi1 < cols1 && yj1 >= 0 && yj1 < rows1) {
        grid1[xi1][yj1] = 1;
      }
    }
  }
}