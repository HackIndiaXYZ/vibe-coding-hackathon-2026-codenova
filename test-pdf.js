import { PDFParse } from 'pdf-parse';
import path from 'path';
import { pathToFileURL } from 'url';
// @ts-ignore
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure the worker path for pdfjs-dist
try {
  const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  console.log('Worker configured at:', pdfjs.GlobalWorkerOptions.workerSrc);
} catch (err) {
  console.error('Failed to configure PDF worker path:', err);
}

async function run() {
  try {
    console.log('Fetching dummy PDF...');
    const res = await fetch('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('PDF fetched successfully. Buffer size:', buffer.length);

    console.log('Parsing PDF using PDFParse...');
    const parsedPdf = new PDFParse(new Uint8Array(buffer));
    const pdfResult = await parsedPdf.getText();
    console.log('PDF text length:', pdfResult.text.length);
    console.log('PDF Text Preview:', pdfResult.text.substring(0, 200));
  } catch (error) {
    console.error('Error during PDF parsing:', error);
  }
}

run();
