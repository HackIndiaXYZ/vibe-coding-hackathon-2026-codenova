import Tesseract from 'tesseract.js';

export async function performOCR(file: File, onProgress?: (pct: number) => void): Promise<string> {
  if (typeof window === 'undefined') return '';

  const imageUrl = URL.createObjectURL(file);

  try {
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing' && onProgress) {
            onProgress(Math.round(m.progress * 100));
          }
        },
      }
    );
    
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image.');
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}
