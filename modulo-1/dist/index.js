"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_utils_js_1 = require("./math-utils.js");
const datos = [22.1, 21.8, 23.0, 45.9, 22.5, 80.0];
const media = (0, math_utils_js_1.calcularMedia)(datos);
if (media !== null) {
    console.log("Media:", media.toFixed(2));
}
const mediana = (0, math_utils_js_1.calcularMediana)(datos);
if (mediana !== null) {
    console.log("Mediana:", mediana.toFixed(2));
}
const filtrados = (0, math_utils_js_1.filtrarAtipicos)(datos, 5);
console.log("Sin atípicos:", filtrados);
