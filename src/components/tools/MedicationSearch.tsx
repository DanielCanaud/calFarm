'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Pill,
  ShieldAlert,
  Activity,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Globe,
  Clock,
  Layers,
  HeartPulse,
  ArrowRight,
  Loader2,
  Scale,
  Skull,
} from 'lucide-react';
import {
  MEDICATIONS_DB,
  PORTARIA_344_LISTS,
  TOXICOLOGY_ANTIDOTES,
} from '@/data/medications-db';
import { LiveApiEnrichment, Medication } from '@/types/pharma';

interface MedicationSearchProps {
  onSendToComparator?: (medId: string) => void;
}

export default function MedicationSearch({ onSendToComparator }: MedicationSearchProps) {
  const [subView, setSubView] = useState<'bulas' | 'deontologia' | 'toxicologia'>('bulas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Todos');
  const [selectedMed, setSelectedMed] = useState<Medication>(MEDICATIONS_DB[0]);
  const [liveData, setLiveData] = useState<LiveApiEnrichment | null>(null);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [dynamicResults, setDynamicResults] = useState<Medication[]>([]);

  const therapeuticClasses = useMemo(() => {
    const set = new Set<string>(['Todos']);
    MEDICATIONS_DB.forEach((m) => set.add(m.therapeuticClass));
    return Array.from(set);
  }, []);

  const filteredMedications = useMemo(() => {
    const q = searchQuery
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    const baseList = [...MEDICATIONS_DB, ...dynamicResults];

    return baseList.filter((m) => {
      const matchesClass =
        selectedClassFilter === 'Todos' || m.therapeuticClass === selectedClassFilter;
      if (!q) return matchesClass;

      const haystack = [
        m.name,
        m.activeIngredient,
        m.englishActiveIngredient,
        m.therapeuticClass,
        m.pharmacologicalGroup,
        m.atcCode,
        ...m.genericsAndSimilars,
        ...m.indications,
      ]
        .join(' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      return matchesClass && haystack.includes(q);
    });
  }, [searchQuery, selectedClassFilter, dynamicResults]);

  // Busca dados em tempo real na API (OpenFDA + RxNorm NIH) sempre que um medicamento é selecionado
  useEffect(() => {
    let cancelled = false;
    async function fetchLiveEnrichment() {
      if (!selectedMed) return;
      setLoadingLive(true);
      setLiveData(null);
      try {
        const res = await fetch(
          `/api/medications/live?q=${encodeURIComponent(selectedMed.activeIngredient)}&en=${encodeURIComponent(selectedMed.englishActiveIngredient)}`
        );
        if (res.ok && !cancelled) {
          const data = await res.json();
          setLiveData(data.enrichment || null);
        }
      } catch {
        // Silencioso caso offline
      } finally {
        if (!cancelled) setLoadingLive(false);
      }
    }
    fetchLiveEnrichment();
    return () => {
      cancelled = true;
    };
  }, [selectedMed]);

  // Permite consultar qualquer fármaco na API global caso não esteja na lista local
  const handleExternalApiSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoadingLive(true);
    try {
      const res = await fetch(
        `/api/medications/live?q=${encodeURIComponent(searchQuery.trim())}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.dynamicMedication) {
          setDynamicResults((prev) => {
            const exists = prev.some((p) => p.id === data.dynamicMedication.id);
            return exists ? prev : [data.dynamicMedication, ...prev];
          });
          setSelectedMed(data.dynamicMedication);
          setLiveData(data.enrichment || null);
        }
      }
    } finally {
      setLoadingLive(false);
    }
  };

  const getPrescriptionBadgeStyle = (type: string) => {
    if (type.includes('MIP')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (type.includes('Notificação B')) {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    if (type.includes('Retenção')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-rose-50/80 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200/60 mb-2">
              <Globe className="w-3.5 h-3.5" />
              Base RENAME / Bulário ANVISA + Integração OpenFDA & NIH RxNorm
            </span>
            <h2 className="text-xl font-semibold text-slate-800">
              Buscador Clínico de Medicamentos e Bulas
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Pesquise pelo nome comercial, princípio ativo (DCB), genérico, indicação ou código ATC.
            </p>
          </div>

          <a
            href="https://consultas.anvisa.gov.br/#/bulario/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors self-start"
          >
            Portal Bulário ANVISA Oficial
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Seletor de Sub-módulos Acadêmicos: Bulas | Portaria 344/98 | Toxicologia & Antídotos */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'bulas', label: 'Bulas & Monografias (ANVISA/FDA)', icon: Pill },
            { id: 'deontologia', label: 'Deontologia: Portaria 344/98 & Receituários', icon: Scale },
            { id: 'toxicologia', label: 'Toxicologia: Antídotos Específicos', icon: Skull },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubView(tab.id as 'bulas' | 'deontologia' | 'toxicologia')}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                  active
                    ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {subView === 'bulas' && (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredMedications.length === 0) {
                      handleExternalApiSearch();
                    }
                  }}
                  placeholder="Ex: Dipirona, Amoxicilina, Losartana, Rivotril, Omeprazol, Xarelto, Atenolol..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
              <button
                onClick={handleExternalApiSearch}
                disabled={!searchQuery.trim() || loadingLive}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                {loadingLive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                Consultar API Externa (FDA/NIH)
              </button>
            </div>

            {/* Filtro Rápido por Classe Terapêutica */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {therapeuticClasses.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedClassFilter === cls
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* SUB-VIEW 2: DEONTOLOGIA & LEGISLAÇÃO FARMACÊUTICA (PORTARIA 344/98 & RDC 471/2021) */}
      {subView === 'deontologia' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-600" />
              Guia Completo de Dispensação: Portaria SVS/MS 344/98 e RDC 471/2021
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabela de referência rápida para provas de Deontologia/Legislação Farmacêutica e conferência de receituários no estágio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTARIA_344_LISTS.map((rule) => {
              const badgeColor =
                rule.colorBadge === 'yellow'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : rule.colorBadge === 'blue'
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : rule.colorBadge === 'special'
                  ? 'bg-teal-100 text-teal-900 border-teal-300'
                  : 'bg-slate-100 text-slate-800 border-slate-300';

              return (
                <div
                  key={rule.listCode}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}
                      >
                        {rule.listCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1.5">
                        {rule.listTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-700 bg-white p-3 rounded-xl border border-slate-200/70">
                    <p>
                      <strong>Documento Exigido:</strong> {rule.prescriptionDocument}
                    </p>
                    <p>
                      <strong>Validade da Receita:</strong>{' '}
                      <span className="text-teal-700 font-semibold">{rule.validityDays}</span>
                    </p>
                    <p>
                      <strong>Quantidade Máxima:</strong> {rule.maxTreatmentQuantity}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong>Exemplos Clássicos:</strong>{' '}
                    <span className="text-slate-800 font-medium">
                      {rule.examples.join(' • ')}
                    </span>
                  </div>

                  <div className="text-[11px] text-teal-900 bg-teal-50/70 p-2.5 rounded-lg border border-teal-200/60">
                    <strong>Regra de Ouro:</strong> {rule.keyRules}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: TOXICOLOGIA CLÍNICA & ANTÍDOTOS ESPECÍFICOS */}
      {subView === 'toxicologia' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Skull className="w-5 h-5 text-teal-600" />
              Toxicologia Clínica: Agentes Tóxicos, Síndromes & Antídotos Específicos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consulta rápida dos antídotos e mecanismos farmacológicos mais cobrados em provas de Toxicologia, Farmacologia e Concursos/Residência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOXICOLOGY_ANTIDOTES.map((tox, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/70">
                  <span className="text-sm font-bold text-rose-800">
                    Intoxicação: {tox.toxicAgent}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 self-start">
                    Antídoto: {tox.antidote}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-700">
                  <p>
                    <strong>Mecanismo da Toxicidade:</strong> {tox.toxicityMechanism}
                  </p>
                  <p className="text-teal-800">
                    <strong>Mecanismo do Antídoto:</strong> {tox.antidoteMechanism}
                  </p>
                  <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/70">
                    <strong>Quadro Clínico Clássico:</strong> {tox.clinicalSign}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layout Principal: Lista Lateral + Monografia Completa */}
      {subView === 'bulas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Lista de Medicamentos */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((med) => {
              const isSelected = selectedMed?.id === med.id;
              return (
                <button
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {med.name}
                      </h3>
                      <p className="text-xs text-teal-700 font-medium mt-0.5">
                        {med.activeIngredient}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      {med.atcCode}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {med.therapeuticClass}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border ${getPrescriptionBadgeStyle(
                        med.prescriptionType
                      )}`}
                    >
                      {med.prescriptionType.split('(')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3">
              <Pill className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-medium text-slate-700">
                Não encontrado na base local RENAME
              </div>
              <p className="text-xs text-slate-500">
                Clique abaixo para buscar <strong>&ldquo;{searchQuery}&rdquo;</strong> diretamente na API internacional OpenFDA / NIH RxNorm em tempo real.
              </p>
              <button
                onClick={handleExternalApiSearch}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                Buscar &ldquo;{searchQuery}&rdquo; na API Oficial
              </button>
            </div>
          )}
        </div>

        {/* Coluna Direita: Bula Estruturada & Monografia Farmacológica */}
        {selectedMed && (
          <div className="lg:col-span-8 space-y-5">
            {/* Cabeçalho da Monografia */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getPrescriptionBadgeStyle(
                        selectedMed.prescriptionType
                      )}`}
                    >
                      {selectedMed.prescriptionType}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      Risco Gestacional: Categoria {selectedMed.pregnancyCategory}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      ATC: {selectedMed.atcCode}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedMed.name}
                  </h2>
                  <p className="text-sm text-teal-700 font-medium mt-0.5">
                    Princípio Ativo (DCB): {selectedMed.activeIngredient}
                  </p>
                </div>

                {onSendToComparator && (
                  <button
                    onClick={() => onSendToComparator(selectedMed.id)}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/80 text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    Comparar Medicamento
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Resumo de Classe, Apresentações e Genéricos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    Classificação Farmacológica
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Classe:</strong> {selectedMed.therapeuticClass}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Grupo Químico/Ação:</strong> {selectedMed.pharmacologicalGroup}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Vias de Administração:</strong> {selectedMed.routeOfAdministration.join(', ')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    Genéricos, Similares e Apresentações
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Nomes Comerciais / Genéricos:</strong>{' '}
                    {selectedMed.genericsAndSimilars.join(' • ')}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Apresentações:</strong> {selectedMed.presentations.join(' | ')}
                  </p>
                </div>
              </div>

              {/* Mecanismo de Ação */}
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/60 space-y-1.5">
                <div className="text-xs font-semibold text-teal-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  Mecanismo de Ação Farmacodinâmico (Foco Acadêmico)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedMed.mechanismOfAction}
                </p>
              </div>

              {/* Indicações e Posologia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Indicações Terapêuticas
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedMed.indications.map((ind, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Guia Posológico e Ajuste Renal
                  </h4>
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 space-y-2 text-xs text-slate-700">
                    <p>
                      <strong>Adultos:</strong> {selectedMed.dosageGuide.adult}
                    </p>
                    <p>
                      <strong>Pediatria:</strong> {selectedMed.dosageGuide.pediatric}
                    </p>
                    <p>
                      <strong>Dose Máxima Diária:</strong>{' '}
                      <span className="font-semibold text-teal-800">
                        {selectedMed.dosageGuide.maxDailyDose}
                      </span>
                    </p>
                    <p>
                      <strong>Ajuste Renal:</strong> {selectedMed.dosageGuide.renalAdjustment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contraindicações e Reações Adversas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/60 space-y-2">
                  <h4 className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Contraindicações Absolutas e Relativas
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                    {selectedMed.contraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                  <h4 className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Reações Adversas (RAM)
                  </h4>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <p>
                      <strong>Comuns:</strong> {selectedMed.adverseEffects.common.join('; ')}
                    </p>
                    <p>
                      <strong className="text-rose-700">Graves (Monitorar):</strong>{' '}
                      {selectedMed.adverseEffects.serious.join('; ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parâmetros Farmacocinéticos (ADME) */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Perfil Farmacocinético (ADME)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: 'Biodisponibilidade (F)', val: selectedMed.pharmacokinetics.bioavailability },
                    { label: 'Meia-Vida (t½)', val: selectedMed.pharmacokinetics.halfLife },
                    { label: 'Metabolismo', val: selectedMed.pharmacokinetics.metabolism },
                    { label: 'Excreção', val: selectedMed.pharmacokinetics.excretion },
                    { label: 'Início de Ação', val: selectedMed.pharmacokinetics.onsetOfAction },
                  ].map((pk) => (
                    <div
                      key={pk.label}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70"
                    >
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">
                        {pk.label}
                      </div>
                      <div className="text-xs font-medium text-slate-800 mt-1">
                        {pk.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interações Medicamentosas Clínicas */}
              {selectedMed.interactions.length > 0 && (
                <div className="pt-2 space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-teal-600" />
                    Interações Medicamentosas Relevantes
                  </h4>
                  <div className="space-y-2">
                    {selectedMed.interactions.map((inter, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {inter.interactingSubstance}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                inter.severity === 'Grave'
                                  ? 'bg-rose-100 text-rose-800'
                                  : inter.severity === 'Moderada'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              Severidade {inter.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{inter.effect}</p>
                          <p className="text-xs text-teal-700 font-medium">
                            Conduta Farmacêutica: {inter.conduct}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pérola Clínica / Dica para Estudantes e Dispensação */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/70 space-y-1">
                <div className="text-xs font-semibold text-sky-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Orientação de Dispensação & Atenção Farmacêutica (Dica de Prova e Balcão)
                </div>
                <p className="text-xs text-sky-950/90 leading-relaxed">
                  {selectedMed.clinicalPearls}
                </p>
              </div>

              {/* Painel de Enriquecimento em Tempo Real via API (OpenFDA + NIH RxNorm) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-600" />
                    Farmacovigilância em Tempo Real (OpenFDA FAERS & NIH RxNorm API)
                  </div>
                  {loadingLive ? (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Consultando APIs oficiais...
                    </span>
                  ) : liveData?.openFdaFound ? (
                    <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conectado em Tempo Real
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Base Local Verificada</span>
                  )}
                </div>

                {liveData && (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex flex-wrap gap-2">
                      {liveData.rxNormRxcui && (
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-[11px]">
                          NIH RxNorm ID (RxCUI): {liveData.rxNormRxcui}
                        </span>
                      )}
                      {liveData.fdaPharmacologicClass?.slice(0, 2).map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px]"
                        >
                          FDA EPC: {c}
                        </span>
                      ))}
                    </div>

                    {liveData.fdaAdverseReactionsCount &&
                      liveData.fdaAdverseReactionsCount.length > 0 && (
                        <div>
                          <div className="text-[11px] text-slate-500 mb-1.5">
                            Eventos Adversos Mais Notificados no Sistema Mundial FAERS (OpenFDA):
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {liveData.fdaAdverseReactionsCount.map((item, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between"
                              >
                                <span className="text-[11px] font-medium text-slate-700 truncate pr-2">
                                  {item.term}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 shrink-0">
                                  {item.count.toLocaleString('pt-BR')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
