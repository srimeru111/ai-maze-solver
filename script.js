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

        // LEFT CLICK
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

            // CREATE WALL
            if (cell !== startNode && cell !== endNode) {
                cell.classList.toggle("wall");
            }
        });

        grid.appendChild(cell);

        currentRow.push(cell);
    }

    cells.push(currentRow);
}

// CLEAR GRID
clearBtn.addEventListener("click", () => {

    startNode = null;
    endNode = null;

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            cells[row][col].className = "cell";
        }
    }
});

// BFS BUTTON
const bfsBtn = document.createElement("button");
bfsBtn.innerText = "Run BFS";

document.querySelector(".controls").appendChild(bfsBtn);

bfsBtn.addEventListener("click", runBFS);

// BFS ALGORITHM
async function runBFS() {

    if (!startNode || !endNode) {
        alert("Set start and end nodes first!");
        return;
    }

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

                // VISUALIZE SEARCH
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

// GET NEIGHBORS
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

// DRAW SHORTEST PATH
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

// SLEEP FUNCTION
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}