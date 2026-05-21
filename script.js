const grid = document.getElementById("grid");
const clearBtn = document.getElementById("clearBtn");

const rows = 20;
const cols = 20;

let cells = [];

// CREATE GRID
for (let row = 0; row < rows; row++) {

    let currentRow = [];

    for (let col = 0; col < cols; col++) {

        const cell = document.createElement("div");

        cell.classList.add("cell");

        // TOGGLE WALL
        cell.addEventListener("click", () => {
            cell.classList.toggle("wall");
        });

        grid.appendChild(cell);

        currentRow.push(cell);
    }

    cells.push(currentRow);
}

// CLEAR GRID
clearBtn.addEventListener("click", () => {

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            cells[row][col].classList.remove("wall");
        }
    }
});