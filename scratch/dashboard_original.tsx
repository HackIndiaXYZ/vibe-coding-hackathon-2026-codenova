const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\shria\\.gemini\\antigravity\\brain\\1e3abacd-e180-4e6f-83dd-d02eb60c7e78\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.error('Log file does not exist:', logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let bestCode = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  if (line.includes('dashboard/page.tsx')) {
    try {
      const obj = JSON.parse(line);
      const toolCall = obj.tool_calls.find(tc => tc.name === 'write_to_file' && tc.args.TargetFile.includes('dashboard/page.tsx'));
      if (toolCall) {
        const code = JSON.parse(toolCall.args.CodeContent);
        if (code.length > bestCode.length) {
          bestCode = code;
        }
      }
    } catch (e) {
      // Ignore
    }
  }
}

if (bestCode) {
  fs.writeFileSync(path.join(__dirname, 'dashboard_original.tsx'), bestCode, 'utf8');
  console.log('✅ Successfully wrote original dashboard/page.tsx to scratch/dashboard_original.tsx');
} else {
  console.log('❌ No code found.');
}
