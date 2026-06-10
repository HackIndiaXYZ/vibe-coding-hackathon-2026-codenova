const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\shria\\.gemini\\antigravity\\brain\\1e3abacd-e180-4e6f-83dd-d02eb60c7e78\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  if (line.toLowerCase().includes('dashboard') && line.toLowerCase().includes('page.tsx')) {
    console.log(`Line ${i} matches: ${line.substring(0, 150)}...`);
    try {
      const obj = JSON.parse(line);
      console.log(`  Parsed JSON. step_index: ${obj.step_index}, type: ${obj.type}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`    Found tool call: ${tc.name}, TargetFile: ${tc.args.TargetFile}`);
        });
      }
    } catch (e) {
      console.error(`  JSON Parse Error on line ${i}:`, e.message);
    }
  }
}
