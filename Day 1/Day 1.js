const {example, problem} = require("./Data/Data");

const createColumns = (str) => {
    const columnA = str.match(/\d+   /g).map(a => Number(a.trim()));
    const columnB = str.match(/   \d+/g).map(b => Number(b.trim()));

    return [columnA, columnB];
}

const calculateDistance = (str) => {
    const [columnA, columnB] = createColumns(str);

    columnA.sort((a, b) => a - b);
    columnB.sort((a, b) => a - b);

    return columnA.reduce((acc, a, i) => {

        return acc + Math.abs(a - columnB[i]);
    }, 0)
}

const generateSimilarityScore = (str) => {
    const [columnA, columnB] = createColumns(str);

    const bMap = new Map();
    columnB.forEach(element => {
        if (!bMap.has(element)) bMap.set(element, 1);
        else bMap.set(element, bMap.get(element) + 1);
    });

    return columnA.reduce((acc, a) => {
        if (!bMap.has(a)) return acc;
        return acc + a*bMap.get(a);
    }, 0);
}

// console.log(calculateDistance(example));
// console.log(calculateDistance(problem));

console.log(generateSimilarityScore(example));
console.log(generateSimilarityScore(problem));