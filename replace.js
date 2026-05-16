import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
        callback(fullPath);
      }
    }
  }
}

walk('./src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content.replace(/\.png/g, '.webp').replace(/\.jpg/g, '.webp');
  if (content !== newContent) {
    console.log(`Updated ${filePath}`);
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
});
