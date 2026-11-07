import { NextRequest, NextResponse } from 'next/server';
import { parsePrescriptionText } from '@/utils/prescription-parser';
import { PrescriptionItem } from '@/types/pharma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawText, imageBase64, mimeType, apiKey } = body;

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // Se houver chave de API Gemini configurada e imagem/PDF ou texto, usa a IA Multimodal Gemini para extração estruturada
    if (effectiveApiKey && (imageBase64 || rawText)) {
      const prompt = `Você é um Farmacêutico Clínico Sênior no Brasil. Analise esta prescrição médica e extraia TODOS os medicamentos prescritos em formato JSON estrito (um array de objetos).
Para cada medicamento retorne exatamente estas chaves:
- medicationName (string)
- activeIngredient (string - DCB em português)
- concentration (string - ex: "500 mg", "20 mg/mL")
- pharmaceuticalForm (string - ex: "Comprimido", "Cápsula", "Suspensão Oral", "Gotas")
- dosage (string - ex: "Tomar 1 comprimido", "25 gotas")
- frequency (string - ex: "De 8 em 8 horas", "1x ao dia em jejum")
- duration (string - ex: "Por 7 dias", "Uso contínuo")
- route (string - ex: "Via Oral", "Sublingual", "Intramuscular")
- notes (string - orientação farmacêutica importante de dispensação)
- alerts (array de strings - alertas como retenção de receita RDC 20/2011, Portaria 344/98 ou interações)

Retorne APENAS o JSON puro (array), sem markdown.`;

      const parts: Array<Record<string, unknown>> = [{ text: prompt }];
      if (rawText) {
        parts.push({ text: `Texto extraído da prescrição:\n${rawText}` });
      }
      if (imageBase64 && mimeType) {
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
          },
        });
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(effectiveApiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const textOut = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const parsedJson = JSON.parse(textOut);
        if (Array.isArray(parsedJson)) {
          const items: PrescriptionItem[] = parsedJson.map((item, idx) => ({
            id: `ai-rx-${Date.now()}-${idx}`,
            rawLine: item.medicationName || 'Extraído via IA Multimodal',
            medicationName: item.medicationName || 'Medicamento identificado',
            activeIngredient: item.activeIngredient || 'Princípio ativo identificado',
            concentration: item.concentration || 'A conferir',
            pharmaceuticalForm: item.pharmaceuticalForm || 'Comprimido',
            dosage: item.dosage || 'Conforme prescrição',
            frequency: item.frequency || 'A conferir',
            duration: item.duration || 'Conforme prescrição',
            route: item.route || 'Via Oral',
            confidence: 'Alta',
            verified: false,
            notes: item.notes || '',
            alerts: Array.isArray(item.alerts) ? item.alerts : [],
          }));

          return NextResponse.json({
            engine: 'Gemini 2.5 Flash Multimodal AI',
            items,
          });
        }
      }
    }

    // Fallback determinístico local usando o Parser Farmacêutico NLP
    const items = parsePrescriptionText(rawText || '');
    return NextResponse.json({
      engine: 'Parser Farmacêutico NLP + Dicionário ANVISA/RENAME',
      items,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Falha ao processar prescrição', details: String(err) },
      { status: 500 }
    );
  }
}
