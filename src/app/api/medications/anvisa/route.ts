import { NextRequest, NextResponse } from 'next/server';
import anvisaRawData from '@/data/anvisa-cmed-db.json';
import { Medication } from '@/types/pharma';
import { normalizePlain, normalizePhonetic } from '@/utils/phonetic-search';
import { dcbToEnglishInn } from '@/utils/dcb-translator';

interface AnvisaCompactRecord {
  p: string; // Produto (Nome Comercial)
  s: string; // Substância (Princípio Ativo DCB)
  l: string; // Laboratório
  r: string; // Registro ANVISA
  c: string; // Classe Terapêutica (Código EphMRA/ATC + Descrição)
  t: string; // Tipo (Novo, Genérico, Similar, Biológico, Específico, Fitoterápico)
  h: number; // Restrição Hospitalar (0 ou 1)
  j: string; // Tarja / Prescrição
  a: string[]; // Apresentações
}

interface IndexedAnvisaEntry {
  rec: AnvisaCompactRecord;
  pPlain: string;
  sPlain: string;
  pPhon: string;
  sPhon: string;
  cPlain: string;
  cPhon: string;
  aPlain: string;
}

const ANVISA_DB = anvisaRawData as AnvisaCompactRecord[];

// Pré-indexação em memória no servidor para busca instantânea (< 1ms em 6.423 medicamentos)
const substanceToBrandsMap = new Map<string, string[]>();
const INDEXED_ANVISA_DB: IndexedAnvisaEntry[] = [];

for (const rec of ANVISA_DB) {
  const key = rec.s.toUpperCase();
  let list = substanceToBrandsMap.get(key);
  if (!list) {
    list = [];
    substanceToBrandsMap.set(key, list);
  }
  const label = `${rec.p} (${rec.t} — ${rec.l.split(' ')[0]})`;
  if (list.length < 12 && !list.includes(label)) {
    list.push(label);
  }

  INDEXED_ANVISA_DB.push({
    rec,
    pPlain: normalizePlain(rec.p),
    sPlain: normalizePlain(rec.s),
    pPhon: normalizePhonetic(rec.p),
    sPhon: normalizePhonetic(rec.s),
    cPlain: normalizePlain(rec.c),
    cPhon: normalizePhonetic(rec.c),
    aPlain: normalizePlain(rec.a.join(' ')),
  });
}

function normalizePrescriptionType(raw: string): Medication['prescriptionType'] {
  if (raw.includes('MIP') || raw.includes('Isento')) {
    return 'MIP (Isento de Prescrição)';
  }
  if (raw.includes('Notificação A')) {
    return 'Notificação A (Entorpecente - Amarela)';
  }
  if (raw.includes('Notificação B')) {
    return 'Notificação B1/B2 (Tarja Preta - Azul)';
  }
  if (raw.includes('Retenção') || raw.includes('Controle Especial')) {
    return 'Retenção de Receita (Antimicrobiano / Controle Especial C1)';
  }
  return 'Receita Simples (Tarja Vermelha)';
}

// Motor Acadêmico de Farmacologia por Classe Terapêutica ANVISA/EphMRA
function getAcademicClassKnowledge(classCodeAndName: string, tarja: string, substancia: string) {
  const c = classCodeAndName.toUpperCase();
  const s = substancia.toUpperCase();

  if (c.includes('N3A') || c.includes('ANTIEPIL')) {
    return {
      mechanism:
        'Atua na estabilização da membrana neuronal hiperexcitada no Sistema Nervoso Central através da modulação de canais iônicos dependentes de voltagem (Na⁺ e/ou Ca²⁺ tipo T) e/ou potencialização da neurotransmissão inibitória mediada pelo GABA (ácido gama-aminobutírico) ou inibição sináptica do glutamato.',
      indications: [
        'Controle e prevenção de crises epilépticas (focais e/ou generalizadas conforme espectro do fármaco)',
        'Manejo de síndromes convulsivas, dor neuropática ou estabilização do humor conforme indicação em bula ANVISA',
      ],
      contraindications: [
        'Hipersensibilidade ao princípio ativo ou excipientes da formulação',
        'Insuficiência hepática grave ou porfiria aguda (conforme fármaco específico)',
        'Atenção redobrada em gestantes devido ao potencial teratogênico de diversos antiepilépticos (avaliar risco/benefício estrito)',
      ],
      commonRam: ['Sonolência, tontura, ataxia, diplopia, fadiga', 'Náuseas ou desconforto gastrointestinal inicial'],
      seriousRam: [
        'Reações cutâneas graves (Síndrome de Stevens-Johnson / NET — especialmente no início do tratamento)',
        'Hepatotoxicidade, discrasias sanguíneas ou teratogenicidade (defeitos de fechamento do tubo neural)',
      ],
      pk: {
        bioavailability: 'Geralmente elevada por via oral (consultar bula da apresentação específica)',
        halfLife: 'Variável (8 a 40h); exige tomadas regulares para manter nível sérico na janela terapêutica',
        metabolism: 'Predominantemente hepático (atenção ao potencial de indução ou inibição de enzimas CYP450/UGT)',
        excretion: 'Renal (como metabólitos conjugados ou fração inalterada)',
        onset: 'Estabilização plasmática (steady-state) em 3 a 14 dias de uso contínuo',
      },
      interactions: [
        {
          interactingSubstance: 'Álcool e Depressores do SNC (Benzodiazepínicos, Opioides)',
          severity: 'Grave' as const,
          effect: 'Efeito sinérgico depressor no SNC, acentuando sedação, incoordenação motora e depressão respiratória.',
          conduct: 'Orientar abstinência alcoólica e monitorar sedação.',
        },
        {
          interactingSubstance: 'Outros Anticonvulsivantes e Anticoncepcionais Orais',
          severity: 'Moderada' as const,
          effect: 'Alteração recíproca de níveis séricos por indução (ex: Carbamazepina/Fenitoína) ou inibição enzimática (ex: Valproato).',
          conduct: 'Avaliar necessidade de monitorização terapêutica e método contraceptivo adicional.',
        },
      ],
      pregnancy: 'D' as const,
      pearls:
        'Portaria SVS/MS 344/98 (Lista C1): Receita de Controle Especial em 2 vias (validade de 30 dias). Regra de Ouro de Deontologia: para ANTICONVULSIVANTES e ANTIPARKINSONIANOS, a legislação permite dispensar quantidade para até 180 DIAS (6 meses) de tratamento! Nunca suspender abruptamente pelo risco de Estado de Mal Epiléptico.',
    };
  }

  if (c.includes('N6A') || c.includes('ANTIDEPRESSIVO')) {
    return {
      mechanism:
        'Modula a neurotransmissão monoaminérgica central (serotonina 5-HT, noradrenalina NE e/ou dopamina DA) na fenda sináptica por inibição seletiva de recaptação neuronal (SERT/NET) ou modulação de receptores pré e pós-sinápticos, promovendo neuroplasticidade (BDNF) e dessensibilização adaptativa de autorreceptores após 2 a 4 semanas.',
      indications: [
        'Transtorno Depressivo Maior (TDM)',
        'Transtornos de Ansiedade Generalizada (TAG), Transtorno do Pânico, TOC ou TEPT conforme bula',
      ],
      contraindications: [
        'Uso concomitante ou em até 14 dias do uso de Inibidores da Monoaminoxidase (IMAO)',
        'Hipersensibilidade conhecida ao fármaco',
      ],
      commonRam: ['Náuseas, alteração do hábito intestinal, xerostomia (boca seca)', 'Cefaleia, insônia ou sonolência inicial, disfunção sexual'],
      seriousRam: [
        'Síndrome Serotoninérgica (se associado a outros agentes serotoninérgicos)',
        'Hiponatremia por SIADH (especialmente em idosos) e risco de virada maníaca no transtorno bipolar',
      ],
      pk: {
        bioavailability: 'Boa absorção oral (com ou sem alimentos conforme molécula)',
        halfLife: '20 a 36 horas na maioria dos representantes (permitindo dose única diária)',
        metabolism: 'Hepático extenso via isoenzimas do citocromo P450 (CYP2D6, CYP2C19, CYP3A4)',
        excretion: 'Renal e Fecal (predominantemente como metabólitos)',
        onset: 'Latência clínica de 2 a 4 semanas para resposta antidepressiva plena',
      },
      interactions: [
        {
          interactingSubstance: 'IMAO, Tramadol, Triptanos, Lítio, Linezolida',
          severity: 'Grave' as const,
          effect: 'Risco de Síndrome Serotoninérgica aguda (hipertermia, clônus, agitação, taquicardia).',
          conduct: 'Evitar associação ou monitorar sinais neuromusculares e autonômicos.',
        },
      ],
      pregnancy: 'C' as const,
      pearls:
        'Portaria 344/98 (Lista C1): Retenção da 1ª via da Receita de Controle Especial (validade de 30 dias, máximo 60 dias de tratamento). Orientar o paciente que os efeitos colaterais surgem na 1ª semana, mas o benefício terapêutico no humor leva de 2 a 4 semanas.',
    };
  }

  if (c.includes('N5B') || c.includes('N5C') || s.includes('ZEPAM') || s.includes('ZOLAM') || s.includes('ZOLPIDEM')) {
    return {
      mechanism:
        'Atua como modulador alostérico positivo no complexo receptor GABA-A, aumentando a afinidade do GABA e a frequência de abertura dos canais de cloreto (Cl⁻), promovendo hiperpolarização neuronal com efeito ansiolítico, hipnótico, sedativo, miorrelaxante e anticonvulsivante.',
      indications: [
        'Transtornos de ansiedade aguda ou generalizada, transtorno do pânico e insônia (uso de curta duração)',
        'Adjuvante em crises convulsivas ou espasmos musculares conforme apresentação',
      ],
      contraindications: [
        'Insuficiência respiratória severa e Síndrome da Apneia Obstrutiva do Sono não tratada',
        'Miastenia Gravis e Glaucoma agudo de ângulo fechado',
      ],
      commonRam: ['Sonolência residual diurna, sedação, tontura, ataxia (incoordenação motora)', 'Amnésia anterógrada e redução de reflexos psicomotores'],
      seriousRam: [
        'Desenvolvimento de tolerância, dependência física/psíquica e síndrome de abstinência na retirada abrupta',
        'Depressão respiratória (especialmente com álcool/opioides) e quedas com fratura em idosos (Critérios de Beers)',
      ],
      pk: {
        bioavailability: 'Elevada por via oral (> 80%)',
        halfLife: 'Variável conforme fármaco (curta no Midazolam/Zolpidem; longa no Diazepam/Clonazepam)',
        metabolism: 'Hepático via CYP3A4 e/ou conjugação com ácido glicurônico',
        excretion: 'Renal (metabólitos conjugados)',
        onset: 'Rápido início de ação (15 a 45 minutos por via oral)',
      },
      interactions: [
        {
          interactingSubstance: 'Álcool (Etanol), Opioides e Anti-histamínicos Sedativos',
          severity: 'Grave' as const,
          effect: 'Depressão aditiva grave do Sistema Nervoso Central e centro respiratório bulbar.',
          conduct: 'Contraindicar ingestão de bebidas alcoólicas.',
        },
      ],
      pregnancy: 'D' as const,
      pearls:
        'Portaria 344/98 (Lista B1 - Psicotrópicos): Exige Notificação de Receita "B" (Azul), com validade de 30 dias e dispensação máxima para 60 dias de tratamento. Evitar uso crônico em idosos devido ao alto risco de quedas e déficit cognitivo.',
    };
  }

  if (c.startsWith('J1') || c.includes('ANTIBI') || c.includes('PENICILINA') || c.includes('CEFALOSPORINA') || c.includes('MACROL') || c.includes('QUINOLONA')) {
    return {
      mechanism:
        'Agente antimicrobiano de ação seletiva sobre estruturas bacterianas (inibição da síntese da parede celular de peptideoglicano, síntese proteica ribossômica 30S/50S ou replicação do DNA bacteriano via DNA-girase/topoisomerase IV), promovendo erradicação bactericida ou bacteriostática do patógeno.',
      indications: [
        'Infecções bacterianas sensíveis do trato respiratório, urinário, pele e partes moles ou sistêmicas conforme antibiograma e diretrizes clínicas',
      ],
      contraindications: [
        'Hipersensibilidade conhecida à classe antimicrobiana ou histórico de reação anafilática prévia ao grupo químico',
      ],
      commonRam: ['Náuseas, diarreia por disbiose da microbiota intestinal, dor abdominal', 'Candidíase oral/vaginal ou exantema cutâneo'],
      seriousRam: [
        'Reações de hipersensibilidade imediata (anafilaxia / angioedema)',
        'Colite pseudomembranosa por Clostridioides difficile',
      ],
      pk: {
        bioavailability: 'Conforme via de administração (oral ou parenteral)',
        halfLife: 'Determina o regime farmacodinâmico (tempo-dependente T>CIM ou concentração-dependente Cmáx/CIM)',
        metabolism: 'Variável (hepático parcial ou excreção inalterada)',
        excretion: 'Predominantemente renal (filtração glomerular / secreção tubular) ou biliar',
        onset: 'Melhora clínica de febre e sinais infecciosos esperada em 48 a 72 horas',
      },
      interactions: [
        {
          interactingSubstance: 'Anticoagulantes Orais (Varfarina)',
          severity: 'Moderada' as const,
          effect: 'Alteração da flora intestinal produtora de vitamina K e/ou inibição do CYP, podendo elevar o INR.',
          conduct: 'Monitorar coagulograma em pacientes anticoagulados.',
        },
      ],
      pregnancy: 'B' as const,
      pearls:
        'RDC 471/2021 (Antimicrobianos): Receita em 2 vias com validade de 10 DIAS em todo o território nacional (retenção da 2ª via na farmácia). Orientar rigorosamente o paciente a cumprir os horários e completar todo o tempo de tratamento prescrito para evitar resistência bacteriana!',
    };
  }

  if (c.startsWith('M1A') || c.includes('ANTIRREUM') || c.includes('AINE') || c.includes('ANTI-INFLAM')) {
    return {
      mechanism:
        'Inibe a enzima ciclooxigenase (COX-1 e/ou COX-2), bloqueando a conversão do ácido araquidônico em prostaglandinas pró-inflamatórias (PGE2, PGI2) e tromboxanos, resultando em ação anti-inflamatória, analgésica e antipirética.',
      indications: [
        'Processos inflamatórios e dolorosos agudos ou crônicos (osteoartrite, artrite reumatoide, dorsalgias, entorses, dismenorreia, odontalgias)',
      ],
      contraindications: [
        'Úlcera péptica ativa ou hemorragia gastrointestinal',
        'Suspeita de Dengue (risco hemorrágico)',
        'Insuficiência renal grave (TFG < 30 mL/min), insuficiência cardíaca descompensada e 3º trimestre de gestação',
      ],
      commonRam: ['Dispepsia, pirose, epigastralgia, náuseas', 'Retenção hidrossalina e elevação pressórica'],
      seriousRam: [
        'Ulceração, perfuração e sangramento gastrointestinal',
        'Lesão Renal Aguda (vasoconstrição da arteríola aferente) e aumento do risco trombótico cardiovascular',
      ],
      pk: {
        bioavailability: 'Elevada absorção oral (> 80%)',
        halfLife: 'Variável conforme subgrupo (curta nos derivados propiônicos/acéticos; longa nos oxicans)',
        metabolism: 'Hepático (predominantemente via CYP2C9)',
        excretion: 'Renal (como metabólitos conjugados)',
        onset: '30 a 60 minutos para analgesia',
      },
      interactions: [
        {
          interactingSubstance: 'Anti-hipertensivos (IECA / BRA / Diuréticos) e Anticoagulantes',
          severity: 'Grave' as const,
          effect: 'Antagoniza o efeito anti-hipertensivo, aumenta o risco de lesão renal aguda ("Triple Whammy") e potencializa sangramentos.',
          conduct: 'Limitar o uso ao menor tempo possível (3 a 5 dias) e administrar após as refeições.',
        },
      ],
      pregnancy: 'D' as const,
      pearls:
        'Orientação de Balcão: Sempre ingerir junto às refeições com um copo cheio de água para reduzir a agressão direta à mucosa gástrica. Evitar em idosos hipertensos, renais crônicos ou usuários de anticoagulantes.',
    };
  }

  if (c.startsWith('C') || c.includes('HIPERTENS') || c.includes('CARDIO') || c.includes('DIUR') || c.includes('BETABLOQ') || c.includes('ESTATINA')) {
    return {
      mechanism:
        'Atua na regulação hemodinâmica, neuro-hormonal ou metabólica do sistema cardiovascular (modulação do Sistema Renina-Angiotensina-Aldosterona, bloqueio de canais de cálcio/receptores adrenérgicos, natriurese tubular ou inibição da síntese hepática de colesterol), reduzindo morbimortalidade cardiovascular.',
      indications: [
        'Controle da Hipertensão Arterial Sistêmica (HAS), Insuficiência Cardíaca, Cardiopatia Isquêmica ou Dislipidemia conforme classe',
      ],
      contraindications: [
        'Hipersensibilidade ao princípio ativo',
        'Gestação (especialmente para fármacos que atuam no sistema renina-angiotensina e estatinas)',
      ],
      commonRam: ['Tontura postural leve no início do tratamento, cefaleia ou fadiga'],
      seriousRam: [
        'Hipotensão sintomática acentuada, distúrbios hidroeletrolíticos (potássio/sódio) ou rabdomiólise (no caso de hipolipemiantes)',
      ],
      pk: {
        bioavailability: 'Adequada para manutenção em uso contínuo diário',
        halfLife: 'Permite posologia de 1 a 2 tomadas diárias',
        metabolism: 'Hepático e/ou excreção renal conforme lipofilicidade da molécula',
        excretion: 'Renal e/ou Biliar',
        onset: 'Efeito hemodinâmico pleno alcançado após 2 a 4 semanas de uso regular',
      },
      interactions: [
        {
          interactingSubstance: 'Anti-inflamatórios Não Esteroidais (AINEs)',
          severity: 'Moderada' as const,
          effect: 'Retenção de sódio e água, reduzindo a eficácia anti-hipertensiva e sobrecarregando a função renal.',
          conduct: 'Monitorar pressão arterial e evitar automedicação com anti-inflamatórios.',
        },
      ],
      pregnancy: 'C' as const,
      pearls:
        'Atenção Farmacêutica: Medicamento de uso contínuo para prevenção de eventos cardiovasculares maiores (IAM e AVC). Orientar o paciente a nunca interromper o uso por conta própria mesmo quando a pressão arterial ou exames estiverem normalizados.',
    };
  }

  // Perfil farmacológico acadêmico geral para as demais classes da ANVISA
  return {
    mechanism: `Fármaco pertencente à classe terapêutica oficial ANVISA/CMED "${classCodeAndName}". Atua em alvos moleculares específicos (receptores, enzimas ou canais iônicos) modulando a resposta fisiopatológica correspondente à sua indicação clínica aprovada.`,
    indications: [
      `Indicado no manejo clínico dentro da classe terapêutica: ${classCodeAndName}`,
      `Princípio ativo registrado na DCB/ANVISA: ${substancia}`,
    ],
    contraindications: [
      `Hipersensibilidade conhecida a ${substancia} ou a qualquer excipiente da fórmula`,
      'Avaliar função hepatorrenal e restrições específicas na bula oficial ANVISA do fabricante',
    ],
    commonRam: ['Reações gastrointestinais leves (náuseas, desconforto abdominal) ou cefaleia transitória'],
    seriousRam: ['Reações de hipersensibilidade alérgica ou toxicidade dose-dependente (consultar bula oficial)'],
    pk: {
      bioavailability: 'Conforme forma farmacêutica e via de administração',
      halfLife: 'Consultar seção 3 (Características Farmacológicas) da bula oficial ANVISA',
      metabolism: 'Hepático / Sistêmico',
      excretion: 'Renal e/ou Biliar',
      onset: 'Variável conforme via de administração e apresentação',
    },
    interactions: [
      {
        interactingSubstance: 'Polifarmácia e Indutores/Inibidores de CYP450',
        severity: 'Moderada' as const,
        effect: 'Potencial alteração de biodisponibilidade ou efeito farmacodinâmico aditivo.',
        conduct: 'Revisar farmacoterapia completa do paciente e consultar bula ANVISA.',
      },
    ],
    pregnancy: 'C' as const,
    pearls: `Registro oficial ativo na base de Dados Abertos da ANVISA / CMED. Exigência regulatória: ${tarja}. Sempre conferir a apresentação, concentração e laboratório na dispensação farmacêutica.`,
  };
}

export function convertAnvisaToMedication(rec: AnvisaCompactRecord): Medication {
  const relatedBrands = substanceToBrandsMap.get(rec.s.toUpperCase()) || [];
  const englishInn = dcbToEnglishInn(rec.s);
  const classCode = rec.c.includes(' - ') ? rec.c.split(' - ')[0].trim() : 'ANVISA';
  const className = rec.c.includes(' - ') ? rec.c.split(' - ').slice(1).join(' - ').trim() : rec.c;
  const knowledge = getAcademicClassKnowledge(rec.c, rec.j, rec.s);

  // Extrai concentrações das apresentações (ex: "250 MG", "50 MG/ML")
  const concSet = new Set<string>();
  for (const ap of rec.a) {
    const match = ap.match(/^\d+[,.]?\d*\s*(?:MG\/ML|MCG\/ML|UI\/ML|MG\/G|MG|MCG|G|UI|%)(?:\s*\+\s*\d+[,.]?\d*\s*(?:MG\/ML|MCG\/ML|MG|MCG|G|UI|%))*/i);
    if (match) concSet.add(match[0].trim());
  }

  // Identifica vias de administração pelas siglas da ANVISA nas apresentações
  const routes = new Set<string>();
  const apJoined = rec.a.join(' ').toUpperCase();
  if (apJoined.includes('COM') || apJoined.includes('CAP') || apJoined.includes('XPE') || apJoined.includes('SUS OR') || apJoined.includes('SOL OR') || apJoined.includes('GOT')) {
    routes.add('Oral');
  }
  if (apJoined.includes('INJ') || apJoined.includes('EV') || apJoined.includes('IV') || apJoined.includes('IM') || apJoined.includes('SC')) {
    routes.add('Parenteral / Injetável');
  }
  if (apJoined.includes('CREM') || apJoined.includes('POM') || apJoined.includes('GEL') || apJoined.includes('DERM')) {
    routes.add('Tópica / Dermatológica');
  }
  if (apJoined.includes('OFT') || apJoined.includes('COL')) {
    routes.add('Oftálmica');
  }
  if (apJoined.includes('NAS') || apJoined.includes('INAL') || apJoined.includes('AER')) {
    routes.add('Inalatória / Nasal');
  }
  if (routes.size === 0) routes.add('Conforme apresentação comercial');

  const slug = normalizePlain(`${rec.p}-${rec.s}-${rec.r}`).replace(/[^a-z0-9]+/g, '-');

  return {
    id: `anvisa-${slug}`,
    name: `${rec.p} (${rec.t} — ${rec.l.split(' ')[0]})`,
    activeIngredient: rec.s,
    englishActiveIngredient: englishInn,
    anvisaRegistry: rec.r || 'Registrado ANVISA',
    atcCode: classCode,
    therapeuticClass: className || 'Medicamento Registrado ANVISA',
    pharmacologicalGroup: `${rec.t} • Laboratório: ${rec.l}${rec.h ? ' • Uso Hospitalar' : ''}`,
    mechanismOfAction: knowledge.mechanism,
    genericsAndSimilars:
      relatedBrands.length > 0
        ? relatedBrands
        : [`${rec.p} (${rec.t} — ${rec.l})`],
    presentations:
      rec.a.length > 0
        ? rec.a
        : ['Apresentação comercial registrada na ANVISA'],
    concentrations:
      concSet.size > 0 ? Array.from(concSet) : ['Ver apresentação comercial'],
    routeOfAdministration: Array.from(routes),
    indications: knowledge.indications,
    contraindications: knowledge.contraindications,
    adverseEffects: {
      common: knowledge.commonRam,
      serious: knowledge.seriousRam,
    },
    dosageGuide: {
      adult: `Conforme apresentação comercial (${rec.a[0] || rec.p}) e prescrição médica. Consulte a bula oficial ANVISA.`,
      pediatric: 'Avaliar faixa etária, peso corporal e apresentação pediátrica aprovada em bula.',
      maxDailyDose: 'Respeitar o limite posológico máximo descrito na bula oficial ANVISA.',
      renalAdjustment: 'Avaliar necessidade de ajuste posológico em insuficiência renal ou hepática.',
    },
    pharmacokinetics: {
      bioavailability: knowledge.pk.bioavailability,
      halfLife: knowledge.pk.halfLife,
      metabolism: knowledge.pk.metabolism,
      excretion: knowledge.pk.excretion,
      onsetOfAction: knowledge.pk.onset,
    },
    interactions: knowledge.interactions,
    pregnancyCategory: knowledge.pregnancy,
    lactationSafety: 'Consultar bula oficial da ANVISA e critérios de segurança na amamentação.',
    prescriptionType: normalizePrescriptionType(rec.j),
    clinicalPearls: knowledge.pearls,
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery = (searchParams.get('q') || '').trim();
  const query = rawQuery.slice(0, 120);

  const parsedLimit = Number.parseInt(searchParams.get('limit') || '30', 10);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 80)
    : 30;

  if (!query || query.length < 2) {
    return NextResponse.json({
      totalCatalogProducts: ANVISA_DB.length,
      totalSubstances: substanceToBrandsMap.size,
      results: [],
    });
  }

  const qPlain = normalizePlain(query);
  const qPhonetic = normalizePhonetic(query);
  const tokensPlain = qPlain.split(/\s+/).filter(Boolean).slice(0, 8);
  const tokensPhonetic = qPhonetic.split(/\s+/).filter(Boolean).slice(0, 8);

  const scored: { score: number; rec: AnvisaCompactRecord }[] = [];

  for (const entry of INDEXED_ANVISA_DB) {
    const { rec, pPlain, sPlain, pPhon, sPhon, cPlain, cPhon, aPlain } = entry;

    let score = 0;

    // 1. Correspondência exata ou prefixo no nome comercial (ex: DEPAKENE)
    if (pPlain === qPlain || pPhon === qPhonetic) {
      score += 1000;
    } else if (pPlain.startsWith(qPlain) || (qPhonetic.length >= 3 && pPhon.startsWith(qPhonetic))) {
      score += 700;
    } else if (pPlain.includes(qPlain) || (qPhonetic.length >= 3 && pPhon.includes(qPhonetic))) {
      score += 450;
    }

    // 2. Correspondência no princípio ativo (DCB)
    if (sPlain === qPlain || sPhon === qPhonetic) {
      score += 850;
    } else if (sPlain.startsWith(qPlain) || (qPhonetic.length >= 3 && sPhon.startsWith(qPhonetic))) {
      score += 550;
    } else if (sPlain.includes(qPlain) || (qPhonetic.length >= 3 && sPhon.includes(qPhonetic))) {
      score += 350;
    }

    // 3. Correspondência por múltiplos termos (ex: "depakene 500" ou "valproato xarope")
    if (score === 0 && tokensPhonetic.length > 1) {
      const fullHaystackPlain = `${pPlain} ${sPlain} ${cPlain} ${aPlain}`;
      const fullHaystackPhon = `${pPhon} ${sPhon} ${cPhon}`;
      const allMatch = tokensPhonetic.every(
        (t, idx) => fullHaystackPhon.includes(t) || fullHaystackPlain.includes(tokensPlain[idx] || t)
      );
      if (allMatch) {
        score += 250;
      }
    }

    // 4. Correspondência na classe terapêutica
    if (score === 0 && cPlain.includes(qPlain)) {
      score += 120;
    }

    if (score > 0) {
      // Prioriza medicamento de Referência ("Novo") e Genérico no topo
      if (rec.t === 'Novo') score += 45;
      else if (rec.t === 'Genérico') score += 30;
      else if (rec.t === 'Similar') score += 15;

      scored.push({ score, rec });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.rec.p.localeCompare(b.rec.p, 'pt-BR'));

  const results = scored.slice(0, limit).map((item) => convertAnvisaToMedication(item.rec));

  return NextResponse.json({
    totalCatalogProducts: ANVISA_DB.length,
    totalSubstances: substanceToBrandsMap.size,
    totalMatches: scored.length,
    results,
  });
}
