const {example, problem} = require("./Data/Data");

const solvedMap = new Map([[0,1]]);
const solvedDepthMap = new Map()

const processNumbers = list => list.flatMap((n) => {
    if (solvedMap.has(n)) return solvedMap.get(n);

    const digits = Math.floor(Math.log10(n)) + 1;
    if (digits % 2 === 0) solvedMap.set(n, [Math.floor(n/(10**(digits/2))), n % 10**(digits/2)])
    else solvedMap.set(n, n*2024);
    return solvedMap.get(n);
});

const processBatch = (str, max = 25) => {
    let list = str.split(" ").map(x => Number(x));

    for (let i = 0; i < max; i++) list = processNumbers(list);

    return list.length;
}



const processBatchRecursive = (num, depth) => {
    const id = `${num} ${depth}`;
    if (solvedDepthMap.has(id)) return solvedDepthMap.get(id);
    if (depth === 0) return 1;
    const length = processNumbers([num]).reduce((a, v) => a + processBatchRecursive(v, depth - 1), 0);
    solvedDepthMap.set(id, length);
    return length;
}

const newProcessBatch = (str, depth = 25) =>
    str.split(" ").map(x => Number(x)).reduce((s, x) => s + processBatchRecursive(x, depth), 0);


console.log(processBatch(example));
console.log(newProcessBatch(example));
console.log(processBatch(problem));
console.log(newProcessBatch(problem));
console.log(newProcessBatch(example, 75));
console.log(newProcessBatch(problem, 75));