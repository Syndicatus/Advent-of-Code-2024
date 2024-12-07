const {example, problem} = require("./Data/Data");

const generateRules = (ruleString) => {
    const rules = ruleString.split("\n");

    const ruleMap = new Map();

    rules.forEach(element => {
        const [value, laterValue] = element.split("|").map(v => Number(v));

        if (ruleMap.has(value)) ruleMap.get(value).push(laterValue);
        else ruleMap.set(value, [laterValue]);
    });

    return ruleMap;
}

const runTestOnPrintOrder = (ruleMap, printOrderString) => {
    const pages = printOrderString.split(",").map(v => Number(v));
    const processedSet = new Set();

    let rules;
    for (const each of pages) {
        processedSet.add(each);
        if (!ruleMap.has(each)) continue;
        rules = ruleMap.get(each);
        for (const invalidPage of rules) {
            if (processedSet.has(invalidPage)) return 0;
        }
    }

    return pages[Math.floor(pages.length/2)];
}

const fixPrintOrder = (ruleMap, orderString) => {
    const pages = orderString.split(",").map(v => Number(v));
    let arr = [];

    let rules;
    for (const each of pages) {
        if (!ruleMap.has(each)) {
            arr.push(each);
            continue;
        }
        
        rules = ruleMap.get(each);

        const insertionIndex = arr.findIndex(val => rules.includes(val));

        if (insertionIndex < 0) arr.push(each);
        else arr.splice(insertionIndex, 0, each);
    }
    return arr[Math.floor(arr.length/2)];
}

const getSumOfCenterValues = (ruleMap, printOrders) => 
    printOrders.split("\n").reduce((sum, order) => sum + runTestOnPrintOrder(ruleMap, order), 0)

const getSumOfCentersOfInvalidRules = (ruleMap, printOrders) => 
    printOrders.split("\n").reduce((sum, order) => {
        if (runTestOnPrintOrder(ruleMap, order) !== 0) return sum;
        return sum + fixPrintOrder(ruleMap, order) 
    }, 0)

const runPartOne = (str) => {
    const [rules, orders] = str.split("\n\n");

    const ruleMap = generateRules(rules);
    return getSumOfCenterValues(ruleMap, orders);
}

const runPartTwo = (str) => {
    const [rules, orders] = str.split("\n\n");
    const ruleMap = generateRules(rules);

    return getSumOfCentersOfInvalidRules(ruleMap, orders)
}

console.log(runPartOne(example));
console.log(runPartOne(problem));
console.log(runPartTwo(example));
console.log(runPartTwo(problem));

