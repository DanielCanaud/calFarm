'use client';

import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { MEDICATIONS_DB } from '@/data/medications-db';

interface MedicationComparatorProps {
  initialMedId?: string | null;
}

export default function MedicationComparator({ initialMedId }: MedicationComparatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialMedId && MEDICATIONS_DB.some((m) => m.id === initialMedId)) {
      const other = MEDICATIONS_DB.find((m) => m.id !== initialMedId)?.id || 'paracetamol';
      return [initialMedId, other];
    }
    return ['dipirona-monoidratada', 'paracetamol', 'ibuprofeno'];
  });

  const selectedMeds = useMemo(
    () =>
      selectedIds
        .map((id) => MEDICATIONS_DB.find((m) => m.id === id))
        .filter((m): m is NonNullable<typeof m> => Boolean(m)),
    [selectedIds]
  );

  const handleSelectChange = (index: number, newId: string) => {
    setSelectedIds((prev) => {
      const copy = [...prev];
      copy[index] = newId;
      return copy;
    });
  };

  const handleAddSlot = () => {
    if (selectedIds.length >= 3) return;
    const unused = MEDICATIONS_DB.find((m) => !selectedIds.includes(m.id));
    if (unused) {
      setSelectedIds((prev) => [...prev, unused.id]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (selectedIds.length <= 2) return;
    setSelectedIds((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Análise inteligente de relação farmacológica entre os medicamentos comparados
  const comparisonInsight = useMemo(() => {
    if (selectedMeds.length < 2) return null;
    const sameActive = selectedMeds.every(
      (m) => m.activeIngredient === selectedMeds[0].activeIngredient
    );
    const sameClass = selectedMeds.every(
      (m) => m.therapeuticClass === selectedMeds[0].therapeuticClass
    );

    // Verifica se há interação direta documentada entre eles
    const interactionWarnings: string[] = [];
    for (let i = 0; i < selectedMeds.length; i++) {
      for (let j = i + 1; j < selectedMeds.length; j++) {
        const a = selectedMeds[i];
        const b = selectedMeds[j];
        a.interactions.forEach((inter) => {
          const t = inter.interactingSubstance.toLowerCase();
          if (
            t.includes(b.activeIngredient.toLowerCase().split(' ')[0]) ||
            (t.includes('ieca') && b.pharmacologicalGroup.toLowerCase().includes('ieca')) ||
            (t.includes('bra') && b.pharmacologicalGroup.toLowerCase().includes('bra')) ||
            (t.includes('aine') && b.therapeuticClass.toLowerCase().includes('aine'))
          ) {
            interactionWarnings.push(
              `${a.name.split('(')[0].trim()} + ${b.name.split('(')[0].trim()}: ${inter.effect} (${inter.conduct})`
            );
          }
        });
      }
    }

    return {
      sameActive,
      sameClass,
      interactionWarnings,
    };
  }, [selectedMeds]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Presets de Estudo Comparativo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200/60 mb-2">
              <GitCompare className="w-3.5 h-3.5" />
              Farmacologia Comparada & Intercambialidade
            </span>
            <h2 className="text-xl font-semibold text-slate-800">
              Comparador Clínico de Medicamentos
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Compare lado a lado princípios ativos, concentrações, apresentações, farmacocinética (ADME) e segurança.
            </p>
          </div>

          {selectedIds.length < 3 && (
            <button
              onClick={handleAddSlot}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium flex items-center gap-1.5 self-start cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Adicionar 3º Medicamento
            </button>
          )}
        </div>

        {/* Presets Acadêmicos Clássicos */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500">
            Comparações Clássicas de Prova:
          </span>
          {[
            {
              label: 'Analgésicos/AINEs (Dipirona × Paracetamol × Ibuprofeno)',
              ids: ['dipirona-monoidratada', 'paracetamol', 'ibuprofeno'],
            },
            {
              label: 'Anti-hipertensivos (Losartana × Enalapril × Hidroclorotiazida)',
              ids: ['losartana-potassica', 'enalapril', 'hidroclorotiazida'],
            },
            {
              label: 'Antibióticos (Amoxicilina × Azitromicina × Ciprofloxacino)',
              ids: ['amoxicilina', 'azitromicina', 'ciprofloxacino'],
            },
            {
              label: 'Psicofármacos (Clonazepam × Sertralina)',
              ids: ['clonazepam', 'sertralina'],
            },
          ].map((preset, i) => (
            <button
              key={i}
              onClick={() => setSelectedIds(preset.ids)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Síntese Farmacológica Automática */}
      {comparisonInsight && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Análise Farmacológica Comparativa
          </div>
          <p className="text-xs text-slate-600">
            {comparisonInsight.sameActive
              ? 'Os itens selecionados possuem o MESMO princípio ativo (DCB), sendo candidatos à intercambialidade (Referência/Genérico) desde que na mesma concentração e forma farmacêutica (Lei 9.787/99).'
              : comparisonInsight.sameClass
              ? `Os fármacos pertencem à mesma classe terapêutica principal (${selectedMeds[0].therapeuticClass}), porém possuem estruturas químicas, meias-vidas e perfis de segurança distintos.`
              : 'Os fármacos pertencem a classes terapêuticas distintas — verifique abaixo diferenças em mecanismo de ação, metabolização CYP450 e potenciais interações.'}
          </p>

          {comparisonInsight.interactionWarnings.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                Atenção: Interação Farmacológica entre os Medicamentos Selecionados!
              </div>
              {comparisonInsight.interactionWarnings.map((w, idx) => (
                <p key={idx} className="text-rose-800">
                  • {w}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seletores de Colunas */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          selectedMeds.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
        }`}
      >
        {selectedMeds.map((med, idx) => (
          <div
            key={`${med.id}-${idx}`}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4"
          >
            {/* Cabeçalho Seletor */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <select
                value={med.id}
                onChange={(e) => handleSelectChange(idx, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
              >
                {MEDICATIONS_DB.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {selectedMeds.length > 2 && (
                <button
                  onClick={() => handleRemoveSlot(idx)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 cursor-pointer"
                  title="Remover coluna"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bloco 1: Identificação e Classe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase text-slate-400">
                  Princípio Ativo (DCB)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  ATC: {med.atcCode}
                </span>
              </div>
              <div className="text-sm font-bold text-teal-700">
                {med.activeIngredient}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block">Classe Terapêutica</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {med.therapeuticClass}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block">Grupo Farmacológico</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {med.pharmacologicalGroup}
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Concentrações e Apresentações */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                Concentrações & Apresentações
              </div>
              <div className="flex flex-wrap gap-1.5">
                {med.concentrations.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-teal-800"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <ul className="text-xs text-slate-600 space-y-1 pt-1">
                {med.presentations.map((p, i) => (
                  <li key={i} className="truncate">
                    • {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloco 3: Mecanismo de Ação */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase text-slate-400">
                Mecanismo de Ação
              </div>
              <p className="text-xs text-slate-700 bg-teal-50/40 p-3 rounded-xl border border-teal-200/60 leading-relaxed">
                {med.mechanismOfAction}
              </p>
            </div>

            {/* Bloco 4: Farmacocinética Comparada */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase text-slate-400">
                Farmacocinética (ADME)
              </div>
              <div className="bg-slate-50/80 rounded-xl border border-slate-200/70 divide-y divide-slate-200/60 text-xs">
                <div className="p-2.5 flex justify-between gap-2">
                  <span className="text-slate-500">Biodisponibilidade:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {med.pharmacokinetics.bioavailability}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between gap-2">
                  <span className="text-slate-500">Meia-vida (t½):</span>
                  <span className="font-semibold text-teal-700 text-right">
                    {med.pharmacokinetics.halfLife}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between gap-2">
                  <span className="text-slate-500">Metabolismo:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {med.pharmacokinetics.metabolism}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between gap-2">
                  <span className="text-slate-500">Excreção:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {med.pharmacokinetics.excretion}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between gap-2">
                  <span className="text-slate-500">Início de Ação:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {med.pharmacokinetics.onsetOfAction}
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco 5: Posologia e Dose Máxima */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase text-slate-400">
                Posologia & Dose Máxima
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5 text-slate-700">
                <p>
                  <strong>Adulto:</strong> {med.dosageGuide.adult}
                </p>
                <p>
                  <strong>Teto Diário:</strong>{' '}
                  <span className="font-semibold text-teal-800">
                    {med.dosageGuide.maxDailyDose}
                  </span>
                </p>
              </div>
            </div>

            {/* Bloco 6: Segurança, Gravidez e Receituário */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500">Categoria na Gestação:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    med.pregnancyCategory === 'A' || med.pregnancyCategory === 'B'
                      ? 'bg-emerald-100 text-emerald-800'
                      : med.pregnancyCategory === 'C'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Categoria {med.pregnancyCategory}
                </span>
              </div>

              <div className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 block mb-0.5">Exigência Regulatória:</span>
                <span className="font-semibold text-slate-800">{med.prescriptionType}</span>
              </div>

              <div className="text-xs p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                <div className="font-semibold text-amber-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Principais Reações Adversas
                </div>
                <p className="text-slate-700">{med.adverseEffects.common.join('; ')}</p>
              </div>

              <div className="text-xs p-3 rounded-xl bg-sky-50/60 border border-sky-200/60 space-y-1">
                <div className="font-semibold text-sky-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Diferencial Clínico
                </div>
                <p className="text-slate-700 leading-relaxed">{med.clinicalPearls}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
