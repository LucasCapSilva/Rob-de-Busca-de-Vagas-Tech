import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function testPdf() {
  try {
    const data = new Uint8Array(fs.readFileSync('/Users/user/Desktop/portifolio/robo-busca-vagas/Lucas_Capelotto_CV.pdf'));
    const loadingTask = pdfjsLib.getDocument({ 
      data,
      standardFontDataUrl: `node_modules/pdfjs-dist/standard_fonts/`,
    });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully! Pages: ${pdf.numPages}`);
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    console.log(`Page 1 text snippets: ${textContent.items.length}`);
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
}

testPdf();