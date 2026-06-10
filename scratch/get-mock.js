const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\shria\\.gemini\\antigravity\\brain\\1e3abacd-e180-4e6f-83dd-d02eb60c7e78\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');
const obj = JSON.parse(lines[184]);
const tc = obj.tool_calls[0];

// Use eval to parse the string literal, which is more forgiving than JSON.parse
const code = eval(tc.args.CodeContent);

fs.writeFileSync(path.join(__dirname, 'supabase_original.ts'), code, 'utf8');
console.log('✅ Successfully wrote original supabase.ts from step 187 to scratch/supabase_original.ts');
