const {example, problem} = require("./Data/Data");

const generatePattern = (str) => {
    let index = 0;
    let isData = true;
    return str.split("").flatMap(num => {
        const temp = new Array(Number(num)).fill(isData ? index++ : -1);
        isData = !isData;
        return temp;
    })
};

const buildFiles = (str) => {
    const files = [];
    let fileNum = 0;
    let index = 0;
    let isData = true;

    for (const num of str) {
        files.push({
            Name: isData ? fileNum++ : -1,
            start: index,
            length: Number(num)
        })
        index += Number(num);
        isData = !isData;
    }

    return files;
}

const moveBlocks = (pattern) => {
    let i = 0;
    let temp = 0;

    while (i < pattern.length - 1) {
        temp = pattern.pop();
        if (temp === -1) continue;

        while (pattern[i] !== -1 && i < pattern.length) i++;

        pattern[i] = temp;
    }

    return pattern;
}

const moveFiles = (filesAndSpaces) => {
    const files = filesAndSpaces.filter(file => file.Name >= 0);
    const spaces = filesAndSpaces.filter(file => file.Name < 0);

    for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];
        let fileLocation = file.start;

        let spaceIndex = 0;
        while (spaceIndex < spaces.length && spaces[spaceIndex].start < fileLocation) {
            if (spaces[spaceIndex].length >= file.length) {
                file.start = spaces[spaceIndex].start;
                spaces[spaceIndex].length = spaces[spaceIndex].length - file.length;
                spaces[spaceIndex].start = spaces[spaceIndex].start + file.length;
                break;
            }
            spaceIndex++;
        }
    }

    console.log(files);
    return files;
}

const generateCheckSum = arr => arr.reduce((a, v, i) => a + v*i)
const fileCheckSum = fileArr => fileArr.reduce((a, file) => {
    return file.Name*((file.length * (file.length - 1))/2 + file.length*file.start) + a;
}, 0)

console.log(generateCheckSum(moveBlocks(generatePattern(example))));
console.log(generateCheckSum(moveBlocks(generatePattern(problem))));

console.log(fileCheckSum(moveFiles(buildFiles(example))));
console.log(fileCheckSum(moveFiles(buildFiles(problem))));