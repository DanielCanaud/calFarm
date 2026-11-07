'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Search,
  FileText,
  GitCompare,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import PharmaCalculator from '@/components/tools/PharmaCalculator';
import MedicationSearch from '@/components/tools/MedicationSearch';
import PrescriptionReader from '@/components/tools/PrescriptionReader';
import MedicationComparator from '@/components/tools/MedicationComparator';

type ActiveModule = 'calculator' | 'search' | 'prescription' | 'comparator';

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('calculator');
  const [comparatorInitialMedId, setComparatorInitialMedId] = useState<string | null>(
    null
  );

  const handleSendToComparator = (medId: string) => {
    setComparatorInitialMedId(medId);
    setActiveModule('comparator');
  };

  const modules = [
    {
      id: 'calculator' as ActiveModule,
      number: '01',
      title: 'Calculadora Farmacêutica',
      subtitle: 'Diluição, concentração, molaridade, mEq, unidades e posologia',
      icon: Calculator,
    },
    {
      id: 'search' as ActiveModule,
      number: '02',
      title: 'Buscador de Bulas & Medicamentos',
      subtitle: 'Princípio ativo (DCB), genéricos, indicações, RAM e API em tempo real',
      icon: Search,
    },
    {
      id: 'prescription' as ActiveModule,
      number: '03',
      title: 'Leitor Inteligente de Prescrições',
      subtitle: 'OCR de foto/PDF, organização de posologia e conferência manual',
      icon: FileText,
    },
    {
      id: 'comparator' as ActiveModule,
      number: '04',
      title: 'Comparador de Medicamentos',
      subtitle: 'Comparação lado a lado de farmacocinética, segurança e apresentações',
      icon: GitCompare,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Barra de Navegação Superior Leve e Minimalista */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shadow-2xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-800">
                  CalcFarm
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                  <GraduationCap className="w-3 h-3" />
                  Portal Acadêmico & Clínico
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Plataforma Integrada de Apoio ao Estudante de Farmácia e Atenção Farmacêutica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden md:inline">Fontes:</span> ANVISA / RENAME / OpenFDA / NIH
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Seletor das 4 Ferramentas Principais */}
        <section aria-label="Ferramentas Principais">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-white border-teal-500 ring-2 ring-teal-500/15 shadow-xs'
                      : 'bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-teal-50 text-teal-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {mod.number}
                    </span>
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-semibold ${
                        isActive ? 'text-teal-800' : 'text-slate-800'
                      }`}
                    >
                      {mod.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {mod.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Área Dinâmica do Módulo Ativo */}
        <section className="min-h-[540px]">
          {activeModule === 'calculator' && <PharmaCalculator />}
          {activeModule === 'search' && (
            <MedicationSearch onSendToComparator={handleSendToComparator} />
          )}
          {activeModule === 'prescription' && <PrescriptionReader />}
          {activeModule === 'comparator' && (
            <MedicationComparator initialMedId={comparatorInitialMedId} />
          )}
        </section>
      </main>

      {/* Rodapé Educativo Leve */}
      <footer className="bg-white border-t border-slate-200/80 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>
              <strong>CalcFarm</strong> — Desenvolvido para auxílio acadêmico em Ciências Farmacêuticas, Farmacotécnica e Farmácia Clínica.
            </span>
          </div>
          <div className="text-slate-400">
            Referências: Bulário Eletrônico ANVISA • RENAME/MS • Farmacopeia Brasileira • OpenFDA & NIH RxNorm
          </div>
        </div>
      </footer>
    </div>
  );
}
