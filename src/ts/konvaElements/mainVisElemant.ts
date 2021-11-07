import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { bgGrid } from "./backgroundGrid";
import { AxisArrows } from "./arrows";
import { Crosshairs } from "./crosshairs";
import test from "url:../../assets/HausNikolaus.svg";
import { Rect } from "konva/lib/shapes/Rect";
import { Transform } from "konva/lib/Util";
import { applyAndConvertMatrix, determinant, interpolateTransform } from "../utils";
import { Determinant } from "./determinant";
import { VisGrid } from "./visGrid";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Transformer } from "konva/lib/shapes/Transformer";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle } from "konva/lib/shapes/Circle";
import { RegularPolygon } from "konva/lib/shapes/RegularPolygon";

export class mainVisElement {
  targetTravo: Transform;
  time: Number = 0.0;
  container: HTMLDivElement;
  width: number;
  height: number;
  stage: Stage;
  bgLayer: Layer;
  fgLayer: Layer;
  uiLayer: Layer;
  transformer: Transformer;
  objects: Shape[];
  gbGrid: bgGrid;
  visGrid: VisGrid;
  arrows: AxisArrows;
  determinant: Determinant;
  crosshairs: Crosshairs;
  initalTransform: Transform;
  gridScale: number = 50;

  constructor(containerId: string, gridScale: number = 50, initalTargetTravo: Transform = new Transform()) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.gridScale = gridScale;
    this.targetTravo = initalTargetTravo;

    let containerElement = document.getElementById(containerId);
    if (containerElement != null) {
      this.container = <HTMLDivElement>containerElement;
    } else {
      this.container = new HTMLDivElement();
      this.container.id = "container";
      document.appendChild(this.container);
    }

    this.container.addEventListener("contextmenu", function (e) {
      console.log("rightClickMenu");
      e.preventDefault();
    });

    this.stage = new Konva.Stage({
      container: this.container,
      width: this.width,
      height: this.height,
    });

    this.stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.zoomHandler(e);
    });

    this.stage.on("click tap", (e) => {
      this.selectDeselectHandler(e);
    });

    this.container.addEventListener("dragover", function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.dataTransfer != null) {
        e.dataTransfer.dropEffect = "copy";
      }
    });

    this.container.addEventListener("drop", (e) => {
      this.dragImageHandler(e);
    });

    this.bgLayer = new Layer({
      x: this.width / 2,
      y: this.height / 2,
      draggable: false,
      listening: false,
    });

    this.fgLayer = new Layer({
      x: this.width / 2,
      y: this.height / 2,
      draggable: false,
      listening: true,
      // scaleY: -1,
    });

    this.uiLayer = new Layer({
      x: this.width / 2,
      y: this.height / 2,
      draggable: false,
      listening: true,
    });

    this.stage.add(this.bgLayer);
    this.stage.add(this.fgLayer);
    this.stage.add(this.uiLayer);
    this.initalTransform = this.fgLayer.getTransform().copy();

    this.gbGrid = new bgGrid(this.gridScale);
    this.gbGrid.zIndex(-1);
    this.bgLayer.add(this.gbGrid);

    this.transformer = new Transformer();
    this.fgLayer.add(this.transformer);

    this.visGrid = new VisGrid(this.gridScale);
    this.fgLayer.add(this.visGrid);

    this.arrows = new AxisArrows(this.gridScale);
    this.uiLayer.add(this.arrows);

    this.crosshairs = new Crosshairs(this.gridScale);
    this.uiLayer.add(this.crosshairs);

    this.determinant = new Determinant(this.gridScale);
    this.fgLayer.add(this.determinant);
    this.determinant.hide();

    this.objects = [];
    this.objects.push(new Rect({ x: 0, y: 0, draggable: true }));
    this.fgLayer.add(this.objects[0]);

    this.transformer.nodes([this.objects[0]]);

    let bgImmage = new Image();
    bgImmage.src = test;
    bgImmage.onload = (e) => {
      this.objects[0].fillPatternImage(bgImmage);
      this.objects[0].width(bgImmage.width / 2);
      this.objects[0].height(bgImmage.height / 2);
      this.objects[0].y(-bgImmage.height / 2);
      this.objects[0].fillPatternScale({ x: 0.5, y: 0.5 });
    };

    window.addEventListener("keydown", (e: Event) => {
      this.keyPressHandler(e);
    });
  }

  zoomHandler(e: Event) {
    let oldScale = this.stage.scaleX();
    let zoomSpeed = 1.025;
    var newScale = -(<WheelEvent>e).deltaY > 0 ? oldScale * zoomSpeed : oldScale / zoomSpeed;
    newScale = Math.min(Math.max(newScale, 0.5), 2);

    var mousePointTo = {
      x: (this.stage.width() / 2 - this.stage.x()) / oldScale,
      y: (this.stage.height() / 2 - this.stage.y()) / oldScale,
    };

    this.stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: this.stage.width() / 2 - mousePointTo.x * newScale,
      y: this.stage.height() / 2 - mousePointTo.y * newScale,
    };

    this.stage.position(newPos);
  }

  keyPressHandler(e: Event) {
    console.log(e);
    if ((<KeyboardEvent>e).key === "a") {
      this.arrows.toggleVisibility();
      e.preventDefault();
    }
    if ((<KeyboardEvent>e).key === "g") {
      this.visGrid.toggleVisibility();
      e.preventDefault();
    }
    if ((<KeyboardEvent>e).key === "d") {
      this.determinant.toggleVisibility();
      e.preventDefault();
    }
    if ((<KeyboardEvent>e).key === "c") {
      this.crosshairs.toggleVisibility();
      e.preventDefault();
    }
    if ((<KeyboardEvent>e).key === "Delete") {
      if (this.transformer.nodes() === []) {
        return;
      } else {
        let index = this.objects.indexOf(<Shape<ShapeConfig>>this.transformer.nodes()[0]);
        if (index > -1) {
          this.transformer.nodes([]);
          this.objects[index].destroy();
          this.objects.splice(index, 1);
          e.preventDefault();
        }
      }
    }
  }

  selectDeselectHandler(e: KonvaEventObject<any>) {
    // console.log(e);
    if (e.target === this.stage) {
      this.transformer.nodes([]);
    }

    for (let element of this.objects) {
      if (e.target === element) {
        this.transformer.nodes([element]);
      }
    }
  }

  dragImageHandler(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.stage.setPointersPositions(e);
    console.log("------------------");
    console.log(e);
    let fileTransfer = (<DragEvent>e).dataTransfer;
    if (fileTransfer != null) {
      let files = fileTransfer.files;
      console.log(files);

      for (let i = 0; i < files.length; i++) {
        if (files[i].type.match(/image.*/)) {
          console.log(files[i]);
          let reader = new FileReader();
          reader.onload = (e2) => {
            let target = e2.target;
            if (target != null) {
              let result = target.result;
              if (typeof result === "string" || result instanceof String) {
                let htmlImageElement = new Image();
                htmlImageElement.src = String(result);

                htmlImageElement.onload = (e3) => {
                  let newKonvaImage = new Konva.Image({
                    image: htmlImageElement,
                    x: 0,
                    y: -htmlImageElement.height,
                    draggable: true,
                  });

                  // let pointerPos = this.stage.getPointerPosition();

                  // if (pointerPos != null) {
                  //   newKonvaImage.position(pointerPos);
                  // }
                  this.objects.push(newKonvaImage);
                  this.fgLayer.add(newKonvaImage);
                };
              }
            }
          };

          reader.readAsDataURL(files[i]);
        }
      }
    }
  }

  updateSize() {
    this.stage.size({ width: window.innerWidth, height: window.innerHeight });
    this.bgLayer.position({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    this.fgLayer.position({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    this.uiLayer.position({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }

  // updateFrontLayerMatrix(m: Transform) {
  //   let newCordsTransform = new Transform([1, 0, 0, 1, this.width / 2, this.height / 2]);

  //   let decomposeRes = m.multiply(newCordsTransform).decompose();
  //   console.log(decomposeRes);

  //   this.fgLayer.setAttrs({
  //     x: decomposeRes.x,
  //     y: decomposeRes.y,
  //     scaleX: decomposeRes.scaleX,
  //     scaleY: decomposeRes.scaleY,
  //     skewX: decomposeRes.skewX,
  //     skewY: decomposeRes.skewY,
  //     rotation: (decomposeRes.rotation / Math.PI) * 180,
  //   });
  // }

  applyTRansform(matrix: Transform) {
    this.arrows.applyTravo(matrix);
    let resTransformLayer = applyAndConvertMatrix(this.initalTransform.copy(), matrix);
    let resDet = determinant(resTransformLayer);
    if (resDet === 0) {
      this.fgLayer.hide();
      return;
    } else {
      this.fgLayer.show();
    }

    let transforms = resTransformLayer.decompose();

    this.fgLayer.setAttrs({
      x: transforms.x,
      y: transforms.y,
      scaleX: transforms.scaleX,
      scaleY: transforms.scaleY,
      skewX: transforms.skewX,
      skewY: transforms.skewY,
      rotation: transforms.rotation,
    });
  }

  addRect() {
    let newRect = new Rect({
      x: 0,
      y: -this.gridScale * 2,
      width: this.gridScale * 2,
      height: this.gridScale * 2,
      fill: `hsl(${Math.random() * 360}, 36%, 50%)`,
      draggable: true,
    });

    this.objects.push(newRect);
    this.fgLayer.add(newRect);
  }

  addCircle() {
    let newCircle = new Circle({
      x: 0,
      y: 0,
      radius: this.gridScale,
      fill: `hsl(${Math.random() * 360}, 36%, 50%)`,
      draggable: true,
    });

    this.objects.push(newCircle);
    this.fgLayer.add(newCircle);
  }

  addTri() {
    let newTri = new RegularPolygon({
      x: 0,
      y: 0,
      sides: 3,
      radius: this.gridScale,
      fill: `hsl(${Math.random() * 360}, 36%, 50%)`,
      draggable: true,
    });

    this.objects.push(newTri);
    this.fgLayer.add(newTri);
  }

  setTime(t: number) {
    this.applyTRansform(interpolateTransform(new Transform().copy(), this.targetTravo.copy(), t));
    this.deselectAll();
  }

  deselectAll() {
    this.transformer.nodes([]);
  }

  setTargetTravo(t: Transform, scaleOffset: boolean = false) {
    if (!scaleOffset) {
      this.targetTravo = t;
      this.crosshairs.applyTravo(t);
    } else {
      let tempTargetTravo = t;
      let tempTargetTravoMatrix = tempTargetTravo.m;
      tempTargetTravoMatrix[4] = tempTargetTravoMatrix[4] * this.gridScale * 2;
      tempTargetTravoMatrix[5] = tempTargetTravoMatrix[5] * this.gridScale * 2;
      this.targetTravo = tempTargetTravo.copy();
      this.crosshairs.applyTravo(t);
    }
  }

  getTransformFromTargets(): Transform {
    return this.crosshairs.getTravo();
  }

  toggleArrows() {
    this.arrows.toggleVisibility();
  }

  toggleDeterminant() {
    this.determinant.toggleVisibility();
  }
}
