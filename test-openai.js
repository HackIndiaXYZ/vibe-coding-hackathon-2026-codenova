const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env file does not exist. Please run "npm run build" or create the .env file.');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiKeyLine = envContent.split('\n').find(line => line.trim().startsWith('OPENAI_API_KEY='));
  if (!apiKeyLine) {
    console.error('ERROR: OPENAI_API_KEY is not defined in .env file.');
    process.exit(1);
  }
  
  const apiKey = apiKeyLine.split('=')[1].trim().replace(/['"]/g, '');
  if (!apiKey || apiKey === 'your-openai-api-key') {
    console.error('ERROR: OPENAI_API_KEY is still set to the placeholder "your-openai-api-key" in the .env file.');
    process.exit(1);
  }

  console.log('Testing API key:', apiKey.slice(0, 8) + '...' + apiKey.slice(-4));
  
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'test connection' }],
      temperature: 0.1
    })
  })
  .then(async res => {
    console.log('HTTP Status from OpenAI:', res.status);
    const body = await res.json();
    if (res.ok) {
      console.log('✅ SUCCESS! OpenAI key is valid and working.');
      console.log('Response content:', body.choices[0].message.content);
    } else {
      console.error('❌ FAILED! OpenAI returned an error:');
      console.error(JSON.stringify(body, null, 2));
    }
  })
  .catch(err => {
    console.error('Network error calling OpenAI:', err);
  });
} catch (e) {
  console.error('Failed to run test:', e);
}
