const {example, problem} = require("./Data/Data");

const solveIndividual = ([ax, ay], [bx, by], [tx, ty]) => {
    const aSlope = ay/ax;

    const bPresses = Math.round((ty - aSlope*tx) / (by - aSlope*bx) * 1000)/1000;

    
    const aPresses = (tx - bx*bPresses)/ax;
    
    if (bPresses !== Math.round(bPresses)) return [-1,-1];
    
    return [aPresses, bPresses];
}

const priceOnProblem = probStr => {
    const [ax, ay, bx, by, tx, ty] = probStr.match(/[XY][+=]\d+/g).map(s => Number(s.slice(2)));

    if (isNaN(ax) || isNaN(ay) || isNaN(bx) || isNaN(by) || isNaN(tx) || isNaN(ty))
        console.log(ax, ay, bx, by, tx, ty);

    const [aP, bP] = solveIndividual([ax, ay], [bx, by], [tx, ty]);

    if (aP < 0) return 0;

    // console.log(aP, bP);

    return aP*3 + bP;
}

const priceOnProblemWith10000000000000 = probStr => {
    const [ax, ay, bx, by, tx, ty] = probStr.match(/[XY][+=]\d+/g).map(s => Number(s.slice(2)));

    if (isNaN(ax) || isNaN(ay) || isNaN(bx) || isNaN(by) || isNaN(tx) || isNaN(ty))
        console.log(ax, ay, bx, by, tx, ty);

    const [aP, bP] = solveIndividual([ax, ay], [bx, by], [tx + 10000000000000, ty + 10000000000000]);

    if (aP < 0) return 0;

    // console.log(aP, bP);

    return aP*3 + bP;
}

const solveGroup = (str) => {
    const problems = str.split("\n\n");
    return problems.reduce((a, p) => a + priceOnProblem(p),0);
}

const solveGroupWith10000000000000 = (str) => {
    const problems = str.split("\n\n");
    return problems.reduce((a, p) => a + priceOnProblemWith10000000000000(p),0);
}

console.log(solveGroup(example));
console.log(solveGroup(problem));
console.log(solveGroupWith10000000000000(example));
console.log(solveGroupWith10000000000000(problem));
