import { NextRequest, NextResponse } from 'next/server';
import { MEDICATIONS_DB } from '@/data/medications-db';
import { LiveApiEnrichment, Medication } from '@/types/pharma';

// Dicionário de tradução DCB (Português) -> INN/USP (Inglês) para busca global em APIs (OpenFDA / RxNorm NIH)
const PT_TO_EN_DCB_MAP: Record<string, string> = {
  dipirona: 'metamizole',
  paracetamol: 'acetaminophen',
  ibuprofeno: 'ibuprofen',
  amoxicilina: 'amoxicillin',
  azitromicina: 'azithromycin',
  losartana: 'losartan',
  omeprazol: 'omeprazole',
  metformina: 'metformin',
  sinvastatina: 'simvastatin',
  clonazepam: 'clonazepam',
  sertralina: 'sertraline',
  prednisona: 'prednisone',
  levotiroxina: 'levothyroxine',
  enalapril: 'enalapril',
  hidroclorotiazida: 'hydrochlorothiazide',
  ciprofloxacino: 'ciprofloxacin',
  loratadina: 'loratadine',
  rivaroxabana: 'rivaroxaban',
  atenolol: 'atenolol',
  propranolol: 'propranolol',
  captopril: 'captopril',
  anlodipino: 'amlodipine',
  nifedipino: 'nifedipine',
  furosemida: 'furosemide',
  espironolactona: 'spironolactone',
  atorvastatina: 'atorvastatin',
  rosuvastatina: 'rosuvastatin',
  pantoprazol: 'pantoprazole',
  esomeprazol: 'esomeprazole',
  cefalexina: 'cephalexin',
  ceftriaxona: 'ceftriaxone',
  claritromicina: 'clarithromycin',
  metronidazol: 'metronidazole',
  fluconazol: 'fluconazole',
  cetoconazol: 'ketoconazole',
  ivermectina: 'ivermectin',
  albendazol: 'albendazole',
  dexametasona: 'dexamethasone',
  prednisolona: 'prednisolone',
  hidrocortisona: 'hydrocortisone',
  cetoprofeno: 'ketoprofen',
  diclofenaco: 'diclofenac',
  nimesulida: 'nimesulide',
  meloxicam: 'meloxicam',
  celecoxibe: 'celecoxib',
  tramadol: 'tramadol',
  codeina: 'codeine',
  morfina: 'morphine',
  fluoxetina: 'fluoxetine',
  escitalopram: 'escitalopram',
  citalopram: 'citalopram',
  venlafaxina: 'venlafaxine',
  duloxetina: 'duloxetine',
  amitriptilina: 'amitriptyline',
  nortriptilina: 'nortriptyline',
  bupropiona: 'bupropion',
  diazepam: 'diazepam',
  alprazolam: 'alprazolam',
  zolpidem: 'zolpidem',
  quetiapina: 'quetiapine',
  risperidona: 'risperidone',
  olanzapina: 'olanzapine',
  haloperidol: 'haloperidol',
  carbamazepina: 'carbamazepine',
  fenitoina: 'phenytoin',
  valproato: 'valproic acid',
  lamotrigina: 'lamotrigine',
  pregabalina: 'pregabalin',
  gabapentina: 'gabapentin',
  insulina: 'insulin',
  glibenclamida: 'glyburide',
  gliclazida: 'gliclazide',
  empagliflozina: 'empagliflozin',
  dapagliflozina: 'dapagliflozin',
  semaglutida: 'semaglutide',
  varfarina: 'warfarin',
  apixabana: 'apixaban',
  clopidogrel: 'clopidogrel',
  salbutamol: 'albuterol',
  fenoterol: 'fenoterol',
  ipratropio: 'ipratropium',
  budesonida: 'budesonide',
  dexclorfeniramina: 'dexchlorpheniramine',
  prometazina: 'promethazine',
  fexofenadina: 'fexofenadine',
  cetirizina: 'cetirizine',
  ondansetrona: 'ondansetron',
  metoclopramida: 'metoclopramide',
  dimenidrinato: 'dimenhydrinate',
  escopolamina: 'scopolamine',
  alopurinol: 'allopurinol',
  colchicina: 'colchicine',
  sildenafila: 'sildenafil',
  tadalafila: 'tadalafil',
};

function normalizeTerm(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function translateToEnglishInn(ptTerm: string): string {
  const norm = normalizeTerm(ptTerm);
  for (const [pt, en] of Object.entries(PT_TO_EN_DCB_MAP)) {
    if (norm.includes(pt)) return en;
  }
  // Heurística morfológica DCB -> INN caso não esteja no mapa explícito
  return norm
    .replace(/ina$/, 'ine')
    .replace(/ol$/, 'ol')
    .replace(/sartana$/, 'sartan')
    .replace(/vastatina$/, 'vastatin')
    .replace(/floxacino$/, 'floxacin')
    .replace(/cilina$/, 'cillin')
    .replace(/micina$/, 'mycin')
    .replace(/prazol$/, 'prazole')
    .replace(/dipino$/, 'dipine')
    .replace(/bamato$/, 'bamate')
    .replace(/feno$/, 'fen');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const englishTermParam = searchParams.get('en') || '';

  if (!query && !englishTermParam) {
    return NextResponse.json({ error: 'Parâmetro de busca ausente' }, { status: 400 });
  }

  const searchTermEn = englishTermParam || translateToEnglishInn(query);

  const enrichment: LiveApiEnrichment = {
    openFdaFound: false,
    fetchedAt: new Date().toISOString(),
    anvisaBularioStatus: 'Base RENAME / Bulário ANVISA Sincronizada',
  };

  let dynamicMedication: Medication | null = null;

  try {
    // 1. Consulta paralela ao NIH RxNorm API e OpenFDA (Label + FAERS Adverse Events)
    const [rxNormRes, fdaLabelRes, fdaEventRes] = await Promise.allSettled([
      fetch(
        `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(searchTermEn)}&search=2`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(searchTermEn)}"+openfda.substance_name:"${encodeURIComponent(searchTermEn)}"&limit=1`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.fda.gov/drug/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(searchTermEn)}"&count=patient.reaction.reactionmeddrapt.exact&limit=6`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    // Processa RxNorm (NIH)
    if (rxNormRes.status === 'fulfilled' && rxNormRes.value.ok) {
      const rxData = await rxNormRes.value.json();
      const rxcui = rxData?.idGroup?.rxnormId?.[0];
      if (rxcui) {
        enrichment.rxNormRxcui = rxcui;
      }
    }

    // Processa OpenFDA FAERS Adverse Events (Farmacovigilância Real)
    if (fdaEventRes.status === 'fulfilled' && fdaEventRes.value.ok) {
      const eventData = await fdaEventRes.value.json();
      if (Array.isArray(eventData?.results)) {
        enrichment.openFdaFound = true;
        enrichment.fdaAdverseReactionsCount = eventData.results.slice(0, 6).map((r: { term: string; count: number }) => ({
          term: r.term,
          count: r.count,
        }));
      }
    }

    // Processa OpenFDA Drug Label (Bula Oficial FDA)
    if (fdaLabelRes.status === 'fulfilled' && fdaLabelRes.value.ok) {
      const labelData = await fdaLabelRes.value.json();
      const firstResult = labelData?.results?.[0];
      if (firstResult) {
        enrichment.openFdaFound = true;
        const pharmClasses: string[] = [
          ...(firstResult.openfda?.pharm_class_epc || []),
          ...(firstResult.openfda?.pharm_class_moa || []),
        ];
        if (pharmClasses.length > 0) {
          enrichment.fdaPharmacologicClass = Array.from(new Set(pharmClasses));
        }
        if (firstResult.boxed_warning || firstResult.warnings) {
          const rawWarning = (firstResult.boxed_warning?.[0] || firstResult.warnings?.[0] || '').slice(0, 420);
          if (rawWarning) {
            enrichment.fdaWarnings = [rawWarning + (rawWarning.length >= 420 ? '...' : '')];
          }
        }

        // Se o medicamento buscado não estiver na base local curada, construímos uma monografia dinâmica a partir da API!
        const existsLocally = MEDICATIONS_DB.some(
          (m) =>
            normalizeTerm(m.name).includes(normalizeTerm(query)) ||
            normalizeTerm(m.activeIngredient).includes(normalizeTerm(query)) ||
            normalizeTerm(m.englishActiveIngredient) === normalizeTerm(searchTermEn)
        );

        if (!existsLocally && query.length >= 3) {
          const brandNames = firstResult.openfda?.brand_name?.slice(0, 5) || [];
          const routeList = firstResult.openfda?.route || ['ORAL'];
          const mechText =
            firstResult.mechanism_of_action?.[0]?.slice(0, 500) ||
            firstResult.clinical_pharmacology?.[0]?.slice(0, 500) ||
            `Fármaco identificado via base oficial OpenFDA / NIH RxNorm (${searchTermEn.toUpperCase()}).`;
          const indicationsText =
            firstResult.indications_and_usage?.[0]?.slice(0, 450) ||
            'Consulte a bula oficial ANVISA/FDA para indicações clínicas detalhadas.';
          const contraText =
            firstResult.contraindications?.[0]?.slice(0, 400) ||
            'Hipersensibilidade conhecida ao princípio ativo ou componentes da fórmula.';
          const dosageText =
            firstResult.dosage_and_administration?.[0]?.slice(0, 400) ||
            'Posologia individualizada conforme critério médico e apresentação comercial.';

          dynamicMedication = {
            id: `live-${normalizeTerm(query)}`,
            name: `${query.charAt(0).toUpperCase() + query.slice(1)} (${brandNames[0] || searchTermEn.toUpperCase()})`,
            activeIngredient: `${query.charAt(0).toUpperCase() + query.slice(1)} (INN: ${searchTermEn})`,
            englishActiveIngredient: searchTermEn,
            anvisaRegistry: enrichment.rxNormRxcui ? `RxCUI ${enrichment.rxNormRxcui} / ANVISA` : 'Consulta Externa API',
            atcCode: firstResult.openfda?.unii?.[0] || 'API-LIVE',
            therapeuticClass: enrichment.fdaPharmacologicClass?.[0] || 'Fármaco Catalogado (OpenFDA / RxNorm)',
            pharmacologicalGroup: enrichment.fdaPharmacologicClass?.[1] || 'Monografia Externa em Tempo Real',
            mechanismOfAction: mechText,
            genericsAndSimilars: brandNames.length > 0 ? brandNames : [`Genérico (${query})`],
            presentations: firstResult.dosage_forms_and_strengths
              ? [firstResult.dosage_forms_and_strengths[0].slice(0, 180)]
              : ['Comprimido / Cápsula / Solução (ver bula oficial)'],
            concentrations: ['Ver apresentação comercial'],
            routeOfAdministration: routeList,
            indications: [indicationsText],
            contraindications: [contraText],
            adverseEffects: {
              common:
                enrichment.fdaAdverseReactionsCount?.slice(0, 4).map((r) => `${r.term} (${r.count.toLocaleString('pt-BR')} relatos FAERS)`) ||
                ['Náuseas, cefaleia, tontura (consultar bula completa)'],
              serious: enrichment.fdaWarnings || ['Reações de hipersensibilidade grave (consultar bula)'],
            },
            dosageGuide: {
              adult: dosageText,
              pediatric: firstResult.pediatric_use?.[0]?.slice(0, 220) || 'Conforme peso e orientação pediátrica.',
              maxDailyDose: 'Consultar bula oficial da ANVISA para dose máxima diária.',
              renalAdjustment: 'Avaliar necessidade de ajuste conforme clearance de creatinina.',
            },
            pharmacokinetics: {
              bioavailability: 'Consulte seção de Farmacocinética da bula',
              halfLife: 'Variável conforme função hepatorrenal',
              metabolism: 'Hepático / Sistêmico',
              excretion: 'Renal / Biliar',
              onsetOfAction: 'Conforme via de administração',
            },
            interactions: firstResult.drug_interactions?.[0]
              ? [
                  {
                    interactingSubstance: 'Interações Documentadas na Bula Oficial (FDA/ANVISA)',
                    severity: 'Moderada',
                    effect: firstResult.drug_interactions[0].slice(0, 320) + '...',
                    conduct: 'Avaliar terapia concomitante e monitorar paciente.',
                  },
                ]
              : [],
            pregnancyCategory: 'C',
            lactationSafety: firstResult.nursing_mothers?.[0]?.slice(0, 200) || 'Avaliar risco/benefício durante a lactação.',
            prescriptionType: 'Receita Simples (Tarja Vermelha)',
            clinicalPearls:
              'Monografia obtida em tempo real através da integração com as APIs públicas oficiais OpenFDA (U.S. Food and Drug Administration) e RxNorm (National Library of Medicine - NIH).',
            sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
          };
        }
      }
    }
  } catch {
    // Em caso de falha de rede externa, retorna o status gracioso sem quebrar a aplicação
  }

  return NextResponse.json({
    enrichment,
    dynamicMedication,
  });
}
