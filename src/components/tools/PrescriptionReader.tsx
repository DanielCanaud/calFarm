'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  KeyRound,
  Loader2,
  FileCheck,
  ShieldAlert,
  Eye,
  ClipboardCheck,
  Printer,
  Calendar,
  AlertOctagon,
  Layers,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { PrescriptionItem } from '@/types/pharma';
import { parsePrescriptionText } from '@/utils/prescription-parser';
import {
  enrichItemWithClinicalSafety,
  detectDuplications,
  detectExpandedInteractions,
  validatePrescriptionRegulations,
} from '@/utils/clinical-safety';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const SAMPLE_PRESCRIPTIONS = [
  {
    title: 'Receita 1: Infecção Respiratória Aguda (RDC 20/2011)',
    text: `DR. CARLOS EDUARDO SILVA - CRM 45892
PACIENTE: Mariana Costa Oliveira
USO INTERNO / VIA ORAL:

1) Amoxicilina 500 mg ----------------- 21 cápsulas
Tomar 1 cápsula de 8/8 horas por 7 dias.

2) Prednisona 20 mg ------------------- 5 comprimidos
Tomar 1 comprimido pela manhã após o café por 5 dias.

3) Dipirona Monoidratada 500 mg ------- 10 comprimidos
Tomar 1 comprimido de 6/6 horas se dor ou febre.`,
  },
  {
    title: 'Receita 2: Paciente Polimedicado (HAS + DM2 + Dislipidemia)',
    text: `DRA. HELENA MENDES - CARDIOLOGIA CRM 88210
PACIENTE: José Roberto Santos (67 anos)
USO CONTÍNUO - VIA ORAL:

1) Losartana Potássica 50 mg ---------- Uso contínuo
Tomar 1 comprimido de 12/12 horas.

2) Hidroclorotiazida 25 mg ------------ Uso contínuo
Tomar 1 comprimido pela manhã.

3) Cloridrato de Metformina 850 mg ---- Uso contínuo
Tomar 1 comprimido após o almoço e 1 comprimido após o jantar.

4) Sinvastatina 20 mg ----------------- Uso contínuo
Tomar 1 comprimido à noite ao deitar.

5) Ibuprofeno 600 mg ------------------ 10 comprimidos
Tomar 1 comprimido de 8/8 horas por 5 dias para dor lombar.`,
  },
  {
    title: 'Receita 3: Saúde Mental / Controle Especial (Portaria 344/98)',
    text: `RECEITUÁRIO DE CONTROLE ESPECIAL
PACIENTE: Lucas Almeida
USO ORAL:

1) Cloridrato de Sertralina 50 mg ----- 60 comprimidos
Tomar 1 comprimido 1x ao dia pela manhã por 60 dias.

2) Clonazepam 2,5 mg/mL (gotas) ------- 1 frasco
Tomar 10 gotas via oral à noite ao deitar por 30 dias.

3) Omeprazol 20 mg -------------------- 30 cápsulas
Tomar 1 cápsula em jejum 30 minutos antes do café da manhã.`,
  },
];

export default function PrescriptionReader() {
  const [rawText, setRawText] = useState<string>(SAMPLE_PRESCRIPTIONS[0].text);
  const [items, setItems] = useState<PrescriptionItem[]>(() =>
    parsePrescriptionText(SAMPLE_PRESCRIPTIONS[0].text)
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [engineUsed, setEngineUsed] = useState<string>(
    'Parser Farmacêutico NLP + Dicionário ANVISA/RENAME'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [showApiConfig, setShowApiConfig] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prescriptionIssueDate, setPrescriptionIssueDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [safetyConfirmed, setSafetyConfirmed] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Processa upload de Imagem (PNG, JPG, WEBP) ou PDF/TXT
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setEngineUsed('Arquivo excede 5 MB — envie uma imagem ou PDF menor.');
      e.target.value = '';
      return;
    }

    setUploadedFileName(file.name);
    setIsProcessing(true);
    setOcrProgress(10);

    try {
      // Se for imagem, gera preview e roda OCR (Tesseract.js) ou IA Multimodal Gemini
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        if (geminiApiKey.trim()) {
          setOcrProgress(45);
          const base64 = await fileToBase64(file);
          const res = await fetch('/api/prescription/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType: file.type,
              apiKey: geminiApiKey.trim(),
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.items) && data.items.length > 0) {
              setItems(data.items);
              setEngineUsed(data.engine || 'Gemini 2.5 Flash Vision');
              setOcrProgress(100);
              setIsProcessing(false);
              return;
            }
          }
        }

        // Executa OCR real no navegador via Tesseract.js (Português)
        const Tesseract = await import('tesseract.js');
        const result = await Tesseract.recognize(file, 'por', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
        });

        const extractedText = result.data.text || '';
        setRawText(extractedText);
        const parsed = parsePrescriptionText(extractedText);
        setItems(parsed);
        setEngineUsed('OCR Tesseract.js (PT-BR) + Parser Farmacêutico NLP');
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setPreviewUrl(null);
        // Extração de texto de PDF ou envio à API Gemini se chave configurada
        if (geminiApiKey.trim()) {
          const base64Pdf = await fileToBase64(file);
          const res = await fetch('/api/prescription/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Pdf,
              mimeType: 'application/pdf',
              apiKey: geminiApiKey.trim(),
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.items)) {
              setItems(data.items);
              setEngineUsed(data.engine || 'Gemini PDF Reader');
              setIsProcessing(false);
              return;
            }
          }
        }

        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Extrator leve de strings legíveis de PDF digitais
        const decoder = new TextDecoder('latin1');
        const rawPdfStr = decoder.decode(bytes);
        const textMatches = rawPdfStr.match(/\(([^()]{3,120})\)/g) || [];
        const cleanedPdfText = textMatches
          .map((m) => m.slice(1, -1))
          .filter((t) => /[a-zA-Z]{3,}/.test(t) && !/^(Type|Font|Page|Parent|Resources)/.test(t))
          .join('\n');

        const textToUse =
          cleanedPdfText.length > 20
            ? cleanedPdfText
            : `Prescrição PDF carregada (${file.name}). Confira ou cole o texto abaixo se o PDF for escaneado sem camada de texto.`;
        setRawText(textToUse);
        setItems(parsePrescriptionText(textToUse));
        setEngineUsed('Extrator PDF Digital + Parser Farmacêutico');
      } else {
        // Arquivo de texto
        const textContent = await file.text();
        setRawText(textContent);
        setItems(parsePrescriptionText(textContent));
      }
    } catch {
      setEngineUsed('Falha na leitura automática — utilize ou edite o texto manualmente abaixo');
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
      e.target.value = '';
    }
  };

  const handleAnalyzeRawText = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/prescription/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          apiKey: geminiApiKey.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setEngineUsed(data.engine);
      } else {
        setItems(parsePrescriptionText(rawText));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateItem = (id: string, field: keyof PrescriptionItem, value: string | boolean) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        return enrichItemWithClinicalSafety(updated);
      })
    );
  };

  const handleAddEmptyItem = () => {
    const rawNewItem: PrescriptionItem = {
      id: `manual-${Date.now()}`,
      rawLine: 'Adicionado manualmente',
      medicationName: 'Novo Medicamento',
      activeIngredient: 'Princípio Ativo (DCB)',
      concentration: '500 mg',
      pharmaceuticalForm: 'Comprimido',
      dosage: 'Tomar 1 comprimido',
      frequency: '8/8 horas',
      duration: '7 dias',
      route: 'Via Oral (VO)',
      confidence: 'Revisão Manual',
      verified: false,
      notes: '',
      alerts: [],
    };
    const newItem = enrichItemWithClinicalSafety(rawNewItem);
    setItems((prev) => [...prev, newItem]);
    setEditingId(newItem.id);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 1. Validação Regulatória de Deontologia Farmacêutica (RDC 20/2011, Portaria 344/98 e Vencimento)
  const regulatoryCheck = useMemo(() => {
    return validatePrescriptionRegulations(items, prescriptionIssueDate);
  }, [items, prescriptionIssueDate]);

  // 2. Detecção Automática de Duplicidade Terapêutica (Mesma substância ou mesma classe AINE/IBP/etc.)
  const duplicationAlerts = useMemo(() => {
    return detectDuplications(items);
  }, [items]);

  // 3. Matriz Expandida de Interações Farmacológicas por Classe e Pares
  const prescriptionInteractions = useMemo(() => {
    return detectExpandedInteractions(items);
  }, [items]);

  const verifiedCount = items.filter((i) => i.verified).length;
  const allVerified = items.length > 0 && verifiedCount === items.length;
  const canPrintReport = allVerified && safetyConfirmed;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200/60 mb-2">
              <FileText className="w-3.5 h-3.5" />
              OCR Tesseract.js + Parser Farmacêutico + IA Vision Opcional
            </span>
            <h2 className="text-xl font-semibold text-slate-800">
              Leitor Inteligente de Prescrições Médicas
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Envie uma foto ou PDF da receita médica para extrair medicamentos, concentrações e posologias com conferência manual assistida.
            </p>
          </div>

          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 cursor-pointer self-start"
          >
            <KeyRound className="w-3.5 h-3.5 text-teal-600" />
            {geminiApiKey ? 'IA Vision Ativa' : 'Configurar Chave IA (Opcional)'}
          </button>
        </div>

        {showApiConfig && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700">
                Chave de API Google Gemini (Opcional — para leitura de caligrafia médica complexa via IA Multimodal)
              </label>
              <p className="text-[11px] text-slate-500">
                Sem a chave, o sistema utiliza gratuitamente o motor OCR local (Tesseract.js) + Parser Farmacêutico NLP.
              </p>
            </div>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Cole sua GEMINI_API_KEY aqui..."
              className="w-full sm:w-72 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>
        )}
      </div>

      {/* Área de Upload + Editor de Texto da Prescrição */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Upload de Foto/PDF e Texto Extraído */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              1. Enviar Foto / PDF ou Selecionar Caso Clínico
            </h3>
          </div>

          {/* Dropzone de Arquivo */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/20 rounded-2xl p-5 text-center cursor-pointer transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-7 h-7 text-teal-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">
              Clique para enviar uma Foto (JPG, PNG) ou PDF da Receita
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {uploadedFileName
                ? `Arquivo carregado: ${uploadedFileName}`
                : 'Processamento seguro com OCR em português e validação farmacêutica'}
            </div>
          </div>

          {isProcessing && (
            <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-200 text-xs text-teal-900 flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 shrink-0" />
              <div className="flex-1">
                <div className="font-medium">
                  Processando prescrição médica {ocrProgress > 0 ? `(${ocrProgress}%)` : '...'}
                </div>
                <div className="text-[11px] text-teal-700">
                  Identificando fármacos, concentrações, formas farmacêuticas e posologias.
                </div>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
              <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3" /> Imagem da Prescrição Enviada:
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview da prescrição"
                className="max-h-44 mx-auto object-contain rounded-lg"
              />
            </div>
          )}

          {/* Presets de Casos Clínicos Reais para Treino de Estudantes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600">
              Ou carregue uma Prescrição Modelo para Estudo de Dispensação:
            </label>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_PRESCRIPTIONS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRawText(sample.text);
                    setItems(parsePrescriptionText(sample.text));
                    setPreviewUrl(null);
                    setUploadedFileName(null);
                  }}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-teal-50/80 text-xs text-slate-700 hover:text-teal-800 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Caixa de Texto Transcrito (Editável) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">
                Texto Transcrito da Prescrição (Editável):
              </label>
              <button
                onClick={handleAnalyzeRawText}
                className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Reprocessar Texto
              </button>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 bg-slate-50/40 focus:outline-none focus:border-teal-500"
              placeholder="Cole ou edite o texto da receita médica aqui..."
            />
          </div>
        </div>

        {/* Coluna Direita: Itens Organizados + Conferência Manual e Alertas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-teal-600" />
                  2. Medicamentos Identificados & Conferência Manual
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Motor ativo: <span className="font-medium text-slate-700">{engineUsed}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-medium border border-teal-200/60">
                  {verifiedCount}/{items.length} Conferidos
                </span>
                <button
                  onClick={handleAddEmptyItem}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Item
                </button>
                <button
                  onClick={() => {
                    if (!canPrintReport) {
                      alert(
                        'Para a segurança clínica dos estudantes, todos os itens da receita médica devem ser conferidos individualmente e a trava pedagógica deve ser assinalada antes da impressão.'
                      );
                      return;
                    }
                    window.print();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    canPrintReport
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                  title={
                    canPrintReport
                      ? 'Imprimir Guia de Orientação Farmacêutica'
                      : 'Conferência completa e confirmação necessárias para liberar impressão'
                  }
                >
                  {canPrintReport ? (
                    <Printer className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  {canPrintReport ? 'Imprimir Orientação' : 'Conferência Pendente'}
                </button>
              </div>
            </div>

            {/* 1. Bar de Deontologia & Validação Regulatória Sanitária (RDC 20 e Portaria 344) */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                regulatoryCheck.isExpired
                  ? 'bg-rose-50/90 border-rose-300 text-rose-900'
                  : 'bg-slate-50/80 border-slate-200/90 text-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold">Data de Emissão Médica:</span>
                  <input
                    type="date"
                    value={prescriptionIssueDate}
                    onChange={(e) => setPrescriptionIssueDate(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      regulatoryCheck.isExpired
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}
                  >
                    {regulatoryCheck.regulationNotice}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-700">
                  Exigência de Receituário:{' '}
                  <span className="text-teal-700 font-bold">
                    {regulatoryCheck.prescriptionRequirement}
                  </span>
                </div>
                {regulatoryCheck.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className={`text-[11px] flex items-center gap-1.5 ${
                      regulatoryCheck.isExpired
                        ? 'text-rose-800 font-bold'
                        : 'text-slate-600'
                    }`}
                  >
                    {regulatoryCheck.isExpired ? (
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    )}
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            {/* Trava Human-in-the-Loop Obrigatória para Proteção do Estudante */}
            <label
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                safetyConfirmed
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}
            >
              <input
                type="checkbox"
                checked={safetyConfirmed}
                onChange={(e) => setSafetyConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 h-4 w-4 shrink-0"
              />
              <span>
                <strong>Trava Pedagógica de Segurança (Human-in-the-Loop):</strong> Declaro que comparei visualmente cada medicamento, dose calculada, intervalo e via contra o documento original da prescrição médica antes da validação final.
              </span>
            </label>

            {/* 2. Alerta Automático de Duplicidade Terapêutica */}
            {duplicationAlerts.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                  Atenção Farmacêutica: Duplicidade Terapêutica Detectada na Receita!
                </div>
                {duplicationAlerts.map((dup, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-900"
                  >
                    {dup.message}
                  </div>
                ))}
              </div>
            )}

            {/* 3. Alerta Automático de Interações na Receita! */}
            {prescriptionInteractions.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  Alerta Farmacêutico: Interação Medicamentosa Detectada na Prescrição!
                </div>
                {prescriptionInteractions.map((inter, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 p-3 rounded-lg border border-rose-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{inter.pair}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-semibold">
                        Severidade {inter.severity}
                      </span>
                    </div>
                    <p className="text-slate-700">{inter.effect}</p>
                    <p className="text-teal-800 font-medium">
                      Conduta recomendada: {inter.conduct}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Lista de Cartões de Medicamentos da Prescrição */}
            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const isEditing = editingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.verified
                          ? 'bg-emerald-50/30 border-emerald-300'
                          : 'bg-slate-50/60 border-slate-200/90'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-800">
                                {item.medicationName}
                              </h4>
                              {item.therapeuticClass && (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                  {item.therapeuticClass}
                                </span>
                              )}
                              {item.dailyCalculatedDose && (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold border border-teal-200">
                                  Dose: {item.dailyCalculatedDose}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-teal-700 font-medium">
                              {item.activeIngredient}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleUpdateItem(item.id, 'verified', !item.verified)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer border transition-colors ${
                              item.verified
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.verified ? 'Conferido' : 'Marcar Conferido'}
                          </button>

                          <button
                            onClick={() =>
                              setEditingId(isEditing ? null : item.id)
                            }
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-teal-700 cursor-pointer"
                            title="Editar manualmente"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Remover item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Modo de Edição Manual vs Modo de Visualização Estruturada */}
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 mb-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                              Medicamento
                            </label>
                            <input
                              type="text"
                              value={item.medicationName}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'medicationName', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                              Concentração
                            </label>
                            <input
                              type="text"
                              value={item.concentration}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'concentration', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                              Forma Farmacêutica
                            </label>
                            <input
                              type="text"
                              value={item.pharmaceuticalForm}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'pharmaceuticalForm', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                              Dose / Tomada
                            </label>
                            <input
                              type="text"
                              value={item.dosage}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'dosage', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                              Frequência / Aprazamento
                            </label>
                            <input
                              type="text"
                              value={item.frequency}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'frequency', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs mt-0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                              Duração do Tratamento
                            </label>
                            <input
                              type="text"
                              value={item.duration}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'duration', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs mt-0.5"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 block">Concentração</span>
                            <span className="font-semibold text-slate-800">{item.concentration}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 block">Apresentação</span>
                            <span className="font-semibold text-slate-800">{item.pharmaceuticalForm}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 block">Posologia</span>
                            <span className="font-semibold text-slate-800">{item.dosage}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 block">Intervalo</span>
                            <span className="font-semibold text-teal-700">{item.frequency}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 block">Duração</span>
                            <span className="font-semibold text-slate-800">{item.duration}</span>
                          </div>
                        </div>
                      )}

                      {/* Alerta de Superdosagem Crítica */}
                      {item.maxDailyDoseAlert && (
                        <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-start gap-2">
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div className="font-semibold leading-relaxed">
                            {item.maxDailyDoseAlert}
                          </div>
                        </div>
                      )}

                      {/* Alertas Regulatórios e Dica Clínica do Item */}
                      {item.alerts && item.alerts.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.alerts.map((al, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              {al}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.notes && (
                        <div className="mt-2 text-[11px] text-slate-600 bg-white/80 px-3 py-2 rounded-lg border border-slate-200/60">
                          <strong className="text-teal-800">Orientação de Balcão:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-xs text-slate-500">
                  Nenhum item extraído ainda. Carregue uma foto/PDF ou clique em &ldquo;Adicionar Item&rdquo;.
                </div>
              )}
            </div>

            {items.length > 0 && verifiedCount === items.length && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Conferência Farmacêutica Concluída!</strong> Todos os {items.length} itens da prescrição foram revisados e validados.
                    {!safetyConfirmed && (
                      <span className="block sm:inline text-amber-800 font-medium sm:ml-1">
                        (Assinale a Trava Pedagógica acima para desbloquear a impressão).
                      </span>
                    )}
                  </span>
                </div>
                {canPrintReport && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] shrink-0 self-start sm:self-auto">
                    Aprovado para Dispensação
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
