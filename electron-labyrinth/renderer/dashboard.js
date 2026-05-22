const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const generateBtn = document.getElementById('generateBtn');
const solveBtn = document.getElementById('solveBtn');
const saveBtn = document.getElementById('saveBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Éléments de configuration
const sizeSelect = document.getElementById('size');
const difficultyInput = document.getElementById('difficulty');

// Récupération sécurisée de l'utilisateur connecté
const user = JSON.parse(localStorage.getItem('user'));

let currentMaze = [];
let player = { x: 1, y: 1 };
let gameFinished = false;

// Redirection si l'utilisateur n'est pas connecté
if (!user || !user.id) {
    window.location.href = 'login.html';
}

function getMazeSize(size) {
    switch(size) {
        case 'small': return 21;
        case 'medium': return 31;
        case 'large': return 41;
        default: return 21;
    }
}

function generateMaze(width, height) {
    const maze = [];
    for(let y = 0; y < height; y++) {
        maze[y] = [];
        for(let x = 0; x < width; x++) {
            maze[y][x] = 1;
        }
    }

    function carve(x, y) {
        const directions = [
            [0, -2], [0, 2], [-2, 0], [2, 0]
        ].sort(() => Math.random() - 0.5);

        for(const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if(
                ny > 0 && ny < height - 1 &&
                nx > 0 && nx < width - 1 &&
                maze[ny][nx] === 1
            ) {
                maze[ny][nx] = 0;
                maze[y + dy / 2][x + dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }

    maze[1][1] = 0;
    carve(1,1);
    maze[height - 2][width - 2] = 0;
    return maze;
}

function drawMaze(maze, solutionPath = []) {
    if (!maze || maze.length === 0) return;
    
    const cellSize = Math.floor(canvas.width / maze.length);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let y = 0; y < maze.length; y++) {
        for(let x = 0; x < maze[y].length; x++) {
            if(maze[y][x] === 1) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    // Affichage de la solution
    ctx.fillStyle = 'deepskyblue';
    for(const pos of solutionPath) {
        ctx.fillRect(
            pos.x * cellSize + cellSize / 4,
            pos.y * cellSize + cellSize / 4,
            cellSize / 2,
            cellSize / 2
        );
    }

    // Départ
    ctx.fillStyle = 'green';
    ctx.fillRect(cellSize, cellSize, cellSize, cellSize);

    // Arrivée
    ctx.fillStyle = 'red';
    ctx.fillRect(
        (maze.length - 2) * cellSize,
        (maze.length - 2) * cellSize,
        cellSize,
        cellSize
    );

    // Joueur
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(
        player.x * cellSize + cellSize / 2,
        player.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function movePlayer(dx, dy) {
    if(gameFinished || currentMaze.length === 0) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if(currentMaze[newY] && currentMaze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze(currentMaze);
        checkWin();
    }
}

function checkWin() {
    const endX = currentMaze.length - 2;
    const endY = currentMaze.length - 2;

    if(player.x === endX && player.y === endY) {
        gameFinished = true;
        
        setTimeout(() => {
            const replay = confirm('Bravo ! Tu as terminé le labyrinthe !\n\nOK = Rejouer un niveau\nAnnuler = Rester ici pour changer les paramètres');
            if(replay) {
                handleGeneration();
            } else {
                gameFinished = false;
            }
        }, 50);
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': case 'z': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'q': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
    }
});

function handleGeneration() {
    gameFinished = false;
    const size = sizeSelect.value;
    const difficulty = parseInt(difficultyInput.value) || 0;

    let dimension = getMazeSize(size);
    dimension += difficulty;

    if(dimension % 2 === 0) {
        dimension++;
    }

    currentMaze = generateMaze(dimension, dimension);
    player.x = 1;
    player.y = 1;
    drawMaze(currentMaze);
}

generateBtn.addEventListener('click', handleGeneration);

if (sizeSelect) {
    sizeSelect.addEventListener('change', () => { gameFinished = false; });
}
if (difficultyInput) {
    difficultyInput.addEventListener('input', () => { gameFinished = false; });
}

function solveMaze() {
    if (currentMaze.length === 0) return [];
    
    const queue = [];
    const visited = new Set();

    queue.push({ x: 1, y: 1, path: [] });

    while(queue.length > 0) {
        const current = queue.shift();
        const key = `${current.x}-${current.y}`;

        if(visited.has(key)) continue;
        visited.add(key);

        const newPath = [...current.path, { x: current.x, y: current.y }];

        if(current.x === currentMaze.length - 2 && current.y === currentMaze.length - 2) {
            return newPath;
        }

        const directions = [[0,-1], [0,1], [-1,0], [1,0]];

        for(const [dx,dy] of directions) {
            const nx = current.x + dx;
            const ny = current.y + dy;

            if(currentMaze[ny] && currentMaze[ny][nx] === 0) {
                queue.push({ x: nx, y: ny, path: newPath });
            }
        }
    }
    return [];
}

async function animateSolution(path) {
    for(let i = 0; i < path.length; i++) {
        drawMaze(currentMaze, path.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

solveBtn.addEventListener('click', async () => {
    if(currentMaze.length === 0) return;
    const solution = solveMaze();
    await animateSolution(solution);
});

logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});


// CHARGEMENT DE L'HISTORIQUE

async function loadMazes() {
    const mazeList = document.getElementById('mazeList');
    if (!mazeList) return;

    mazeList.innerHTML = '';
    const mazes = await window.electronAPI.getMazes(user.id);

    if(!mazes || mazes.length === 0) {
        mazeList.innerHTML = '<p style="text-align:center; color:#aaa; font-style:italic;">Aucun labyrinthe sauvegardé</p>';
        return;
    }

    mazes.forEach((maze) => {
        const div = document.createElement('div');
        div.style = "display: flex; justify-content: space-between; align-items: center; background: #2a2a2a; padding: 10px 15px; margin-bottom: 8px; border-radius: 5px; border: 1px solid #444; color: white;";
        
        div.innerHTML = `
            <div id="text-container-${maze.id}">
                <strong id="maze-name-${maze.id}">${maze.name}</strong><br>
                <small style="color: #bbb;">Difficulté : ${maze.difficulty} | Taille : ${maze.size}</small>
            </div>
            <div id="actions-${maze.id}">
                <button class="btn-load-maze" data-id="${maze.id}" style="background: #28a745; color: white; border: none; padding: 5px 10px; margin-right: 5px; cursor: pointer; border-radius: 3px;">Charger</button>
                <button class="btn-edit-maze" data-id="${maze.id}" style="background: #ffc107; color: black; border: none; padding: 5px 10px; margin-right: 5px; cursor: pointer; border-radius: 3px;">Renommer</button>
                <button class="btn-delete-maze" data-id="${maze.id}" style="background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Supprimer</button>
            </div>
        `;
        mazeList.appendChild(div);
    });

    // CHARGER
    document.querySelectorAll('.btn-load-maze').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const mazesList = await window.electronAPI.getMazes(user.id);
            const maze = mazesList.find(m => m.id === id);

            if(!maze) return;

            currentMaze = JSON.parse(maze.maze);
            player.x = 1;
            player.y = 1;
            gameFinished = false;
            drawMaze(currentMaze);
        });
    });

    // RENOMMER
    document.querySelectorAll('.btn-edit-maze').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const textContainer = document.getElementById(`text-container-${id}`);
            const nameSpan = document.getElementById(`maze-name-${id}`);
            const actionsContainer = document.getElementById(`actions-${id}`);

            if(!textContainer || !nameSpan) return;

            const currentName = nameSpan.innerText;

            // champ input dynamique
            textContainer.innerHTML = `
                <input type="text" id="input-name-${id}" value="${currentName}" style="padding: 5px; border-radius: 3px; border: 1px solid #666; background: #333; color: white; font-weight: bold; width: 220px;"><br>
                <small style="color: #bbb;">Modification en cours...</small>
            `;

            // Sauvegarder/Annuler
            actionsContainer.innerHTML = `
                <button id="btn-save-edit-${id}" style="background: #007bff; color: white; border: none; padding: 5px 10px; margin-right: 5px; cursor: pointer; border-radius: 3px;">Valider</button>
                <button id="btn-cancel-edit-${id}" style="background: #6c757d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Annuler</button>
            `;

            // Bouton Valider l'édition
            document.getElementById(`btn-save-edit-${id}`).addEventListener('click', async () => {
                const newName = document.getElementById(`input-name-${id}`).value.trim();
                if(newName) {
                    await window.electronAPI.updateMaze({ id: id, name: newName });
                }
                loadMazes(); // Rafraîchit tout l'historique
            });

            // Bouton Annuler l'édition
            document.getElementById(`btn-cancel-edit-${id}`).addEventListener('click', () => {
                loadMazes(); // Réinitialise l'affichage originel
            });
        });
    });

    // SUPPRIMER
    document.querySelectorAll('.btn-delete-maze').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            
            setTimeout(async () => {
                const confirmation = confirm("Voulez-vous vraiment supprimer ce labyrinthe ?");
                if (!confirmation) return;
                await window.electronAPI.deleteMaze(id);
                loadMazes();
            }, 50);
        });
    });
}


// ACTION : SAUVEGARDER

saveBtn.addEventListener('click', async () => {
    if(currentMaze.length === 0) {
        saveBtn.innerText = "Génère un labyrinthe d'abord !";
        setTimeout(() => { saveBtn.innerText = "Sauvegarder"; }, 2000);
        return;
    }

    const maintenant = new Date();
    const heureOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const heureString = maintenant.toLocaleTimeString('fr-FR', heureOptions);
    
    const size = sizeSelect ? sizeSelect.value : 'small';
    
    let sizeFr = "Petit";
    if(size === "medium") sizeFr = "Moyen";
    if(size === "large") sizeFr = "Grand";

    const name = `Labyrinthe ${sizeFr} (${heureString})`;
    const difficulty = difficultyInput ? difficultyInput.value : 5;

    saveBtn.innerText = "Sauvegarde...";

    const result = await window.electronAPI.saveMaze({
        user_id: user.id,
        name: name,
        difficulty: parseInt(difficulty) || 5,
        size: sizeFr,
        maze: currentMaze
    });

    if(result.success) {
        saveBtn.style.backgroundColor = "#28a745";
        saveBtn.innerText = "Enregistré !";
        loadMazes();
        
        setTimeout(() => {
            saveBtn.style.backgroundColor = "";
            saveBtn.innerText = "Sauvegarder";
        }, 2000);
    } else {
        saveBtn.style.backgroundColor = "#dc3545";
        saveBtn.innerText = "Erreur !";
        setTimeout(() => {
            saveBtn.style.backgroundColor = "";
            saveBtn.innerText = "Sauvegarder";
        }, 2000);
    }
});

window.addEventListener('DOMContentLoaded', loadMazes);