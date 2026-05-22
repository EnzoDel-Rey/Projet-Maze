function generateMaze(width, height) {
  const maze = [];

  for (let y = 0; y < height; y++) {
    maze[y] = [];

    for (let x = 0; x < width; x++) {
      maze[y][x] = 1;
    }
  }

  function carve(x, y) {
    const directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        ny > 0 &&
        ny < height - 1 &&
        nx > 0 &&
        nx < width - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[ny][nx] = 0;
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  maze[1][1] = 0;
  carve(1, 1);

  maze[height - 2][width - 2] = 0;

  return maze;
}

module.exports = generateMaze;