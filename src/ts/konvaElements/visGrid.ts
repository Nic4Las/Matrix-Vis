import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";
import { checkBrowser } from "../utils";

export class VisGrid extends Group {
  constructor(scale: number = 100) {
    super();
    let browserType = checkBrowser();
    let isSlow = browserType === "firefox" ? true : true;
    let gridOffset = isSlow ? 0 : 1;

    for (let i = 0; i < Math.ceil(window.innerWidth / scale) * 2 + 1; i++) {
      let xPos = (i - Math.ceil(window.innerWidth / scale)) * scale;
      if ((i + 1) % 2 == 0 && isSlow) {
        continue;
      }
      this.add(
        new Line({
          points: [xPos, window.innerWidth * 3, xPos, -window.innerWidth * 3],
          stroke: "#1da3d3",
          strokeWidth: (i + 1) % 2 == 0 ? 0.5 : 1,
          perfectDrawEnabled: !isSlow,
        })
      );
    }

    for (let i = 0; i < Math.ceil(window.innerHeight / scale) * 2 + 1; i++) {
      let yPos = (i - Math.ceil(window.innerHeight / scale)) * scale;
      if (i % 2 == 0 && isSlow) {
        continue;
      }
      this.add(
        new Line({
          points: [window.innerHeight * 3, yPos, -window.innerHeight * 3, yPos],
          stroke: "#1da3d3",
          strokeWidth: i % 2 == 0 ? 0.5 : 1,
          perfectDrawEnabled: !isSlow,
        })
      );
    }
    this.visible(false);
    this.listening(false);
  }

  toggleVisibility() {
    this.visible(!this.visible());
  }
}
