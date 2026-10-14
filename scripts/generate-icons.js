/**
 * Generates valid PNG and SVG icons for ZenLaser using Node built-in zlib & fs.
 * Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makePng(width, height, getPixelRgba) {
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel;
  const rawData = Buffer.alloc((scanlineLength + 1) * height);

  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (scanlineLength + 1);
    rawData[scanlineOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pixelOffset = scanlineOffset + 1 + x * bytesPerPixel;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const body = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, body, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

function renderZenLaserIcon(x, y, width, height) {
  const nx = x / width;
  const ny = y / height;

  // Squircle rounded corners
  const cornerR = 0.22;
  const innerX = Math.abs(nx - 0.5) - (0.5 - cornerR);
  const innerY = Math.abs(ny - 0.5) - (0.5 - cornerR);
  if (innerX > 0 && innerY > 0) {
    const d = Math.sqrt(innerX * innerX + innerY * innerY);
    if (d > cornerR) return [0, 0, 0, 0];
  }

  // Deep dark obsidian gradient
  const distCenter = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
  let bgR = Math.floor(7 + (16 - 7) * (1 - distCenter));
  let bgG = Math.floor(11 + (26 - 11) * (1 - distCenter));
  let bgB = Math.floor(18 + (42 - 18) * (1 - distCenter));

  let addedR = 0, addedG = 0, addedB = 0;

  // Horizontal radiant laser ray across y = 0.5
  const distHoriz = Math.abs(ny - 0.5);
  if (distHoriz < 0.05) {
    const rayInt = Math.pow(1 - (distHoriz / 0.05), 2);
    addedR += 0 * rayInt;
    addedG += 229 * rayInt;
    addedB += 255 * rayInt; // Cyan laser glow
    if (distHoriz < 0.015) {
      const core = 1 - (distHoriz / 0.015);
      addedR += 255 * core;
      addedG += 255 * core;
      addedB += 255 * core; // White core
    }
  }

  // Vertical laser ray across x = 0.5
  const distVert = Math.abs(nx - 0.5);
  if (distVert < 0.05 && ny <= 0.5) {
    const rayInt = Math.pow(1 - (distVert / 0.05), 2);
    addedR += 255 * rayInt;
    addedG += 51 * rayInt;
    addedB += 102 * rayInt; // Neon crimson laser glow
    if (distVert < 0.015) {
      const core = 1 - (distVert / 0.015);
      addedR += 255 * core;
      addedG += 255 * core;
      addedB += 255 * core;
    }
  }

  // Center Prismatic Diamond / Gem at (0.5, 0.5)
  const dx = Math.abs(nx - 0.5);
  const dy = Math.abs(ny - 0.5);
  const diamondDist = dx + dy;

  if (diamondDist < 0.22) {
    const intensity = 1 - (diamondDist / 0.22);
    addedR += 140 * intensity;
    addedG += 240 * intensity;
    addedB += 255 * intensity;
    if (diamondDist < 0.08) {
      const coreInt = 1 - (diamondDist / 0.08);
      addedR += 255 * coreInt;
      addedG += 255 * coreInt;
      addedB += 255 * coreInt;
    }
  }

  const finalR = Math.min(255, bgR + Math.floor(addedR));
  const finalG = Math.min(255, bgG + Math.floor(addedG));
  const finalB = Math.min(255, bgB + Math.floor(addedB));

  return [finalR, finalG, finalB, 255];
}

const srcDir = path.join(__dirname, '..', 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

console.log('Generating icon-192.png...');
const icon192 = makePng(192, 192, renderZenLaserIcon);
fs.writeFileSync(path.join(srcDir, 'icon-192.png'), icon192);

console.log('Generating icon-512.png...');
const icon512 = makePng(512, 512, renderZenLaserIcon);
fs.writeFileSync(path.join(srcDir, 'icon-512.png'), icon512);

// Generate SVG favicon
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#121D30"/>
      <stop offset="100%" stop-color="#070B12"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bgGlow)"/>
  
  <!-- Laser Beams -->
  <line x1="40" y1="256" x2="472" y2="256" stroke="#00E5FF" stroke-width="16" stroke-linecap="round" filter="url(#glow)"/>
  <line x1="256" y1="40" x2="256" y2="256" stroke="#FF3366" stroke-width="16" stroke-linecap="round" filter="url(#glow)"/>
  <line x1="40" y1="256" x2="472" y2="256" stroke="#FFFFFF" stroke-width="4"/>
  <line x1="256" y1="40" x2="256" y2="256" stroke="#FFFFFF" stroke-width="4"/>

  <!-- Optical Prism Gem -->
  <polygon points="256,156 356,256 256,356 156,256" fill="rgba(0, 229, 255, 0.25)" stroke="#00E5FF" stroke-width="10" filter="url(#glow)"/>
  <polygon points="256,196 316,256 256,316 196,256" fill="#FFFFFF"/>
</svg>`;

fs.writeFileSync(path.join(srcDir, 'favicon.svg'), faviconSvg, 'utf8');
console.log('ZenLaser icons generated successfully.');
