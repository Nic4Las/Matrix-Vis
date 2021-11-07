import { Group } from "konva/lib/Group";
import { Arrow } from "konva/lib/shapes/Arrow";
import { Circle } from "konva/lib/shapes/Circle";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";
import { Transform } from "konva/lib/Util";
import { applyAndConvertMatrix } from "../utils";

export class AxisArrows extends Group {
  arrowX: Arrow;
  arrowY: Arrow;
  zeroDot: Circle;
  gridScale: number;
  constructor(scale: number = 100) {
    super();
    this.gridScale = scale;
    this.arrowX = new Arrow({
      points: [0, 0, scale * 2, 0],
      fill: "#7db561",
      stroke: "#7db561",
      strokeWidth: 3,
    });

    this.arrowY = new Arrow({
      points: [0, 0, 0, -scale * 2],
      fill: "#ff7152",
      stroke: "#ff7152",
      strokeWidth: 3,
    });

    this.zeroDot = new Circle({
      x: 0,
      y: 0,
      radius: this.gridScale / 10,
      fill: "#001fce",
    });

    this.add(this.arrowX);
    this.add(this.arrowY);
    this.add(this.zeroDot);
  }

  applyTravo(t: Transform) {
    let newX = t.point({ x: 2 * this.gridScale, y: 0 });
    let newY = t.point({ x: 0, y: 2 * this.gridScale });
    let newZero = t.point({ x: 0, y: 0 });

    this.arrowX.points([newZero.x, -newZero.y, newX.x, -newX.y]);
    this.arrowY.points([newZero.x, -newZero.y, newY.x, -newY.y]);
    this.zeroDot.position({ x: newZero.x, y: -newZero.y });
  }

  toggleVisibility() {
    this.visible(!this.visible());
  }
}
