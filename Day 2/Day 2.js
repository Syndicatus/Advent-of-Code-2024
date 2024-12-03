const { example, problem } = require("./Data/Data");

const processLineByLine = (fn, start) => (str) => {
    return str.split("\n").reduce(fn, start);
}

const processSafety = (accumulator, line) => {
    const numbers = line.split(" ").map((num) => Number(num));

    let valid = true;

    const direction = Math.sign(numbers[1] - numbers[0]);
    let jump;
    for (let i = 1; i < numbers.length; i++) {
        jump = numbers[i] - numbers[i - 1];
        if (Math.abs(jump) > 3 || direction !== Math.sign(jump)) {
            valid = false;
            break;
        }
    }

    if (valid) return accumulator + 1;
    else return accumulator;
}

const processSafetyWithDampener = (accumulator, line) => {
    const numbers = line.split(" ").map((num) => Number(num));

    let valid = processSafety(0, line) === 1;
    if (valid) return accumulator + 1;

    for (let i = 0; i < numbers.length; i++) {
        valid = processSafety(0, numbers.toSpliced(i, 1).join(" ")) === 1
        if (valid) break;
    }

    if (valid) return accumulator + 1;
    else return accumulator;
}

const determineSafety = processLineByLine(processSafety, 0);
const determineSafetyWithDampener = processLineByLine(processSafetyWithDampener, 0);

console.log(determineSafety(example));
console.log(determineSafety(problem));
console.log(determineSafetyWithDampener(example));
console.log(determineSafetyWithDampener(problem));