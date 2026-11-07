import { describe, it, expect } from 'vitest';
import {
  normalizePlain,
  normalizePhonetic,
  matchesPharmaQuery,
} from '@/utils/phonetic-search';
import { dcbToEnglishInn, sanitizePharmaSearchTerm } from '@/utils/dcb-translator';

describe('phonetic-search & dcb-translator utilities', () => {
  describe('normalizePlain', () => {
    it('remove acentos, espaços extras e converte para minúsculas', () => {
      expect(normalizePlain('  Ácido Valpróico Sódico  ')).toBe('acido valproico sodico');
    });
  });

  describe('normalizePhonetic', () => {
    it('iguala variações gráficas comuns de medicamentos brasileiros', () => {
      expect(normalizePhonetic('depaquene')).toBe(normalizePhonetic('Depakene'));
      expect(normalizePhonetic('clonazepan')).toBe(normalizePhonetic('Clonazepam'));
      expect(normalizePhonetic('tilenol')).toBe(normalizePhonetic('Tylenol'));
      expect(normalizePhonetic('azitromissina')).toBe(normalizePhonetic('Azitromicina'));
      expect(normalizePhonetic('hidroclorotiasida')).toBe(normalizePhonetic('Hidroclorotiazida'));
      expect(normalizePhonetic('roacutam')).toBe(normalizePhonetic('Roacutan'));
    });
  });

  describe('matchesPharmaQuery', () => {
    const haystack =
      'Depakene Ácido Valproico (Valproato de Sódio) 500 mg Xarope Antiepiléptico';

    it('retorna true para query vazia ou apenas espaços (Edge Case)', () => {
      expect(matchesPharmaQuery(haystack, '')).toBe(true);
      expect(matchesPharmaQuery(haystack, '   ')).toBe(true);
    });

    it('encontra por correspondência fonética e múltiplos termos fora de ordem (Happy Path)', () => {
      expect(matchesPharmaQuery(haystack, 'depaquene')).toBe(true);
      expect(matchesPharmaQuery(haystack, 'depaquene 500')).toBe(true);
      expect(matchesPharmaQuery(haystack, 'valproato xarope')).toBe(true);
    });

    it('retorna false quando um dos tokens da busca não existe no alvo (Error Path)', () => {
      expect(matchesPharmaQuery(haystack, 'depakene 999mg')).toBe(false);
      expect(matchesPharmaQuery(haystack, 'amoxicilina')).toBe(false);
    });
  });

  describe('dcbToEnglishInn & sanitizePharmaSearchTerm', () => {
    it('traduz sais e princípios ativos corretamente (incluindo correção de nortriptilina)', () => {
      expect(dcbToEnglishInn('Cloridrato de Nortriptilina')).toBe('nortriptyline');
      expect(dcbToEnglishInn('Cloridrato de Sertralina')).toBe('sertraline');
      expect(dcbToEnglishInn('Dipirona Monoidratada')).toBe('metamizole');
      expect(dcbToEnglishInn('Losartana Potássica')).toBe('losartan');
    });

    it('remove aspas e operadores de injeção Lucene', () => {
      const malicious = 'amoxicillin"+OR+_exists_:openfda.brand_name+OR+"a';
      const sanitized = sanitizePharmaSearchTerm(malicious);
      expect(sanitized).not.toContain('"');
      expect(sanitized).not.toContain(':');
      expect(sanitized).not.toContain('+');
    });
  });
});
