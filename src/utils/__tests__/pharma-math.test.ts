import { describe, it, expect } from 'vitest';
import {
  calculateDilution,
  calculateMagistralWeighing,
  calculateCockcroftGault,
} from '@/utils/pharma-math';

describe('pharma-math domain calculations', () => {
  describe('calculateDilution', () => {
    it('calcula V1 corretamente (C1*V1 = C2*V2) no Happy Path', () => {
      const res = calculateDilution({
        solveFor: 'V1',
        c1: 50,
        v1: 0,
        c2: 10,
        v2: 100,
        concUnit: '%',
        volUnit: 'mL',
      });
      expect(res).not.toBeNull();
      expect(res?.value).toBe('20.00 mL');
      expect(res?.diluent).toBe('80.00 mL');
      expect(res?.warning).toBeNull();
    });

    it('alerta quando C1 < C2 (diluição impossível) ou V2 < V1', () => {
      const resV1 = calculateDilution({
        solveFor: 'V1',
        c1: 10,
        v1: 0,
        c2: 50,
        v2: 100,
        concUnit: '%',
        volUnit: 'mL',
      });
      expect(resV1?.warning).toContain('C₁ precisa ser maior que C₂');

      const resC1 = calculateDilution({
        solveFor: 'C1',
        c1: 0,
        v1: 200,
        c2: 10,
        v2: 100,
        concUnit: '%',
        volUnit: 'mL',
      });
      expect(resC1?.diluent).toBe('V₂ deve ser maior que V₁');
      expect(resC1?.warning).toContain('menor que o volume inicial');
    });
  });

  describe('calculateMagistralWeighing', () => {
    it('calcula FC, FEq e excipiente corretamente no Happy Path', () => {
      const res = calculateMagistralWeighing({
        prescribedDoseMg: 20,
        feq: 1.12,
        assayPercent: 99.2,
        moisturePercent: 0.5,
        numCapsules: 60,
        capsuleVolumeMl: 0.5,
        powderDensity: 0.65,
      });
      expect(res).not.toBeNull();
      expect(res!.fc).toBeCloseTo(1.0131, 3);
      expect(res!.correctedDosePerCapMg).toBeCloseTo(22.69, 2);
      expect(res!.totalActiveToWeighG).toBeCloseTo(1.3616, 3);
      expect(res!.overflowWarning).toBeNull();
    });

    it('emite alerta quando o volume do fármaco excede a capacidade da cápsula (Edge Case)', () => {
      const res = calculateMagistralWeighing({
        prescribedDoseMg: 500,
        feq: 1.0,
        assayPercent: 100,
        moisturePercent: 0,
        numCapsules: 30,
        capsuleVolumeMl: 0.21, // Cápsula #4 muito pequena para 500mg
        powderDensity: 0.6,
      });
      expect(res).not.toBeNull();
      expect(res!.excipientMassG).toBe(0);
      expect(res!.overflowWarning).toContain('Capacidade excedida');
    });

    it('retorna null para umidade >= 100% evitando divisão por zero (Error Path)', () => {
      const res = calculateMagistralWeighing({
        prescribedDoseMg: 20,
        feq: 1,
        assayPercent: 99,
        moisturePercent: 100,
        numCapsules: 30,
        capsuleVolumeMl: 0.5,
        powderDensity: 0.65,
      });
      expect(res).toBeNull();
    });
  });

  describe('calculateCockcroftGault', () => {
    it('calcula clearance renal para sexo masculino e feminino (×0,85)', () => {
      const male = calculateCockcroftGault({
        age: 68,
        weightKg: 70,
        serumCreatinineMgDl: 1.4,
        sex: 'M',
      });
      const female = calculateCockcroftGault({
        age: 68,
        weightKg: 70,
        serumCreatinineMgDl: 1.4,
        sex: 'F',
      });
      expect(male?.clcr).toBeCloseTo(50.0, 1);
      expect(female?.clcr).toBeCloseTo(42.5, 1);
    });

    it('retorna null para idades inválidas (>= 130 ou <= 0)', () => {
      expect(
        calculateCockcroftGault({
          age: 145,
          weightKg: 70,
          serumCreatinineMgDl: 1.0,
          sex: 'M',
        })
      ).toBeNull();
    });
  });
});
