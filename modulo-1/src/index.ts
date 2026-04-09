import { calcularMedia, calcularMediana, filtrarAtipicos } from "./math-utils.js";

const datos: number[] = [22.1, 21.8, 23.0, 45.9, 22.5, 80.0];

const media = calcularMedia(datos);
if (media !== null) {
  console.log("Media:", media.toFixed(2));
}

const mediana = calcularMediana(datos);
if (mediana !== null) {
  console.log("Mediana:", mediana.toFixed(2));
}

const filtrados = filtrarAtipicos(datos, 5);
console.log("Sin atípicos:", filtrados); 