const { example, problem } = require("./Data/Data");

const findWordsInLineOfChars = (strs) => {
    const forwards = strs.join("").match(/XMAS/g)?.length ?? 0;
    const backwards = strs.join("").match(/SAMX/g)?.length ?? 0;
    return forwards + backwards;
}

const rotate90 = (strGrid) => {
    const arr = new Array(strGrid[0].length).fill(0).map(() => new Array(strGrid.length));

    for (let i = 0; i < strGrid.length; i++)
        for (let j = 0; j < strGrid[i].length; j++) {
            arr[j][i] = strGrid[i][j];
        }

    return arr;
}

const diagonalizeDR = (strGrid) => {
    const length = strGrid.length + strGrid[0].length;
    const arr = new Array(length - 1).fill(0).map(() => new Array());

    let x, y;
    for (let i = 0; i < length; i++) {
        x = Math.max(0, strGrid[0].length - i - 1);
        y = Math.max(i + 1 - strGrid[0].length, 0);

        while (x < strGrid[0].length && y < strGrid.length) {
            arr[i].push(strGrid[x][y]);
            x++;
            y++;
        }
    }
    return arr;
}

const diagonalizeUL = (strGrid) => {
    const length = strGrid.length + strGrid[0].length;
    const arr = new Array(length).fill(0).map(() => new Array());

    let x, y;
    for (let i = 0; i < length; i++) {
        x = Math.min(i, strGrid.length - 1);
        y = Math.max(0, i + 1 - strGrid.length);

        while (x >= 0 && y < strGrid.length) {
            arr[i].push(strGrid[x][y]);
            x--;
            y++;
        }
    }
    return arr;
}

const gridify = (str) => {
    return str.split("\n").map((substr) => substr.split(""));
}

const processStr = (str) => {
    const defGrid = gridify(str);
    const rotated = rotate90(defGrid);
    const diagonalDR = diagonalizeDR(defGrid);
    const diagonalUL = diagonalizeUL(defGrid);

    const total = defGrid.concat(rotated, diagonalDR, diagonalUL);

    return total.reduce((sum, line) => sum + findWordsInLineOfChars(line), 0);
}

const isXMAS = (grid, centerX, centerY) => {
    if (grid[centerX][centerY] !== "A") return false;
    const topLeft = 
        (grid[centerX - 1][centerY - 1] === "M" && grid[centerX + 1][centerY + 1] === "S")
        || (grid[centerX - 1][centerY - 1] === "S" && grid[centerX + 1][centerY + 1] === "M");
    
    const bottomRight =
        (grid[centerX - 1][centerY + 1] === "M" && grid[centerX + 1][centerY - 1] === "S")
        || (grid[centerX - 1][centerY + 1] === "S" && grid[centerX + 1][centerY - 1] === "M");

    return topLeft && bottomRight;
}

const findXMAS = (str) => {
    const grid = gridify(str);

    let total = 0;
    for (let i = 1; i < grid.length - 1; i++) {
        for (let j = 1; j < grid[j].length - 1; j++) {
            if (isXMAS(grid, i, j))
                total++
        }
    }

    return total;
}

console.log(processStr(example));
console.log(processStr(problem));

console.log(findXMAS(example));
console.log(findXMAS(problem));