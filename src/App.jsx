import React from "react";
import Sketch from "react-p5";
import { Game } from "./services";

const RIGHT = 39;
const LEFT = 37;
const UP = 38;
const DOWN = 40;

const COLOR_DICT = {
  2: [0, 63, 92],
  4: [47, 75, 124],
  8: [102, 81, 145],
  16: [160, 81, 149],
  32: [212, 80, 135],
  64: [249, 93, 106],
  128: [255, 124, 67],
  256: [255, 166, 0],
  512: [135, 211, 80],
  1024: [211, 80, 200],
  2048: [80, 200, 211],
};

function range(n) {
  return [...new Array(n).keys()];
}

export default (props) => {
  const options = {
    rectSize: 100,
    margin: 10,
    count: 4,
    width: 500,
    height: 500,
    rounded: 5,
    duration: 100,
  };
  const game = new Game();

  let animationNodes = [];
  let animationStartedAt = null;

  let newNode = game.addRandom();
  let newNodeStartedAt = new Date().getTime();

  let juaFont = null;
  const preload = (p5) => {
    juaFont = p5.loadFont("Jua-Regular.ttf");
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(options.width, options.height).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.clear();
    p5.noStroke();
    p5.background(250, 248, 239);

    if (juaFont) {
      p5.textFont(juaFont);
    }

    const startWidthMargin =
      (options.width - (options.rectSize + options.margin) * options.count) / 2;
    const startHeightMargin =
      (options.height - (options.rectSize + options.margin) * options.count) /
      2;

    p5.fill(188, 172, 159);
    p5.rect(
      startWidthMargin - options.margin * 2,
      startHeightMargin - options.margin * 2,
      (options.rectSize + options.margin) * options.count + options.margin * 3,
      (options.rectSize + options.margin) * options.count + options.margin * 3,
      10
    );

    for (const y of range(options.count)) {
      for (const x of range(options.count)) {
        p5.fill(204, 193, 180);
        p5.rect(
          startWidthMargin + x * (options.rectSize + options.margin),
          startHeightMargin + y * (options.rectSize + options.margin),
          options.rectSize,
          options.rectSize,
          options.rounded
        );
      }
    }

    const staticNodes = game.getNodes().filter((node) => {
      if (animationNodes.length <= 0 || animationStartedAt === null) {
        return true;
      }

      const found = animationNodes.find((animationNode) => {
        return (
          animationNode.dest.x === node.x && animationNode.dest.y === node.y
        );
      });

      if (found) {
        return false;
      }

      return true;
    });

    for (const node of staticNodes) {
      if (newNode && newNode.x === node.x && newNode.y === node.y) {
        const progress =
          (new Date().getTime() - newNodeStartedAt) / options.duration;

        p5.fill(...COLOR_DICT[node.value], progress * 255);
        p5.rect(
          startWidthMargin + node.x * (options.rectSize + options.margin),
          startHeightMargin + node.y * (options.rectSize + options.margin),
          options.rectSize,
          options.rectSize,
          options.rounded
        );

        p5.fill(255, 255, 255);
        const textWidth = p5.textWidth(node.value);
        p5.textSize(40);
        p5.text(
          node.value,
          startWidthMargin +
            node.x * (options.rectSize + options.margin) +
            options.rectSize / 2 -
            textWidth / 2,
          startHeightMargin +
            node.y * (options.rectSize + options.margin) +
            options.rectSize / 2 +
            15
        );

        if (progress > 1) {
          newNode = null;
          newNodeStartedAt = null;
        }
      } else {
        p5.fill(...COLOR_DICT[node.value]);
        p5.rect(
          startWidthMargin + node.x * (options.rectSize + options.margin),
          startHeightMargin + node.y * (options.rectSize + options.margin),
          options.rectSize,
          options.rectSize,
          options.rounded
        );

        p5.fill(255, 255, 255);
        const textWidth = p5.textWidth(node.value);
        p5.textSize(40);
        p5.text(
          node.value,
          startWidthMargin +
            node.x * (options.rectSize + options.margin) +
            options.rectSize / 2 -
            textWidth / 2,
          startHeightMargin +
            node.y * (options.rectSize + options.margin) +
            options.rectSize / 2 +
            15
        );
      }
    }

    const progress =
      (new Date().getTime() - animationStartedAt) / options.duration;
    for (const animationNode of animationNodes) {
      const { src, dest } = animationNode;

      const dx = (dest.x - src.x) * Math.min(progress, 1);
      const dy = (dest.y - src.y) * Math.min(progress, 1);

      p5.fill(COLOR_DICT[src.value]);
      p5.rect(
        startWidthMargin + (src.x + dx) * (options.rectSize + options.margin),
        startHeightMargin + (src.y + dy) * (options.rectSize + options.margin),
        options.rectSize,
        options.rectSize,
        options.rounded
      );
    }

    if (progress > 1) {
      animationStartedAt = null;
      animationNodes = [];
    }
  };

  let lastKeyPressed = new Date().getTime();
  const keyPressed = (p5) => {
    if (new Date().getTime() - lastKeyPressed < 100) {
      return;
    }

    if (animationStartedAt) {
      return;
    }

    lastKeyPressed = new Date().getTime();

    let shifted = [];
    if (p5.keyCode === RIGHT) {
      shifted = game.shift("RIGHT");
    } else if (p5.keyCode === LEFT) {
      shifted = game.shift("LEFT");
    } else if (p5.keyCode === UP) {
      shifted = game.shift("UP");
    } else if (p5.keyCode === DOWN) {
      shifted = game.shift("DOWN");
    }

    animationNodes = shifted;
    animationStartedAt = new Date().getTime();
  };

  let lastKeyReleased = new Date().getTime();
  const keyReleased = (p5) => {
    if (new Date().getTime() - lastKeyReleased < 100) {
      return;
    }

    lastKeyReleased = new Date().getTime();
    setTimeout(() => {
      newNode = game.addRandom();
      newNodeStartedAt = new Date().getTime();
    }, options.duration);
  };

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center"
      style={{
        backgroundColor: "rgb(250, 248, 239)",
      }}
    >
      <div className="flex  w-[500px] p-4 justify-between">
        <div
          className="jua text-7xl"
          style={{
            color: "rgb(119, 110, 101)",
          }}
        >
          2048
        </div>
        <div
          className="flex items-end cursor-pointer"
          onClick={() => {
            game.reset();
            game.addRandom();
          }}
        >
          <div
            className="px-3 py-1 jua rounded text-xl"
            style={{
              backgroundColor: "rgb(143, 122, 101)",
            }}
          >
            New Game
          </div>
        </div>
      </div>
      <div>
        <Sketch
          preload={preload}
          setup={setup}
          draw={draw}
          keyPressed={keyPressed}
          keyReleased={keyReleased}
        />
      </div>
    </div>
  );
};
