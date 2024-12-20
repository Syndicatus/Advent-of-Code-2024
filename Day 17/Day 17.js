const {example1, example2, problem} = require("./Data/Data");

const computer = (regA, regB, regC, instructions) => {
    const instructionMemory = instructions.match(/\d+/g).map(x => Number(x));

    return {
        regA, regB, regC,
        Instructions: instructionMemory,
        instPointer: 0,

        output: []
    }
}

const processInstruction = (computer) => {
    const {regA, regB, regC, instPointer} = computer;
    const inst = computer.Instructions[instPointer];

    const literalOperand = computer.Instructions[instPointer + 1];
    const comboOperand = [0,1,2,3,regA,regB,regC][literalOperand];

    computer.instPointer += 2;

    switch (inst) {
        case 0:
            computer.regA = Math.floor(regA / (2**comboOperand));
            return computer;
        
        case 1:
            computer.regB = regB ^ literalOperand;
            return computer;

        case 2:
            computer.regB = (comboOperand % 8 + 8) % 8;
            return computer;

        case 3: 
            if (regA !== 0) computer.instPointer = literalOperand;
            return computer;

        case 4: 
            computer.regB = regB ^ regC;
            return computer;

        case 5: 
            computer.output.push((comboOperand % 8 + 8) % 8);
            return computer;

        case 6:
            computer.regB = Math.floor(regA / (2**comboOperand));
            return computer;
        
        case 7:
            computer.regC = Math.floor(regA / (2**comboOperand));
            return computer;

        default:
            console.log(inst);
    }
}

const processComputer = (str) => {
    const [regs, instructions] = str.split("\n\n");
    const [regA, regB, regC] = regs.match(/\d+/g).map(x => Number(x));

    const comp = computer(regA, regB, regC, instructions);

    while(comp.instPointer < comp.Instructions.length) {
        processInstruction(comp);
    }

    console.log(`Program: ${comp.output.join(",")}`);
    console.log(`Program: ${comp.output.join(",")}` === instructions);
}

const findRegA = (str) => {
    const [regs, instructions] = str.split("\n\n");
    const [_, regB, regC] = regs.match(/\d+/g).map(x => Number(x));
    
    const compPrime = computer(0, regB, regC, instructions);
    
    const findPreviousIter = (comp, inst, regA) => {
        comp.output = [];
        comp.regA = regA;
        comp.instPointer = 0;
        do {
            processInstruction(comp);
        } while (comp.output.length <= 0);

        if (comp.output[0] < 0) console.log(regA);
        console.log(comp.output);

        if (comp.output[0] !== comp.Instructions[inst]) return -1;
        
        if (inst === 0) {
            return regA;
        }

        for (let i = 0; i < 8; i++) {
            const value = findPreviousIter(comp, inst - 1, regA*8 + i)

            if (value >= 0) return value;
        }

        return -1;
    }

    for (let i = 0; i < 8; i++) {
        const value = findPreviousIter(compPrime, compPrime.Instructions.length - 1, i);

        if (value >= 0) return value;
    }
    return -1;
}

console.log(processComputer(problem))
console.log(findRegA(problem));