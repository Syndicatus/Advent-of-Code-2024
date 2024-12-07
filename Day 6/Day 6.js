const {example, problem} = require("./Data/Data");

const addVectors = (vec1, vec2) => vec1.map((v, i) => v + vec2[i]);

const rotate90right = ([x, y]) => [-y, x];

const generateMap = (str) => {
    console.log(str);
    const rows = str.split("\n");

    const set = new Set();
    let location;

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].length; j++) {
            if (rows[i][j] === "#")
                set.add(`${[j, i]}`);
            else if (rows[i][j] === "^")
                location = [j,i];
        }
    }

    return [set, location, rows[0].length, rows.length];
}

const visualizeWalk = (locationSet, visitedSet, width, height) => {;
    let row = "";
    for (let i = 0; i < width; i++) {
        row = "";
        for(let j = 0; j < height; j++) {
            if (locationSet.has(`${[j,i]}`)) row += "#";
            else if (visitedSet.has(`${[j,i]}`)) row += "X";
            else row += " "
        }
        console.log(row);
    }
}

const walkThroughMap = (locationSet, location, width, height) => {
    let velocity = [0,-1];
    let nextLocation = addVectors(location, velocity);

    const visitedSet = new Set();
    const loopingSet = new Set();

    while (location[0] >= 0 && location[0] < width && location[1] >= 0 && location[1] < height) {
        if (locationSet.has(`${nextLocation}`)) {
            velocity = rotate90right(velocity);
        } else if (loopingSet.has(`${location} ${velocity}`)) {
            //Looping, shouldn't happen, but I'll cover it
            break;
        } else {
            visitedSet.add(`${location}`);
            loopingSet.add(`${location} ${velocity}`)
            location = nextLocation;
        }
        nextLocation = addVectors(location, velocity);
    }

    visualizeWalk(locationSet, visitedSet, width, height)

    return visitedSet.size
}

const hasLoop = (locationSet, location, width, height, velocity = [0,-1], loopingSet) => {
    let nextLocation = addVectors(location, velocity);

    while (location[0] >= 0 && location[0] < width && location[1] >= 0 && location[1] < height) {
        if (locationSet.has(`${nextLocation}`)) {
            velocity = rotate90right(velocity);
        } else if (loopingSet.has(`${location} ${velocity}`)) {
            return true;
        } else {
            loopingSet.add(`${location} ${velocity}`)
            location = nextLocation;
        }
        nextLocation = addVectors(location, velocity);
    }
    return false;
}

const walkThroughForLoops = (locationSet, startingLocaiton, width, height) => {
    let location = startingLocaiton.map(x => x)
    let velocity = [0,-1];
    let nextLocation = addVectors(location, velocity);

    const visitedSet = new Set();
    const loopingSet = new Set();

    let newLocationSet;
    let count = 0;

    while (location[0] >= 0 && location[0] < width && location[1] >= 0 && location[1] < height) {
        if (locationSet.has(`${nextLocation}`)) {
            velocity = rotate90right(velocity);
        } else {
            newLocationSet = new Set(locationSet);
            newLocationSet.add(`${nextLocation}`);
            if (!visitedSet.has(`${nextLocation}`) &&
                hasLoop(newLocationSet, location.map(x => x), width, height, velocity, new Set(loopingSet)))
                count++;

            visitedSet.add(`${location}`);
            loopingSet.add(`${location} ${velocity}`)
            location = nextLocation;
        }
        nextLocation = addVectors(location, velocity);
    }

    visualizeWalk(locationSet, visitedSet, width, height)

    return count;
}

console.log(walkThroughMap(...generateMap(example)));
console.log(walkThroughMap(...generateMap(problem)));
console.log(walkThroughForLoops(...generateMap(example)));
console.log(walkThroughForLoops(...generateMap(problem)));