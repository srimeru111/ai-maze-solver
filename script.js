const grid = document.getElementById("grid");
const clearBtn = document.getElementById("clearBtn");

const rows = 20;
const cols = 20;

let cells = [];

let startNode = null;
let endNode = null;

// CREATE GRID
for (let row = 0; row < rows; row++) {

    let currentRow = [];

    for (let col = 0; col < cols; col++) {

        const cell = document.createElement("div");

        cell.classList.add("cell");

        cell.dataset.row = row;
        cell.dataset.col = col;

        // CLICK EVENTS
        cell.addEventListener("click", () => {

            // SET START NODE
            if (!startNode) {
                startNode = cell;
                cell.classList.add("start");
                return;
            }

            // SET END NODE
            if (!endNode && cell !== startNode) {
                endNode = cell;
                cell.classList.add("end");
                return;
            }

            // CREATE WALLS
            if (cell !== startNode && cell !== endNode) {
                cell.classList.toggle("wall");
            }
        });

        grid.appendChild(cell);

        currentRow.push(cell);
    }

    cells.push(currentRow);
}

// ---------------- BUTTONS ----------------

const mazeBtn = document.createElement("button");
mazeBtn.innerText = "Generate Maze";

const bfsBtn = document.createElement("button");
bfsBtn.innerText = "Run BFS";

const astarBtn = document.createElement("button");
astarBtn.innerText = "Run A*";

// ADD BUTTONS
document.querySelector(".controls").appendChild(mazeBtn);
document.querySelector(".controls").appendChild(bfsBtn);
document.querySelector(".controls").appendChild(astarBtn);

// EVENTS
mazeBtn.addEventListener("click", generateMaze);
bfsBtn.addEventListener("click", runBFS);
astarBtn.addEventListener("click", runAStar);

// ---------------- CLEAR GRID ----------------

clearBtn.addEventListener("click", () => {

    startNode = null;
    endNode = null;

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            cells[row][col].className = "cell";
        }
    }
});

// ---------------- BFS ----------------

async function runBFS() {

    if (!startNode || !endNode) {
        alert("Set start and end nodes first!");
        return;
    }

    clearVisited();

    let queue = [];

    let visited = new Set();

    let parentMap = new Map();

    queue.push(startNode);

    visited.add(startNode);

    while (queue.length > 0) {

        let current = queue.shift();

        // END FOUND
        if (current === endNode) {
            drawPath(parentMap);
            return;
        }

        let neighbors = getNeighbors(current);

        for (let neighbor of neighbors) {

            if (
                !visited.has(neighbor) &&
                !neighbor.classList.contains("wall")
            ) {

                visited.add(neighbor);

                parentMap.set(neighbor, current);

                queue.push(neighbor);

                // VISUALIZATION
                if (
                    neighbor !== startNode &&
                    neighbor !== endNode
                ) {
                    neighbor.classList.add("visited");
                }

                await sleep(20);
            }
        }
    }

    alert("No path found!");
}

// ---------------- A* ----------------

async function runAStar() {

    if (!startNode || !endNode) {
        alert("Set start and end nodes first!");
        return;
    }

    clearVisited();

    let openSet = [startNode];

    let cameFrom = new Map();

    let gScore = new Map();
    let fScore = new Map();

    gScore.set(startNode, 0);

    fScore.set(
        startNode,
        heuristic(startNode, endNode)
    );

    while (openSet.length > 0) {

        // LOWEST F SCORE
        let current = openSet.reduce((a, b) =>
            (fScore.get(a) || Infinity) <
            (fScore.get(b) || Infinity)
                ? a
                : b
        );

        // END FOUND
        if (current === endNode) {
            drawPath(cameFrom);
            return;
        }

        openSet = openSet.filter(cell => cell !== current);

        let neighbors = getNeighbors(current);

        for (let neighbor of neighbors) {

            if (neighbor.classList.contains("wall")) {
                continue;
            }

            let tentativeG =
                (gScore.get(current) || Infinity) + 1;

            if (
                tentativeG <
                (gScore.get(neighbor) || Infinity)
            ) {

                cameFrom.set(neighbor, current);

                gScore.set(neighbor, tentativeG);

                fScore.set(
                    neighbor,
                    tentativeG +
                    heuristic(neighbor, endNode)
                );

                if (!openSet.includes(neighbor)) {

                    openSet.push(neighbor);

                    if (
                        neighbor !== startNode &&
                        neighbor !== endNode
                    ) {
                        neighbor.classList.add("visited");
                    }
                }
            }
        }

        await sleep(20);
    }

    alert("No path found!");
}

// ---------------- HEURISTIC ----------------

function heuristic(a, b) {

    let rowA = parseInt(a.dataset.row);
    let colA = parseInt(a.dataset.col);

    let rowB = parseInt(b.dataset.row);
    let colB = parseInt(b.dataset.col);

    // MANHATTAN DISTANCE
    return Math.abs(rowA - rowB) +
           Math.abs(colA - colB);
}

// ---------------- MAZE GENERATION ----------------

function generateMaze() {

    clearVisited();

    // CLEAR WALLS
    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = cells[row][col];

            if (
                cell !== startNode &&
                cell !== endNode
            ) {
                cell.classList.remove("wall");
            }
        }
    }

    // RANDOM WALLS
    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell = cells[row][col];

            if (
                cell !== startNode &&
                cell !== endNode
            ) {

                let random = Math.random();

                // 30% CHANCE
                if (random < 0.3) {
                    cell.classList.add("wall");
                }
            }
        }
    }
}

// ---------------- HELPERS ----------------

function getNeighbors(cell) {

    let neighbors = [];

    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    let directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    for (let [dr, dc] of directions) {

        let newRow = row + dr;
        let newCol = col + dc;

        if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols
        ) {

            neighbors.push(cells[newRow][newCol]);
        }
    }

    return neighbors;
}

async function drawPath(parentMap) {

    let current = endNode;

    while (current !== startNode) {

        current = parentMap.get(current);

        if (current !== startNode) {
            current.classList.add("path");
        }

        await sleep(30);
    }
}

function clearVisited() {

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            cells[row][col].classList.remove("visited");
            cells[row][col].classList.remove("path");
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}