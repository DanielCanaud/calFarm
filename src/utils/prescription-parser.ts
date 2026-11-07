import { MEDICATIONS_DB } from '@/data/medications-db';
import { PrescriptionItem } from '@/types/pharma';

function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function parsePrescriptionText(rawText: string): PrescriptionItem[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const items: PrescriptionItem[] = [];
  let currentItem: PrescriptionItem | null = null;

  // Padrões regex farmacêuticos brasileiros
  const concentrationRegex =
    /\b(\d+(?:[.,]\d+)?\s*(?:mg\/ml|mg\/5\s*ml|mcg\/ml|ui\/ml|mg|mcg|g|ml|%|ui))\b/i;
  const formRegex =
    /\b(comprimidos?|comp\.?|capsulas?|caps\.?|gotas?|gts|solucao\s+oral|suspensao\s+oral|susp\.?|xarope|ampolas?|injetavel|pomada|creme|colirio|sach[eê]s?|sublingual)\b/i;
  const frequencyRegex =
    /\b(de\s*\d+\s*\/\s*\d+\s*h(?:oras)?|\d+\s*\/\s*\d+\s*h(?:oras)?|a\s*cada\s*\d+\s*horas?|\d+\s*(?:vez|vezes|x)\s*ao\s*dia|1\s*x\s*\/?\s*dia|2\s*x\s*\/?\s*dia|3\s*x\s*\/?\s*dia|em\s*jejum|pela\s*manha|a\s*noite|ao\s*deitar|apos\s*o?\s*(?:almoco|jantar|cafe)|se\s*(?:dor|febre|necessario))\b/i;
  const durationRegex =
    /\b(por\s*\d+\s*(?:dias?|semanas?|meses)|durante\s*\d+\s*(?:dias?|semanas?)|uso\s*continuo)\b/i;
  const routeRegex =
    /\b(uso\s*oral|via\s*oral|\bvo\b|uso\s*interno|uso\s*externo|sublingual|\bsl\b|intramuscular|\bim\b|endovenos[oa]|\bev\b|\biv\b|uso\s*topico|uso\s*nasal|uso\s*oftalmico)\b/i;
  const dosageRegex =
    /\b((?:tomar|aplicar|dar|administrar|ingerir)\s+\d+(?:[.,]\d+)?\s*(?:comprimidos?|comp\.?|capsulas?|gotas?|ml|colher(?:es)?)|^\d+\s*(?:comprimidos?|capsulas?|gotas?|ml))\b/i;

  // Ignorar cabeçalhos médicos comuns
  const ignoreLineRegex =
    /^(dr\.?|dra\.?|crm|paciente\s*:|data\s*:|receituario|prescricao\s*medica|assinatura|carimbo|cpf\s*:|endereco\s*:|uso\s*interno\s*$|uso\s*oral\s*$)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ignoreLineRegex.test(line) && !concentrationRegex.test(line)) {
      continue;
    }

    const normLine = normalizeStr(line);

    // Verifica se a linha casa com algum medicamento do banco de dados
    const matchedMed = MEDICATIONS_DB.find((med) => {
      const medNameFirst = normalizeStr(med.name.split('(')[0]);
      const activeFirst = normalizeStr(med.activeIngredient.split('(')[0]).split(' ')[0];
      const genericsMatch = med.genericsAndSimilars.some((g) => {
        const gClean = normalizeStr(g.split('(')[0]);
        return gClean.length >= 4 && normLine.includes(gClean);
      });
      return (
        (medNameFirst.length >= 4 && normLine.includes(medNameFirst)) ||
        (activeFirst.length >= 4 && normLine.includes(activeFirst)) ||
        genericsMatch
      );
    });

    // Verifica se parece ser o início de um item de medicamento (ex: "1) Dipirona 500mg", "Amoxicilina 500 mg ---- 21 cáps")
    const startsWithNumberOrBullet = /^(\d+[\.\)\-\s]+|[-•*]\s+)/.test(line);
    const hasConcentration = concentrationRegex.test(line);
    const isPosologyContinuation =
      /^(tomar|aplicar|dar|ingerir|diluir|posologia\s*:|obs\s*:)/i.test(line) && !startsWithNumberOrBullet;

    if (isPosologyContinuation && currentItem) {
      // É a linha de posologia abaixo do nome do medicamento!
      currentItem.rawLine += ` | ${line}`;
      const freqMatch = line.match(frequencyRegex);
      const durMatch = line.match(durationRegex);
      const doseMatch = line.match(dosageRegex);
      const routeMatch = line.match(routeRegex);

      if (doseMatch) currentItem.dosage = doseMatch[0];
      else if (!currentItem.dosage || currentItem.dosage === 'A conferir') {
        currentItem.dosage = line;
      }
      if (freqMatch) currentItem.frequency = freqMatch[0];
      if (durMatch) currentItem.duration = durMatch[0];
      if (routeMatch) currentItem.route = routeMatch[0];
      continue;
    }

    if (matchedMed || startsWithNumberOrBullet || hasConcentration) {
      const concMatch = line.match(concentrationRegex);
      const formMatch = line.match(formRegex);
      const freqMatch = line.match(frequencyRegex);
      const durMatch = line.match(durationRegex);
      const routeMatch = line.match(routeRegex);
      const doseMatch = line.match(dosageRegex);

      // Extrair nome limpo do medicamento
      let extractedName = line
        .replace(/^(\d+[\.\)\-\s]+|[-•*]\s+)/, '')
        .split(/[-—_]{2,}/)[0]
        .trim();

      if (concMatch) {
        const idx = extractedName.toLowerCase().indexOf(concMatch[0].toLowerCase());
        if (idx > 2) {
          extractedName = extractedName.slice(0, idx).trim();
        }
      }

      const alerts: string[] = [];
      if (matchedMed) {
        if (matchedMed.prescriptionType.includes('Notificação B')) {
          alerts.push('Portaria 344/98 (Lista B1): Exige Notificação de Receita Azul e retenção.');
        } else if (matchedMed.prescriptionType.includes('Retenção de Receita')) {
          alerts.push('Exige Retenção de Receita (RDC 20/2011 Antimicrobiano ou Controle Especial C1).');
        }
        if (matchedMed.pregnancyCategory === 'D' || matchedMed.pregnancyCategory === 'X') {
          alerts.push(`Alerta Gestação: Categoria ${matchedMed.pregnancyCategory} (Risco fetal documentado).`);
        }
      }

      currentItem = {
        id: `rx-item-${Date.now()}-${i}`,
        rawLine: line,
        medicationName: matchedMed ? matchedMed.name : extractedName || line,
        matchedMedicationId: matchedMed?.id,
        activeIngredient: matchedMed?.activeIngredient || 'Verificar princípio ativo (DCB)',
        concentration: concMatch ? concMatch[0] : matchedMed?.concentrations[0] || 'A conferir',
        pharmaceuticalForm: formMatch
          ? formMatch[0].charAt(0).toUpperCase() + formMatch[0].slice(1)
          : matchedMed?.presentations[0]?.split(' ')[0] || 'Comprimido / Oral',
        dosage: doseMatch ? doseMatch[0] : '1 unidade por tomada (conferir)',
        frequency: freqMatch ? freqMatch[0] : 'Conferir intervalo (ex: 8/8h, 12/12h)',
        duration: durMatch ? durMatch[0] : 'Conforme orientação médica',
        route: routeMatch ? routeMatch[0].toUpperCase() : matchedMed?.routeOfAdministration[0] || 'Via Oral (VO)',
        confidence: matchedMed && concMatch ? 'Alta' : matchedMed || concMatch ? 'Média' : 'Revisão Manual',
        verified: false,
        notes: matchedMed?.clinicalPearls?.slice(0, 180) ? `${matchedMed.clinicalPearls.slice(0, 180)}...` : '',
        alerts,
      };

      items.push(currentItem);
    }
  }

  return items;
}
