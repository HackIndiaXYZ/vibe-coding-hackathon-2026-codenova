const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\shria\\.gemini\\antigravity\\brain\\1e3abacd-e180-4e6f-83dd-d02eb60c7e78\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.error('Log file not found at:', logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  if (line.includes('supabase.ts')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Line ${i}: step_index: ${obj.step_index}, type: ${obj.type}, status: ${obj.status}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach((tc, idx) => {
          console.log(`  Tool Call ${idx}: ${tc.name}`);
          if (tc.args && tc.args.TargetFile) {
            console.log(`    TargetFile: ${tc.args.TargetFile}`);
          }
          if (tc.args && tc.args.CodeContent) {
            console.log(`    CodeContent length: ${tc.args.CodeContent.length}`);
            console.log(`    CodeContent snippet: ${tc.args.CodeContent.substring(0, 300)}...`);
          }
          if (tc.args && tc.args.ReplacementContent) {
            console.log(`    ReplacementContent length: ${tc.args.ReplacementContent.length}`);
            console.log(`    ReplacementContent snippet: ${tc.args.ReplacementContent.substring(0, 300)}...`);
          }
        });
      }
    } catch (e) {
      // Ignored if it's not valid JSON or doesn't have expected properties
    }
  }
}
