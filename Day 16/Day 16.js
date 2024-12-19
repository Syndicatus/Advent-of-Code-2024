const {example1, example2, problem} = require("./Data/Data");

const nodeDistance = ({x: lx, y: ly}, {x: endX, y: endY}) => {
    return Math.sqrt((lx - endX)**2 + (ly - endY)**2)
}

const aStar = (map) => {
    let end;

    const nodesToEvaluate = [];
    const nodesEvaluated = new Set();

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++){
            if (map[y][x] === 'E') end = {x, y};
            if (map[y][x] === 'S') nodesToEvaluate.push({
                location: {x, y},
                direction: {x: 1, y: 0},
                travelCost: 0,
                distance: Infinity,
                parent: null
            })
        }
    }

    nodesToEvaluate[0].distance = nodeDistance(nodesToEvaluate[0].location, end);

    while (nodesToEvaluate.length > 0) {
        nodesToEvaluate.sort((a, b) => {
            const cost = (b.distance + b.travelCost) - (a.distance + a.travelCost);
            if (cost !== 0) return cost;
            return b.distance - a.distance;
        });

        const currentNode = nodesToEvaluate.pop();
        const {location, direction} = currentNode;

        if (location.x === end.x && location.y === end.y) return currentNode;
        
        nodesEvaluated.add(`${location.x} ${location.y} ${direction.x} ${direction.y}`);
        
        const forwardLocation = {x: location.x + direction.x, y: location.y + direction.y}
        const forwardNode = {
            operation: "Move",
            location: forwardLocation,
            direction: currentNode.direction,
            travelCost: currentNode.travelCost + 1,
            distance: nodeDistance(forwardLocation, end),
            parent: currentNode
        }
        
        const turnLeftNode = {
            ...currentNode,
            operation: "Turn Left",
            direction: {x: direction.y, y: -direction.x},
            travelCost: currentNode.travelCost + 1000,
            parent: currentNode
        }
        
        const turnRightNode = {
            ...currentNode,
            operation: "Turn Right",
            direction: {x: -direction.y, y: direction.x},
            travelCost: currentNode.travelCost + 1000,
            parent: currentNode
        }
        
        const validNodes = [forwardNode, turnLeftNode, turnRightNode].filter((node) => {
            const {location, direction} = node;
            if (map[location.y][location.x] === '#') return false;
            return !nodesEvaluated.has(`${location.x} ${location.y} ${direction.x} ${direction.y}`);
        })
        
        for (const each of validNodes) {
            const index = nodesToEvaluate.findIndex((potentialDuplicate) =>
                potentialDuplicate.location.x === each.location.x
                && potentialDuplicate.location.y === each.location.y
                && potentialDuplicate.direction.x === each.direction.x
                && potentialDuplicate.direction.y === each.direction.y
                && potentialDuplicate.travelCost > each.travelCost
            )
        
            if (index < 0) nodesToEvaluate.push(each);
            else nodesToEvaluate[index] = each;
        }
        
        // if (location.x === 1 && location.y === 15) console.log("Current: ", currentNode);
        // if (location.x === 1 && location.y === 15) console.log("All Evaled: ", nodesEvaluated);
        // if (location.x === 1 && location.y === 15) console.log("Next Location: ", forwardLocation);
        // if (location.x === 1 && location.y === 15) console.log("List of Valid Nodes: ", validNodes);
        // if (location.x === 1 && location.y === 15) console.log("List of Nodes: ", nodesToEvaluate);
    }

    return 0;
}

const manyStar = (map) => {
    let end;

    const nodesToEvaluate = [];
    const nodesEvaluated = new Map();

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++){
            if (map[y][x] === 'E') end = {x, y};
            if (map[y][x] === 'S') nodesToEvaluate.push({
                location: {x, y},
                direction: {x: 1, y: 0},
                travelCost: 0,
                distance: Infinity,
                parent: [null]
            })
        }
    }

    nodesToEvaluate[0].distance = nodeDistance(nodesToEvaluate[0].location, end);

    while (nodesToEvaluate.length > 0) {
        nodesToEvaluate.sort((a, b) => {
            const cost = (b.distance + b.travelCost) - (a.distance + a.travelCost);
            if (cost !== 0) return cost;
            return b.distance - a.distance;
        });

        const currentNode = nodesToEvaluate.pop();
        const {location, direction} = currentNode;
        
        if (nodesEvaluated.has(`${location.x} ${location.y} ${direction.x} ${direction.y}`)) {
            const thatNode = nodesEvaluated.get(`${location.x} ${location.y} ${direction.x} ${direction.y}`);
            // if (location.x === 6 && location.y === 7) console.log("Has Location", thatNode, currentNode);
            if (thatNode.travelCost >= currentNode.travelCost) {
                // console.log("Adding Nodes")
                thatNode.parent.push(...currentNode.parent);
            }
            continue;
        } else {
            nodesEvaluated.set(`${location.x} ${location.y} ${direction.x} ${direction.y}`, currentNode)
        }
        
        if (location.x === end.x && location.y === end.y) {
            continue;
        };
        
        const forwardLocation = {x: location.x + direction.x, y: location.y + direction.y}
        const forwardNode = {
            operation: "Move",
            location: forwardLocation,
            direction: currentNode.direction,
            travelCost: currentNode.travelCost + 1,
            distance: nodeDistance(forwardLocation, end),
            parent: [currentNode]
        }
        
        const turnLeftNode = {
            ...currentNode,
            operation: "Turn Left",
            direction: {x: direction.y, y: -direction.x},
            travelCost: currentNode.travelCost + 1000,
            parent: [currentNode]
        }
        
        const turnRightNode = {
            ...currentNode,
            operation: "Turn Right",
            direction: {x: -direction.y, y: direction.x},
            travelCost: currentNode.travelCost + 1000,
            parent: [currentNode]
        }
        
        const validNodes = [forwardNode, turnLeftNode, turnRightNode].filter((node) => {
            const {location} = node;
            return map[location.y][location.x] !== '#'
        })
        
        for (const each of validNodes) {
            const index = nodesToEvaluate.findIndex((potentialDuplicate) =>
                potentialDuplicate.location.x === each.location.x
                && potentialDuplicate.location.y === each.location.y
                && potentialDuplicate.direction.x === each.direction.x
                && potentialDuplicate.direction.y === each.direction.y
                && potentialDuplicate.travelCost > each.travelCost
            )
        
            if (index < 0) nodesToEvaluate.push(each);
            else nodesToEvaluate[index] = each;
        }
        
        // if (location.x === 1 && location.y === 15) console.log("Current: ", currentNode);
        // if (location.x === 1 && location.y === 15) console.log("All Evaled: ", nodesEvaluated);
        // if (location.x === 1 && location.y === 15) console.log("Next Location: ", forwardLocation);
        // if (location.x === 1 && location.y === 15) console.log("List of Valid Nodes: ", validNodes);
        // if (location.x === 1 && location.y === 15) console.log("List of Nodes: ", nodesToEvaluate);
    }

    const getNodesAtLocation = (loc) => {
        const nodes = [
            nodesEvaluated.get(`${loc.x} ${loc.y} 0 1`), 
            nodesEvaluated.get(`${loc.x} ${loc.y} -1 0`), 
            nodesEvaluated.get(`${loc.x} ${loc.y} 1 0`), 
            nodesEvaluated.get(`${loc.x} ${loc.y} 0 -1`)]
            .filter(node => node !== undefined);

        const distance = nodes.reduce((acc, node) => Math.min(acc ,node.travelCost), Number.MAX_SAFE_INTEGER);
        return nodes.filter(node => node.travelCost === distance);
    }

    return getNodesAtLocation(end);
}

const performTest = (str) => {
    const map = str.split("\n");
    const node = aStar(map);

    console.log(node.travelCost)
    
    const locationSet = new Set();
    
    let n = node;
    while (n !== null) {
        // console.log(n.operation, n.location.x, n.location.y);
        locationSet.add(`${n.location.x} ${n.location.y}`);
        n = n.parent;
    }

    for (let y = 0; y < map.length; y++) {
        let temp = "";
        for (let x = 0; x < map[y].length; x++) {
            if (locationSet.has(`${x} ${y}`)) temp += "O";
            else temp += map[y][x];
        }
        console.log(temp);
    }
}

const addToSet = (set, node) => {
    if (node === null) return;
    set.add(`${node.location.x} ${node.location.y}`);
    node.parent.forEach(parent => addToSet(set, parent));
}

const performTest2 = (str) => {
    const map = str.split("\n");

    const nodes = manyStar(map);

    const locationSet = new Set();

    for (const node of nodes) addToSet(locationSet, node);

    for (let y = 0; y < map.length; y++) {
        let temp = "";
        for (let x = 0; x < map[y].length; x++) {
            if (locationSet.has(`${x} ${y}`)) temp += "O";
            else temp += map[y][x];
        }
        console.log(temp);
    }
    
    console.log(locationSet.size);
}

// performTest(problem);
performTest2(example1);
performTest2(example2);
performTest2(problem);