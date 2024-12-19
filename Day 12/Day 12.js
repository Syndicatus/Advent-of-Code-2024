const {example, problem} = require("./Data/Data");

const calculatePerimeter = (regionSet) => {
    let regionPerimeter = 0;
    regionSet.forEach(element => {
        const [x,y] = element.split(" ").map(x => Number(x));
        let localPerimeter = 4;
        if (regionSet.has(`${x - 1} ${y}`)) localPerimeter--;
        if (regionSet.has(`${x + 1} ${y}`)) localPerimeter--;
        if (regionSet.has(`${x} ${y - 1}`)) localPerimeter--;
        if (regionSet.has(`${x} ${y + 1}`)) localPerimeter--;
        regionPerimeter += localPerimeter;
    });
    return regionPerimeter
}

const calculateSides = (regionSet = new Set()) => {
    let sides = 0;
    
    const topSet = new Set();
    const bottomSet = new Set();
    const leftSet = new Set();
    const rightSet = new Set();

    regionSet.forEach(element => {
        const [x,y] = element.split(" ").map(x => Number(x));
        if (!regionSet.has(`${x - 1} ${y}`)) leftSet.add(element);
        if (!regionSet.has(`${x + 1} ${y}`)) rightSet.add(element);
        if (!regionSet.has(`${x} ${y - 1}`)) topSet.add(element);
        if (!regionSet.has(`${x} ${y + 1}`)) bottomSet.add(element);
    });

    while (topSet.size > 0) {
        sides++;
        const [fX, fY] = topSet.values().next().value.split(" ").map(x => Number(x));
        let nX;
        for (nX = fX; topSet.has(`${nX} ${fY}`); nX--) {
            topSet.delete(`${nX} ${fY}`);
        }
        for (nX = fX + 1; topSet.has(`${nX} ${fY}`); nX++) {
            topSet.delete(`${nX} ${fY}`);
        }
    }

    while (bottomSet.size > 0) {
        sides++;
        const [fX, fY] = bottomSet.values().next().value.split(" ").map(x => Number(x));
        let nX;
        for (nX = fX; bottomSet.has(`${nX} ${fY}`); nX--) {
            bottomSet.delete(`${nX} ${fY}`);
        }
        for (nX = fX + 1; bottomSet.has(`${nX} ${fY}`); nX++) {
            bottomSet.delete(`${nX} ${fY}`);
        }
    }

    while (leftSet.size > 0) {
        sides++;
        const [fX, fY] = leftSet.values().next().value.split(" ").map(x => Number(x));
        let nY;
        for (nY = fY; leftSet.has(`${fX} ${nY}`); nY--) {
            leftSet.delete(`${fX} ${nY}`);
        }
        for (nY = fY + 1; leftSet.has(`${fX} ${nY}`); nY++) {
            leftSet.delete(`${fX} ${nY}`);
        }
    }

    while (rightSet.size > 0) {
        sides++;
        const [fX, fY] = rightSet.values().next().value.split(" ").map(x => Number(x));
        let nY;
        for (nY = fY; rightSet.has(`${fX} ${nY}`); nY--) {
            rightSet.delete(`${fX} ${nY}`);
        }
        for (nY = fY + 1; rightSet.has(`${fX} ${nY}`); nY++) {
            rightSet.delete(`${fX} ${nY}`);
        }
    }

    return sides;
}

const calculateCost = (regionSet) =>
    regionSet.size*calculatePerimeter(regionSet);

const calculateBulkCost = (regionSet) =>
    regionSet.size*calculateSides(regionSet);

const floodFill = (rows, x, y, letter, processedSet) => {
    let lowestX = Number.MAX_SAFE_INTEGER;
    let lowestY = Number.MAX_SAFE_INTEGER;
    const regionSet = new Set();

    const thingsToProcess = [[x,y]];

    while(thingsToProcess.length > 0) {
        const [currentX, currentY] = thingsToProcess.pop();

        if (currentX < lowestX) {
            lowestX = currentX;
            lowestY = currentY;
        }

        regionSet.add(`${currentX} ${currentY}`);
        processedSet.add(`${currentX} ${currentY}`);
        
        const lowX = currentX - 1;
        const highX = currentX + 1;
        const lowY = currentY - 1;
        const highY = currentY + 1;

        [[lowX,currentY],[highX,currentY],[currentX, lowY],[currentX, highY]].forEach(([cx,cy]) => {
            if (cx < 0 || cx >= rows[0].length || cy < 0 || cy >= rows.length) return;
            if (rows[cy][cx] !== letter) return;
            if (processedSet.has(`${cx} ${cy}`)) return;
            thingsToProcess.push([cx, cy]);
        });
    }

    return [lowestX, lowestY, regionSet];
}

const buildRegions = (str) => {
    const rows = str.split("\n");

    const processedSet = new Set();
    const regionsMap = new Map();

    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            if (processedSet.has(`${x} ${y}`)) continue;
            const letter = rows[y][x];
            const [lX, lY, region] = floodFill(rows, x, y, letter, processedSet);
            regionsMap.set(`${lX} ${lY} ${letter}`, region);
        }
    }

    return regionsMap;
}

const calculateTotalCost = (regionsMap) => {
    let returnValue = 0;
    for (const [id, regionSet] of regionsMap) {
        returnValue += calculateCost(regionSet);
    }
    return returnValue;
}

const calculateTotalBulkCost = (regionsMap) => {
    let returnValue = 0;
    for (const [id, regionSet] of regionsMap) {
        returnValue += calculateBulkCost(regionSet);
    }
    return returnValue;
}

console.log(calculateTotalCost(buildRegions(example)));
console.log(calculateTotalCost(buildRegions(problem)));
console.log(calculateTotalBulkCost(buildRegions(example)));
// console.log(calculateTotalBulkCost(buildRegions(ABA)));
console.log(calculateTotalBulkCost(buildRegions(problem)));