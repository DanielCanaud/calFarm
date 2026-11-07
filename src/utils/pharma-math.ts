export interface DilutionOutput {
  label: string;
  value: string;
  diluent: string;
  formulaStep: string;
  warning: string | null;
}

export function calculateDilution(params: {
  solveFor: 'V1' | 'C2' | 'V2' | 'C1';
  c1: number;
  v1: number;
  c2: number;
  v2: number;
  concUnit: string;
  volUnit: string;
}): DilutionOutput | null {
  const { solveFor, c1: numC1, v1: numV1, c2: numC2, v2: numV2, concUnit, volUnit } = params;

  if (solveFor === 'V1') {
    if (!Number.isFinite(numC1) || !Number.isFinite(numC2) || !Number.isFinite(numV2) || numC1 <= 0 || numC2 <= 0 || numV2 <= 0) {
      return null;
    }
    const resV1 = (numC2 * numV2) / numC1;
    const diluent = numV2 - resV1;
    return {
      label: `Volume da Solução Estoque (V₁)`,
      value: `${resV1.toFixed(2)} ${volUnit}`,
      diluent:
        diluent >= 0
          ? `${diluent.toFixed(2)} ${volUnit}`
          : 'Concentração estoque menor que a final desejada!',
      formulaStep: `V₁ = (C₂ × V₂) / C₁ = (${numC2} × ${numV2}) / ${numC1} = ${resV1.toFixed(2)} ${volUnit}`,
      warning:
        resV1 > numV2
          ? 'Atenção: C₁ precisa ser maior que C₂ para realizar uma diluição.'
          : null,
    };
  }

  if (solveFor === 'C2') {
    if (!Number.isFinite(numC1) || !Number.isFinite(numV1) || !Number.isFinite(numV2) || numC1 <= 0 || numV1 <= 0 || numV2 <= 0) {
      return null;
    }
    const resC2 = (numC1 * numV1) / numV2;
    const diluent = numV2 - numV1;
    return {
      label: `Concentração Final (C₂)`,
      value: `${resC2.toFixed(3)} ${concUnit}`,
      diluent: diluent >= 0 ? `${diluent.toFixed(2)} ${volUnit}` : 'V₂ deve ser maior que V₁',
      formulaStep: `C₂ = (C₁ × V₁) / V₂ = (${numC1} × ${numV1}) / ${numV2} = ${resC2.toFixed(3)} ${concUnit}`,
      warning: diluent < 0 ? 'Atenção: O volume final (V₂) não pode ser menor que o volume inicial (V₁).' : null,
    };
  }

  if (solveFor === 'V2') {
    if (!Number.isFinite(numC1) || !Number.isFinite(numV1) || !Number.isFinite(numC2) || numC1 <= 0 || numV1 <= 0 || numC2 <= 0) {
      return null;
    }
    const resV2 = (numC1 * numV1) / numC2;
    const diluent = resV2 - numV1;
    return {
      label: `Volume Final Total (V₂)`,
      value: `${resV2.toFixed(2)} ${volUnit}`,
      diluent: diluent >= 0 ? `${diluent.toFixed(2)} ${volUnit}` : 'N/A',
      formulaStep: `V₂ = (C₁ × V₁) / C₂ = (${numC1} × ${numV1}) / ${numC2} = ${resV2.toFixed(2)} ${volUnit}`,
      warning: diluent < 0 ? 'Atenção: C₁ deve ser maior ou igual a C₂.' : null,
    };
  }

  if (solveFor === 'C1') {
    if (!Number.isFinite(numV1) || !Number.isFinite(numC2) || !Number.isFinite(numV2) || numV1 <= 0 || numC2 <= 0 || numV2 <= 0) {
      return null;
    }
    const resC1 = (numC2 * numV2) / numV1;
    const diluent = numV2 - numV1;
    return {
      label: `Concentração Inicial Necessária (C₁)`,
      value: `${resC1.toFixed(2)} ${concUnit}`,
      diluent: diluent >= 0 ? `${diluent.toFixed(2)} ${volUnit}` : 'V₂ deve ser maior que V₁',
      formulaStep: `C₁ = (C₂ × V₂) / V₁ = (${numC2} × ${numV2}) / ${numV1} = ${resC1.toFixed(2)} ${concUnit}`,
      warning: diluent < 0 ? 'Atenção: O volume final (V₂) é menor que o volume inicial (V₁).' : null,
    };
  }

  return null;
}

export interface MagistralCalculationOutput {
  fc: number;
  factorCombined: number;
  correctedDosePerCapMg: number;
  totalActiveToWeighMg: number;
  totalActiveToWeighG: number;
  totalCapsulesVolumeMl: number;
  activeVolumeMl: number;
  remainingVolumeForExcipientMl: number;
  excipientMassG: number;
  overflowWarning: string | null;
}

export function calculateMagistralWeighing(params: {
  prescribedDoseMg: number;
  feq: number;
  assayPercent: number;
  moisturePercent: number;
  numCapsules: number;
  capsuleVolumeMl: number;
  powderDensity: number;
}): MagistralCalculationOutput | null {
  const {
    prescribedDoseMg: dose,
    feq,
    assayPercent: teor,
    moisturePercent: umid,
    numCapsules: nCaps,
    capsuleVolumeMl: capVol,
    powderDensity: dens,
  } = params;

  if (
    !Number.isFinite(dose) ||
    dose <= 0 ||
    !Number.isFinite(teor) ||
    teor <= 0 ||
    !Number.isFinite(umid) ||
    umid < 0 ||
    umid >= 100 ||
    !Number.isFinite(feq) ||
    feq <= 0 ||
    !Number.isFinite(nCaps) ||
    nCaps <= 0 ||
    !Number.isFinite(capVol) ||
    capVol <= 0 ||
    !Number.isFinite(dens) ||
    dens <= 0
  ) {
    return null;
  }

  const effectiveAssay = teor * (1 - umid / 100);
  if (effectiveAssay <= 0) return null;

  const fc = 100 / effectiveAssay;
  const factorCombined = feq * fc;
  const correctedDosePerCapMg = dose * factorCombined;
  const totalActiveToWeighMg = correctedDosePerCapMg * nCaps;
  const totalActiveToWeighG = totalActiveToWeighMg / 1000;

  const totalCapsulesVolumeMl = capVol * nCaps;
  const activeVolumeMl = totalActiveToWeighG / dens;
  const isOverflow = activeVolumeMl > totalCapsulesVolumeMl;
  const remainingVolumeForExcipientMl = Math.max(0, totalCapsulesVolumeMl - activeVolumeMl);
  const excipientMassG = remainingVolumeForExcipientMl * dens;

  return {
    fc,
    factorCombined,
    correctedDosePerCapMg,
    totalActiveToWeighMg,
    totalActiveToWeighG,
    totalCapsulesVolumeMl,
    activeVolumeMl,
    remainingVolumeForExcipientMl,
    excipientMassG,
    overflowWarning: isOverflow
      ? `Capacidade excedida! O volume de IFA (${activeVolumeMl.toFixed(2)} mL) ultrapassa o volume total das cápsulas (${totalCapsulesVolumeMl.toFixed(2)} mL). Selecione uma cápsula maior (ex: #0 ou #00) ou desdobre a dose em 2 cápsulas por tomada.`
      : null,
  };
}

export function calculateCockcroftGault(params: {
  age: number;
  weightKg: number;
  serumCreatinineMgDl: number;
  sex: 'M' | 'F';
}): { clcr: number; stageMessage: string; warning?: string } | null {
  const { age, weightKg, serumCreatinineMgDl: scr, sex } = params;
  if (
    !Number.isFinite(age) ||
    !Number.isFinite(weightKg) ||
    !Number.isFinite(scr) ||
    age <= 0 ||
    age >= 130 ||
    weightKg <= 0 ||
    scr <= 0
  ) {
    return null;
  }

  let clcr = ((140 - age) * weightKg) / (72 * scr);
  if (sex === 'F') clcr *= 0.85;

  const stageMessage =
    clcr >= 60
      ? 'Função renal preservada ou redução leve (geralmente sem ajuste).'
      : clcr >= 30
      ? 'Insuficiência renal moderada: checar ajuste de antimicrobianos, DOACs e metformina.'
      : 'Insuficiência renal grave (< 30 mL/min): exige ajuste rigoroso de doses!';

  const warning =
    age < 18
      ? 'Nota: A equação de Cockcroft-Gault é validada para adultos (≥ 18 anos). Em pediatria, utilize a fórmula de Schwartz.'
      : undefined;

  return { clcr, stageMessage, warning };
}
