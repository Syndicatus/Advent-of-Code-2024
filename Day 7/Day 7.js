const {example, problem} = require("./Data/Data");

const add = a => b => a + (b ?? 0);
const mul = a => b => a * (b ?? 1);
const concat = a => b => Number((b ?? "") + `${a}`);

const duplicateAndApplyFuncs = (func1, func2) => (accumulator, value) =>
    [...accumulator.map(func1(value)), ...accumulator.map(func2(value))];

const performManyFuncs = (funcArr) => (accumulator, value) => funcArr.flatMap(f => accumulator.map(f(value)));

const processFunction = (line) => {
    const [answerStr, numberStrs] = line.split(": ");
    const answer = Number(answerStr);
    const [first, ...rest] = numberStrs.split(" ").map(x => Number(x));

    const possibleAnswers = rest.reduce(duplicateAndApplyFuncs(add, mul), [first]);

    return possibleAnswers.find(x => x === answer) ?? 0;
}

const newProcessFunction = (line) => {
    const [answerStr, numberStrs] = line.split(": ");
    const answer = Number(answerStr);
    const [first, ...rest] = numberStrs.split(" ").map(x => Number(x));

    const possibleAnswers = rest.reduce(performManyFuncs([add, mul, concat]), [first]);

    return possibleAnswers.find(x => x === answer) ?? 0;
}

const processGroup = lines => lines.split("\n").reduce((a, l) => a + processFunction(l), 0);
const newProcessGroup = lines => lines.split("\n").reduce((a, l) => a + newProcessFunction(l), 0);

console.log(processGroup(example));
console.log(processGroup(problem));
console.log(newProcessGroup(example));
console.log(newProcessGroup(problem));