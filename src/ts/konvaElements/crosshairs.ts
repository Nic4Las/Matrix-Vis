import { Group } from "konva/lib/Group";
import { Arrow } from "konva/lib/shapes/Arrow";
import { Circle } from "konva/lib/shapes/Circle";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";
import { Transform } from "konva/lib/Util";
import { applyAndConvertMatrix } from "../utils";
import crosshairUrl from "url:../../assets/crosshair.svg";
import Konva from "konva";

export class Crosshairs extends Group {
  crosshairX: Konva.Image;
  crosshairY: Konva.Image;
  crosshairZero: Konva.Image;
  gridScale: number;
  constructor(scale: number = 100) {
    super();
    this.gridScale = scale;

    let crossheirTexture = new Image();
    crossheirTexture.src = crosshairUrl;

    crossheirTexture.onload = (e) => {
      this.crosshairX.cache();
      this.crosshairY.cache();
      this.crosshairZero.cache();

      this.crosshairX.filters([Konva.Filters.RGB]);
      this.crosshairY.filters([Konva.Filters.RGB]);
      this.crosshairZero.filters([Konva.Filters.RGB]);

      this.crosshairX.red(125);
      this.crosshairX.green(181);
      this.crosshairX.blue(97);

      this.crosshairY.red(255);
      this.crosshairY.green(113);
      this.crosshairY.blue(82);

      this.crosshairZero.red(0);
      this.crosshairZero.green(31);
      this.crosshairZero.blue(106);

      this.add(this.crosshairX);
      this.add(this.crosshairY);
      this.add(this.crosshairZero);
    };

    this.crosshairX = new Konva.Image({
      x: this.gridScale * 2,
      y: 0,
      offsetX: this.gridScale / 2,
      offsetY: this.gridScale / 2,
      image: crossheirTexture,
      width: this.gridScale,
      height: this.gridScale,
      draggable: true,
    });

    this.crosshairY = new Konva.Image({
      x: 0,
      y: -this.gridScale * 2,
      offsetX: this.gridScale / 2,
      offsetY: this.gridScale / 2,
      image: crossheirTexture,
      width: this.gridScale,
      height: this.gridScale,
      draggable: true,
    });

    this.crosshairZero = new Konva.Image({
      x: 0,
      y: 0,
      offsetX: this.gridScale / 2,
      offsetY: this.gridScale / 2,
      image: crossheirTexture,
      width: this.gridScale,
      height: this.gridScale,
      draggable: true,
    });
  }

  applyTravo(t: Transform) {
    let newX = t.point({ x: 2 * this.gridScale, y: 0 });
    let newY = t.point({ x: 0, y: 2 * this.gridScale });
    let newZero = t.point({ x: 0, y: 0 });

    this.crosshairX.position({ x: newX.x, y: -newX.y });
    this.crosshairY.position({ x: newY.x, y: -newY.y });
    this.crosshairZero.position({ x: newZero.x, y: -newZero.y });
  }

  getTravo(): Transform {
    let resTravo = new Transform();
    let resTravoMatrix = resTravo.m;

    resTravoMatrix[0] = (this.crosshairX.x() - this.crosshairZero.x()) / (2 * this.gridScale);
    resTravoMatrix[1] = -(this.crosshairX.y() - this.crosshairZero.y()) / (2 * this.gridScale);

    resTravoMatrix[2] = (this.crosshairY.x() - this.crosshairZero.x()) / (2 * this.gridScale);
    resTravoMatrix[3] = -(this.crosshairY.y() - this.crosshairZero.y()) / (2 * this.gridScale);

    resTravoMatrix[4] = this.crosshairZero.x() / (2 * this.gridScale);
    resTravoMatrix[5] = -this.crosshairZero.y() / (2 * this.gridScale);

    resTravo.m = resTravoMatrix;
    return resTravo.copy();
  }

  toggleVisibility() {
    this.visible(!this.visible());
  }
}
