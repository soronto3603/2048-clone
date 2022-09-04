type Direction = "UP" | "DOWN" | "RIGHT" | "LEFT";
interface Node {
  x: number;
  y: number;
  value: number;
}

export interface Shift {
  src: Node;
  dest: Node;
}

function range(n: number) {
  return new Array(n).keys();
}

export class Game {
  private size = 0;
  private nodes: Node[] = [];

  constructor() {
    this.size = 4;
  }

  reset() {
    this.nodes = [];
  }

  addRandom() {
    if (this.nodes.length >= this.size * this.size) {
      return null;
    }

    let count = 0;

    while (true) {
      const x = Math.round(Math.random() * (this.size - 1));
      const y = Math.round(Math.random() * (this.size - 1));

      const found = this.nodes.find((node) => node.x === x && node.y === y);
      if (!found) {
        const newNode = { value: 2, x, y };
        this.nodes = [...this.nodes, newNode];
        return newNode;
      }
      if (count > 100) {
        return null;
      }
    }
  }

  shift(direction: Direction) {
    let shifted: Shift[] = [];

    if (direction === "RIGHT") {
      const sorted = this.nodes.sort((a, b) => b.x - a.x);
      for (const node of sorted) {
        let found = null;
        let countX = node.x + 1;
        while (true) {
          found = sorted.find(
            (_node) =>
              _node.x === countX && _node.y === node.y && _node.value > 0
          );
          if (found) {
            break;
          }

          countX++;
          if (countX >= this.size) {
            break;
          }
        }

        if (!found) {
          shifted.push({
            src: { ...node },
            dest: { ...node, x: this.size - 1 },
          });

          node.x = this.size - 1;
        } else if (found.value === node.value) {
          shifted.push({
            src: { ...node },
            dest: { ...found, value: found.value * 2 },
          });

          node.value = -1;
          found.value = found.value * 2;
        } else {
          shifted.push({
            src: { ...node },
            dest: { ...node, x: found.x - 1 },
          });

          node.x = found.x - 1;
        }
      }
    } else if (direction === "LEFT") {
      console.log("before sorted", this.nodes);
      const sorted = this.nodes.sort((a, b) => a.x - b.x);
      console.log("sorted", sorted);
      for (const node of sorted) {
        let found = null;
        let countX = node.x - 1;
        while (true) {
          found = sorted.find(
            (_node) =>
              _node.x === countX && _node.y === node.y && _node.value > 0
          );
          if (found) {
            break;
          }

          countX--;
          if (countX < 0) {
            break;
          }
        }

        if (!found) {
          console.log(node, "#1");
          shifted.push({
            src: { ...node },
            dest: { ...node, x: 0 },
          });

          node.x = 0;
        } else if (found.value === node.value) {
          console.log(node, "#2");
          shifted.push({
            src: { ...node },
            dest: { ...found, value: found.value * 2 },
          });

          node.value = -1;
          found.value = found.value * 2;
        } else {
          console.log(node, found, "#3");
          shifted.push({
            src: { ...node },
            dest: { ...node, x: found.x + 1 },
          });

          node.x = found.x + 1;
        }
      }
    } else if (direction === "DOWN") {
      const sorted = this.nodes.sort((a, b) => b.y - a.y);
      for (const node of sorted) {
        let found = null;
        let countY = node.y + 1;
        while (true) {
          found = sorted.find(
            (_node) =>
              _node.y === countY && _node.x === node.x && _node.value > 0
          );
          if (found) {
            break;
          }

          countY++;
          if (countY >= this.size) {
            break;
          }
        }

        if (!found) {
          shifted.push({
            src: { ...node },
            dest: { ...node, y: this.size - 1 },
          });

          node.y = this.size - 1;
        } else if (found.value === node.value) {
          shifted.push({
            src: { ...node },
            dest: { ...found, value: found.value * 2 },
          });

          node.value = -1;
          found.value = found.value * 2;
        } else {
          shifted.push({
            src: { ...node },
            dest: { ...node, y: found.y - 1 },
          });

          node.y = found.y - 1;
        }
      }
    } else if (direction === "UP") {
      const sorted = this.nodes.sort((a, b) => a.y - b.y);
      for (const node of sorted) {
        let found = null;
        let countY = node.y - 1;
        while (true) {
          found = sorted.find(
            (_node) =>
              _node.y === countY && _node.x === node.x && _node.value > 0
          );
          if (found) {
            break;
          }

          countY--;
          if (countY < 0) {
            break;
          }
        }

        if (!found) {
          console.log("#1");
          shifted.push({
            src: { ...node },
            dest: { ...node, y: 0 },
          });

          node.y = 0;
        } else if (found.value === node.value) {
          console.log("#2");
          shifted.push({
            src: { ...node },
            dest: { ...found, value: found.value * 2 },
          });

          node.value = -1;
          found.value = found.value * 2;
        } else {
          console.log("#3");
          shifted.push({
            src: { ...node },
            dest: { ...node, y: found.y + 1 },
          });

          node.y = found.y + 1;
        }
      }
    }

    this.nodes = this.nodes.filter((node) => node.value > 0);
    return shifted.filter(
      (node) => !(JSON.stringify(node.src) === JSON.stringify(node.dest))
    );
  }

  print() {
    for (const y of range(this.size)) {
      let line = "";
      for (const x of range(this.size)) {
        const node = this.nodes.find((node) => node.x === x && node.y === y);

        if (node) {
          line += `${node.value}\t`;
        } else {
          line += `0\t`;
        }
      }
      console.log(line);
    }
    console.log();
  }

  getNodes() {
    return this.nodes;
  }

  setNodes(nodes: Node[]) {
    this.nodes = nodes;
  }
}

// const game = new Game();
// game.setNodes([
//   {
//     x: 0,
//     value: 2,
//     y: 0,
//   },
//   {
//     x: 1,
//     value: 2,
//     y: 0,
//   },
//   {
//     x: 2,
//     value: 2,
//     y: 0,
//   },
//   {
//     x: 3,
//     value: 2,
//     y: 0,
//   },
// ]);
// game.shift("LEFT");
// game.print();
