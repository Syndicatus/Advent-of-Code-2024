const {example1, example2, problem} = require("./Data/Data");

const nodeDistance = ({x: lx, y: ly}, {x: endX, y: endY}) => {
    return Math.sqrt((lx - endX)**2 + (ly - endY)**2)
}

const aStar = (map) => {
    let end = {x: map[0].length, y: map.length};

    const nodesToEvaluate = [];
    const nodesEvaluated = new Set();

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++){
            if (map[y][x] === 'E') end = {x, y};
            if (map[y][x] === 'S') nodesToEvaluate.push({
                location: {x, y},
                travelCost: 0,
                distance: Infinity,
                parent: null
            })
        }
    }

    nodesToEvaluate[0].distance = nodeDistance(nodesToEvaluate[0].location, end);

    let nodesEvaled = 0;

    while (nodesToEvaluate.length > 0) {
        nodesToEvaluate.sort((a, b) => {
            const cost = (b.distance + b.travelCost) - (a.distance + a.travelCost);
            if (cost !== 0) return cost;
            return b.distance - a.distance;
        });

        const currentNode = nodesToEvaluate.pop();
        const {location} = currentNode;

        if (location.x === end.x && location.y === end.y) return currentNode;
        
        if (nodesEvaluated.has(`${location.x} ${location.y}`)) console.log("What is happening");
        nodesEvaluated.add(`${location.x} ${location.y}`);
        
        const north = {x: location.x, y: location.y - 1};
        const south = {x: location.x, y: location.y + 1};
        const east = {x: location.x + 1, y: location.y};
        const west = {x: location.x - 1, y: location.y};
        
        const validNodes = [north, east, south, west].filter((pos) => {
            if (pos.y < 0 || pos.y >= map.length || pos.x < 0 || pos.x >= map[0].length) return false;
            if (map[pos.y][pos.x] === '#') return false;
            return !nodesEvaluated.has(`${pos.x} ${pos.y}`);
        }).map(pos => {
            return {
                location: pos,
                travelCost: currentNode.travelCost + 1,
                distance: nodeDistance(pos, end),
                parent: currentNode
            };
        })
        
        for (const each of validNodes) {
            const index = nodesToEvaluate.findIndex((potentialDuplicate) =>
                potentialDuplicate.location.x === each.location.x
                && potentialDuplicate.location.y === each.location.y
            )
        
            if (index < 0) nodesToEvaluate.push(each);
            else if (nodesToEvaluate[index].travelCost > each.travelCost) nodesToEvaluate[index] = each;
        }
    }

    return 0;
}

const generateMap = (sx, sy, bCount, list) => {
    let str = "";
    const map = new Array(sy + 1);

    const locations = new Set(list.split("\n").slice(0,bCount));

    for (let y = 0; y < sy + 1; y++) {
        str = "";
        for (let x = 0; x < sx + 1; x++) {
            if (x === 0 && y === 0) {
                str += "S"
            } else if (x === sx && y === sy) {
                str += "E"
            } else if (locations.has(`${x},${y}`)) {
                str += "#"
            } else {
                str += "."
            }
        }
        map[y] = str;
    }

    const node = aStar(map);

    console.log(node.travelCost);
    
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

const generateIterativeMap = (sx, sy, list) => {
    let str = "";
    const map = new Array(sy + 1).fill(".").map(x => new Array(sx + 1).fill("."));

    map[0][0] = "S";
    map[sy][sx] = "E";

    const locations = list.split("\n").map(s => s.split(",").map(x => Number(x)));

    for (const [x,y] of locations) {
        map[y][x] = "#";
        if (aStar(map) === 0) {
            console.log(x,y);
            return;
        } 
    }
}

// generateMap(6, 6, 12, example1);
// generateMap(70, 70, 1024, problem);
generateIterativeMap(70, 70, problem);