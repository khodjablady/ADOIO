import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, body, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // deflate
  ihdrData[11] = 0; // no filter
  ihdrData[12] = 0; // no interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Generate pixels
  const rawRows = [];
  const cx = width / 2;
  const cy = height / 2;
  const rBg = isMaskable ? width * 0.7 : width * 0.44;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const offset = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default: background deep olive #233416
      let r = 0x23, g = 0x34, b = 0x16, a = 0xff;

      if (!isMaskable) {
        // rounded corner or circle
        if (dist > rBg) {
          a = 0x00; // transparent outside rounded radius
        }
      }

      if (a > 0) {
        // Draw golden drop in center
        // Drop equation approximate
        const dropY = (y - cy * 1.05) / (height * 0.28);
        const dropX = (x - cx) / (width * 0.22);
        
        // Leaf left
        const leaf1X = (x - cx * 0.75) / (width * 0.2);
        const leaf1Y = (y - cy * 0.8) / (height * 0.15);
        // Leaf right
        const leaf2X = (x - cx * 1.25) / (width * 0.2);
        const leaf2Y = (y - cy * 0.8) / (height * 0.15);

        if (leaf1X * leaf1X + leaf1Y * leaf1Y < 0.4) {
          // Leaf green #709D43
          r = 0x70; g = 0x9D; b = 0x43; a = 0xff;
        } else if (leaf2X * leaf2X + leaf2Y * leaf2Y < 0.4) {
          r = 0x70; g = 0x9D; b = 0x43; a = 0xff;
        } else if (dropY >= -0.7 && dropY <= 0.8) {
          const widthAtY = dropY < 0 ? (dropY + 0.7) / 0.7 : Math.sqrt(Math.max(0, 1 - dropY * dropY));
          if (Math.abs(dropX) < widthAtY * 0.75) {
            // Golden oil drop #E6AB3C
            r = 0xE6; g = 0xAB; b = 0x3C; a = 0xff;
            // Droplet shine highlight
            if (dropX < -0.15 && dropX > -0.45 && dropY > -0.1 && dropY < 0.4) {
              r = 0xFA; g = 0xF7; b = 0xF2; a = 0xff;
            }
          }
        }
      }

      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('Successfully generated PWA PNG icons in /public: 192x192, 512x512, maskable 512x512, apple-touch-icon.png');
