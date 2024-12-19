const {example, problem} = require("./Data/Data");

const processTrailPart = (map, x, y, previous = -1, locationSet) => {
    if (x < 0 || x >= map[0].length) return;
    if (y < 0 || y >= map.length) return;

    const level = map[y][x];
    if (level !== previous + 1) return;
    if (level === 9) {
        locationSet.add(`${x} ${y}`);
        return;
    };
    
    processTrailPart(map, x - 1, y, level, locationSet)
    processTrailPart(map, x + 1, y, level, locationSet)
    processTrailPart(map, x, y - 1, level, locationSet)
    processTrailPart(map, x, y + 1, level, locationSet)
}

const processTrail = (map, x, y) => {
    if (map[y][x] !== 0) return 0;
    const locationSet = new Set();
    processTrailPart(map, x, y, -1, locationSet);
    return locationSet.size;
};

const processTrailRating = (map, x, y, previous = -1) => {
    if (x < 0 || x >= map[0].length) return 0;
    if (y < 0 || y >= map.length) return 0;

    const level = map[y][x];
    if (level !== previous + 1) return 0;
    if (level === 9) return 1;
    
    return (
        processTrailRating(map, x - 1, y, level)
        + processTrailRating(map, x + 1, y, level)
        + processTrailRating(map, x, y + 1, level)
        + processTrailRating(map, x, y - 1, level)
    );
}

const processString = (str) => {
    const strs = str.split("\n");
    const map = strs.map(substr => substr.split("").map(x => Number(x)));

    let result = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            result += processTrail(map, x, y);
        }
    }
    return result;
}

const processStringRating = (str) => {
    const strs = str.split("\n");
    const map = strs.map(substr => substr.split("").map(x => Number(x)));

    let result = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            result += processTrailRating(map, x, y);
        }
    }
    return result;
}

console.log(processString(example));
console.log(processString(problem));
console.log(processStringRating(example));
console.log(processStringRating(problem));