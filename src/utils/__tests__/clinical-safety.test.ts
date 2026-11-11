import { describe, it, expect } from 'vitest';
import {
  parseDoseInMg,
  parseDailyFrequencyMultiplier,
  evaluateDailyDose,
  detectDuplications,
  detectExpandedInteractions,
  validatePrescriptionRegulations,
} from '@/utils/clinical-safety';
import { PrescriptionItem } from '@/types/pharma';

describe('clinical-safety engine', () => {
  describe('Dose Parsing & Accumulation', () => {
    it('extrai corretamente dose em mg a partir de comprimidos e concentração em mg e g', () => {
      expect(parseDoseInMg('500 mg', 'Tomar 1 comprimido')).toBe(500);
      expect(parseDoseInMg('500 mg', 'Tomar 2 comprimidos')).toBe(1000);
      expect(parseDoseInMg('1 g', 'Tomar 1 comprimido')).toBe(1000);
      expect(parseDoseInMg('500 mg/mL', 'Tomar 20 gotas')).toBe(500); // 20 gotas = 1 mL = 500 mg
      expect(parseDoseInMg('500 mg/mL', 'Tomar 40 gotas')).toBe(1000);
    });

    it('identifica multiplicador de frequência diária', () => {
      expect(parseDailyFrequencyMultiplier('de 8/8h')).toBe(3);
      expect(parseDailyFrequencyMultiplier('12/12 horas')).toBe(2);
      expect(parseDailyFrequencyMultiplier('de 6 em 6 horas')).toBe(4);
      expect(parseDailyFrequencyMultiplier('de 4 em 4 horas')).toBe(6);
      expect(parseDailyFrequencyMultiplier('1x ao dia')).toBe(1);
    });

    it('emite alerta de superdosagem quando dose diária ultrapassa o limite da ANVISA', () => {
      // Paracetamol 750 mg de 4/4h = 6 x 750 = 4500 mg/dia (limite é 4000 mg/dia)
      const toxicParacetamol: PrescriptionItem = {
        id: '1',
        rawLine: 'Paracetamol 750 mg de 4/4h',
        medicationName: 'Paracetamol',
        activeIngredient: 'Paracetamol',
        concentration: '750 mg',
        pharmaceuticalForm: 'Comprimido',
        dosage: 'Tomar 1 comprimido',
        frequency: 'de 4 em 4 horas',
        duration: '5 dias',
        route: 'Via Oral',
        confidence: 'Alta',
        verified: false,
      };

      const result = evaluateDailyDose(toxicParacetamol);
      expect(result.calculatedDailyDoseMg).toBe(4500);
      expect(result.alert).toContain('RISCO CRÍTICO DE SUPERDOSAGEM');
      expect(result.alert).toContain('4.000 mg/dia');
    });

    it('não emite alerta quando dose está dentro da margem segura', () => {
      // Paracetamol 500 mg de 8/8h = 1500 mg/dia (seguro)
      const safeParacetamol: PrescriptionItem = {
        id: '2',
        rawLine: 'Paracetamol 500 mg de 8/8h',
        medicationName: 'Paracetamol',
        activeIngredient: 'Paracetamol',
        concentration: '500 mg',
        pharmaceuticalForm: 'Comprimido',
        dosage: 'Tomar 1 comprimido',
        frequency: '8/8h',
        duration: '3 dias',
        route: 'Via Oral',
        confidence: 'Alta',
        verified: false,
      };

      const result = evaluateDailyDose(safeParacetamol);
      expect(result.calculatedDailyDoseMg).toBe(1500);
      expect(result.alert).toBeNull();
    });
  });

  describe('Detecção de Duplicidade Terapêutica', () => {
    it('detecta duplicidade de mesmo princípio ativo com nomes comerciais diferentes', () => {
      const items: PrescriptionItem[] = [
        {
          id: '1',
          rawLine: 'Tylenol 750mg',
          medicationName: 'Tylenol 750 mg',
          activeIngredient: 'Paracetamol',
          concentration: '750 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comprimido',
          frequency: '8/8h',
          duration: '3 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
        {
          id: '2',
          rawLine: 'Paracetamol 500mg',
          medicationName: 'Paracetamol Genérico',
          activeIngredient: 'Paracetamol',
          concentration: '500 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comprimido',
          frequency: '6/6h',
          duration: '3 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
      ];

      const dups = detectDuplications(items);
      expect(dups.length).toBeGreaterThan(0);
      expect(dups.some((d) => d.type === 'same_substance')).toBe(true);
    });

    it('detecta duplicidade de classe com dois AINEs simultâneos', () => {
      const items: PrescriptionItem[] = [
        {
          id: '1',
          rawLine: 'Ibuprofeno 600mg',
          medicationName: 'Ibuprofeno 600 mg',
          activeIngredient: 'Ibuprofeno',
          concentration: '600 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '8/8h',
          duration: '5 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
        {
          id: '2',
          rawLine: 'Diclofenaco 50mg',
          medicationName: 'Diclofenaco Potássico',
          activeIngredient: 'Diclofenaco Potássico',
          concentration: '50 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '8/8h',
          duration: '5 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
      ];

      const dups = detectDuplications(items);
      expect(dups.some((d) => d.type === 'same_class')).toBe(true);
      expect(dups[0].message).toContain('Anti-inflamatório Não Esteroidal (AINE)');
    });
  });

  describe('Matriz Expandida de Interações Farmacológicas', () => {
    it('detecta interação crítica entre AINE e Anticoagulante', () => {
      const items: PrescriptionItem[] = [
        {
          id: '1',
          rawLine: 'Varfarina Sódica 5mg',
          medicationName: 'Marevan (Varfarina Sódica)',
          activeIngredient: 'Varfarina Sódica',
          concentration: '5 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '1x ao dia',
          duration: 'Uso contínuo',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
        {
          id: '2',
          rawLine: 'Cetoprofeno 150mg',
          medicationName: 'Profenid (Cetoprofeno)',
          activeIngredient: 'Cetoprofeno',
          concentration: '150 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '12/12h',
          duration: '5 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
      ];

      const interactions = detectExpandedInteractions(items);
      expect(interactions.length).toBeGreaterThan(0);
      expect(interactions[0].severity).toBe('Grave');
      expect(interactions[0].effect).toContain('hemorragia');
    });

    it('detecta a tríade nefrotóxica Triple Whammy (AINE + IECA/BRA + Diurético)', () => {
      const items: PrescriptionItem[] = [
        {
          id: '1',
          rawLine: 'Losartana 50mg',
          medicationName: 'Losartana Potássica',
          activeIngredient: 'Losartana',
          concentration: '50 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '12/12h',
          duration: 'Contínuo',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
        {
          id: '2',
          rawLine: 'Hidroclorotiazida 25mg',
          medicationName: 'Hidroclorotiazida',
          activeIngredient: 'Hidroclorotiazida',
          concentration: '25 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: 'Pela manhã',
          duration: 'Contínuo',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
        {
          id: '3',
          rawLine: 'Ibuprofeno 600mg',
          medicationName: 'Ibuprofeno',
          activeIngredient: 'Ibuprofeno',
          concentration: '600 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '8/8h',
          duration: '5 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
      ];

      const interactions = detectExpandedInteractions(items);
      const tripleWhammy = interactions.find((i) => i.effect.includes('TRIPLE WHAMMY'));
      expect(tripleWhammy).toBeDefined();
      expect(tripleWhammy?.severity).toBe('Grave');
    });
  });

  describe('Validador Regulatório de Prescrições (Deontologia)', () => {
    it('alerta vencimento em receita de antimicrobiano com mais de 10 dias da emissão (RDC 20/2011)', () => {
      const items: PrescriptionItem[] = [
        {
          id: '1',
          rawLine: 'Amoxicilina 500mg',
          medicationName: 'Amoxicilina',
          activeIngredient: 'Amoxicilina',
          concentration: '500 mg',
          pharmaceuticalForm: 'Cápsula',
          dosage: '1 cápsula',
          frequency: '8/8h',
          duration: '7 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
      ];

      // Emitida há 14 dias atrás
      const issuedDate = new Date();
      issuedDate.setDate(issuedDate.getDate() - 14);
      const dateStr = issuedDate.toISOString().split('T')[0];

      const validation = validatePrescriptionRegulations(items, dateStr);
      expect(validation.isExpired).toBe(true);
      expect(validation.maxValidDays).toBe(10);
      expect(validation.severity).toBe('Crítica');
      expect(validation.details[0]).toContain('RECEITA VENCIDA');
    });

    it('valida receita de antimicrobiano emitida dentro do prazo de 10 dias', () => {
      const items: PrescriptionItem[] = [
        {
          id: '1',
          rawLine: 'Azitromicina 500mg',
          medicationName: 'Azitromicina',
          activeIngredient: 'Azitromicina',
          concentration: '500 mg',
          pharmaceuticalForm: 'Comprimido',
          dosage: '1 comp',
          frequency: '1x ao dia',
          duration: '3 dias',
          route: 'Oral',
          confidence: 'Alta',
          verified: false,
        },
      ];

      // Emitida há 2 dias
      const issuedDate = new Date();
      issuedDate.setDate(issuedDate.getDate() - 2);
      const dateStr = issuedDate.toISOString().split('T')[0];

      const validation = validatePrescriptionRegulations(items, dateStr);
      expect(validation.isExpired).toBe(false);
      expect(validation.daysElapsed).toBe(2);
      expect(validation.regulationNotice).toContain('RDC ANVISA 20/2011');
    });
  });
});
