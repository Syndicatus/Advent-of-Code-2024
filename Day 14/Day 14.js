const {example, problem} = require("./Data/Data");

const robot = ([px, py], [vx, vy], [bx, by]) => {
    return {
        pos: {x: px, y: py},
        vel: {x: (vx + bx) % bx, y: (vy + by) % by},
        move() {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            this.pos.x %= bx;
            this.pos.y %= by;
        },
        moveTo(t) {
            this.pos.x += this.vel.x*t;
            this.pos.y += this.vel.y*t;
            this.pos.x %= bx;
            this.pos.y %= by;
        }
    }
}

const generateRobots = (str, bx, by) => {
    const robots = str.split("\n");

    return robots.map((s) => {
        const [posStr, velStr] = s.split(" ").map(v => v.slice(2));
        const pos = posStr.split(",").map(x => Number(x));
        const vel = velStr.split(",").map(x => Number(x));

        return robot(pos, vel, [bx, by]);
    })
}

const moveRobots100 = (robotArr) => 
    robotArr.forEach(robot => {
        robot.moveTo(100)
    });

const countInBounds = (robotArr, bx, by) => {
    const limitX = Math.floor(bx/2);
    const limitY = Math.floor(by/2);

    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;

    robotArr.forEach(robot => {
        const qx = Math.sign(robot.pos.x - limitX);
        const qy = Math.sign(robot.pos.y - limitY);

        if (qx === -1 && qy === -1) q3++
        if (qx === -1 && qy === 1) q2++
        if (qx === 1 && qy === -1) q4++
        if (qx === 1 && qy === 1) q1++
    })

    return q1*q2*q3*q4;
}

const moveAndDisplayRobots = (robotArr, bx, by) => {
    let strArray = [];
    let iter = 0;
    let min = Number.MAX_SAFE_INTEGER;

    while (true) {
        const score = countInBounds(robotArr, bx, by);

        if (score < min) {
            min = score;
            strArray = new Array(by).fill(0).map(() => new Array(bx).fill(0));
            robotArr.forEach(robot => {
                strArray[robot.pos.y][robot.pos.x] += 1
            })
            console.log(iter, min);
            console.log("+" + "-".repeat(bx) + "+");
            strArray.forEach(str => console.log("|" + str.join("").replace(/0/g, " ") + "|"));
            console.log("+" + "-".repeat(bx) + "+");
        }

        iter++;
        robotArr.forEach(robot => robot.move());
    }
}

const robotsInProblem = generateRobots(problem, 101, 103);
moveAndDisplayRobots(robotsInProblem, 101, 103);