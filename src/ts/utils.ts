import { Node } from "konva/lib/Node";
import { Transform } from "konva/lib/Util";

function applyAndConvertMatrix(t1: Transform, t2: Transform): Transform {
  let cordTravoMatrix = new Transform([1, 0, 0, -1, 0, 0]);

  let resTravo = t1.copy().multiply(cordTravoMatrix);
  // console.log(resTravo.copy());
  resTravo = resTravo.copy().multiply(t2);
  // console.log(resTravo.copy());
  resTravo = resTravo.copy().multiply(cordTravoMatrix);
  // console.log(resTravo.copy());
  return resTravo;
}

function interpolateTransform2(t1: Transform, t2: Transform, a: number): Transform {
  // console.log(a);
  let resTravo = new Transform();
  let t1Decomposed = t1.decompose();
  let t2Decomposed = t2.decompose();
  console.log(t1Decomposed);
  console.log(t2Decomposed);

  let resX = lerp(t1Decomposed.x, t2Decomposed.x, a);
  let resY = lerp(t1Decomposed.y, t2Decomposed.y, a);
  // console.log(resX, resY);
  let resRotation = lerp(t1Decomposed.rotation, t2Decomposed.rotation, a);
  let resScaleX = lerp(t1Decomposed.scaleX, t2Decomposed.scaleX, a);
  let resScaleY = lerp(t1Decomposed.scaleY, t2Decomposed.scaleY, a);
  let resSkewX = lerp(t1Decomposed.skewX, t2Decomposed.skewX, a);
  let resSkewY = lerp(t1Decomposed.skewY, t2Decomposed.skewY, a);

  resTravo.translate(resX, resY);
  resTravo.rotate(resRotation * (Math.PI / 180));
  resTravo.scale(resScaleX, resScaleY);
  resTravo.skew(-resSkewX, -resSkewY);

  // console.log(resTravo);
  return resTravo;
}

function interpolateTransform(t1: Transform, t2: Transform, a: number): Transform {
  let resTravo = new Transform();
  let resTravoMatrix = resTravo.m;
  for (let i = 0; i < 6; i++) {
    resTravoMatrix[i] = lerp(t1.m[i], t2.m[i], a);
  }
  resTravo.m = resTravoMatrix;
  return resTravo;
}

function determinant(t: Transform): number {
  return t.m[0] * t.m[3] - t.m[1] * t.m[2];
}

function lerp(x: number, y: number, a: number): number {
  return x * (1 - a) + y * a;
}

function checkBrowser(): string {
  if ((!!(<any>window["opr"]) && !!["opr"]["addons"]) || !!window["opera"] || navigator.userAgent.indexOf(" OPR/") >= 0) {
    return "opera";
  }

  if (typeof window["InstallTrigger"] !== "undefined") {
    return "firefox";
  }

  if (
    /constructor/i.test(<string>(<unknown>window["HTMLElement"])) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window["safari"] || (typeof window["safari"] !== "undefined" && window["safari"].pushNotification))
  ) {
    return "safari";
  }

  if (/*@cc_on!@*/ false || !!document["documentMode"]) {
    return "ie";
  }

  if (!(/*@cc_on!@*/ (false || !!document["documentMode"])) && !!window["StyleMedia"]) {
    return "edge";
  }

  if (!!window["chrome"] && !!window["chrome"].webstore) {
    return "chrome";
  }

  if (
    ((!!window["chrome"] && !!window["chrome"].webstore) ||
      (!!window["opr"] && !!["opr"]["addons"]) ||
      !!window["opera"] ||
      navigator.userAgent.indexOf(" OPR/") >= 0) &&
    !!window["CSS"]
  ) {
    return "blink";
  }

  return "unknown";
}

export { applyAndConvertMatrix, interpolateTransform, determinant, lerp, checkBrowser };
