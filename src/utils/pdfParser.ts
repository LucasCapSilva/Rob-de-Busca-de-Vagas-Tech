import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024;
if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
}

const normalizePdfText = (text: string) =>
  text
    .split('\0')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

export const extractTextFromPDFArrayBuffer = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const uint8 = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8,
  });

  const pdf = await loadingTask.promise;
  const pagesCount = pdf.numPages;
  const pagesText: string[] = [];

  for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    if (pageText.trim().length > 0) {
      pagesText.push(pageText);
    }
  }

  const extractedText = normalizePdfText(pagesText.join('\n'));
  if (extractedText.length < 20) {
    throw new Error('Não foi possível extrair texto legível do PDF.');
  }

  return extractedText;
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('Arquivo inválido. Selecione um PDF válido.');
  }
  if (file.type !== 'application/pdf') {
    throw new Error('Formato inválido. Envie um arquivo PDF.');
  }
  if (file.size <= 0 || file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error('Arquivo fora do limite permitido (máx 5MB).');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    await PDFDocument.load(arrayBuffer);
    return await extractTextFromPDFArrayBuffer(arrayBuffer);
  } catch (error) {
    console.error('Erro ao ler PDF:', error);
    throw new Error('Falha ao decodificar o arquivo PDF. Verifique se o arquivo não está corrompido ou ilegível.');
  }
};
