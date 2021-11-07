import { Group } from "konva/lib/Group";
import { Arrow } from "konva/lib/shapes/Arrow";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";
import { Transform } from "konva/lib/Util";
import { applyAndConvertMatrix } from "../utils";

export class Determinant extends Group {
  gridScale: number;
  constructor(scale: number = 100) {
    super();
    // this.zIndex(-10);
    this.gridScale = scale;
    this.add(
      new Rect({
        x: 0,
        y: -this.gridScale * 2,
        width: this.gridScale * 2,
        height: this.gridScale * 2,
        fill: "#FFFF0055",
        stroke: "#FFFF00",
        strokeWidth: 2,
      })
    );
  }

  toggleVisibility() {
    this.visible(!this.visible());
  }
}
