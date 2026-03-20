import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { extractTextFromPDFArrayBuffer } from './pdfParser';

describe('pdfParser', () => {
  it('extrai texto de um PDF válido', async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    page.drawText('Nome: Maria Silva');
    page.drawText('Desenvolvedora React com 6 anos de experiência', { y: 360 });
    const bytes = await pdfDoc.save();

    const buffer = Uint8Array.from(bytes).buffer;
    const text = await extractTextFromPDFArrayBuffer(buffer);

    expect(text).toContain('Maria Silva');
    expect(text.toLowerCase()).toContain('react');
  });

  it('retorna erro para PDF corrompido ou ilegível', async () => {
    const invalidBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const invalidBuffer = invalidBytes.buffer.slice(
      invalidBytes.byteOffset,
      invalidBytes.byteOffset + invalidBytes.byteLength,
    );

    await expect(extractTextFromPDFArrayBuffer(invalidBuffer)).rejects.toThrow();
  });
});
