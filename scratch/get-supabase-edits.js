const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\shria\\.gemini\\antigravity\\brain\\1e3abacd-e180-4e6f-83dd-d02eb60c7e78\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.error('Log file not found');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

lines.forEach((line, idx) => {
  if (!line) return;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      obj.tool_calls.forEach((tc) => {
        const target = tc.args && (tc.args.TargetFile || tc.args.Target);
        if (target && target.includes('supabase.ts')) {
          console.log(`\n==================================================`);
          console.log(`Line ${idx}: step_index: ${obj.step_index}, tool: ${tc.name}`);
          console.log(`Description: ${tc.args.Description || tc.args.Reason || 'None'}`);
          if (tc.args.CodeContent) {
            console.log(`--- CodeContent ---`);
            console.log(tc.args.CodeContent);
          } else if (tc.args.ReplacementContent) {
            console.log(`--- ReplacementContent ---`);
            console.log(tc.args.ReplacementContent);
          } else if (tc.args.ReplacementChunks) {
            console.log(`--- ReplacementChunks ---`);
            console.log(JSON.stringify(tc.args.ReplacementChunks, null, 2));
          } else {
            console.log(`Other args:`, Object.keys(tc.args));
          }
        }
      });
    }
  } catch (e) {
    // Ignore
  }
});
