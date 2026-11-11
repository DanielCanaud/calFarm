import {
  PrescriptionItem,
  DuplicationAlert,
  RegulatoryValidationResult,
} from '@/types/pharma';
import { DetectedInteraction } from '@/utils/interactions';
import { normalizePlain } from '@/utils/phonetic-search';

// --- 1. Dicionário de Doses Máximas Diárias (DMD) em Adultos (ANVISA / Bulas Oficiais) ---
export interface MaxDoseDefinition {
  substanceKey: string;
  name: string;
  maxDailyMg: number;
  maxPerIntakeMg?: number;
  warningText: string;
}

export const MAX_DAILY_DOSES_DB: Record<string, MaxDoseDefinition> = {
  paracetamol: {
    substanceKey: 'paracetamol',
    name: 'Paracetamol',
    maxDailyMg: 4000,
    maxPerIntakeMg: 1000,
    warningText:
      'Dose máxima permitida de 4.000 mg/dia (ou 3.000 mg/dia para idosos ou uso prolongado). Risco de hepatotoxicidade fulminante e necrose hepática por saturação da via da glutationa (acúmulo de NAPQI).',
  },
  dipirona: {
    substanceKey: 'dipirona',
    name: 'Dipirona Monoidratada',
    maxDailyMg: 4000,
    maxPerIntakeMg: 1000,
    warningText:
      'Dose máxima de 4.000 mg/dia (1.000 mg por tomada). Risco aumentado de hipotensão e toxicidade hematológica (agranulocitose).',
  },
  ibuprofeno: {
    substanceKey: 'ibuprofeno',
    name: 'Ibuprofeno',
    maxDailyMg: 2400,
    maxPerIntakeMg: 800,
    warningText:
      'Dose máxima anti-inflamatória em adultos de 2.400 mg/dia (como analgésico de venda livre MIP o teto é 1.200 mg/dia). Risco de hemorragia gastrointestinal e lesão renal aguda.',
  },
  cetoprofeno: {
    substanceKey: 'cetoprofeno',
    name: 'Cetoprofeno',
    maxDailyMg: 300,
    maxPerIntakeMg: 150,
    warningText:
      'Dose máxima recomendada de 300 mg/dia (ou 200 mg/dia para a maioria das apresentações). Elevado risco de ulceração gástrica.',
  },
  diclofenaco: {
    substanceKey: 'diclofenaco',
    name: 'Diclofenaco (Sódico ou Potássico)',
    maxDailyMg: 150,
    maxPerIntakeMg: 50,
    warningText:
      'Dose máxima recomendada de 150 mg/dia. Risco significativo de eventos trombóticos cardiovasculares e toxicidade gastrointestinal.',
  },
  nimesulida: {
    substanceKey: 'nimesulida',
    name: 'Nimesulida',
    maxDailyMg: 200,
    maxPerIntakeMg: 100,
    warningText:
      'Dose máxima de 200 mg/dia (100 mg de 12/12h). Uso restrito ao menor tempo possível (máximo 7 dias) pelo risco documentado de hepatite tóxica aguda grave.',
  },
  amoxicilina: {
    substanceKey: 'amoxicilina',
    name: 'Amoxicilina',
    maxDailyMg: 3000,
    maxPerIntakeMg: 1000,
    warningText:
      'Dose habitual máxima de 3.000 mg/dia em infecções graves em adultos (ex: 1 g de 8/8h ou 875 mg de 12/12h). Monitorar diarreia por Clostridioides e hipersensibilidade.',
  },
  ciprofloxacino: {
    substanceKey: 'ciprofloxacino',
    name: 'Ciprofloxacino',
    maxDailyMg: 1500,
    maxPerIntakeMg: 750,
    warningText:
      'Dose máxima usual de 1.500 mg/dia (750 mg de 12/12h). Atenção para tendinite/ruptura de tendão de Aquiles e prolongamento do intervalo QT.',
  },
  azitromicina: {
    substanceKey: 'azitromicina',
    name: 'Azitromicina',
    maxDailyMg: 500,
    maxPerIntakeMg: 500,
    warningText:
      'Dose habitual máxima de 500 mg em tomada única diária (exceto 1.000 mg dose única em uretrite por Clamídia). Risco de arritmia cardíaca e prolongamento de QT.',
  },
  metformina: {
    substanceKey: 'metformina',
    name: 'Cloridrato de Metformina',
    maxDailyMg: 2550,
    maxPerIntakeMg: 1000,
    warningText:
      'Dose máxima diária de 2.550 mg (ou 2.000 mg na forma de liberação prolongada XR). Risco aumentado de acidose láctica em idosos ou nefropatas.',
  },
  losartana: {
    substanceKey: 'losartana',
    name: 'Losartana Potássica',
    maxDailyMg: 100,
    maxPerIntakeMg: 100,
    warningText:
      'Dose máxima de 100 mg/dia (em tomada única ou dividida em 50 mg de 12/12h). Não há benefício anti-hipertensivo adicional acima de 100 mg/dia e há risco de hipercalemia.',
  },
  hidroclorotiazida: {
    substanceKey: 'hidroclorotiazida',
    name: 'Hidroclorotiazida',
    maxDailyMg: 50,
    maxPerIntakeMg: 50,
    warningText:
      'Dose máxima diária recomendada de 50 mg/dia (doses habituais eficazes são 12,5 mg a 25 mg/dia). Risco acentuado de hipocalemia, hiponatremia e hiperuricemia.',
  },
  clonazepam: {
    substanceKey: 'clonazepam',
    name: 'Clonazepam',
    maxDailyMg: 4,
    maxPerIntakeMg: 2,
    warningText:
      'Dose habitual máxima de 4 mg/dia em transtornos de ansiedade (raramente até 20 mg/dia em casos refratários de epilepsia). Risco grave de sedação profunda, tolerância e dependência física.',
  },
  zolpidem: {
    substanceKey: 'zolpidem',
    name: 'Hemitartarato de Zolpidem',
    maxDailyMg: 10,
    maxPerIntakeMg: 10,
    warningText:
      'Dose máxima de 10 mg/dia imediatamente antes de deitar (5 mg em idosos ou mulheres com metabolismo lento). Risco de sonambulismo, amnésia anterógrada e comportamentos complexos do sono.',
  },
  tramadol: {
    substanceKey: 'tramadol',
    name: 'Cloridrato de Tramadol',
    maxDailyMg: 400,
    maxPerIntakeMg: 100,
    warningText:
      'Dose máxima de 400 mg/dia. Risco acentuado de convulsões, síndrome serotoninérgica e depressão respiratória.',
  },
};

// --- 2. Extração Numérica de Concentração e Frequência ---

export function parseDoseInMg(concentrationStr: string, dosageStr: string): number | null {
  const normConc = normalizePlain(concentrationStr);
  const normDose = normalizePlain(dosageStr);

  // 1. Extração da concentração em mg por unidade
  let mgPerUnit: number | null = null;

  const gMatch = normConc.match(/(\d+(?:[.,]\d+)?)\s*g\b/);
  const mgMatch = normConc.match(/(\d+(?:[.,]\d+)?)\s*mg\b/);
  const mcgMatch = normConc.match(/(\d+(?:[.,]\d+)?)\s*mcg\b/);
  const dropsMlMatch = normConc.match(/(\d+(?:[.,]\d+)?)\s*mg\s*\/\s*ml/);

  if (dropsMlMatch) {
    const mgMl = parseFloat(dropsMlMatch[1].replace(',', '.'));
    // Se for gotas na posologia: ex: "20 gotas", "40 gts" (20 gotas = 1 mL)
    const dropsDoseMatch = normDose.match(/(\d+)\s*(?:gotas?|gts)/);
    if (dropsDoseMatch) {
      const numDrops = parseInt(dropsDoseMatch[1], 10);
      const volMl = numDrops / 20;
      return mgMl * volMl;
    }
    // Se for mL: ex: "5 mL", "10 ml"
    const mlDoseMatch = normDose.match(/(\d+(?:[.,]\d+)?)\s*ml/);
    if (mlDoseMatch) {
      const volMl = parseFloat(mlDoseMatch[1].replace(',', '.'));
      return mgMl * volMl;
    }
  }

  if (gMatch && !normConc.includes('mg')) {
    mgPerUnit = parseFloat(gMatch[1].replace(',', '.')) * 1000;
  } else if (mgMatch) {
    mgPerUnit = parseFloat(mgMatch[1].replace(',', '.'));
  } else if (mcgMatch) {
    mgPerUnit = parseFloat(mcgMatch[1].replace(',', '.')) / 1000;
  }

  if (mgPerUnit === null || isNaN(mgPerUnit)) {
    return null;
  }

  // 2. Extração da quantidade de unidades por tomada (ex: "tomar 2 comprimidos" -> 2)
  let unitsPerIntake = 1;
  const unitMatch = normDose.match(/(?:tomar|ingerir|dar|administrar)?\s*(\d+(?:[.,]\d+)?)\s*(?:comprimidos?|comp|capsulas?|caps|envelopes?|saches?)/);
  if (unitMatch) {
    const parsed = parseFloat(unitMatch[1].replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
      unitsPerIntake = parsed;
    }
  }

  return mgPerUnit * unitsPerIntake;
}

export function parseDailyFrequencyMultiplier(frequencyStr: string): number {
  const norm = normalizePlain(frequencyStr);

  if (/24\s*(?:\/|em)\s*24\s*h|a\s*cada\s*24\s*h|1\s*x\s*(?:ao|\/)?\s*dia|1\s*vez|pela\s*manha|a\s*noite|ao\s*deitar|em\s*jejum/.test(norm)) {
    return 1;
  }
  if (/12\s*(?:\/|em)\s*12\s*h|a\s*cada\s*12\s*h|2\s*x\s*(?:ao|\/)?\s*dia|2\s*vezes/.test(norm)) {
    return 2;
  }
  if (/8\s*(?:\/|em)\s*8\s*h|a\s*cada\s*8\s*h|3\s*x\s*(?:ao|\/)?\s*dia|3\s*vezes/.test(norm)) {
    return 3;
  }
  if (/6\s*(?:\/|em)\s*6\s*h|a\s*cada\s*6\s*h|4\s*x\s*(?:ao|\/)?\s*dia|4\s*vezes/.test(norm)) {
    return 4;
  }
  if (/4\s*(?:\/|em)\s*4\s*h|a\s*cada\s*4\s*h|6\s*x\s*(?:ao|\/)?\s*dia|6\s*vezes/.test(norm)) {
    return 6;
  }
  if (/se\s*dor|se\s*febre|se\s*necessario|s\/n/.test(norm)) {
    return 4; // Frequência condicional típica (até 4x/dia)
  }

  return 1; // Padrão seguro conservador
}

export function evaluateDailyDose(item: PrescriptionItem): {
  calculatedDailyDoseMg: number | null;
  maxDoseMg: number | null;
  alert: string | null;
  formattedDailyDose: string | null;
} {
  const dosePerIntakeMg = parseDoseInMg(item.concentration, item.dosage);
  if (dosePerIntakeMg === null || dosePerIntakeMg <= 0) {
    return {
      calculatedDailyDoseMg: null,
      maxDoseMg: null,
      alert: null,
      formattedDailyDose: null,
    };
  }

  const freq = parseDailyFrequencyMultiplier(item.frequency);
  const totalDailyMg = dosePerIntakeMg * freq;

  // Busca se há substância monitorada no nome ou princípio ativo
  const fullHaystack = normalizePlain(`${item.medicationName} ${item.activeIngredient || ''}`);
  let matchedDef: MaxDoseDefinition | null = null;

  for (const key of Object.keys(MAX_DAILY_DOSES_DB)) {
    if (fullHaystack.includes(key)) {
      matchedDef = MAX_DAILY_DOSES_DB[key];
      break;
    }
  }

  const formattedDailyDose =
    totalDailyMg >= 1000
      ? `${(totalDailyMg / 1000).toFixed(1).replace('.0', '')} g/dia (${freq} tomadas de ${dosePerIntakeMg >= 1000 ? (dosePerIntakeMg / 1000).toFixed(1) + ' g' : dosePerIntakeMg + ' mg'})`
      : `${totalDailyMg.toFixed(0)} mg/dia (${freq} tomadas de ${dosePerIntakeMg} mg)`;

  if (matchedDef) {
    if (totalDailyMg > matchedDef.maxDailyMg) {
      const alert = `🔴 RISCO CRÍTICO DE SUPERDOSAGEM: A dose diária calculada (${formattedDailyDose}) ultrapassa o limite máximo preconizado pela ANVISA de ${matchedDef.maxDailyMg} mg/dia! ${matchedDef.warningText}`;
      return {
        calculatedDailyDoseMg: totalDailyMg,
        maxDoseMg: matchedDef.maxDailyMg,
        alert,
        formattedDailyDose,
      };
    }

    if (matchedDef.maxPerIntakeMg && dosePerIntakeMg > matchedDef.maxPerIntakeMg) {
      const alert = `⚠️ ALERTA DE DOSE POR TOMADA: A dose por tomada (${dosePerIntakeMg} mg) excede o teto usual por administração (${matchedDef.maxPerIntakeMg} mg). ${matchedDef.warningText}`;
      return {
        calculatedDailyDoseMg: totalDailyMg,
        maxDoseMg: matchedDef.maxDailyMg,
        alert,
        formattedDailyDose,
      };
    }
  }

  return {
    calculatedDailyDoseMg: totalDailyMg,
    maxDoseMg: matchedDef ? matchedDef.maxDailyMg : null,
    alert: null,
    formattedDailyDose,
  };
}

// --- 3. Mapeador Farmacológico e Detector de Duplicidade Terapêutica ---

const DRUG_CLASS_KEYWORDS: Record<string, { className: string; keywords: string[] }> = {
  aine: {
    className: 'Anti-inflamatório Não Esteroidal (AINE)',
    keywords: [
      'ibuprofeno',
      'cetoprofeno',
      'diclofenaco',
      'nimesulida',
      'meloxicam',
      'piroxicam',
      'celecoxibe',
      'etoricoxibe',
      'naproxeno',
      'cetorolaco',
      'indometacina',
      'flurbiprofeno',
      'tenoxicam',
      'cataflam',
      'voltaren',
      'advil',
      'alivium',
      'nisulid',
      'scaflogen',
      'profenid',
    ],
  },
  ibp: {
    className: 'Inibidor da Bomba de Prótons (IBP)',
    keywords: [
      'omeprazol',
      'pantoprazol',
      'esomeprazol',
      'lansoprazol',
      'rabeprazol',
      'dexlansoprazol',
      'losec',
      'pantozol',
      'nexium',
    ],
  },
  benzodiazepinico: {
    className: 'Benzodiazepínico (Sedativo / Ansiolítico)',
    keywords: [
      'clonazepam',
      'diazepam',
      'alprazolam',
      'lorazepam',
      'bromazepam',
      'midazolam',
      'flunitrazepam',
      'rivotril',
      'valium',
      'frontal',
      'lexotan',
    ],
  },
  opioide: {
    className: 'Opioide Analgésico',
    keywords: [
      'tramadol',
      'codeina',
      'morfina',
      'oxicodona',
      'metadona',
      'fentanil',
      'buprenorfina',
      'tylex',
      'paco',
      'dimorf',
      'tramal',
      'oxycontin',
    ],
  },
  estatina: {
    className: 'Inibidor da HMG-CoA Redutase (Estatina)',
    keywords: [
      'sinvastatina',
      'atorvastatina',
      'rosuvastatina',
      'pravastatina',
      'pitavastatina',
      'zocor',
      'lipitor',
      'crestor',
    ],
  },
  anticoagulante: {
    className: 'Anticoagulante',
    keywords: [
      'varfarina',
      'rivaroxabana',
      'apixabana',
      'dabigatrana',
      'edoxabana',
      'enoxaparina',
      'heparina',
      'marevan',
      'xarelto',
      'eliquis',
      'pradaxa',
      'clexane',
    ],
  },
  antiagregante: {
    className: 'Antiagregante Plaquetário',
    keywords: [
      'clopidogrel',
      'ticagrelor',
      'prasugrel',
      'aspirina preventiva',
      'aas',
      'plavix',
      'brilinta',
    ],
  },
  corticoide: {
    className: 'Glicocorticoide Oral / Sistêmico',
    keywords: [
      'prednisona',
      'prednisolona',
      'dexametasona',
      'betametasona',
      'hidrocortisona',
      'metilprednisolona',
      'prelone',
      'decadron',
    ],
  },
  antimicrobiano: {
    className: 'Antimicrobiano (Antibiótico)',
    keywords: [
      'amoxicilina',
      'clavulanato',
      'azitromicina',
      'claritromicina',
      'ciprofloxacino',
      'levofloxacino',
      'cefalexina',
      'ceftriaxona',
      'cefuroxima',
      'sulfametoxazol',
      'trimetoprima',
      'nitrofurantoina',
      'doxiciclina',
      'metronidazol',
      'ampicilina',
      'norfloxacino',
      'bactrim',
      'clavulin',
      'astro',
      'keflex',
    ],
  },
  ieca_bra: {
    className: 'Bloqueador do SRAA (IECA / BRA)',
    keywords: [
      'losartana',
      'enalapril',
      'captopril',
      'ramipril',
      'valsartana',
      'candesartana',
      'olmesartana',
      'lisinopril',
      'aradois',
      'cozaar',
      'renitec',
      'diovan',
    ],
  },
};

export function identifyTherapeuticClass(text: string): string | undefined {
  const norm = normalizePlain(text);
  for (const group of Object.values(DRUG_CLASS_KEYWORDS)) {
    if (group.keywords.some((k) => norm.includes(k))) {
      return group.className;
    }
  }
  return undefined;
}

export function detectDuplications(items: PrescriptionItem[]): DuplicationAlert[] {
  const alerts: DuplicationAlert[] = [];
  if (items.length < 2) return alerts;

  // 1. Checagem de Mesmo Princípio Ativo (Duplicidade Exata de Molécula)
  const substanceMap = new Map<string, string[]>();

  for (const it of items) {
    const rawSubstance = it.activeIngredient && !it.activeIngredient.includes('Verificar')
      ? it.activeIngredient
      : it.medicationName;
    const cleanSubstance = normalizePlain(rawSubstance.split(/[\(\/]/)[0]).trim();
    if (cleanSubstance.length >= 4) {
      const list = substanceMap.get(cleanSubstance) || [];
      list.push(it.medicationName);
      substanceMap.set(cleanSubstance, list);
    }
  }

  for (const [substance, medNames] of substanceMap.entries()) {
    if (medNames.length > 1) {
      alerts.push({
        type: 'same_substance',
        substanceOrClass: substance.toUpperCase(),
        items: medNames,
        severity: 'Grave',
        message: `🔴 DUPLICIDADE EXATA DE FÁRMACO: A mesma substância ativa ("${substance.toUpperCase()}") foi prescrita em múltiplos itens (${medNames.join(' e ')}). Risco crítico de intoxicação acidental por soma inadvertida de doses!`,
      });
    }
  }

  // 2. Checagem de Mesma Classe Farmacológica Concorrente
  const classMap = new Map<string, string[]>();

  for (const it of items) {
    const hay = `${it.medicationName} ${it.activeIngredient || ''}`;
    for (const [classKey, def] of Object.entries(DRUG_CLASS_KEYWORDS)) {
      if (['aine', 'ibp', 'benzodiazepinico', 'estatina'].includes(classKey)) {
        if (def.keywords.some((k) => normalizePlain(hay).includes(k))) {
          const list = classMap.get(def.className) || [];
          if (!list.includes(it.medicationName)) {
            list.push(it.medicationName);
            classMap.set(def.className, list);
          }
        }
      }
    }
  }

  for (const [className, medNames] of classMap.entries()) {
    if (medNames.length > 1) {
      // Evita duplicar o alerta caso já tenha disparado por mesma substância
      alerts.push({
        type: 'same_class',
        substanceOrClass: className,
        items: medNames,
        severity: className.includes('AINE') ? 'Grave' : 'Moderada',
        message: `🟠 SOBREPOSIÇÃO DE CLASSE TERAPÊUTICA: Foram prescritos múltiplos fármacos da classe "${className}" (${medNames.join(' e ')}). Na maioria dos casos clínicos, essa combinação não agrega benefício e eleva expressivamente os riscos de reações adversas graves.`,
      });
    }
  }

  return alerts;
}

// --- 4. Matriz Expandida de Interações Farmacológicas por Classe ---

export function detectExpandedInteractions(
  items: PrescriptionItem[]
): DetectedInteraction[] {
  const alerts: DetectedInteraction[] = [];
  const seenPairs = new Set<string>();

  // Normaliza os itens
  const normalizedItems = items.map((it) => {
    const hay = normalizePlain(`${it.medicationName} ${it.activeIngredient || ''}`);
    const isAine = DRUG_CLASS_KEYWORDS.aine.keywords.some((k) => hay.includes(k));
    const isAnticoagulante = DRUG_CLASS_KEYWORDS.anticoagulante.keywords.some((k) => hay.includes(k));
    const isAntiagregante = DRUG_CLASS_KEYWORDS.antiagregante.keywords.some((k) => hay.includes(k));
    const isCorticoide = DRUG_CLASS_KEYWORDS.corticoide.keywords.some((k) => hay.includes(k));
    const isIecaBra = DRUG_CLASS_KEYWORDS.ieca_bra.keywords.some((k) => hay.includes(k));
    const isDiuretico = hay.includes('hidroclorotiazida') || hay.includes('furosemida') || hay.includes('indapamida') || hay.includes('clortalidona');
    const isDiureticoPoupadorK = hay.includes('espironolactona') || hay.includes('amilorida');
    const isOpioide = DRUG_CLASS_KEYWORDS.opioide.keywords.some((k) => hay.includes(k));
    const isBenzo = DRUG_CLASS_KEYWORDS.benzodiazepinico.keywords.some((k) => hay.includes(k));
    const isEstatina = DRUG_CLASS_KEYWORDS.estatina.keywords.some((k) => hay.includes(k));
    const isMacrolideoAzol = hay.includes('claritromicina') || hay.includes('eritromicina') || hay.includes('cetoconazol') || hay.includes('itraconazol') || hay.includes('fluconazol');
    const isMetformina = hay.includes('metformina');
    const isContraste = hay.includes('contraste') || hay.includes('iodo');
    const isLevotiroxina = hay.includes('levotiroxina') || hay.includes('puran') || hay.includes('euthyrox');
    const isQuelante = hay.includes('calcio') || hay.includes('ferroso') || hay.includes('antiacido') || hay.includes('omeprazol');
    const isIsrs = hay.includes('fluoxetina') || hay.includes('sertralina') || hay.includes('paroxetina') || hay.includes('escitalopram') || hay.includes('citalopram');
    const isAntimicrobiano = DRUG_CLASS_KEYWORDS.antimicrobiano.keywords.some((k) => hay.includes(k));

    return {
      name: it.medicationName,
      hay,
      isAine,
      isAnticoagulante,
      isAntiagregante,
      isCorticoide,
      isIecaBra,
      isDiuretico,
      isDiureticoPoupadorK,
      isOpioide,
      isBenzo,
      isEstatina,
      isMacrolideoAzol,
      isMetformina,
      isContraste,
      isLevotiroxina,
      isQuelante,
      isIsrs,
      isAntimicrobiano,
    };
  });

  const addAlert = (
    medA: string,
    medB: string,
    severity: DetectedInteraction['severity'],
    effect: string,
    conduct: string
  ) => {
    const sorted = [medA, medB].sort().join(' + ');
    const key = `${sorted}:${effect.slice(0, 30)}`;
    if (!seenPairs.has(key)) {
      seenPairs.add(key);
      alerts.push({
        pair: sorted,
        severity,
        effect,
        conduct,
      });
    }
  };

  // 1. Pares Cruzados
  for (let i = 0; i < normalizedItems.length; i++) {
    for (let j = i + 1; j < normalizedItems.length; j++) {
      const a = normalizedItems[i];
      const b = normalizedItems[j];

      // AINE + Anticoagulante
      if ((a.isAine && b.isAnticoagulante) || (b.isAine && a.isAnticoagulante)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Risco crítico de hemorragia gastrointestinal e sangramento sistêmico grave por inibição plaquetária COX-1 e lesão da mucosa associada à anticoagulação.',
          'Evitar a associação. Se analgesia for estritamente necessária, prescrever Paracetamol ou Dipirona com acompanhamento médico.'
        );
      }

      // AINE + Antiagregante Plaquetário
      if ((a.isAine && b.isAntiagregante) || (b.isAine && a.isAntiagregante)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Aumento de até 4x no risco de hemorragia digestiva alta e perfuração de úlceras.',
          'Evitar associação. Caso indispensável, utilizar IBP protetor gástrico e limitar ao menor período possível.'
        );
      }

      // AINE + Corticoide Oral
      if ((a.isAine && b.isCorticoide) || (b.isAine && a.isCorticoide)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Efeito ulcerogênico sinérgico na mucosa gástrica, com alto risco de sangramentos e gastrite erosiva.',
          'Contraindicar o uso concomitante sem prescrição explícita e protetor gástrico (IBP).'
        );
      }

      // Benzodiazepínico + Opioide
      if ((a.isBenzo && b.isOpioide) || (b.isBenzo && a.isOpioide)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Depressão respiratória profunda, sedação excessiva, coma e risco de parada respiratória fatal (Alerta de Caixa Preta FDA/ANVISA).',
          'Evitar a prescrição simultânea. Se indispensável, orientar monitoramento contínuo de oximetria e redução de doses.'
        );
      }

      // IECA/BRA + Diurético Poupador de K (Espironolactona)
      if ((a.isIecaBra && b.isDiureticoPoupadorK) || (b.isIecaBra && a.isDiureticoPoupadorK)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Risco acentuado de hipercalemia grave (> 5,5 mEq/L), capaz de precipitar arritmias ventriculares potencialmente fatais.',
          'Monitorar obrigatoriamente potássio sérico e creatinina em 7 a 14 dias após o início da associação.'
        );
      }

      // Estatina + Inibidor Potente CYP3A4
      if ((a.isEstatina && b.isMacrolideoAzol) || (b.isEstatina && a.isMacrolideoAzol)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Inibição metabólica acentuada de CYP3A4 elevando as concentrações séricas da estatina em até 5x, com risco grave de miopatia e rabdomiólise com insuficiência renal aguda.',
          'Suspender temporariamente a estatina durante o ciclo do antimicrobiano/antifúngico ou substituir por estatina não metabolizada por CYP3A4 (Rosuvastatina ou Pravastatina).'
        );
      }

      // Metformina + Contraste
      if ((a.isMetformina && b.isContraste) || (b.isMetformina && a.isContraste)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Risco de acidose láctica induzida por contraste associada à metformina.',
          'Suspender a metformina 48 horas antes do procedimento contrastado e reintroduzir 48 horas após se função renal normal.'
        );
      }

      // Levotiroxina + Quelante
      if ((a.isLevotiroxina && b.isQuelante) || (b.isLevotiroxina && a.isQuelante)) {
        addAlert(
          a.name,
          b.name,
          'Moderada',
          'Queda acentuada da absorção gastrointestinal da Levotiroxina por quelação e elevação do pH gástrico, levando a descontrole do hipotireoidismo.',
          'Administrar a Levotiroxina em jejum absoluto 30 a 60 min antes do café e manter espaçamento de no mínimo 4 horas dos cátions/quelantes.'
        );
      }

      // ISRS + Tramadol
      if ((a.isIsrs && b.isOpioide) || (b.isIsrs && a.isOpioide)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Risco agudo de Síndrome Serotoninérgica (hipertermia, hiper-reflexia, clônus, sudorese, taquicardia) e rebaixamento do limiar convulsivo.',
          'Evitar a combinação ou monitorar estritamente sinais neuromusculares e autonômicos.'
        );
      }

      // Varfarina + Antibiótico de amplo espectro
      if ((a.hay.includes('varfarina') && b.isAntimicrobiano) || (b.hay.includes('varfarina') && a.isAntimicrobiano)) {
        addAlert(
          a.name,
          b.name,
          'Grave',
          'Redução da flora bacteriana intestinal produtora de Vitamina K, potencializando a hipoprotrombinemia com elevação descontrolada do RNI/TAP e hemorragias.',
          'Monitorar rigorosamente o RNI dentro de 3 a 5 dias após o início do antibiótico e ajustar a dose da Varfarina se necessário.'
        );
      }
    }
  }

  // 2. Síndrome do Triple Whammy (Tríade Nefrotóxica: AINE + IECA/BRA + Diurético)
  const hasAine = normalizedItems.find((it) => it.isAine);
  const hasIecaBra = normalizedItems.find((it) => it.isIecaBra);
  const hasDiuretico = normalizedItems.find((it) => it.isDiuretico);

  if (hasAine && hasIecaBra && hasDiuretico) {
    addAlert(
      `${hasAine.name} + ${hasIecaBra.name}`,
      hasDiuretico.name,
      'Grave',
      '🔴 ALERTA MÁXIMO "TRIPLE WHAMMY" (TRÍADE NEFROTÓXICA): A combinação de AINE (bloqueia vasodilatação aferente por prostaglandinas) + IECA/BRA (bloqueia vasoconstrição eferente por Angiotensina II) + Diurético (reduz volemia) colapsa a pressão de filtração glomerular, provocando Insuficiência Renal Aguda súbita.',
      'Conduta Farmacêutica Urgente: Contatar imediatamente o médico prescritor para descontinuar o AINE. Substituir a analgesia por alternativas não nefrotóxicas (Paracetamol ou Dipirona).'
    );
  }

  return alerts;
}

// --- 5. Validador Regulatório de Vencimento e Receituário (Deontologia Farmacêutica) ---

export function validatePrescriptionRegulations(
  items: PrescriptionItem[],
  issueDateStr?: string,
  referenceDate: Date = new Date()
): RegulatoryValidationResult {
  const details: string[] = [];
  let isAntimicrobial = false;
  let isListaB = false;
  let isListaA = false;
  let isListaC1 = false;

  for (const it of items) {
    const hay = normalizePlain(`${it.medicationName} ${it.activeIngredient || ''}`);
    if (DRUG_CLASS_KEYWORDS.antimicrobiano.keywords.some((k) => hay.includes(k))) {
      isAntimicrobial = true;
    }
    if (DRUG_CLASS_KEYWORDS.benzodiazepinico.keywords.some((k) => hay.includes(k)) || hay.includes('zolpidem')) {
      isListaB = true;
    }
    if (hay.includes('morfina') || hay.includes('oxicodona') || hay.includes('metilfenidato') || hay.includes('fentanil')) {
      isListaA = true;
    }
    if (
      hay.includes('sertralina') ||
      hay.includes('fluoxetina') ||
      hay.includes('escitalopram') ||
      hay.includes('amitriptilina') ||
      hay.includes('carbamazepina') ||
      hay.includes('valproato') ||
      hay.includes('fenobarbital') ||
      hay.includes('tramadol')
    ) {
      isListaC1 = true;
    }
  }

  let maxValidDays = 30; // Padrão geral de controle especial
  let prescriptionRequirement = 'Receita Simples (Tarja Vermelha sem retenção)';
  let regulationNotice = 'Receita de Medicamentos Isentos ou Simples';

  if (isListaA) {
    maxValidDays = 30;
    prescriptionRequirement = 'Notificação de Receita "A" (Cor Amarela) + Receita Médica';
    regulationNotice = 'Portaria SVS/MS 344/1998 (Lista A1/A2/A3 - Entorpecentes)';
    details.push('Exige Notificação de Receita Amarela talonário numerado emitido pela Vigilância Sanitária local.');
    details.push('Validade legal estrita: 30 dias contados a partir da data de emissão em todo o território nacional.');
  } else if (isListaB) {
    maxValidDays = 30;
    prescriptionRequirement = 'Notificação de Receita "B" (Cor Azul) + Receita Médica';
    regulationNotice = 'Portaria SVS/MS 344/1998 (Lista B1/B2 - Psicotrópicos)';
    details.push('Exige Notificação de Receita Azul com retenção da folha de notificação na farmácia.');
    details.push('Validade legal: 30 dias a partir da data de emissão.');
    details.push('Tratamento limitado a no máximo 60 dias por notificação.');
  } else if (isAntimicrobial) {
    maxValidDays = 10;
    prescriptionRequirement = 'Receituário Privativo em 2 Vias (RDC 20/2011 / RDC 471/2021)';
    regulationNotice = 'RDC ANVISA 20/2011 e 471/2021 (Antimicrobianos)';
    details.push('Validade legal estrita de 10 DIAS CORRIDOS a contar da data de emissão!');
    details.push('Retenção obrigatória da 2ª via da receita pelo farmacêutico com carimbo e visto na 1ª via devolvida.');
  } else if (isListaC1) {
    maxValidDays = 30;
    prescriptionRequirement = 'Receituário de Controle Especial em 2 Vias (Branca)';
    regulationNotice = 'Portaria SVS/MS 344/1998 (Lista C1 - Outras Substâncias Sujeitas a Controle Especial)';
    details.push('Retenção obrigatória da 1ª via na farmácia; 2ª via do paciente com anotação da dispensação.');
    details.push('Validade legal: 30 dias a partir da data de emissão.');
    details.push('Para anticonvulsivantes e antiparkinsonianos, é permitido dispensar até 180 dias de tratamento.');
  }

  let daysElapsed: number | null = null;
  let isExpired = false;
  let severity: RegulatoryValidationResult['severity'] = 'Informativa';

  if (issueDateStr) {
    const issueDate = new Date(issueDateStr);
    if (!isNaN(issueDate.getTime())) {
      const diffMs = referenceDate.getTime() - issueDate.getTime();
      daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (daysElapsed < 0) {
        details.push('Atenção: A data informada é futura em relação à data atual.');
      } else if (daysElapsed > maxValidDays) {
        isExpired = true;
        severity = 'Crítica';
        details.unshift(
          `🔴 RECEITA VENCIDA! Já se passaram ${daysElapsed} dias da emissão médica (limite legal é de ${maxValidDays} dias). DISPENSAÇÃO PROIBIDA POR LEI pelo CRF e ANVISA!`
        );
      } else {
        severity = isAntimicrobial || isListaB || isListaA ? 'Alerta' : 'Informativa';
        details.push(
          `Receita dentro do prazo legal: ${daysElapsed} dias decorridos de um teto de ${maxValidDays} dias (${maxValidDays - daysElapsed} dias restantes de validade).`
        );
      }
    }
  } else {
    details.push(
      `Conferência de data pendente: Verifique a data manuscrita/impressa na receita física. O prazo de validade legal para este receituário é de ${maxValidDays} dias.`
    );
  }

  return {
    isExpired,
    daysElapsed,
    maxValidDays,
    regulationNotice,
    prescriptionRequirement,
    severity,
    details,
  };
}

// --- 6. Enriquecedor de Itens com Segurança Clínica Integrada ---

export function enrichItemWithClinicalSafety(item: PrescriptionItem): PrescriptionItem {
  const identifiedClass = identifyTherapeuticClass(
    `${item.medicationName} ${item.activeIngredient || ''}`
  );
  const doseEval = evaluateDailyDose(item);

  return {
    ...item,
    therapeuticClass: item.therapeuticClass || identifiedClass,
    dailyCalculatedDose: doseEval.formattedDailyDose || undefined,
    maxDailyDoseAlert: doseEval.alert || undefined,
  };
}
