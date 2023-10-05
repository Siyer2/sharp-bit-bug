import { readFileSync } from "fs";
import sharp from "sharp";
import { Image } from "image-js";

async function decodePNGSharp(buffer: Buffer) {
  const rawOutput = await sharp(buffer)
    .raw({ depth: "ushort" })
    .toColorspace("grey16")
    .toBuffer();
  return new Uint16Array(rawOutput.buffer, 0, rawOutput.length / 2);
}

async function decodePNGImageJs(buffer: Buffer) {
  const image = await Image.load(buffer);
  return new Uint16Array(image.data.buffer);
}

function arraysEqual(a: Uint16Array, b: Uint16Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

async function main() {
  const png = readFileSync("./data.png");
  const sharpPng = await decodePNGSharp(png);
  const imageJsPng = await decodePNGImageJs(png);

  console.log(arraysEqual(sharpPng, imageJsPng));
}

main().catch((error) => {
  console.error(error);
});
