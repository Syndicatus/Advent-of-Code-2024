const {exampleSmaller, exampleSmall, exampleLarge, problem} = require("./Data/Data");

const move = (x, y, dir) => {
    switch (dir) {
        case 'v': 
            return [x, y + 1]
        case '^':
            return [x, y - 1]
        case '>':
            return [x + 1, y]
        case '<':
            return [x - 1, y]
        default:
            return [0,0];
    }
}

const moveRobot = (map, instructions) => {
    let xRobot = 0;
    let yRobot = 0;

    // console.log(map.map(x => x.join("")).join("\n"));

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "@") {
                xRobot = x;
                yRobot = y;
                y = map.length - 1;
                x = map[y - 1].length;
            }
        }
    }

    let nextX = 0;
    let nextY = 0;
    let moved = false;

    for (const each of instructions) {
        nextX = xRobot;
        nextY = yRobot;
        while (true) {
            moved = true;
            [nextX, nextY] = move(nextX, nextY, each);

            let char = map[nextY][nextX];
            if (char === '#') {
                moved = false;
                break;
            } else if (char === '.') {
                break;
            }
        }

        let dir = Math.sign(nextX - xRobot);
        for (let i = nextX; moved && i !== xRobot; i -= dir) {
            map[yRobot][i] = map[yRobot][i - dir];
        }
        dir = Math.sign(nextY - yRobot);
        for (let i = nextY; moved && i !== yRobot; i -= dir) {            
            map[i][xRobot] = map[i - dir][xRobot];
        }

        map[yRobot][xRobot] = '.';

        if (moved) [xRobot, yRobot] = move(xRobot, yRobot, each);

        map[yRobot][xRobot] = '@';

        // console.log(map.map(x => x.join("")).join("\n"));

    }

    // console.log(map.map(x => x.join("")).join("\n"));

    let res = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "O") {
                res += 100*y + x;
            }
        }
    }
    return res;
}

const increaseMap = (mapStr) => mapStr.split("\n").map(rowStr => {
    let result = "";
    for (const letter of rowStr) {
        if (letter === '@') {
            result += '@.';
            continue;
        } else if (letter === "O") {
            result += '[]';
            continue;
        }
        result += letter.repeat(2);
    }
    return result.split("");
})

const generateMap = (mapStr) => mapStr.split("\n").map(rowStr => rowStr.split(""));

const process1 = (str) => {
    const [mapStr, instructions] = str.split("\n\n");

    const map = generateMap(mapStr);
    const res = moveRobot(map, instructions);

    return res;
}


const recursiveMovement = (map, x, y, direction, locations = []) => {
    const [nX, nY] = move(x, y, direction);

    locations.push([x,y, map[y][x]]);

    if (map[nY][nX] === undefined) throw Error(`${x}, ${y}, ${direction}`)
    if (map[nY][nX] === '.') return true;
    else if (map[nY][nX] === '#') return false;
    else if (map[nY][nX] === '[' && direction !== '<' && direction !== '>') 
        return recursiveMovement(map, nX, nY, direction, locations) && recursiveMovement(map, nX + 1, nY, direction, locations);
    else if (map[nY][nX] === ']' && direction !== '<' && direction !== '>') 
        return recursiveMovement(map, nX, nY, direction, locations) && recursiveMovement(map, nX - 1, nY, direction, locations);
    else 
        return recursiveMovement(map, nX, nY, direction, locations);
}

const moveRobotRecursive = (map, instructions) => {
    let xRobot = 0;
    let yRobot = 0;

    // console.log(map.map(x => x.join("")).join("\n"));

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "@") {
                xRobot = x;
                yRobot = y;
                y = map.length - 1;
                x = map[y - 1].length;
            }
        }
    }

    for (const each of instructions) {
        const cellsToMove = [];

        const canMove = recursiveMovement(map, xRobot, yRobot, each, cellsToMove);

        if (!canMove) continue;

        for (const [x, y] of cellsToMove) {
            map[y][x] = '.';
        }

        for (const [x, y, val] of cellsToMove) {
            const [nX, nY] = move(x, y, each);
            map[nY][nX] = val;
        }

        [xRobot, yRobot] = move(xRobot, yRobot, each);

        // console.log(each);
        // console.log(map.map(x => x.join("")).join("\n"));
    }

    console.log(map.map(x => x.join("")).join("\n"));

    let res = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "[") {
                res += y*100 + x;
                x++;
            }
        }
    }
    return res;
}

const process2 = (str) => {
    const [mapStr, instructions] = str.split("\n\n");

    const map = increaseMap(mapStr);
    const res = moveRobotRecursive(map, instructions);

    return res;
}

console.log(process2(problem));

