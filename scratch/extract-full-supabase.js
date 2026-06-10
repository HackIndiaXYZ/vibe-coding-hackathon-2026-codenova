const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\shria\\.gemini\\antigravity\\brain\\1e3abacd-e180-4e6f-83dd-d02eb60c7e78\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.error('Log file not found');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

// Line 184 in 0-based index is line 185 in 1-based index
const lineIndex = 184;
const line = lines[lineIndex];

try {
  const obj = JSON.parse(line);
  const tc = obj.tool_calls[0];
  const code = tc.args.CodeContent;
  
  fs.writeFileSync(path.join(__dirname, 'supabase_recovered.ts'), code, 'utf8');
  console.log('✅ Successfully wrote full mock client implementation to scratch/supabase_recovered.ts');
} catch (e) {
  console.error('Failed to parse line 184:', e);
}
