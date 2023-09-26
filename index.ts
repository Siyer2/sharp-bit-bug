import { readFileSync } from "fs";
import sharp from "sharp";
import { Image } from "image-js";

async function decodePNGSharp(buffer: Buffer) {
  const rawOutput = await sharp(buffer)
    .raw({ depth: "ushort" })
    .toColorspace("grey16")
    .toBuffer();
  return new Uint16Array(rawOutput);
}

async function decodePNGImageJs(buffer: Buffer) {
  const image = await Image.load(buffer);
  return new Uint16Array(image.data.buffer);
}

async function main() {
  const png = readFileSync("./data.png");
  const sharpPng = await decodePNGSharp(png);
  const imageJsPng = await decodePNGImageJs(png);

  console.log(sharpPng);
  console.log(imageJsPng);
}

main().catch((error) => {
  console.error(error);
});
