const {example, problem, TProb} = require("./Data/Data");

const printMap = (map, set, sizeX, sizeY) => {
    const arr = new Array(sizeY).fill(1).map(() => new Array(sizeX).fill(" "));
    for (const v of set) {
        const [x,y] = v.split(" ").map(x => Number(x));
        arr[y][x] = '#';
    }

    for (const [key, vals] of map) {
        vals.forEach(([x,y]) => arr[y][x] = key);
    }

    console.log('-'.repeat(sizeX + 2));
    console.log(arr.map((sArr) => `|${sArr.join("")}|`).join("\n"));
    console.log('-'.repeat(sizeX + 2));
}

const findLocation = ([x1, y1], [x2, y2]) =>
    [2*x1 - x2, 2*y1 - y2]

const generateFrequencies = (mapText) => {
    const frequencyMap = new Map();
    const rows = mapText.split("\n").filter(s => s.length > 0);

    let char = "";
    let list = [];
    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            char = rows[y][x]
            if (char === ".") continue;
            list = frequencyMap.get(char) ?? [];
            list.push([x,y]);
            frequencyMap.set(char, list);
        }
    }
    return [frequencyMap, rows[0].length, rows.length];
}

const processFrequency = (transmitters, sizeX, sizeY, set) => {
    for (let i = 0; i < transmitters.length; i++) {
        for (let j = 0; j < transmitters.length; j++) {
            if (i === j) continue;
            const [x, y] = findLocation(transmitters[i], transmitters[j]);
            if (x < 0 || x >= sizeX || y < 0 || y >= sizeY) continue;
            set.add(`${x} ${y}`);
        }
    }
}

const processFrequencies = (map, sizeX, sizeY) => {
    const set = new Set();

    for (const each of map) {
        processFrequency(each[1], sizeX, sizeY, set);
    }

    return set.size;
}

const processWithResonances = (sizeX, sizeY) => ([x1, y1], [x2, y2], set) => {
    const slope = (y2 - y1)/(x2 - x1);
    const line = (x) => slope*x + -x1*slope + y1

    if (slope === Infinity) {
        for (let i = 0; i < sizeY; i++) {
            set.add(`${x1} ${i}`);
        }
        return;
    }

    let y = 0;
    for (let x = 0; x < sizeX; x++) {
        y = line(x);

        if (y < 0 || Math.round(y) >= sizeY) continue;
        if (Math.abs(y - Math.round(y)) >= 0.001) continue;
        
        
        set.add(`${x} ${Math.round(y)}`);
    }
}

const processFrequenciesWithRes = (map, sizeX, sizeY) => {
    const set = new Set();
    const process = processWithResonances(sizeX, sizeY);

    for (const [key, loop] of map) {
        for (let i = 0; i < loop.length - 1; i++) {
            for (let j = i + 1; j < loop.length; j++) {
                process(loop[i], loop[j], set);
            }
        }
    }

    printMap(map, set, sizeX, sizeY);

    return set.size;
}

const [tFrequency, tSizeX, tSizeY] = generateFrequencies(TProb);
const [exampleFrequency, eSizeX, eSizeY] = generateFrequencies(example);
const [problemFrequency, pSizeX, pSizeY] = generateFrequencies(problem);

console.log(exampleFrequency);

console.log(processFrequencies(exampleFrequency, eSizeX, eSizeY));
console.log(processFrequencies(problemFrequency, pSizeX, pSizeY));
console.log(processFrequenciesWithRes(exampleFrequency, eSizeX, eSizeY));
console.log(processFrequenciesWithRes(problemFrequency, pSizeX, pSizeY));