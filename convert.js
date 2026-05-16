import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dirs = [
  './public',
  './public/images'
];

async function convert() {
  for (const dir of dirs) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const fullPath = path.join(dir, file);
        const name = path.basename(file, ext);
        const outPath = path.join(dir, `${name}.webp`);
        
        console.log(`Converting ${fullPath} to ${outPath}...`);
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(outPath);
        
        fs.unlinkSync(fullPath); // remove old file
      }
    }
  }
}

convert().catch(console.error);
