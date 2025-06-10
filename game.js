// Wait for the DOM to be fully loaded before trying to get the canvas
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Error: Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Error: 2D rendering context not available!');
        return;
    }

    const tileSize = 20;
    let gameState = 'ready'; // 'ready', 'playing', 'gameOver', 'gameWon'
    const frightenedDuration = 5000; // 5 seconds

    const initialMazeLayout = [
        [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    initialMazeLayout[0][1] = 3; initialMazeLayout[0][28] = 3;
    initialMazeLayout[18][1] = 3; initialMazeLayout[18][28] = 3;
    initialMazeLayout[1][1] = 2;

    let maze = JSON.parse(JSON.stringify(initialMazeLayout));

    canvas.width = maze[0].length * tileSize;
    canvas.height = maze.length * tileSize;

    const pacMan = {
        x: 1, y: 1, size: tileSize / 2 - 2,
        dx: 0, dy: 0, nextDx: 0, nextDy: 0,
        color: 'yellow',
    };

    let score = 0;
    const pelletSize = tileSize / 8;

    const initialGhostConfigs = [
        { id: 'ghost0', x: 10, y: 8, color: 'red' },
        { id: 'ghost1', x: 15, y: 10, color: 'pink' },
        { id: 'ghost2', x: 27, y: 0, color: 'cyan' },
        { id: 'ghost3', x: 1, y: 18, color: 'orange' }
    ];

    const ghosts = JSON.parse(JSON.stringify(initialGhostConfigs)).map(g => ({
        ...g,
        size: tileSize / 2 - 2,
        dx: 0, dy: 0,
        isFrightened: false,
        frightenedTimer: 0
    }));

    function canMove(checkX, checkY) {
        if (checkX < 0 || checkX >= maze[0].length || checkY < 0 || checkY >= maze.length) {
            return false;
        }
        return maze[checkY][checkX] === 0 || maze[checkY][checkX] === 2 || maze[checkY][checkX] === 3;
    }

    function resetGame() { /* ... same as before ... */
        pacMan.x = 1; pacMan.y = 1;
        pacMan.dx = 0; pacMan.dy = 0;
        pacMan.nextDx = 0; pacMan.nextDy = 0;
        score = 0;
        maze = JSON.parse(JSON.stringify(initialMazeLayout));

        ghosts.forEach((ghost, index) => {
            const config = initialGhostConfigs[index];
            ghost.x = config.x;
            ghost.y = config.y;
            ghost.isFrightened = false;
            ghost.frightenedTimer = 0;
            ghost.color = config.color;

            const directions = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
            let validInitialMoves = [];
            directions.forEach(dir => {
                if (canMove(ghost.x + dir.dx, ghost.y + dir.dy)) {
                    validInitialMoves.push(dir);
                }
            });
            if (validInitialMoves.length > 0) {
                const initialMove = validInitialMoves[Math.floor(Math.random() * validInitialMoves.length)];
                ghost.dx = initialMove.dx;
                ghost.dy = initialMove.dy;
            } else {
                ghost.dx = 0; ghost.dy = 0;
            }
        });
        console.log("Game reset.");
    }

    function drawMaze() { /* ... same ... */
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 1) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                }
            }
        }
    }
    function drawPellets() { /* ... same ... */
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 2) {
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, pelletSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                } else if (maze[row][col] === 3) {
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, pelletSize * 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawPacMan() { /* ... same ... */
        ctx.beginPath();
        ctx.arc(pacMan.x * tileSize + tileSize / 2, pacMan.y * tileSize + tileSize / 2, pacMan.size, 0, Math.PI * 2);
        ctx.fillStyle = pacMan.color;
        ctx.fill();
        ctx.closePath();
    }
    function drawGhosts() { /* ... same ... */
        ghosts.forEach(ghost => {
            ctx.beginPath();
            ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, ghost.size, 0, Math.PI * 2);
            ctx.fillStyle = ghost.isFrightened ? '#6495ED' : ghost.color;
            ctx.fill();
            ctx.closePath();
        });
    }
    function drawScore() { /* ... same ... */
        ctx.fillStyle = 'white';
        ctx.font = '20px Inter';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('Score: ' + score, 10, tileSize - 2);
    }
    function drawGameStateMessages() { /* ... same ... */
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '30px Inter';
        if (gameState === 'ready') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('Press Enter to Start', canvas.width / 2, canvas.height / 2);
        } else if (gameState === 'gameOver') {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = '20px Inter';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 10);
        } else if (gameState === 'gameWon') {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = '20px Inter';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 10);
        }
    }

    document.addEventListener('keydown', (e) => { /* ... same ... */
        if (gameState === 'ready' || gameState === 'gameOver' || gameState === 'gameWon') {
            if (e.key === 'Enter') {
                e.preventDefault();
                resetGame();
                if (maze[pacMan.y][pacMan.x] === 2) {
                    maze[pacMan.y][pacMan.x] = 0; score += 10;
                } else if (maze[pacMan.y][pacMan.x] === 3) {
                    maze[pacMan.y][pacMan.x] = 0; score += 50;
                    ghosts.forEach(g => { g.isFrightened = true; g.frightenedTimer = frightenedDuration; });
                }
                // Check win instantly if map is empty from start (edge case for testing)
                if(checkWinCondition()){
                    gameState = 'gameWon';
                } else {
                    gameState = 'playing';
                }
            }
        } else if (gameState === 'playing') {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                switch (e.key) {
                    case 'ArrowUp':    pacMan.nextDy = -1; pacMan.nextDx = 0; break;
                    case 'ArrowDown':  pacMan.nextDy = 1;  pacMan.nextDx = 0; break;
                    case 'ArrowLeft':  pacMan.nextDx = -1; pacMan.nextDy = 0; break;
                    case 'ArrowRight': pacMan.nextDx = 1;  pacMan.nextDy = 0; break;
                }
            }
        }
    });

    function updateGhosts() { /* ... same as before ... */
        ghosts.forEach(ghost => {
            if (ghost.isFrightened) {
                ghost.frightenedTimer -= movementInterval;
                if (ghost.frightenedTimer <= 0) {
                    ghost.isFrightened = false;
                    ghost.frightenedTimer = 0;
                    console.log(ghost.color + " ghost is no longer frightened.");
                }
            }
            const currentGhostDx = ghost.dx;
            const currentGhostDy = ghost.dy;
            const nextCoreX = ghost.x + currentGhostDx;
            const nextCoreY = ghost.y + currentGhostDy;
            if ((currentGhostDx !== 0 || currentGhostDy !== 0) && canMove(nextCoreX, nextCoreY)) {
                ghost.x = nextCoreX;
                ghost.y = nextCoreY;
            } else {
                let possibleDirections = [];
                const turns = [{dx:0, dy:-1}, {dx:0, dy:1}, {dx:-1, dy:0}, {dx:1, dy:0}];
                let otherOptionsExist = false;
                turns.forEach(dir => {
                    if (!(dir.dx === -currentGhostDx && dir.dy === -currentGhostDy) && canMove(ghost.x + dir.dx, ghost.y + dir.dy)) {
                        otherOptionsExist = true;
                    }
                });
                turns.forEach(dir => {
                    const isReversal = (dir.dx === -currentGhostDx && dir.dy === -currentGhostDy);
                    if (canMove(ghost.x + dir.dx, ghost.y + dir.dy)) {
                        if (!isReversal || !otherOptionsExist) {
                            possibleDirections.push(dir);
                        }
                    }
                });
                if (possibleDirections.length > 0) {
                    const newDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                    ghost.dx = newDir.dx;
                    ghost.dy = newDir.dy;
                    if (canMove(ghost.x + ghost.dx, ghost.y + ghost.dy)) {
                         ghost.x += ghost.dx;
                         ghost.y += ghost.dy;
                    } else {
                        ghost.dx = 0; ghost.dy = 0;
                    }
                }
            }
        });
    }

    function checkCollisions() { /* ... same as before ... */
        for (let i = 0; i < ghosts.length; i++) {
            const ghost = ghosts[i];
            if (pacMan.x === ghost.x && pacMan.y === ghost.y) {
                if (ghost.isFrightened) {
                    score += 200;
                    console.log("Ate frightened " + ghost.color + " ghost!");
                    const config = initialGhostConfigs.find(c => c.id === ghost.id);
                    if(config){
                        ghost.x = config.x;
                        ghost.y = config.y;
                    }
                    ghost.isFrightened = false;
                    ghost.frightenedTimer = 0;
                } else {
                    console.log("Game Over! Collision with " + ghost.color + " ghost.");
                    gameState = 'gameOver';
                    return;
                }
            }
        }
    }

    function checkWinCondition() {
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 2 || maze[row][col] === 3) { // Pellet or Power Pellet
                    return false; // Found a pellet, game not won
                }
            }
        }
        return true; // No pellets found, game is won
    }

    let lastUpdateTime = 0;
    const movementInterval = 150;

    function update(currentTime = 0) {
        requestAnimationFrame(update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPellets();
        drawGhosts();
        drawPacMan();
        drawScore();
        drawGameStateMessages();

        const deltaTime = currentTime - lastUpdateTime;
        if (deltaTime >= movementInterval) {
            lastUpdateTime = currentTime;
            if (gameState === 'playing') {
                if (pacMan.nextDx !== 0 || pacMan.nextDy !== 0) {
                    if (canMove(pacMan.x + pacMan.nextDx, pacMan.y + pacMan.nextDy)) {
                        pacMan.dx = pacMan.nextDx;
                        pacMan.dy = pacMan.nextDy;
                    }
                }
                pacMan.nextDx = 0; pacMan.nextDy = 0;

                if (canMove(pacMan.x + pacMan.dx, pacMan.y + pacMan.dy)) {
                    pacMan.x += pacMan.dx;
                    pacMan.y += pacMan.dy;

                    let pelletEaten = false;
                    if (maze[pacMan.y][pacMan.x] === 2) {
                        maze[pacMan.y][pacMan.x] = 0;
                        score += 10;
                        pelletEaten = true;
                    } else if (maze[pacMan.y][pacMan.x] === 3) {
                        maze[pacMan.y][pacMan.x] = 0;
                        score += 50;
                        pelletEaten = true;
                        ghosts.forEach(g => {
                            g.isFrightened = true;
                            g.frightenedTimer = frightenedDuration;
                        });
                        console.log("Power Pellet Eaten! Ghosts are frightened.");
                    }

                    if (pelletEaten) {
                        if (checkWinCondition()) {
                            gameState = 'gameWon';
                            console.log("All pellets eaten! You WIN!");
                        }
                    }
                } else {
                    pacMan.dx = 0; pacMan.dy = 0;
                }
                updateGhosts();
                if (gameState === 'playing') { // Check if still playing before collision check (win might have occurred)
                    checkCollisions();
                }
            }
        }
    }
    resetGame();
    console.log("Game initialized with Win Condition. Current state: " + gameState);
    update(0);
});
