import { describe, it, expect } from 'vitest';
import { parsePrescriptionText } from '@/utils/prescription-parser';
import { findPairwiseInteractions } from '@/utils/interactions';
import { MEDICATIONS_DB } from '@/data/medications-db';

describe('parsePrescriptionText & findPairwiseInteractions', () => {
  it('extrai medicamentos, posologias na linha seguinte e alertas regulatórios (Happy Path)', () => {
    const raw = `
      DR. CARLOS EDUARDO SILVA - CRM 45892
      PACIENTE: Mariana Costa Oliveira
      USO INTERNO / VIA ORAL:
      1) Amoxicilina 500 mg ----------------- 21 cápsulas
      Tomar 1 cápsula de 8/8 horas por 7 dias.
      2) Clonazepam 2,5 mg/mL (gotas) ------- 1 frasco
      Tomar 10 gotas via oral à noite ao deitar por 30 dias.
    `;

    const items = parsePrescriptionText(raw);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      matchedMedicationId: 'amoxicilina',
      concentration: '500 mg',
      dosage: 'Tomar 1 cápsula',
      frequency: 'de 8/8 horas',
      duration: 'por 7 dias',
      confidence: 'Alta',
    });
    expect(items[0].alerts).toContain(
      'Exige Retenção de Receita (RDC 20/2011 Antimicrobiano ou Controle Especial C1).'
    );

    expect(items[1]).toMatchObject({
      matchedMedicationId: 'clonazepam',
      concentration: '2,5 mg/mL',
      dosage: 'Tomar 10 gotas',
      duration: 'por 30 dias',
      confidence: 'Alta',
    });
    expect(items[1].alerts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Portaria 344/98 (Lista B1)'),
        expect.stringContaining('Categoria D'),
      ])
    );
  });

  it('atualiza dosage na linha de continuação mesmo quando o formato é livre (ex: Dissolver 1 sachê)', () => {
    const raw = `
      1) Acetilcisteína 600 mg --- 16 envelopes
      Dissolver 1 envelope em meio copo de água à noite por 5 dias.
    `;
    const items = parsePrescriptionText(raw);
    expect(items).toHaveLength(1);
    expect(items[0].dosage).toContain('Dissolver 1 envelope');
    expect(items[0].duration).toBe('por 5 dias');
  });

  it('retorna lista vazia para textos em branco ou apenas cabeçalhos médicos (Edge/Error Path)', () => {
    expect(parsePrescriptionText('')).toEqual([]);
    expect(parsePrescriptionText('DR. JOÃO\nCRM 12345\nPACIENTE: TESTE')).toEqual([]);
  });

  it('detecta interações medicamentosas de forma simétrica independentemente da ordem (A+B === B+A)', () => {
    const losartana = MEDICATIONS_DB.find((m) => m.id === 'losartana-potassica')!;
    const ibuprofeno = MEDICATIONS_DB.find((m) => m.id === 'ibuprofeno')!;

    const forward = findPairwiseInteractions([losartana, ibuprofeno]);
    const reverse = findPairwiseInteractions([ibuprofeno, losartana]);

    expect(forward.length).toBeGreaterThan(0);
    expect(reverse.length).toBe(forward.length);
  });
});
