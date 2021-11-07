import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";

export class bgGrid extends Group {
  constructor(scale: number = 100) {
    super();

    // this.zIndex(-10);

    this.add(
      new Rect({
        x: -25 * window.innerWidth,
        y: -25 * window.innerHeight,
        width: window.innerWidth * 50,
        height: window.innerHeight * 50,
        // fill: "#000000",
        fill: "#121212",
      })
    );

    this.add(
      new Line({
        points: [0, window.innerHeight, 0, -window.innerHeight],
        stroke: "#b0bec5",
        strokeWidth: 2,
      })
    );

    this.add(
      new Line({
        points: [-window.innerWidth, 0, window.innerWidth, 0],
        stroke: "#b0bec5",
        strokeWidth: 2,
      })
    );

    for (let i = 0; i < Math.ceil(window.innerWidth / scale) * 2 + 1; i++) {
      let xPos = (i - Math.ceil(window.innerWidth / scale)) * scale;
      if (xPos == 0) {
        continue;
      }
      this.add(
        new Line({
          points: [xPos, window.innerWidth * 2, xPos, -window.innerWidth * 2],
          stroke: "#37474f",
          strokeWidth: i % 2 == 0 ? 0.5 : 1,
        })
      );
    }

    for (let i = 0; i < Math.ceil(window.innerHeight / scale) * 2 + 1; i++) {
      let yPos = (i - Math.ceil(window.innerHeight / scale)) * scale;
      if (yPos == 0) {
        continue;
      }
      this.add(
        new Line({
          points: [window.innerHeight * 2, yPos, -window.innerHeight * 2, yPos],
          stroke: "#37474f",
          strokeWidth: (i + 1) % 2 == 0 ? 0.5 : 1,
        })
      );
    }
  }
}
