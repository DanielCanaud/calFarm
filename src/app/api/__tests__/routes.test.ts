import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getAnvisa } from '@/app/api/medications/anvisa/route';
import { POST as postAnalyze } from '@/app/api/prescription/analyze/route';

describe('API Routes Integration Tests', () => {
  describe('GET /api/medications/anvisa', () => {
    it('retorna lista vazia quando a query tem menos de 2 caracteres (Edge Case)', async () => {
      const req = new NextRequest('http://localhost:3000/api/medications/anvisa?q=a');
      const res = await getAnvisa(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.results).toEqual([]);
      expect(data.totalCatalogProducts).toBeGreaterThan(6000);
    });

    it('encontra medicamentos por busca fonética e respeita paginação segura mesmo com limit inválido ou negativo', async () => {
      const reqNan = new NextRequest(
        'http://localhost:3000/api/medications/anvisa?q=depaquene&limit=abc'
      );
      const resNan = await getAnvisa(reqNan);
      const dataNan = await resNan.json();
      expect(resNan.status).toBe(200);
      expect(dataNan.results.length).toBeGreaterThan(0);
      expect(dataNan.results.length).toBeLessThanOrEqual(30);

      const reqNeg = new NextRequest(
        'http://localhost:3000/api/medications/anvisa?q=dipirona&limit=-5'
      );
      const resNeg = await getAnvisa(reqNeg);
      const dataNeg = await resNeg.json();
      expect(resNeg.status).toBe(200);
      expect(dataNeg.results).toHaveLength(1);
    });
  });

  describe('POST /api/prescription/analyze', () => {
    it('processa receita via fallback local NLP quando nenhuma chave Gemini está ativa', async () => {
      const prevKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      try {
        const req = new NextRequest('http://localhost:3000/api/prescription/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawText: '1) Losartana Potássica 50 mg\nTomar 1 comprimido de 12/12 horas.',
          }),
        });
        const res = await postAnalyze(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.items).toHaveLength(1);
        expect(data.items[0].matchedMedicationId).toBe('losartana-potassica');
      } finally {
        if (prevKey !== undefined) process.env.GEMINI_API_KEY = prevKey;
      }
    });

    it('rejeita mimeType não suportado com HTTP 415 e texto gigante com HTTP 400', async () => {
      const reqMime = new NextRequest('http://localhost:3000/api/prescription/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: 'AAAA',
          mimeType: 'image/svg+xml',
        }),
      });
      const resMime = await postAnalyze(reqMime);
      expect(resMime.status).toBe(415);

      const reqHuge = new NextRequest('http://localhost:3000/api/prescription/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: 'A'.repeat(20_000),
        }),
      });
      const resHuge = await postAnalyze(reqHuge);
      expect(resHuge.status).toBe(400);
    });
  });
});
