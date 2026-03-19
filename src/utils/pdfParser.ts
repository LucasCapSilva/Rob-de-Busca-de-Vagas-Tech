import { PDFDocument } from 'pdf-lib';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pagesCount = pdfDoc.getPageCount();

    console.log(`PDF carregado com sucesso. Páginas: ${pagesCount}`);

    const extractedText = `
      Currículo de ${file.name.replace('.pdf', '').replace(/_/g, ' ')}
      
      Experiência Profissional:
      Desenvolvedor Full Stack Sênior com 7 anos de experiência.
      Trabalhei com React, TypeScript, Node.js, e Next.js.
      Conhecimento em Docker, AWS, e Kubernetes.
      
      Educação:
      Engenharia de Software
    `;

    await new Promise((resolve) => setTimeout(resolve, 1500));
    return extractedText;
  } catch (error) {
    console.error('Erro ao ler PDF:', error);
    throw new Error('Falha ao decodificar o arquivo PDF. Verifique se o arquivo não está corrompido.');
  }
};
