const {example1, example2, problem} = require("./Data/Data");

const patternBuilder = (str) => {
    const patterns = str.split(", ");

    const mapping = {};

    for (const str of patterns) {
        let subMap = mapping;
        for (const char of str) {
            if (subMap[char] === undefined) subMap[char] = {};
            subMap = subMap[char];
            if (!("end" in subMap)) subMap.end = false;
        }
        subMap.end = true;
    }

    return mapping;
}

const traversePattern = (str, index, pattern) => {
    if (index >= str.length) return true;

    
    let char = str[index];
    let subMap = pattern;
    
    while (index < str.length) {
        if (subMap !== undefined && char in subMap) {
            subMap = subMap[char];
            if (subMap.end && traversePattern(str, index + 1, pattern)) return true; 
        } else {
            return false;
        }

        char = str[++index];
    }

    return subMap.end;
}

const traversePatternWithCount = (preprocessedMap, str, index, pattern) => {
    const ogIndex = index;
    if (index >= str.length) return 1;
    if (preprocessedMap.has(str + index)) return preprocessedMap.get(str + index);

    
    let char = str[index];
    let subMap = pattern;

    let count = 0;
    
    while (index < str.length) {
        if (subMap !== undefined && char in subMap) {
            subMap = subMap[char];
            if (subMap.end) {
                count += traversePatternWithCount(preprocessedMap, str, index + 1, pattern)
            } 
        } else {
            preprocessedMap.set(str + ogIndex, count);
            return count;
        }

        char = str[++index];
    }
    preprocessedMap.set(str + ogIndex, count);
    return count;
}

const processString = (str) => {
    const [patternStr, patterns] = str.split("\n\n");

    const patternMap = patternBuilder(patternStr);

    let total = 0;

    for (const towelSet of patterns.split("\n")) {
        if (traversePattern(towelSet, 0, patternMap)) total++;
    }

    console.log(total);
}


const processStringWithCount = (str) => {
    const [patternStr, patterns] = str.split("\n\n");

    const patternMap = patternBuilder(patternStr);

    let total = 0;

    for (const towelSet of patterns.split("\n")) {
        total += traversePatternWithCount(new Map(), towelSet, 0, patternMap);
    }

    console.log(total);
}

processString(example1);
processString(problem);
processStringWithCount(example1);
processStringWithCount(problem);