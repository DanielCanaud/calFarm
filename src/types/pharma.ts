export type PrescriptionType =
  | 'MIP (Isento de Prescrição)'
  | 'Receita Simples (Tarja Vermelha)'
  | 'Retenção de Receita (Antimicrobiano / Controle Especial C1)'
  | 'Notificação B1/B2 (Tarja Preta - Azul)'
  | 'Notificação A (Entorpecente - Amarela)';

export type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X';

export interface Pharmacokinetics {
  bioavailability: string;
  halfLife: string;
  metabolism: string;
  excretion: string;
  onsetOfAction: string;
  proteinBinding?: string;
}

export interface DrugInteraction {
  interactingSubstance: string;
  severity: 'Grave' | 'Moderada' | 'Leve';
  effect: string;
  conduct: string;
}

export interface Medication {
  id: string;
  name: string; // Nome de referência ou principal
  activeIngredient: string; // DCB (Denominação Comum Brasileira)
  englishActiveIngredient: string; // INN / FDA query term for live API enrichment
  anvisaRegistry: string;
  atcCode: string;
  therapeuticClass: string;
  pharmacologicalGroup: string;
  mechanismOfAction: string;
  genericsAndSimilars: string[];
  presentations: string[];
  concentrations: string[];
  routeOfAdministration: string[];
  indications: string[];
  contraindications: string[];
  adverseEffects: {
    common: string[];
    serious: string[];
  };
  dosageGuide: {
    adult: string;
    pediatric: string;
    maxDailyDose: string;
    renalAdjustment: string;
  };
  pharmacokinetics: Pharmacokinetics;
  interactions: DrugInteraction[];
  pregnancyCategory: PregnancyCategory;
  lactationSafety: string;
  prescriptionType: PrescriptionType;
  clinicalPearls: string; // Dicas farmacêuticas para estudantes e dispensação
  sourceUrl?: string;
}

export interface LiveApiEnrichment {
  openFdaFound: boolean;
  rxNormRxcui?: string;
  fdaWarnings?: string[];
  fdaAdverseReactionsCount?: { term: string; count: number }[];
  fdaPharmacologicClass?: string[];
  anvisaBularioStatus?: string;
  fetchedAt: string;
}

export interface DuplicationAlert {
  type: 'same_substance' | 'same_class';
  substanceOrClass: string;
  items: string[];
  severity: 'Grave' | 'Moderada';
  message: string;
}

export interface RegulatoryValidationResult {
  isExpired: boolean;
  daysElapsed: number | null;
  maxValidDays: number | null;
  regulationNotice: string;
  prescriptionRequirement: string;
  severity: 'Crítica' | 'Alerta' | 'Informativa';
  details: string[];
}

export interface PrescriptionItem {
  id: string;
  rawLine: string;
  medicationName: string;
  matchedMedicationId?: string;
  activeIngredient?: string;
  therapeuticClass?: string;
  concentration: string;
  pharmaceuticalForm: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  confidence: 'Alta' | 'Média' | 'Revisão Manual';
  verified: boolean;
  dailyCalculatedDose?: string;
  maxDailyDoseAlert?: string;
  duplicationAlert?: string;
  regulatoryNotice?: string;
  notes?: string;
  alerts?: string[];
}
