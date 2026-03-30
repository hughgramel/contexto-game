import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
const svgPath = join(iconsDir, "icon.svg");

const sizes = [512, 384, 192, 180, 128, 96, 48, 32, 16];

for (const size of sizes) {
  const outPath = join(iconsDir, `icon-${size}x${size}.png`);
  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`Generated ${outPath}`);
}

// Also generate apple-touch-icon at root public/
const applePath = join(__dirname, "..", "public", "apple-touch-icon.png");
await sharp(svgPath).resize(180, 180).png().toFile(applePath);
console.log(`Generated ${applePath}`);

// Generate favicon.ico source (32x32 png, browsers accept png favicons)
const faviconPath = join(__dirname, "..", "src", "app", "favicon.png");
await sharp(svgPath).resize(32, 32).png().toFile(faviconPath);
console.log(`Generated ${faviconPath}`);

console.log("Done!");
