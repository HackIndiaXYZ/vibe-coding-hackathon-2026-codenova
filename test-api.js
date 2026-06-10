async function test() {
  try {
    console.log('Downloading dummy PDF for API test...');
    const pdfRes = await fetch('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    if (!pdfRes.ok) throw new Error(`Failed to download dummy PDF: ${pdfRes.statusText}`);
    const pdfBlob = await pdfRes.blob();

    console.log('Creating FormData...');
    const formData = new FormData();
    formData.append('agreementType', 'Employment Agreement');
    // We name it dummy.pdf so the API route detects it as a PDF
    formData.append('file', pdfBlob, 'dummy.pdf');

    console.log('Sending request to http://localhost:3000/api/analyze...');
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData
    });

    console.log('Response status:', response.status);
    console.log('Response content-type:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('Raw Response Body:', text);
  } catch (error) {
    console.error('Error in API test:', error);
  }
}

test();
