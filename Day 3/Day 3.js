const { example, example2, problem } = require("./Data/Data");

const sumMultiplications = (str) => {
    const problems = str.match(/mul\(\d{1,3},\d{1,3}\)/g).map((each) => each.match(/\d+,\d+/g)[0].split(",").map(Number));
    
    return problems.reduce((acc, [a, b]) => acc + a*b, 0);
}

const sumMultiplicationWithDos = (str) => {
    const problems = str.match(/do(n't)?\(\)|mul\(\d{1,3},\d{1,3}\)/g).map((each) => {
        if (each[0] === "d") return each;
        return each.match(/\d+,\d+/g)[0].split(",").map(Number);
    });

    let sum = 0;
    let active = true;
    
    for (const each of problems) {
        if (each === "do()") active = true;
        else if (each === "don't()") active = false;
        else if (active) {
            sum += each[0]*each[1]
        }
    }

    return sum;
}

console.log(sumMultiplications(example));
console.log(sumMultiplications(problem));
console.log(sumMultiplicationWithDos(example2));
console.log(sumMultiplicationWithDos(problem));