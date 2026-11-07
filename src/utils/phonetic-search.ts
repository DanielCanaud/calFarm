/**
 * Normalização textual simples (remove acentos e converte para minúsculas)
 */
export function normalizePlain(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Normalização fonética farmacêutica para o Português Brasileiro.
 * Permite encontrar medicamentos mesmo quando o estudante ou paciente digita variações gráficas:
 * - "depaquene" === "depakene"
 * - "clonazepan" === "clonazepam"
 * - "tilenol" === "tylenol"
 * - "azitromissina" === "azitromicina"
 * - "hidroclorotiasida" === "hidroclorotiazida"
 * - "roacutam" === "roacutan"
 */
export function normalizePhonetic(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ph/g, 'f')
    .replace(/th/g, 't')
    .replace(/rh/g, 'r')
    .replace(/ch/g, 'x')
    .replace(/c([ei])/g, 's$1')
    .replace(/ç/g, 's')
    .replace(/ss/g, 's')
    .replace(/z/g, 's')
    .replace(/qu([ei])/g, 'k$1')
    .replace(/qu/g, 'ku')
    .replace(/c/g, 'k')
    .replace(/y/g, 'i')
    .replace(/w/g, 'v')
    .replace(/h/g, '')
    .replace(/m(\b|$)/g, 'n$1')
    .replace(/l(\b|$)/g, 'u$1')
    .replace(/([a-z])\1+/g, '$1')
    .trim();
}

/**
 * Verifica se um texto-alvo (haystack) corresponde à consulta (query)
 * usando busca exata sem acento OU equivalência fonética farmacêutica.
 */
export function matchesPharmaQuery(haystack: string, query: string): boolean {
  const qPlain = normalizePlain(query);
  if (!qPlain) return true;

  const hPlain = normalizePlain(haystack);
  if (hPlain.includes(qPlain)) return true;

  const qPhonetic = normalizePhonetic(query);
  const hPhonetic = normalizePhonetic(haystack);
  if (qPhonetic.length >= 2 && hPhonetic.includes(qPhonetic)) return true;

  // Suporte a múltiplos termos (ex: "depakene 500" ou "valproato xarope")
  const tokens = qPhonetic.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    return tokens.every((t) => hPhonetic.includes(t) || hPlain.includes(t));
  }

  return false;
}
