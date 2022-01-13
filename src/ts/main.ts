import { Transform } from "konva/lib/Util";
import { mainVisElement } from "./konvaElements/mainVisElement";
import { applyAndConvertMatrix, interpolateTransform } from "./utils";

let mainVis = new mainVisElement("container", 50);

let targetTravo = new Transform([1, 1, -1, 1, 200, 0]);
mainVis.setTargetTravo(targetTravo);

let interpolationSlider = <HTMLInputElement>document.getElementById("time");
let getTravoButton = <HTMLButtonElement>document.getElementById("getTravoButton");
let setTravoButton = <HTMLButtonElement>document.getElementById("setTravoButton");

let addCircleButton = <HTMLButtonElement>document.getElementById("addCircleButton");
let addRectButton = <HTMLButtonElement>document.getElementById("addRectButton");
let addTriButton = <HTMLButtonElement>document.getElementById("addTriButton");

window.onresize = (e) => {
  mainVis.updateSize();
};

interpolationSlider.oninput = (e) => {
  e.preventDefault();
  mainVis.setTime(Number(interpolationSlider.value) / 100);
};

getTravoButton.onclick = (e) => {
  e.preventDefault();
  let targetTravo = mainVis.getTransformFromTargets();
  let targetTravoMatrix = targetTravo.m;
  mainVis.setTargetTravo(targetTravo.copy(), true);
  let matrixInputs = document.getElementsByClassName("matrixInput");
  for (let element of matrixInputs) {
    let index = parseInt((<HTMLInputElement>element).name);
    if (index > -1) {
      (<HTMLInputElement>element).value = String(targetTravoMatrix[index].toFixed(3));
    }
  }
  mainVis.setTime(Number(interpolationSlider.value) / 100);
};

setTravoButton.onclick = (e) => {
  e.preventDefault();
  let matrixInputs = document.getElementsByClassName("matrixInput");
  let tempTargetTravo = new Transform();
  let tempTargetTravoMatrix = tempTargetTravo.m;
  for (let element of matrixInputs) {
    let index = parseInt((<HTMLInputElement>element).name);
    if (index > -1) {
      tempTargetTravoMatrix[index] = Number((<HTMLInputElement>element).value);
    }
  }
  console.log(tempTargetTravo);
  mainVis.setTargetTravo(tempTargetTravo.copy(), true);
  mainVis.setTime(Number(interpolationSlider.value) / 100);
};

addRectButton.onclick = (e) => {
  mainVis.addRect();
};

addCircleButton.onclick = (e) => {
  mainVis.addCircle();
};

addTriButton.onclick = (e) => {
  mainVis.addTri();
};
