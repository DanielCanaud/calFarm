'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  FlaskConical,
  Droplets,
  Scale,
  Atom,
  Baby,
  Info,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Activity,
  Pill,
  Eye,
} from 'lucide-react';
import {
  COMMON_PHARMA_COMPOUNDS,
  MANIPULATION_FEQ_PRESETS,
} from '@/data/medications-db';
import {
  calculateDilution,
  calculateMagistralWeighing,
  calculateCockcroftGault,
} from '@/utils/pharma-math';

type CalcTab =
  | 'dilution'
  | 'concentration'
  | 'molarity'
  | 'units'
  | 'pediatric_drip'
  | 'pearson'
  | 'manipulation'
  | 'isotony';

export default function PharmaCalculator() {
  const [activeTab, setActiveTab] = useState<CalcTab>('dilution');

  // --- 1. Estado: Diluição (C1 * V1 = C2 * V2) ---
  const [solveFor, setSolveFor] = useState<'V1' | 'C2' | 'V2' | 'C1'>('V1');
  const [c1, setC1] = useState<string>('50');
  const [v1, setV1] = useState<string>('20');
  const [c2, setC2] = useState<string>('10');
  const [v2, setV2] = useState<string>('100');
  const [concUnit, setConcUnit] = useState<string>('% (p/v)');
  const [volUnit, setVolUnit] = useState<string>('mL');

  // --- 2. Estado: Concentração (% p/v, mg/mL, ppm) ---
  const [soluteMassG, setSoluteMassG] = useState<string>('5');
  const [solutionVolMl, setSolutionVolMl] = useState<string>('100');

  // --- 3. Estado: Molaridade, Normalidade e mEq ---
  const [selectedCompoundIdx, setSelectedCompoundIdx] = useState<number>(0);
  const [customMolarMass, setCustomMolarMass] = useState<string>('58.44');
  const [customValence, setCustomValence] = useState<string>('1');
  const [customParticles, setCustomParticles] = useState<string>('2');
  const [molarSoluteG, setMolarSoluteG] = useState<string>('0.9');
  const [molarVolMl, setMolarVolMl] = useState<string>('100');

  // --- 4. Estado: Conversor de Unidades ---
  const [convCategory, setConvCategory] = useState<'mass' | 'volume'>('mass');
  const [convValue, setConvValue] = useState<string>('500');
  const [convFromUnit, setConvFromUnit] = useState<string>('mg');
  const [dropsPerMl, setDropsPerMl] = useState<string>('20');

  // --- 5. Estado: Posologia Pediátrica, Gotejamento & Clearance Renal ---
  const [childWeightKg, setChildWeightKg] = useState<string>('12');
  const [prescribedDoseMgKg, setPrescribedDoseMgKg] = useState<string>('15');
  const [medConcentrationMgMl, setMedConcentrationMgMl] = useState<string>('50');
  const [dosesPerDay, setDosesPerDay] = useState<string>('3');

  const [infusionVolMl, setInfusionVolMl] = useState<string>('500');
  const [infusionTimeHours, setInfusionTimeHours] = useState<string>('6');

  const [patientAge, setPatientAge] = useState<string>('68');
  const [patientWeight, setPatientWeight] = useState<string>('70');
  const [serumCreatinine, setSerumCreatinine] = useState<string>('1.4');
  const [patientSex, setPatientSex] = useState<'M' | 'F'>('M');

  // --- 6. Estado: Quadrado de Pearson (Aligação) ---
  const [highConc, setHighConc] = useState<string>('96');
  const [lowConc, setLowConc] = useState<string>('0');
  const [desiredConc, setDesiredConc] = useState<string>('70');
  const [finalTotalVol, setFinalTotalVol] = useState<string>('1000');

  // --- 7. Estado: Farmacotécnica Magistral (FEq, FC e Cápsulas) ---
  const [manipPresetIdx, setManipPresetIdx] = useState<number>(0);
  const [prescribedDoseMg, setPrescribedDoseMg] = useState<string>('20');
  const [feqVal, setFeqVal] = useState<string>('1.12');
  const [assayPercent, setAssayPercent] = useState<string>('99.2');
  const [moisturePercent, setMoisturePercent] = useState<string>('0.5');
  const [numCapsules, setNumCapsules] = useState<string>('60');
  const [capsuleVolumeMl, setCapsuleVolumeMl] = useState<string>('0.50'); // Cápsula #1 = 0,50 mL
  const [powderDensity, setPowderDensity] = useState<string>('0.65');

  // --- 8. Estado: Isotonia de Colírios e Injetáveis (Equivalente em NaCl - E) ---
  const [isoDrugMassG, setIsoDrugMassG] = useState<string>('0.5');
  const [isoNaClEquivE, setIsoNaClEquivE] = useState<string>('0.24'); // Ex: Cloridrato de Pilocarpina E = 0,24
  const [isoFinalVolMl, setIsoFinalVolMl] = useState<string>('30');

  // Cálculos Memoizados
  const dilutionResult = useMemo(() => {
    return calculateDilution({
      solveFor,
      c1: parseFloat(c1),
      v1: parseFloat(v1),
      c2: parseFloat(c2),
      v2: parseFloat(v2),
      concUnit,
      volUnit,
    });
  }, [solveFor, c1, v1, c2, v2, concUnit, volUnit]);

  const concentrationMetrics = useMemo(() => {
    const mG = parseFloat(soluteMassG);
    const vMl = parseFloat(solutionVolMl);
    if (isNaN(mG) || isNaN(vMl) || vMl <= 0) return null;

    const percentWV = (mG / vMl) * 100; // g / 100 mL
    const mgPerMl = (mG * 1000) / vMl;
    const mcgPerMl = (mG * 1_000_000) / vMl;
    const gPerL = (mG / vMl) * 1000;
    const ppm = mcgPerMl; // 1 ppm = 1 mg/L = 1 mcg/mL em solução aquosa diluída
    const ratio = mG > 0 ? `1 : ${(vMl / mG).toFixed(0)}` : 'N/A';

    return {
      percentWV: percentWV.toFixed(3),
      mgPerMl: mgPerMl.toFixed(2),
      mcgPerMl: mcgPerMl.toFixed(1),
      gPerL: gPerL.toFixed(2),
      ppm: ppm.toFixed(1),
      ratio,
    };
  }, [soluteMassG, solutionVolMl]);

  const molarityMetrics = useMemo(() => {
    const mm = parseFloat(customMolarMass);
    const val = parseFloat(customValence);
    const part = parseFloat(customParticles);
    const massG = parseFloat(molarSoluteG);
    const volMl = parseFloat(molarVolMl);

    if (!mm || !val || !massG || !volMl || mm <= 0 || volMl <= 0) return null;

    const volL = volMl / 1000;
    const moles = massG / mm;
    const millimoles = moles * 1000;
    const molarity = moles / volL; // mol/L
    const millimolar = molarity * 1000; // mmol/L
    const normality = molarity * val; // Eq/L
    const mEqTotal = millimoles * val; // mEq no volume informado
    const mEqPerMl = mEqTotal / volMl;
    const mEqPerL = mEqTotal / volL;
    const osmolarity = molarity * (part || 1) * 1000; // mOsm/L teórico

    return {
      moles: moles.toFixed(4),
      millimoles: millimoles.toFixed(2),
      molarity: molarity.toFixed(4),
      millimolar: millimolar.toFixed(2),
      normality: normality.toFixed(4),
      mEqTotal: mEqTotal.toFixed(2),
      mEqPerMl: mEqPerMl.toFixed(3),
      mEqPerL: mEqPerL.toFixed(1),
      osmolarity: osmolarity.toFixed(1),
    };
  }, [customMolarMass, customValence, customParticles, molarSoluteG, molarVolMl]);

  const pearsonResult = useMemo(() => {
    const ch = parseFloat(highConc);
    const cl = parseFloat(lowConc);
    const cd = parseFloat(desiredConc);
    const vt = parseFloat(finalTotalVol);

    if (isNaN(ch) || isNaN(cl) || isNaN(cd) || isNaN(vt) || vt <= 0) return null;
    if (cd >= ch || cd <= cl || ch <= cl) {
      return {
        error: 'A concentração desejada (C_desejada) deve estar estritamente entre a concentração menor e a maior!',
      };
    }

    const partsHigh = cd - cl;
    const partsLow = ch - cd;
    const totalParts = partsHigh + partsLow;

    const volHigh = (partsHigh / totalParts) * vt;
    const volLow = (partsLow / totalParts) * vt;

    return {
      partsHigh: partsHigh.toFixed(2),
      partsLow: partsLow.toFixed(2),
      totalParts: totalParts.toFixed(2),
      volHigh: volHigh.toFixed(2),
      volLow: volLow.toFixed(2),
      error: null,
    };
  }, [highConc, lowConc, desiredConc, finalTotalVol]);

  const handleCompoundSelect = (idx: number) => {
    setSelectedCompoundIdx(idx);
    const comp = COMMON_PHARMA_COMPOUNDS[idx];
    if (comp) {
      setCustomMolarMass(String(comp.molarMass));
      setCustomValence(String(comp.valence));
      setCustomParticles(String(comp.dissociationParticles));
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Seletor de Sub-ferramentas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200/60 mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              Farmacotécnica & Farmácia Clínica
            </span>
            <h2 className="text-xl font-semibold text-slate-800">
              Calculadora Farmacêutica Universitária
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Cálculos exatos com demonstração passo a passo das fórmulas para estudo e conferência de bancada.
            </p>
          </div>
        </div>

        {/* Abas de Cálculos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-4">
          {[
            { id: 'dilution', label: 'Diluição (C₁V₁)', icon: Droplets },
            { id: 'concentration', label: 'Concentração & %', icon: FlaskConical },
            { id: 'pearson', label: 'Pearson (Mistura)', icon: Calculator },
            { id: 'molarity', label: 'Molaridade & mEq', icon: Atom },
            { id: 'manipulation', label: 'Manipulação (FC/FEq)', icon: Pill },
            { id: 'isotony', label: 'Isotonia (Colírios)', icon: Eye },
            { id: 'units', label: 'Unidades & Gotas', icon: Scale },
            { id: 'pediatric_drip', label: 'Posologia & Renal', icon: Baby },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CalcTab)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  active
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50/80 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ABA 1: DILUIÇÃO C1V1 = C2V2 */}
      {activeTab === 'dilution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-teal-600" />
                Diluição de Soluções (C₁ · V₁ = C₂ · V₂)
              </h3>
              <button
                onClick={() => {
                  setC1('50');
                  setV1('20');
                  setC2('10');
                  setV2('100');
                }}
                className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar exemplo
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Qual incógnita você deseja descobrir?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'V1', title: 'Descobrir V₁', desc: 'Volume do Estoque' },
                  { id: 'C2', title: 'Descobrir C₂', desc: 'Concentração Final' },
                  { id: 'V2', title: 'Descobrir V₂', desc: 'Volume Final' },
                  { id: 'C1', title: 'Descobrir C₁', desc: 'Conc. Inicial' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSolveFor(opt.id as 'V1' | 'C2' | 'V2' | 'C1')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      solveFor === opt.id
                        ? 'bg-teal-50/90 border-teal-500 text-teal-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.title}</div>
                    <div className="text-[11px] text-slate-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Unidade de Concentração
                </label>
                <select
                  value={concUnit}
                  onChange={(e) => setConcUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="% (p/v)">% (p/v)</option>
                  <option value="mg/mL">mg/mL</option>
                  <option value="mcg/mL">mcg/mL</option>
                  <option value="mol/L (M)">mol/L (M)</option>
                  <option value="UI/mL">UI/mL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Unidade de Volume
                </label>
                <select
                  value={volUnit}
                  onChange={(e) => setVolUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="mL">mL (Mililitros)</option>
                  <option value="L">L (Litros)</option>
                  <option value="µL">µL (Microlitros)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {solveFor !== 'C1' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    C₁ — Concentração Inicial / Estoque ({concUnit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={c1}
                    onChange={(e) => setC1(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}
              {solveFor !== 'V1' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    V₁ — Volume da Solução Inicial ({volUnit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={v1}
                    onChange={(e) => setV1(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}
              {solveFor !== 'C2' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    C₂ — Concentração Final Desejada ({concUnit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={c2}
                    onChange={(e) => setC2(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}
              {solveFor !== 'V2' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    V₂ — Volume Final Total ({volUnit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={v2}
                    onChange={(e) => setV2(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card de Resultado e Explicação Didática */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-700 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Resultado Farmacotécnico
              </div>

              {dilutionResult ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="text-xs text-slate-500">{dilutionResult.label}</div>
                    <div className="text-2xl font-bold text-teal-700 mt-1">
                      {dilutionResult.value}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Volume de Diluente / Veículo (q.s.p.):</span>
                      <span className="font-semibold text-slate-800">{dilutionResult.diluent}</span>
                    </div>
                  </div>

                  {dilutionResult.warning && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      {dilutionResult.warning}
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      Memória de Cálculo (Passo a Passo)
                    </div>
                    <p className="text-xs font-mono bg-slate-50 p-2.5 rounded-lg text-slate-700 border border-slate-200/60">
                      {dilutionResult.formulaStep}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Princípio da Conservação de Massa:</strong> Na diluição simples, a quantidade absoluta de soluto antes e depois de adicionar o solvente permanece constante (<code className="text-teal-700">m₁ = m₂</code>, logo <code className="text-teal-700">C₁ · V₁ = C₂ · V₂</code>).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 py-8 text-center">
                  Preencha valores numéricos positivos para calcular.
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900">
              <strong>Dica de Bancada:</strong> Ao preparar a diluição em balão volumétrico ou proveta, meça primeiro o volume <code className="font-semibold">V₁</code> da solução concentrada e adicione o veículo/solvente em <strong>q.s.p.</strong> (quantidade suficiente para) atingir o volume final <code className="font-semibold">V₂</code>.
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: CONCENTRAÇÃO (% p/v, mg/mL, mcg/mL, ppm, Título) */}
      {activeTab === 'concentration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-600" />
              Expressões de Concentração Farmacêutica
            </h3>
            <p className="text-xs text-slate-500">
              Informe a massa do fármaco (soluto) e o volume total da solução para converter automaticamente entre todas as representações de bula e farmacopeia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Massa de Soluto (em gramas - g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={soluteMassG}
                  onChange={(e) => setSoluteMassG(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Equivale a {(parseFloat(soluteMassG || '0') * 1000).toFixed(1)} mg
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Volume Total da Solução (em mL)
                </label>
                <input
                  type="number"
                  step="any"
                  value={solutionVolMl}
                  onChange={(e) => setSolutionVolMl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Equivale a {(parseFloat(solutionVolMl || '0') / 1000).toFixed(3)} L
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs font-medium text-slate-600 mb-2">
                Exemplos Rápidos Hospitalares (Clique para carregar):
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Soro Fisiológico 0,9% (0,9g / 100mL)', m: '0.9', v: '100' },
                  { label: 'Soro Glicosado 5% (25g / 500mL)', m: '25', v: '500' },
                  { label: 'Lidocaína 2% (0,4g / 20mL)', m: '0.4', v: '20' },
                  { label: 'Adrenalina 1:1000 (0,001g / 1mL)', m: '0.001', v: '1' },
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSoluteMassG(preset.m);
                      setSolutionVolMl(preset.v);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">
              Equivalências Calculadas
            </h4>
            {concentrationMetrics ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Título Percentual (% p/v)</div>
                  <div className="text-lg font-bold text-teal-700 mt-0.5">
                    {concentrationMetrics.percentWV}%
                  </div>
                  <div className="text-[10px] text-slate-400">g por 100 mL</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Miligramas por mL</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {concentrationMetrics.mgPerMl} mg/mL
                  </div>
                  <div className="text-[10px] text-slate-400">1% p/v = 10 mg/mL</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Microgramas por mL</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {concentrationMetrics.mcgPerMl} mcg/mL
                  </div>
                  <div className="text-[10px] text-slate-400">µg/mL</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Concentração Comum</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {concentrationMetrics.gPerL} g/L
                  </div>
                  <div className="text-[10px] text-slate-400">gramas por litro</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Partes por Milhão (ppm)</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {concentrationMetrics.ppm} ppm
                  </div>
                  <div className="text-[10px] text-slate-400">1 g em 1.000.000 mL</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Proporção / Razão</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {concentrationMetrics.ratio}
                  </div>
                  <div className="text-[10px] text-slate-400">1 g : X mL</div>
                </div>
              </div>
            ) : null}

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                Macete Rápido para Provas e Estágio:
              </div>
              <p>
                Para converter rapidamente <strong>% (p/v) para mg/mL</strong>, basta multiplicar por <strong>10</strong>! Exemplo: Lidocaína 2% = 20 mg/mL; Glicose 50% = 500 mg/mL; NaCl 0,9% = 9 mg/mL.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: QUADRADO DE PEARSON (ALIGAÇÃO) */}
      {activeTab === 'pearson' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              Método de Aligação Medial (Quadrado de Pearson)
            </h3>
            <p className="text-xs text-slate-500">
              Ideal para misturar duas soluções de concentrações diferentes (ex: preparar Álcool 70% a partir de Álcool 96% e Água 0%, ou preparar Soro Glicosado 10% misturando SG 5% e SG 50%).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Concentração Maior — C_maior (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={highConc}
                  onChange={(e) => setHighConc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Concentração Menor — C_menor (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={lowConc}
                  onChange={(e) => setLowConc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Concentração Desejada — C_final (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={desiredConc}
                  onChange={(e) => setDesiredConc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Volume Final a Preparar (mL)
                </label>
                <input
                  type="number"
                  step="any"
                  value={finalTotalVol}
                  onChange={(e) => setFinalTotalVol(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => {
                  setHighConc('96');
                  setLowConc('0');
                  setDesiredConc('70');
                  setFinalTotalVol('1000');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 cursor-pointer"
              >
                Exemplo: Álcool 70% (a partir de 96% e Água)
              </button>
              <button
                onClick={() => {
                  setHighConc('50');
                  setLowConc('5');
                  setDesiredConc('10');
                  setFinalTotalVol('500');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 cursor-pointer"
              >
                Exemplo: SG 10% (500 mL a partir de SG 50% + SG 5%)
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">
              Proporção de Mistura (Quadrado de Pearson)
            </h4>
            {pearsonResult?.error ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                {pearsonResult.error}
              </div>
            ) : pearsonResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                    <div className="text-xs text-slate-500">
                      Volume da Solução Maior ({highConc}%)
                    </div>
                    <div className="text-xl font-bold text-teal-700 mt-1">
                      {pearsonResult.volHigh} mL
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      ({pearsonResult.partsHigh} partes de {pearsonResult.totalParts})
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                    <div className="text-xs text-slate-500">
                      Volume da Solução Menor ({lowConc}%)
                    </div>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      {pearsonResult.volLow} mL
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      ({pearsonResult.partsLow} partes de {pearsonResult.totalParts})
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-xs space-y-1.5 text-slate-600">
                  <div className="font-semibold text-slate-800">Como o Quadrado de Pearson funciona:</div>
                  <p>
                    1. Partes da Solução Maior = <code className="text-teal-700">C_desejada - C_menor = {desiredConc} - {lowConc} = {pearsonResult.partsHigh} partes</code>
                  </p>
                  <p>
                    2. Partes da Solução Menor = <code className="text-teal-700">C_maior - C_desejada = {highConc} - {desiredConc} = {pearsonResult.partsLow} partes</code>
                  </p>
                  <p>
                    3. Soma das Partes = <code className="text-teal-700">{pearsonResult.totalParts} partes</code> equivalem ao volume total de <code className="text-teal-700">{finalTotalVol} mL</code>.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ABA 4: MOLARIDADE, NORMALIDADE, mEq e OSMOLARIDADE */}
      {activeTab === 'molarity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Atom className="w-5 h-5 text-teal-600" />
              Molaridade (M), Normalidade (N), mEq e Osmolaridade
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Selecionar Insumo Farmacêutico da Farmacopeia (ou edite abaixo)
              </label>
              <select
                value={selectedCompoundIdx}
                onChange={(e) => handleCompoundSelect(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
              >
                {COMMON_PHARMA_COMPOUNDS.map((c, idx) => (
                  <option key={c.name} value={idx}>
                    {c.name} [{c.formula}] — MM: {c.molarMass} g/mol | Valência: {c.valence}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Massa Molar (g/mol)
                </label>
                <input
                  type="number"
                  step="any"
                  value={customMolarMass}
                  onChange={(e) => setCustomMolarMass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Valência (z)
                </label>
                <input
                  type="number"
                  step="1"
                  value={customValence}
                  onChange={(e) => setCustomValence(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Partículas (i)
                </label>
                <input
                  type="number"
                  step="1"
                  value={customParticles}
                  onChange={(e) => setCustomParticles(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Massa do Soluto (g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={molarSoluteG}
                  onChange={(e) => setMolarSoluteG(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Volume da Solução (mL)
                </label>
                <input
                  type="number"
                  step="any"
                  value={molarVolMl}
                  onChange={(e) => setMolarVolMl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">
              Parâmetros Físico-Químicos e Eletrolíticos
            </h4>
            {molarityMetrics ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Molaridade (M)</div>
                  <div className="text-lg font-bold text-teal-700 mt-0.5">
                    {molarityMetrics.molarity} mol/L
                  </div>
                  <div className="text-[10px] text-slate-400">{molarityMetrics.millimolar} mmol/L</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Miliequivalentes Totais</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {molarityMetrics.mEqTotal} mEq
                  </div>
                  <div className="text-[10px] text-slate-400">em {molarVolMl} mL</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Concentração em mEq/mL</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {molarityMetrics.mEqPerMl} mEq/mL
                  </div>
                  <div className="text-[10px] text-slate-400">{molarityMetrics.mEqPerL} mEq/L</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Normalidade (N)</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {molarityMetrics.normality} Eq/L
                  </div>
                  <div className="text-[10px] text-slate-400">N = M × valência</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Osmolaridade Teórica</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {molarityMetrics.osmolarity} mOsm/L
                  </div>
                  <div className="text-[10px] text-slate-400">Plasma normal: 275–295</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500">Quantidade de Matéria</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {molarityMetrics.millimoles} mmol
                  </div>
                  <div className="text-[10px] text-slate-400">{molarityMetrics.moles} mol</div>
                </div>
              </div>
            ) : null}

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Fórmulas Fundamentais:</div>
              <p className="font-mono text-[11px] text-teal-800">
                M = m(g) / [MM(g/mol) × V(L)] &nbsp;|&nbsp; mEq = [m(mg) × Valência] / MM(g/mol)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: CONVERSOR DE UNIDADES FARMACÊUTICAS */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-600" />
              Conversor Universal de Unidades Farmacêuticas
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setConvCategory('mass');
                  setConvFromUnit('mg');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
                  convCategory === 'mass'
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Massa (kg, g, mg, mcg, ng)
              </button>
              <button
                onClick={() => {
                  setConvCategory('volume');
                  setConvFromUnit('mL');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
                  convCategory === 'volume'
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Volume & Gotas (L, mL, µL, gotas)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Valor a Converter
                </label>
                <input
                  type="number"
                  step="any"
                  value={convValue}
                  onChange={(e) => setConvValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Unidade de Origem
                </label>
                {convCategory === 'mass' ? (
                  <select
                    value={convFromUnit}
                    onChange={(e) => setConvFromUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800"
                  >
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="mg">Miligrama (mg)</option>
                    <option value="mcg">Micrograma (mcg / µg)</option>
                    <option value="ng">Nanograma (ng)</option>
                  </select>
                ) : (
                  <select
                    value={convFromUnit}
                    onChange={(e) => setConvFromUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800"
                  >
                    <option value="L">Litro (L)</option>
                    <option value="mL">Mililitro (mL)</option>
                    <option value="uL">Microlitro (µL)</option>
                    <option value="gotas">Gotas (Padrão)</option>
                    <option value="microgotas">Microgotas</option>
                  </select>
                )}
              </div>
            </div>

            {convCategory === 'volume' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Calibração do Conta-gotas (Padrão Farmacopeia Brasileira = 20 gotas/mL)
                </label>
                <input
                  type="number"
                  value={dropsPerMl}
                  onChange={(e) => setDropsPerMl(e.target.value)}
                  className="w-40 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">
              Tabela de Conversão Instantânea
            </h4>
            {(() => {
              const v = parseFloat(convValue);
              if (isNaN(v)) return null;

              if (convCategory === 'mass') {
                // Base em gramas
                const toG: Record<string, number> = {
                  kg: 1000,
                  g: 1,
                  mg: 1e-3,
                  mcg: 1e-6,
                  ng: 1e-9,
                };
                const baseG = v * (toG[convFromUnit] || 1);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { u: 'Quilogramas (kg)', val: baseG / 1000 },
                      { u: 'Gramas (g)', val: baseG },
                      { u: 'Miligramas (mg)', val: baseG * 1000 },
                      { u: 'Microgramas (mcg / µg)', val: baseG * 1e6 },
                      { u: 'Nanogramas (ng)', val: baseG * 1e9 },
                    ].map((row) => (
                      <div
                        key={row.u}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 flex justify-between items-center"
                      >
                        <span className="text-xs text-slate-500">{row.u}</span>
                        <span className="text-sm font-bold text-slate-800">
                          {row.val >= 0.001 && row.val < 1e7
                            ? row.val.toLocaleString('pt-BR', { maximumFractionDigits: 6 })
                            : row.val.toExponential(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              } else {
                const gtsFactor = parseFloat(dropsPerMl) || 20;
                const toMl: Record<string, number> = {
                  L: 1000,
                  mL: 1,
                  uL: 0.001,
                  gotas: 1 / gtsFactor,
                  microgotas: 1 / 60,
                };
                const baseMl = v * (toMl[convFromUnit] || 1);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { u: 'Litros (L)', val: baseMl / 1000 },
                      { u: 'Mililitros (mL)', val: baseMl },
                      { u: 'Microlitros (µL)', val: baseMl * 1000 },
                      { u: `Gotas (${gtsFactor} gts/mL)`, val: baseMl * gtsFactor },
                      { u: 'Microgotas (60 µgts/mL)', val: baseMl * 60 },
                      { u: 'Colher de Chá (5 mL)', val: baseMl / 5 },
                    ].map((row) => (
                      <div
                        key={row.u}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 flex justify-between items-center"
                      >
                        <span className="text-xs text-slate-500">{row.u}</span>
                        <span className="text-sm font-bold text-slate-800">
                          {row.val.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}

      {/* ABA 6: POSOLOGIA PEDIÁTRICA, GOTEJAMENTO EV E CLEARANCE DE CREATININA */}
      {activeTab === 'pediatric_drip' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Dose Pediátrica */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Baby className="w-4 h-4 text-teal-600" />
              Cálculo de Posologia Pediátrica
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Peso da Criança (kg)</label>
                <input
                  type="number"
                  value={childWeightKg}
                  onChange={(e) => setChildWeightKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Dose Prescrita (mg/kg/dose)</label>
                <input
                  type="number"
                  value={prescribedDoseMgKg}
                  onChange={(e) => setPrescribedDoseMgKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Concentração (mg/mL)</label>
                  <input
                    type="number"
                    value={medConcentrationMgMl}
                    onChange={(e) => setMedConcentrationMgMl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Tomadas / Dia</label>
                  <input
                    type="number"
                    value={dosesPerDay}
                    onChange={(e) => setDosesPerDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {(() => {
              const w = parseFloat(childWeightKg);
              const d = parseFloat(prescribedDoseMgKg);
              const c = parseFloat(medConcentrationMgMl);
              const n = parseFloat(dosesPerDay) || 1;
              if (!w || !d || !c || c <= 0) return null;
              const mgPerDose = w * d;
              const mlPerDose = mgPerDose / c;
              const dropsDose = mlPerDose * 20;
              return (
                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/70 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Dose por tomada (mg):</span>
                    <span className="font-bold text-slate-800">{mgPerDose.toFixed(1)} mg</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Volume por tomada (mL):</span>
                    <span className="font-bold text-teal-700 text-sm">{mlPerDose.toFixed(2)} mL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Em gotas (20 gts/mL):</span>
                    <span className="font-semibold text-slate-800">{Math.round(dropsDose)} gotas</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-teal-200/60">
                    <span className="text-slate-600">Dose Total Diária:</span>
                    <span className="font-semibold text-slate-800">
                      {(mgPerDose * n).toFixed(0)} mg/dia ({(mlPerDose * n).toFixed(1)} mL/dia)
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Card 2: Gotejamento de Soro */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-teal-600" />
              Velocidade de Gotejamento Endovenoso
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Volume Total da Infusão (mL)</label>
                <input
                  type="number"
                  value={infusionVolMl}
                  onChange={(e) => setInfusionVolMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tempo de Infusão (em Horas)</label>
                <input
                  type="number"
                  value={infusionTimeHours}
                  onChange={(e) => setInfusionTimeHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            {(() => {
              const v = parseFloat(infusionVolMl);
              const t = parseFloat(infusionTimeHours);
              if (!v || !t || t <= 0) return null;
              const macroDropsMin = v / (t * 3);
              const microDropsMin = v / t;
              return (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Equipo Macrogotas:</span>
                    <span className="text-base font-bold text-teal-700">
                      {Math.round(macroDropsMin)} gts/min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Equipo Microgotas:</span>
                    <span className="text-base font-bold text-slate-800">
                      {Math.round(microDropsMin)} µgts/min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Bomba de Infusão (BIC):</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {microDropsMin.toFixed(1)} mL/h
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Fórmula: <code>Gotas/min = V / (3 × t)</code>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Card 3: Clearance de Creatinina (Cockcroft-Gault) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Ajuste Renal (Cockcroft-Gault)
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Idade (anos)</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  value={patientWeight}
                  onChange={(e) => setPatientWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Creatinina (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={serumCreatinine}
                  onChange={(e) => setSerumCreatinine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Sexo Biológico</label>
                <select
                  value={patientSex}
                  onChange={(e) => setPatientSex(e.target.value as 'M' | 'F')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino (×0,85)</option>
                </select>
              </div>
            </div>

            {(() => {
              const res = calculateCockcroftGault({
                age: parseFloat(patientAge),
                weightKg: parseFloat(patientWeight),
                serumCreatinineMgDl: parseFloat(serumCreatinine),
                sex: patientSex,
              });
              if (!res) return null;
              return (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Clearance Estimado (ClCr):</span>
                    <span className="text-base font-bold text-teal-700">
                      {res.clcr.toFixed(1)} mL/min
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">{res.stageMessage}</div>
                  {res.warning && (
                    <div className="text-[11px] text-amber-700 font-medium">{res.warning}</div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ABA 7: FARMACOTÉCNICA MAGISTRAL (FATOR DE EQUIVALÊNCIA FEq, FATOR DE CORREÇÃO FC & CÁPSULAS) */}
      {activeTab === 'manipulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              Farmácia de Manipulação: Fator de Equivalência (FEq), Correção (FC) & Cápsulas
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo essencial para pesagem de insumos na forma de sal/hidratados, correção de teor/umidade do laudo analítico e cálculo do excipiente para encapsulação.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Exemplos Clássicos de Farmacotécnica Magistral (Clique para carregar)
              </label>
              <select
                value={manipPresetIdx}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setManipPresetIdx(idx);
                  const preset = MANIPULATION_FEQ_PRESETS[idx];
                  if (preset) {
                    setFeqVal(String(preset.feq));
                    setAssayPercent(String(preset.defaultAssayPercent));
                    setMoisturePercent(String(preset.defaultMoisturePercent));
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-800"
              >
                {MANIPULATION_FEQ_PRESETS.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name} — FEq: {p.feq} | Teor Padrão: {p.defaultAssayPercent}%
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-teal-700 mt-1">
                {MANIPULATION_FEQ_PRESETS[manipPresetIdx]?.note}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dose Prescrita / Cáps (mg)
                </label>
                <input
                  type="number"
                  step="any"
                  value={prescribedDoseMg}
                  onChange={(e) => setPrescribedDoseMg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  FEq (Sal / Base)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={feqVal}
                  onChange={(e) => setFeqVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Teor no Laudo (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={assayPercent}
                  onChange={(e) => setAssayPercent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Umidade no Laudo (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nº Total de Cápsulas
                </label>
                <input
                  type="number"
                  value={numCapsules}
                  onChange={(e) => setNumCapsules(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tamanho da Cápsula
                </label>
                <select
                  value={capsuleVolumeMl}
                  onChange={(e) => setCapsuleVolumeMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                >
                  <option value="0.95">Cápsula #00 (0,95 mL)</option>
                  <option value="0.68">Cápsula #0 (0,68 mL)</option>
                  <option value="0.50">Cápsula #1 (0,50 mL)</option>
                  <option value="0.37">Cápsula #2 (0,37 mL)</option>
                  <option value="0.30">Cápsula #3 (0,30 mL)</option>
                  <option value="0.21">Cápsula #4 (0,21 mL)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Densidade Aparente (g/mL)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={powderDensity}
                  onChange={(e) => setPowderDensity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">
              Ficha de Pesagem Magistral
            </h4>
            {(() => {
              const dose = parseFloat(prescribedDoseMg);
              const feq = parseFloat(feqVal) || 1;
              const teor = parseFloat(assayPercent) || 100;
              const umid = parseFloat(moisturePercent) || 0;
              const nCaps = parseFloat(numCapsules) || 1;
              const capVol = parseFloat(capsuleVolumeMl) || 0.5;
              const dens = parseFloat(powderDensity) || 0.65;

              const mag = calculateMagistralWeighing({
                prescribedDoseMg: dose,
                feq,
                assayPercent: teor,
                moisturePercent: umid,
                numCapsules: nCaps,
                capsuleVolumeMl: capVol,
                powderDensity: dens,
              });

              if (!mag) return null;

              const {
                fc,
                factorCombined,
                correctedDosePerCapMg,
                totalActiveToWeighMg,
                totalActiveToWeighG,
                excipientMassG,
                overflowWarning,
              } = mag;

              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] text-slate-500">Fator de Correção (FC)</div>
                      <div className="text-lg font-bold text-slate-800 mt-0.5">
                        {fc.toFixed(4)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Fator Total (FEq×FC): {factorCombined.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] text-slate-500">Dose Corrigida / Cáps</div>
                      <div className="text-lg font-bold text-teal-700 mt-0.5">
                        {correctedDosePerCapMg.toFixed(2)} mg
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Prescrita: {dose} mg
                      </div>
                    </div>
                  </div>

                  {overflowWarning && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                      {overflowWarning}
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-xl border border-teal-300 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">
                        Massa Total de IFA a Pesar ({nCaps} cáps):
                      </span>
                      <span className="text-lg font-bold text-teal-700">
                        {totalActiveToWeighG.toFixed(4)} g ({totalActiveToWeighMg.toFixed(1)} mg)
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-600">
                        Excipiente Padrão q.s.p. ({nCaps} cáps):
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {excipientMassG.toFixed(3)} g ({(excipientMassG * 1000).toFixed(0)} mg)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800">Memória de Cálculo (Provas de Farmacotécnica):</div>
                    <p className="font-mono text-[11px] text-teal-800">
                      FEq = MM_sal / MM_base &nbsp;|&nbsp; FC = 100 / [Teor × (1 - Umidade/100)]
                    </p>
                    <p className="text-[11px]">
                      Massa a pesar = {dose} mg × {feq} (FEq) × {fc.toFixed(3)} (FC) × {nCaps} cáps ={' '}
                      <strong>{totalActiveToWeighG.toFixed(4)} g</strong>.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ABA 8: ISOTONIA DE COLÍRIOS E INJETÁVEIS (MÉTODO DO EQUIVALENTE EM NaCl - E) */}
      {activeTab === 'isotony' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              Cálculo de Isotonia (Método do Equivalente em NaCl — Valor E)
            </h3>
            <p className="text-xs text-slate-500">
              Determina a quantidade exata de Cloreto de Sódio (NaCl) ou agente isotonizante necessária para que colírios e soluções injetáveis fiquem isotônicos com os fluidos biológicos (0,9% de NaCl).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Massa do Fármaco na Fórmula (g)
                </label>
                <input
                  type="number"
                  step="any"
                  value={isoDrugMassG}
                  onChange={(e) => setIsoDrugMassG(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Equivalente em NaCl do Fármaco (E)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={isoNaClEquivE}
                  onChange={(e) => setIsoNaClEquivE(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Volume Final do Colírio/Solução (mL)
                </label>
                <input
                  type="number"
                  step="any"
                  value={isoFinalVolMl}
                  onChange={(e) => setIsoFinalVolMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-medium text-slate-600">
                Valores Clássicos de Equivalente em NaCl (E) da Farmacopeia:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Cloridrato de Pilocarpina (E = 0,24)', e: '0.24', m: '0.3', v: '30' },
                  { label: 'Sulfato de Atropina (E = 0,13)', e: '0.13', m: '0.3', v: '30' },
                  { label: 'Sulfato de Zinco (E = 0,15)', e: '0.15', m: '0.075', v: '30' },
                  { label: 'Cloridrato de Lidocaína (E = 0,22)', e: '0.22', m: '0.4', v: '20' },
                  { label: 'Nitrato de Prata (E = 0,33)', e: '0.33', m: '0.1', v: '10' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsoNaClEquivE(item.e);
                      setIsoDrugMassG(item.m);
                      setIsoFinalVolMl(item.v);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-800">
              Resultado do Ajuste de Tonicidade
            </h4>
            {(() => {
              const mDrug = parseFloat(isoDrugMassG);
              const valE = parseFloat(isoNaClEquivE);
              const vol = parseFloat(isoFinalVolMl);

              if (isNaN(mDrug) || isNaN(valE) || !vol || vol <= 0) return null;

              // Passo 1: Quantos gramas de NaCl seriam necessários para isotonizar 'vol' mL de água pura?
              const totalNaClRequiredG = (0.9 * vol) / 100;
              // Passo 2: Quanto de NaCl o fármaco já representa osmoticamente?
              const drugNaClContributionG = mDrug * valE;
              // Passo 3: Diferença que falta adicionar de NaCl
              const naclToAddG = totalNaClRequiredG - drugNaClContributionG;
              // Caso queira isotonizar com Ácido Bórico (E = 0,52) em vez de NaCl:
              const boricAcidToAddG = naclToAddG > 0 ? naclToAddG / 0.52 : 0;

              return (
                <div className="space-y-3">
                  {naclToAddG >= 0 ? (
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          NaCl a adicionar para isotonizar:
                        </span>
                        <span className="text-xl font-bold text-teal-700">
                          {naclToAddG.toFixed(4)} g ({(naclToAddG * 1000).toFixed(1)} mg)
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          Ou se isotonizar com Ácido Bórico (E=0,52):
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {boricAcidToAddG.toFixed(4)} g ({(boricAcidToAddG * 1000).toFixed(1)} mg)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>Solução Hipertônica!</strong> O fármaco sozinho já equivale a{' '}
                      {drugNaClContributionG.toFixed(3)} g de NaCl (acima dos {totalNaClRequiredG.toFixed(3)} g necessários para {vol} mL). Não adicionar NaCl!
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800">
                      Passo a Passo do Método de Wells (Provas de Farmacotécnica):
                    </div>
                    <p>
                      1. <strong>NaCl total para {vol} mL (0,9%):</strong>{' '}
                      <code>0,009 × {vol} mL = {totalNaClRequiredG.toFixed(4)} g</code>
                    </p>
                    <p>
                      2. <strong>Equivalente osmótico do fármaco:</strong>{' '}
                      <code>{mDrug} g × {valE} (E) = {drugNaClContributionG.toFixed(4)} g de NaCl</code>
                    </p>
                    <p>
                      3. <strong>NaCl a pesar:</strong>{' '}
                      <code>
                        {totalNaClRequiredG.toFixed(4)} - {drugNaClContributionG.toFixed(4)} ={' '}
                        {Math.max(0, naclToAddG).toFixed(4)} g
                      </code>
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
