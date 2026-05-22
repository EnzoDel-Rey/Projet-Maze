function solveMaze(maze) {
  const rows = maze.length;
  const cols = maze[0].length;

  const queue = [[[1, 1]]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const [x, y] = path[path.length - 1];

    if (x === cols - 2 && y === rows - 2) {
      return path;
    }

    const key = `${x},${y}`;

    if (visited.has(key)) continue;

    visited.add(key);

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        maze[ny][nx] === 0
      ) {
        queue.push([...path, [nx, ny]]);
      }
    }
  }

  return [];
}

module.exports = solveMaze;