const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      files = files.concat(walk(filePath));
    } else {
      files.push(filePath);
    }
  });
  return files;
}

const appDir = 'C:\\Users\\shria\\.gemini\\antigravity\\scratch\\novalens\\src';
const files = walk(appDir);

files.forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('supabase')) {
      console.log(`\nFile: ${file}`);
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('supabase') || line.includes('isLiveMode')) {
          console.log(`  Line ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
});
