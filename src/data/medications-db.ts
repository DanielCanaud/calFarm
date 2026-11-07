import { Medication } from '@/types/pharma';

export const MEDICATIONS_DB: Medication[] = [
  {
    id: 'dipirona-monoidratada',
    name: 'Novalgina (Dipirona Monoidratada)',
    activeIngredient: 'Dipirona Monoidratada (Metamizol Sódico)',
    englishActiveIngredient: 'metamizole',
    anvisaRegistry: '1.8326.0354',
    atcCode: 'N02BB02',
    therapeuticClass: 'Analgésico e Antitérmico',
    pharmacologicalGroup: 'Derivado Pirazolônico Não-Opioide',
    mechanismOfAction:
      'Pró-fármaco metabolizado em 4-N-metilaminoantipirina (4-MAA). Inibe a síntese de prostaglandinas (especialmente COX-3 central e COX-1/2 periférica), ativa a via óxido nítrico-GMPc-canais de potássio nos nociceptores periféricos e exerce ação antinociceptiva central com efeito espasmolítico.',
    genericsAndSimilars: [
      'Dipirona Monoidratada Genérico (Medley, EMS, Eurofarma, Prati-Donaduzzi)',
      'Anador',
      'Magnopyrol',
      'Maxalgina',
      'Dorona',
    ],
    presentations: [
      'Comprimido simples 500 mg e 1 g',
      'Solução oral (gotas) 500 mg/mL (1 mL = 20 gotas)',
      'Xarope / Solução oral 50 mg/mL',
      'Solução injetável 500 mg/mL (ampola 2 mL e 5 mL)',
      'Supositório infantil 300 mg',
    ],
    concentrations: ['500 mg', '1000 mg (1 g)', '500 mg/mL', '50 mg/mL'],
    routeOfAdministration: ['Oral', 'Intramuscular (IM)', 'Endovenosa (EV lenta)', 'Retal'],
    indications: [
      'Manifestações dolorosas agudas e crônicas (cefaleia, odontalgia, cólicas renais e biliares, dor pós-operatória)',
      'Estados febris refratários a outras medidas',
    ],
    contraindications: [
      'Hipersensibilidade à dipirona ou a outros derivados pirazolônicos',
      'Função da medula óssea prejudicada ou doenças do sistema hematopoiético (histórico de agranulocitose)',
      'Broncoespasmo ou reações anafilactoides induzidas por AINEs (asma por analgésicos)',
      'Porfiria hepática aguda intermitente e deficiência congênita de G6PD',
      'Menores de 3 meses de idade ou pesando menos de 5 kg',
      'Gravidez (especialmente 1º e 3º trimestres)',
    ],
    adverseEffects: {
      common: [
        'Hipotensão arterial transitória (especialmente após infusão EV rápida)',
        'Coloração avermelhada na urina (excreção do metabólito ácido rubazônico — inofensivo)',
        'Náuseas ou desconforto epigástrico leve',
      ],
      serious: [
        'Agranulocitose, leucopenia e trombocitopenia (raro, porém grave — monitorar febre e odinofagia)',
        'Reação anafilática / choque anafilático e Síndrome de Kounis',
        'Síndrome de Stevens-Johnson (SSJ) e Necrólise Epidérmica Tóxica (NET)',
      ],
    },
    dosageGuide: {
      adult: '500 mg a 1.000 mg (1 g) VO ou 20 a 40 gotas (500 mg/mL) a cada 6 horas.',
      pediatric: '10 a 15 mg/kg/dose a cada 6 horas (1 gota/kg da solução 500 mg/mL equivale a 25 mg/kg — atenção para não superdosar; dose usual prática: 0,5 a 0,8 gota/kg/dose).',
      maxDailyDose: '4.000 mg/dia (4 g/dia) em adultos.',
      renalAdjustment: 'Em insuficiência renal ou hepática, evitar doses elevadas repetidas devido à redução na taxa de eliminação dos metabólitos ativos.',
    },
    pharmacokinetics: {
      bioavailability: '85% a 93% (do metabólito ativo 4-MAA após hidrólise gástrica)',
      halfLife: '2,6 a 3,5 horas (metabólito ativo 4-MAA)',
      metabolism: 'Hidrólise rápida no suco gástrico para 4-MAA, seguido de metabolização hepática para 4-AA',
      excretion: 'Renal (~90% na forma de metabólitos)',
      onsetOfAction: '30 a 60 minutos (via oral); 15 minutos (parenteral)',
      proteinBinding: '58% (4-MAA)',
    },
    interactions: [
      {
        interactingSubstance: 'Ciclosporina / Tacrolimo',
        severity: 'Moderada',
        effect: 'Redução dos níveis séricos da ciclosporina por indução enzimática leve.',
        conduct: 'Monitorar concentrações séricas do imunossupressor.',
      },
      {
        interactingSubstance: 'Metotrexato',
        severity: 'Grave',
        effect: 'Aumento da hematotoxicidade do metotrexato, especialmente em idosos.',
        conduct: 'Evitar uso concomitante.',
      },
      {
        interactingSubstance: 'Ácido Acetilsalicílico (AAS) em baixa dose',
        severity: 'Moderada',
        effect: 'A dipirona pode reduzir o efeito antiagregante plaquetário do AAS (competição na COX-1 plaquetária).',
        conduct: 'Administrar o AAS pelo menos 30 a 60 minutos antes da dipirona.',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Evitar amamentação durante e por até 48 horas após o uso devido à excreção dos metabólitos no leite materno.',
    prescriptionType: 'MIP (Isento de Prescrição)',
    clinicalPearls:
      'Atenção na dispensação pediátrica: na apresentação gotas 500 mg/mL, 1 mL = 20 gotas, logo 1 gota = 25 mg. A administração EV deve ser feita lentamente (máximo 1 mL/min) com o paciente deitado para prevenir queda brusca de pressão arterial.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'paracetamol',
    name: 'Tylenol (Paracetamol / Acetaminofeno)',
    activeIngredient: 'Paracetamol (Acetaminofeno)',
    englishActiveIngredient: 'acetaminophen',
    anvisaRegistry: '1.5721.0012',
    atcCode: 'N02BE01',
    therapeuticClass: 'Analgésico e Antitérmico',
    pharmacologicalGroup: 'Derivado do Para-aminofenol',
    mechanismOfAction:
      'Inibe a síntese de prostaglandinas predominantemente no Sistema Nervoso Central (SNC) e bloqueia a geração do impulso doloroso periférico. Atua também através do metabólito AM404 modulando receptores canabinoides CB1 e canais TRPV1.',
    genericsAndSimilars: [
      'Paracetamol Genérico (EMS, Medley, Eurofarma, Neo Química)',
      'Dorfen',
      'Cimegripe (associação)',
      'Tylenol Sinus (associação)',
    ],
    presentations: [
      'Comprimido revestido 500 mg e 750 mg',
      'Solução oral (gotas) 200 mg/mL (1 mL = 15 gotas)',
      'Suspensão oral pediátrica 100 mg/mL e 32 mg/mL',
    ],
    concentrations: ['500 mg', '750 mg', '200 mg/mL', '100 mg/mL'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Redução da febre e alívio temporário de dores leves a moderadas (cefaleia, mialgia, artralgia, dismenorreia, dor associada a resfriados e pós-vacinação)',
      'Analgésico de escolha em gestantes e pacientes com suspeita de Dengue',
    ],
    contraindications: [
      'Hipersensibilidade ao paracetamol',
      'Insuficiência hepática grave ou doença hepática ativa descompensada',
    ],
    adverseEffects: {
      common: ['Raros em doses terapêuticas; ocasionalmente náuseas ou erupção cutânea leve'],
      serious: [
        'Hepatotoxicidade aguda dose-dependente / Necrose hepática fulminante (em superdosagem > 150 mg/kg ou > 7,5–10 g em adultos)',
        'Reações cutâneas graves raras ( pustulose exantemática generalizada aguda, SSJ)',
      ],
    },
    dosageGuide: {
      adult: '500 mg a 1.000 mg a cada 4 a 6 horas, ou 750 mg a cada 6 a 8 horas.',
      pediatric: '10 a 15 mg/kg/dose a cada 4 a 6 horas (máximo 5 doses em 24 horas).',
      maxDailyDose: '4.000 mg/dia (4 g/dia) em adultos saudáveis; máximo 2.000 mg/dia em etilistas crônicos ou hepatopatas leves.',
      renalAdjustment: 'ClCr 10-50 mL/min: intervalo de 6h; ClCr < 10 mL/min: intervalo de 8h.',
    },
    pharmacokinetics: {
      bioavailability: '70% a 90%',
      halfLife: '2 a 3 horas (pode chegar a > 4h na hepatotoxicidade)',
      metabolism: 'Hepático: ~90% conjugação (glicuronidação e sulfatação); ~5-10% oxidado pelo CYP2E1 formando o metabólito reativo hepatotóxico NAPQI (neutralizado pela glutationa)',
      excretion: 'Renal (< 5% inalterado)',
      onsetOfAction: '15 a 30 minutos',
      proteinBinding: '10% a 25%',
    },
    interactions: [
      {
        interactingSubstance: 'Álcool (Etanol)',
        severity: 'Grave',
        effect: 'Indução da CYP2E1 e depleção de glutationa, aumentando drasticamente a formação de NAPQI e o risco de necrose hepática.',
        conduct: 'Orientar abstinência alcoólica durante o tratamento.',
      },
      {
        interactingSubstance: 'Varfarina',
        severity: 'Moderada',
        effect: 'Uso regular de doses > 2 g/dia de paracetamol por vários dias pode elevar o INR e o risco de sangramento.',
        conduct: 'Monitorar INR caso o paciente utilize paracetamol continuamente.',
      },
    ],
    pregnancyCategory: 'B',
    lactationSafety: 'Compatível com a amamentação (excretado em quantidades mínimas no leite materno).',
    prescriptionType: 'MIP (Isento de Prescrição)',
    clinicalPearls:
      'Conceito clássico de Toxicologia/Farmacologia Clínica: Na intoxicação por paracetamol, o antídoto específico é a N-Acetilcisteína (NAC), que atua repondo os estoques hepáticos de glutationa para inativar o metabólito tóxico NAPQI.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'ibuprofeno',
    name: 'Advil / Alivium (Ibuprofeno)',
    activeIngredient: 'Ibuprofeno',
    englishActiveIngredient: 'ibuprofen',
    anvisaRegistry: '1.7817.0092',
    atcCode: 'M01AE01',
    therapeuticClass: 'Anti-inflamatório Não Esteroidal (AINE), Analgésico e Antitérmico',
    pharmacologicalGroup: 'Derivado do Ácido Propiônico (Inibidor não seletivo de COX-1 e COX-2)',
    mechanismOfAction:
      'Inibe reversivelmente as enzimas ciclooxigenase-1 (COX-1) e ciclooxigenase-2 (COX-2), reduzindo a conversão de ácido araquidônico em prostaglandinas (PGE2, PGI2) e tromboxano A2, diminuindo inflamação, dor e febre.',
    genericsAndSimilars: [
      'Ibuprofeno Genérico (Medley, Prati-Donaduzzi, Neo Química, Biosintética)',
      'Buscofem ( Cápsula líquida 400 mg)',
      'Ibuflex',
      'Spidufen (Ibuprofeno Arginina)',
    ],
    presentations: [
      'Comprimido revestido 200 mg, 400 mg e 600 mg',
      'Cápsula gelatinosa mole 400 mg',
      'Suspensão oral gotas 50 mg/mL e 100 mg/mL',
    ],
    concentrations: ['200 mg', '400 mg', '600 mg', '50 mg/mL', '100 mg/mL'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Processos inflamatórios osteomusculares, artrite reumatoide, osteoartrite',
      'Dismenorreia primária, odontalgia pós-extração, cefaleia tensional e enxaqueca',
      'Febre em adultos e crianças (> 6 meses)',
    ],
    contraindications: [
      'Úlcera péptica ativa, sangramento ou perfuração gastrointestinal',
      'Suspeita ou confirmação de Dengue (risco de sangramento por inibição plaquetária)',
      'Insuficiência renal, hepática ou cardíaca grave',
      'Terceiro trimestre de gestação (risco de fechamento prematuro do canal arterial fetal)',
      'Tríade da aspirina (asma, rinite com pólipos nasais e intolerância ao AAS)',
    ],
    adverseEffects: {
      common: ['Dispepsia, pirose, epigastralgia, náuseas', 'Retenção hídrica leve e elevação da pressão arterial'],
      serious: [
        'Úlcera gastroduodenal e hemorragia digestiva alta',
        'Lesão renal aguda (vasoconstrição da arteríola aferente glomerular)',
        'Eventos trombóticos cardiovasculares em uso prolongado',
      ],
    },
    dosageGuide: {
      adult: 'Analgésico/Antitérmico: 200 a 400 mg a cada 4 a 6h. Anti-inflamatório: 400 a 800 mg a cada 6 a 8h.',
      pediatric: '5 a 10 mg/kg/dose a cada 6 a 8 horas (máximo 40 mg/kg/dia).',
      maxDailyDose: '2.400 mg/dia (ou até 3.200 mg/dia sob supervisão médica estrita em reumatologia).',
      renalAdjustment: 'Evitar se TFG < 30 mL/min.',
    },
    pharmacokinetics: {
      bioavailability: '> 80%',
      halfLife: '1,8 a 2 horas',
      metabolism: 'Hepático via CYP2C9 (oxidação em metabólitos inativos)',
      excretion: 'Renal (> 90% como metabólitos e conjugados)',
      onsetOfAction: '30 minutos (analgesia); 1 a 2 semanas (efeito anti-inflamatório pleno)',
      proteinBinding: '99%',
    },
    interactions: [
      {
        interactingSubstance: 'IECA (Enalapril, Captopril) / BRA (Losartana) + Diuréticos',
        severity: 'Grave',
        effect: 'Redução do efeito anti-hipertensivo e risco de Lesão Renal Aguda ("Triple Whammy" / Triplo Golpe Renal).',
        conduct: 'Evitar associação, especialmente em idosos ou desidratados; monitorar função renal e PA.',
      },
      {
        interactingSubstance: 'Anticoagulantes (Varfarina, Rivaroxabana) e Antiagregantes',
        severity: 'Grave',
        effect: 'Sinergismo no risco de sangramento gastrointestinal.',
        conduct: 'Preferir paracetamol ou dipirona para analgesia.',
      },
      {
        interactingSubstance: 'Lítio',
        severity: 'Grave',
        effect: 'Reduz o clearance renal de lítio, elevando litemia a níveis tóxicos.',
        conduct: 'Evitar AINEs em usuários de carbonato de lítio.',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Compatível com a amamentação (baixa transferência para o leite materno).',
    prescriptionType: 'MIP (Isento de Prescrição)',
    clinicalPearls:
      'Isento de prescrição nas concentrações de 200 mg, 400 mg e gotas 50/100 mg/mL; a apresentação de 600 mg exige receita simples (tarja vermelha). Recomendar ingestão junto às refeições para reduzir irritação gástrica.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'amoxicilina',
    name: 'Amoxil (Amoxicilina Tri-hidratada)',
    activeIngredient: 'Amoxicilina Tri-hidratada',
    englishActiveIngredient: 'amoxicillin',
    anvisaRegistry: '1.0107.0189',
    atcCode: 'J01CA04',
    therapeuticClass: 'Antibiótico / Antimicrobiano',
    pharmacologicalGroup: 'Penicilina Semissintética (Aminopenicilina Beta-Lactâmica)',
    mechanismOfAction:
      'Antibiótico bactericida tempo-dependente. Liga-se às Proteínas Ligadoras de Penicilina (PBPs) na parede celular bacteriana, inibindo a etapa final de transpeptidação da síntese do peptideoglicano, levando à lise osmótica da bactéria.',
    genericsAndSimilars: [
      'Amoxicilina Genérico (EMS, Eurofarma, Medley, Sandoz, Teuto)',
      'Velamox',
      'Novocilin',
      'Clavulin (associada ao Clavulanato de Potássio)',
    ],
    presentations: [
      'Cápsula / Comprimido 500 mg e 875 mg',
      'Pó para suspensão oral 250 mg/5 mL (50 mg/mL) e 400 mg/5 mL (80 mg/mL)',
    ],
    concentrations: ['500 mg', '875 mg', '250 mg/5 mL', '400 mg/5 mL'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Infecções do trato respiratório superior e inferior (faringoamigdalite estreptocócica, otite média aguda, rinossinusite aguda, pneumonia adquirida na comunidade)',
      'Infecções odontogênicas e profilaxia de endocardite bacteriana',
      'Erradicação do Helicobacter pylori (em esquema tríplice com IBP e Claritromicina)',
    ],
    contraindications: [
      'Hipersensibilidade às penicilinas ou histórico de reação alérgica grave imediata a outros beta-lactâmicos (cefalosporinas, carbapenêmicos)',
      'Suspeita de Mononucleose Infecciosa (vírus Epstein-Barr) devido à alta incidência de exantema maculopapular',
    ],
    adverseEffects: {
      common: ['Diarreia, náuseas, desconforto abdominal', 'Candidíase oral ou vulvovaginal por alteração da microbiota', 'Exantema cutâneo (rash)'],
      serious: [
        'Reação anafilática imediata mediada por IgE (urticária, angioedema, broncoespasmo)',
        'Colite pseudomembranosa associada ao Clostridioides difficile',
      ],
    },
    dosageGuide: {
      adult: '500 mg a cada 8 horas ou 875 mg a cada 12 horas por 7 a 10 dias.',
      pediatric: 'Dose padrão: 40 a 50 mg/kg/dia divididos de 8/8h ou 12/12h. Dose dobrada (Otite/Sinusite/Pneumonia por pneumococo resistente): 80 a 90 mg/kg/dia.',
      maxDailyDose: '3.000 mg/dia (3 g/dia) em adultos.',
      renalAdjustment: 'TFG 10-30 mL/min: 250-500 mg a cada 12h; TFG < 10 mL/min: 250-500 mg a cada 24h.',
    },
    pharmacokinetics: {
      bioavailability: '75% a 90% (não sofre interferência significativa dos alimentos)',
      halfLife: '1 a 1,5 hora',
      metabolism: 'Parcialmente hidrolisada em ácido peniciloico inativo (< 30%)',
      excretion: 'Renal (~60-80% inalterada na urina em 6h por secreção tubular)',
      onsetOfAction: 'Pico sérico (Tmáx) em 1 a 2 horas',
      proteinBinding: '17% a 20%',
    },
    interactions: [
      {
        interactingSubstance: 'Alopurinol',
        severity: 'Moderada',
        effect: 'Aumenta significativamente a incidência de rash cutâneo induzido por amoxicilina.',
        conduct: 'Monitorar surgimento de lesões cutâneas.',
      },
      {
        interactingSubstance: 'Probenecida',
        severity: 'Leve',
        effect: 'Inibe competitivamente a secreção tubular renal da amoxicilina, prolongando sua meia-vida e níveis séricos.',
        conduct: 'Por vezes utilizado intencionalmente em protocolos específicos; monitorar se não intencional.',
      },
      {
        interactingSubstance: 'Anticoncepcionais Orais Combinados',
        severity: 'Leve',
        effect: 'Possível redução mínima da circulação entero-hepática do etinilestradiol em caso de diarreia intensa.',
        conduct: 'Orientar método de barreira adicional apenas se houver vômitos ou diarreia severa.',
      },
    ],
    pregnancyCategory: 'B',
    lactationSafety: 'Compatível com a amamentação.',
    prescriptionType: 'Retenção de Receita (Antimicrobiano / Controle Especial C1)',
    clinicalPearls:
      'RDC 20/2011 (atualizada pela RDC 471/2021): Receita de antimicrobiano tem validade de 10 dias em todo o território nacional e exige retenção da 2ª via na farmácia. Orientar o paciente sobre reconstituição da suspensão com água filtrada até a marca do frasco e validade após aberto (geralmente 7 a 14 dias).',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'azitromicina',
    name: 'Zitromax (Azitromicina Di-hidratada)',
    activeIngredient: 'Azitromicina Di-hidratada',
    englishActiveIngredient: 'azithromycin',
    anvisaRegistry: '1.0216.0041',
    atcCode: 'J01FA10',
    therapeuticClass: 'Antibiótico / Antimicrobiano',
    pharmacologicalGroup: 'Macrolídeo (Azalídeo)',
    mechanismOfAction:
      'Antibiótico bacteriostático (bactericida em altas concentrações contra certos patógenos). Liga-se reversivelmente à subunidade ribossômica 50S bacteriana (rRNA 23S), bloqueando a translocação de peptídeos e inibindo a síntese proteica dependente de RNA.',
    genericsAndSimilars: [
      'Azitromicina Genérico (EMS, Medley, Eurofarma, Sandoz, Prati-Donaduzzi)',
      'Astro',
      'Azi',
      'Zitromil',
    ],
    presentations: [
      'Comprimido revestido 500 mg e 1.000 mg',
      'Pó para suspensão oral 200 mg/5 mL (40 mg/mL) — frascos de 600 mg, 900 mg e 1.500 mg',
    ],
    concentrations: ['500 mg', '1000 mg', '200 mg/5 mL (40 mg/mL)'],
    routeOfAdministration: ['Oral', 'Endovenosa (uso hospitalar)'],
    indications: [
      'Infecções respiratórias por germes atípicos (Mycoplasma pneumoniae, Chlamydia pneumoniae, Legionella) ou alternativa em alérgicos a penicilinas',
      'Uretrites e cervicites não gonocócicas por Chlamydia trachomatis (dose única de 1 g)',
      'Coqueluche (Bordetella pertussis) e diarreia do viajante',
    ],
    contraindications: [
      'Hipersensibilidade à azitromicina, eritromicina ou a qualquer macrolídeo/cetolídeo',
      'Histórico de icterícia colestática ou disfunção hepática associada ao uso prévio de azitromicina',
    ],
    adverseEffects: {
      common: ['Náuseas, diarreia, dor ou cólica abdominal (efeito agonista leve nos receptores de motilina)'],
      serious: [
        'Prolongamento do intervalo QT no ECG e arritmia ventricular (Torsades de Pointes)',
        'Hepatotoxicidade colestática',
        'Ototoxicidade reversível em altas doses prolongadas',
      ],
    },
    dosageGuide: {
      adult: '500 mg em dose única diária por 3 a 5 dias (ou 1.000 mg em dose única para IST por Chlamydia).',
      pediatric: '10 mg/kg/dia em dose única diária por 3 a 5 dias (máximo 500 mg/dia).',
      maxDailyDose: '500 mg/dia (ou 1.000 mg em dose única específica para uretrite/cervicite).',
      renalAdjustment: 'Não requer ajuste de dose na insuficiência renal leve a moderada; cautela se TFG < 10 mL/min.',
    },
    pharmacokinetics: {
      bioavailability: '37% a 38%',
      halfLife: '68 horas (longa meia-vida tecidual graças ao sequestro intracelular em fagócitos e fibroblastos)',
      metabolism: 'Hepático menor (desmetilação); ao contrário da eritromicina e claritromicina, inibe minimamente o CYP3A4',
      excretion: 'Biliar/Fecal (> 50% inalterada) e Renal (~6-12%)',
      onsetOfAction: 'Tmáx em 2 a 3 horas',
      proteinBinding: '7% a 51% (dependente da concentração)',
    },
    interactions: [
      {
        interactingSubstance: 'Fármacos que prolongam o intervalo QT (Amiodarona, Haloperidol, Ondansetrona, Citalopram)',
        severity: 'Grave',
        effect: 'Efeito aditivo no prolongamento do intervalo QT e risco de arritmias ventriculares graves.',
        conduct: 'Avaliar ECG e fatores de risco (hipocalemia, hipomagnesemia, bradicardia) antes de associar.',
      },
      {
        interactingSubstance: 'Antiácidos contendo Alumínio ou Magnésio',
        severity: 'Moderada',
        effect: 'Reduzem a concentração sérica máxima (Cmáx) da azitromicina em até 24%.',
        conduct: 'Espaçar a administração em pelo menos 2 horas.',
      },
    ],
    pregnancyCategory: 'B',
    lactationSafety: 'Compatível com a amamentação.',
    prescriptionType: 'Retenção de Receita (Antimicrobiano / Controle Especial C1)',
    clinicalPearls:
      'Por que a Azitromicina é tomada por apenas 3 ou 5 dias? Devido ao seu enorme volume de distribuição e penetração nos lisossomos de leucócitos, que migram para o sítio infeccioso ("efeito cavalo de Troia") e mantêm concentrações teciduais bactericidas por 5 a 7 dias após o último comprimido.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'losartana-potassica',
    name: 'Cozaar / Aradois (Losartana Potássica)',
    activeIngredient: 'Losartana Potássica',
    englishActiveIngredient: 'losartan',
    anvisaRegistry: '1.0029.0007',
    atcCode: 'C09CA01',
    therapeuticClass: 'Anti-hipertensivo',
    pharmacologicalGroup: 'Bloqueador do Receptor de Angiotensina II (BRA - Subtipo AT1)',
    mechanismOfAction:
      'Antagonista competitivo e seletivo dos receptores AT1 da Angiotensina II no músculo liso vascular e na glândula adrenal. Bloqueia a vasoconstrição e a secreção de aldosterona sem inibir a ECA (enzima conversora de angiotensina), evitando o acúmulo de bradicinina e a tosse seca.',
    genericsAndSimilars: [
      'Losartana Potássica Genérico (EMS, Medley, Eurofarma, Neo Química, Biolab)',
      'Aradois',
      'Corus',
      'Zart',
    ],
    presentations: [
      'Comprimido revestido 25 mg, 50 mg e 100 mg',
      'Associada à Hidroclorotiazida (50/12,5 mg e 100/25 mg)',
    ],
    concentrations: ['25 mg', '50 mg', '100 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Hipertensão Arterial Sistêmica (HAS)',
      'Insuficiência Cardíaca com fração de ejeção reduzida (quando intolerante a IECA)',
      'Nefropatia diabética no Diabetes Mellitus tipo 2 com proteinúria (efeito nefroprotetor)',
    ],
    contraindications: [
      'Gravidez (qualquer trimestre — teratogênico e fetotóxico)',
      'Estenose bilateral da artéria renal',
      'Uso concomitante com Alisquireno em pacientes com diabetes',
    ],
    adverseEffects: {
      common: ['Tontura, hipotensão ortostática leve', 'Hipercalemia (aumento do potássio sérico)'],
      serious: [
        'Insuficiência renal aguda em pacientes com estenose de artéria renal',
        'Angioedema (muito mais raro que nos IECAs, mas possível)',
      ],
    },
    dosageGuide: {
      adult: 'Dose inicial usual: 50 mg 1x ao dia (ou 50 mg 12/12h). Máximo de 100 mg/dia.',
      pediatric: 'Crianças > 6 anos: 0,7 mg/kg 1x ao dia (até 50 mg/dia).',
      maxDailyDose: '100 mg/dia.',
      renalAdjustment: 'Não requer ajuste inicial; monitorar creatinina e potássio sérico.',
    },
    pharmacokinetics: {
      bioavailability: '33% (sofre extenso metabolismo de primeira passagem)',
      halfLife: '2 horas (Losartana) e 6 a 9 horas (metabólito ativo ácido carboxílico E-3174, 10 a 40x mais potente)',
      metabolism: 'Hepático via CYP2C9 e CYP3A4 gerando o metabólito ativo E-3174',
      excretion: 'Fecal/Biliar (~60%) e Renal (~35%)',
      onsetOfAction: 'Pico em 1h (losartana) e 3–4h (metabólito ativo); efeito máximo em 3 a 6 semanas',
      proteinBinding: '98,7%',
    },
    interactions: [
      {
        interactingSubstance: 'Diuréticos Poupadores de Potássio (Espironolactona) / Suplementos de Potássio',
        severity: 'Grave',
        effect: 'Risco elevado de hipercalemia grave e arritmias cardíacas.',
        conduct: 'Monitorar potássio sérico rigorosamente.',
      },
      {
        interactingSubstance: 'AINEs (Ibuprofeno, Diclofenaco, Nimesulida)',
        severity: 'Grave',
        effect: 'Atenuação do efeito anti-hipertensivo e piora aguda da função renal.',
        conduct: 'Evitar uso contínuo de AINEs em hipertensos.',
      },
      {
        interactingSubstance: 'IECA (Enalapril, Captopril)',
        severity: 'Grave',
        effect: 'Duplo bloqueio do Sistema Renina-Angiotensina-Aldosterona aumenta risco de hipotensão, hipercalemia e falência renal sem benefício adicional.',
        conduct: 'Contraindicado associar IECA + BRA.',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Evitar na lactação por falta de dados de segurança (preferir Enalapril, Captopril ou Nifedipino).',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Diferencial farmacológico clássico: A Losartana possui efeito uricosúrico exclusivo entre os BRAs (inibe o transportador renal URAT1), ajudando a reduzir os níveis de ácido úrico em pacientes hipertensos com hiperuricemia ou gota! Além disso, está disponível gratuitamente no Programa Farmácia Popular.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'omeprazol',
    name: 'Losec Mups / Peprazol (Omeprazol)',
    activeIngredient: 'Omeprazol',
    englishActiveIngredient: 'omeprazole',
    anvisaRegistry: '1.0181.0452',
    atcCode: 'A02BC01',
    therapeuticClass: 'Antiulceroso e Antissecretor Gástrico',
    pharmacologicalGroup: 'Inibidor da Bomba de Prótons (IBP - Benzimidazol Substituído)',
    mechanismOfAction:
      'Pró-fármaco básico fraco que se acumula nos canalículos secretores ácidos das células parietais gástricas. Em meio ácido, é convertido na sulfenamida ativa, que se liga covalentemente (irreversivelmente) aos resíduos de cisteína da enzima H+/K+-ATPase (bomba de prótons), bloqueando a etapa final da secreção de ácido clorídrico.',
    genericsAndSimilars: [
      'Omeprazol Genérico (Medley, EMS, Teuto, Cristália, Eurofarma)',
      'Peprazol',
      'Gastrium',
      'Victrix',
    ],
    presentations: [
      'Cápsula dura com microgrânulos gastrorresistentes 10 mg, 20 mg e 40 mg',
      'Pó liofilizado injetável 40 mg',
    ],
    concentrations: ['10 mg', '20 mg', '40 mg'],
    routeOfAdministration: ['Oral', 'Endovenosa (EV)'],
    indications: [
      'Doença do Refluxo Gastroesofágico (DRGE) e esofagite erosiva',
      'Úlcera péptica gástrica e duodenal',
      'Erradicação do Helicobacter pylori (associado a antibióticos)',
      'Profilaxia de úlcera induzida por AINEs e Síndrome de Zollinger-Ellison',
    ],
    contraindications: [
      'Hipersensibilidade ao omeprazol ou a outros benzimidazóis substituídos (pantoprazol, esomeprazol, lansoprazol)',
      'Uso concomitante com Nelfinavir ou Rilpivirina',
    ],
    adverseEffects: {
      common: ['Cefaleia, dor abdominal, diarreia, flatulência, constipação ou náuseas'],
      serious: [
        'Deficiência de Vitamina B12, Hipomagnesemia e redução da absorção de Cálcio/Ferro em uso crônico (> 1 ano)',
        'Aumento do risco de infecções entéricas (Clostridioides difficile) e fraturas osteoporóticas em uso prolongado',
        'Nefrite intersticial aguda (rara)',
      ],
    },
    dosageGuide: {
      adult: '20 mg a 40 mg 1x ao dia, em jejum, 30 minutos antes do café da manhã, por 4 a 8 semanas.',
      pediatric: '1 mg/kg/dia 1x ao dia (crianças > 1 ano: 10 mg a 20 mg/dia).',
      maxDailyDose: '80 mg/dia (ou até 120 mg/dia em Zollinger-Ellison).',
      renalAdjustment: 'Não requer ajuste de dose na insuficiência renal.',
    },
    pharmacokinetics: {
      bioavailability: '30% a 40% (aumenta para ~65% após doses repetidas devido à menor degradação ácida)',
      halfLife: '0,5 a 1 hora no plasma (porém o efeito dura 24–72h devido à ligação covalente irreversível à bomba H+/K+-ATPase)',
      metabolism: 'Hepático extenso via CYP2C19 (principal) e CYP3A4',
      excretion: 'Renal (~80% como metabólitos) e Biliar (~20%)',
      onsetOfAction: '1 hora; inibição máxima em 4 dias de uso contínuo',
      proteinBinding: '95%',
    },
    interactions: [
      {
        interactingSubstance: 'Clopidogrel',
        severity: 'Grave',
        effect: 'O omeprazol inibe a enzima CYP2C19, impedindo a conversão do pró-fármaco Clopidogrel em seu metabólito ativo antiagregante plaquetário, aumentando o risco de trombose/infarto.',
        conduct: 'Substituir o Omeprazol por Pantoprazol (menor inibição da CYP2C19) em pacientes usando Clopidogrel.',
      },
      {
        interactingSubstance: 'Levotiroxina / Sulfato Ferroso / Cetoconazol / Itraconazol',
        severity: 'Moderada',
        effect: 'O aumento do pH gástrico reduz a dissolução e absorção desses fármacos.',
        conduct: 'Espaçar administração e monitorar resposta clínica/TSH.',
      },
    ],
    pregnancyCategory: 'C',
    lactationSafety: 'Compatível com a amamentação.',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Por que o Omeprazol DEVE ser tomado em jejum 30 minutos antes do café da manhã? Porque ele precisa ser absorvido no duodeno e chegar pela corrente sanguínea às células parietais exatamente no momento em que as bombas de prótons são ativadas pelo estímulo alimentar matinal! As cápsulas não devem ser mastigadas pois os microgrânulos possuem revestimento entérico ácido-resistente.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'metformina',
    name: 'Glifage / Glifage XR (Cloridrato de Metformina)',
    activeIngredient: 'Cloridrato de Metformina',
    englishActiveIngredient: 'metformin',
    anvisaRegistry: '1.0089.0196',
    atcCode: 'A10BA02',
    therapeuticClass: 'Antidiabético Oral (Sensibilizador de Insulina)',
    pharmacologicalGroup: 'Biguanida',
    mechanismOfAction:
      'Ativa a proteína quinase ativada por AMP (AMPK) nos hepatócitos e músculo esquelético. Reduz a produção hepática de glicose (gliconeogênese), aumenta a captação periférica de glicose mediada pela insulina e reduz a absorção intestinal de glicose. Não estimula a secreção pancreática de insulina, portanto não causa hipoglicemia em monoterapia.',
    genericsAndSimilars: [
      'Cloridrato de Metformina Genérico (Merck, Prati-Donaduzzi, Medley, Eurofarma)',
      'Glifage XR (Liberação Prolongada)',
      'Dimefor',
      'Glucoformin',
    ],
    presentations: [
      'Comprimido revestido liberação imediata 500 mg e 850 mg',
      'Comprimido de liberação prolongada (XR) 500 mg, 750 mg e 1.000 mg',
    ],
    concentrations: ['500 mg', '750 mg', '850 mg', '1000 mg (1 g)'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Tratamento de primeira linha do Diabetes Mellitus tipo 2 (DM2)',
      'Pré-diabetes / Prevenção do DM2 em pacientes de alto risco',
      'Síndrome dos Ovários Policísticos (SOP) com resistência insulínica',
    ],
    contraindications: [
      'Insuficiência renal grave (Taxa de Filtração Glomerular < 30 mL/min/1,73m²)',
      'Acidose metabólica aguda ou crônica (incluindo cetoacidose diabética)',
      'Insuficiência hepática grave, insuficiência cardíaca descompensada ou hipóxia tecidual aguda/sepse',
    ],
    adverseEffects: {
      common: [
        'Intolerância gastrointestinal: diarreia, náuseas, distensão abdominal, flatulência e gosto metálico (reduzidos na formulação XR)',
        'Redução da absorção ileal de Vitamina B12 (cianocobalamina) em uso prolongado',
      ],
      serious: [
        'Acidose láctica associada à metformina (rara, porém grave, especialmente se houver falência renal aguda)',
      ],
    },
    dosageGuide: {
      adult: 'Iniciar com 500 mg ou 850 mg 1x a 2x ao dia junto às refeições (ou Glifage XR 500–2.000 mg 1x ao dia no jantar). Titular gradualmente.',
      pediatric: 'Crianças ≥ 10 anos: iniciar com 500 mg 1x ou 2x ao dia (máximo 2.000 mg/dia).',
      maxDailyDose: '2.550 mg/dia (liberação imediata) ou 2.000 mg/dia (liberação prolongada XR).',
      renalAdjustment: 'TFG 30-45 mL/min: reduzir dose máxima para 1.000 mg/dia e não iniciar novo tratamento; TFG < 30 mL/min: contraindicado.',
    },
    pharmacokinetics: {
      bioavailability: '50% a 60%',
      halfLife: '4 a 8,7 horas (plasmática)',
      metabolism: 'Não sofre metabolização hepática (0% metabolizada pelo citocromo P450)',
      excretion: 'Renal (100% excretada inalterada na urina por filtração glomerular e secreção tubular via OCT2)',
      onsetOfAction: 'Melhora glicêmica inicial em dias; efeito máximo em 2 semanas',
      proteinBinding: 'Desprezível (0%)',
    },
    interactions: [
      {
        interactingSubstance: 'Contraste Radiológico Iodado Endovenoso',
        severity: 'Grave',
        effect: 'O contraste iodado pode induzir nefropatia aguda, levando ao acúmulo de metformina e acidose láctica.',
        conduct: 'Suspender a metformina no momento ou antes do exame com contraste iodado se TFG < 60 mL/min, reavaliando função renal 48h após.',
      },
      {
        interactingSubstance: 'Cimetidina / Dolutegravir',
        severity: 'Moderada',
        effect: 'Competem pelo transportador tubular renal OCT2, elevando os níveis plasmáticos da metformina.',
        conduct: 'Monitorar tolerância e considerar ajuste da dose de metformina.',
      },
    ],
    pregnancyCategory: 'B',
    lactationSafety: 'Compatível com a amamentação.',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Para minimizar diarreia e náuseas: orientar o paciente a tomar SEMPRE durante ou logo após as refeições (especialmente o jantar na versão XR). Em pacientes com queixa de formigamento (neuropatia) ou anemia em uso crônico de Metformina, dosar Vitamina B12!',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'sinvastatina',
    name: 'Zocor (Sinvastatina)',
    activeIngredient: 'Sinvastatina',
    englishActiveIngredient: 'simvastatin',
    anvisaRegistry: '1.0029.0132',
    atcCode: 'C10AA01',
    therapeuticClass: 'Hipolipemiante / Antilipêmico',
    pharmacologicalGroup: 'Estatina (Inibidor da HMG-CoA Redutase)',
    mechanismOfAction:
      'Pró-fármaco (lactona inativa) hidrolisado no fígado em beta-hidroxiácido ativo, que inibe competitivamente a enzima HMG-CoA redutase (etapa limitante da biossíntese hepática de colesterol). Isso reduz o colesterol intracelular e estimula a expressão de receptores de LDL na superfície dos hepatócitos, aumentando a remoção de LDL-c do sangue.',
    genericsAndSimilars: [
      'Sinvastatina Genérico (EMS, Medley, Sandoz, Eurofarma, Cimed)',
      'Sinvascor',
      'Clinfar',
      'Vaslip',
    ],
    presentations: ['Comprimido revestido 10 mg, 20 mg, 40 mg e 80 mg'],
    concentrations: ['10 mg', '20 mg', '40 mg', '80 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Hipercolesterolemia primária e dislipidemia mista (redução de LDL-c, colesterol total e triglicerídeos)',
      'Prevenção primária e secundária de eventos cardiovasculares (Infarto Agudo do Miocárdio, AVC) em pacientes de alto risco',
    ],
    contraindications: [
      'Doença hepática ativa ou elevações persistentes inexplicadas das transaminases séricas (TGO/TGP)',
      'Gravidez e lactação',
      'Uso concomitante com inibidores potentes da CYP3A4 (Itraconazol, Cetoconazol, Claritromicina, Eritromicina, Inibidores de Protease do HIV, Ciclosporina, Genfibrozila)',
    ],
    adverseEffects: {
      common: ['Mialgia (dor muscular), artralgia, cefaleia', 'Elevação discreta e assintomática de transaminases hepáticas'],
      serious: [
        'Miopatia e Rabdomiólise com elevação acentuada de CPK (> 10x LSN), mioglobinúria e lesão renal aguda',
      ],
    },
    dosageGuide: {
      adult: '10 mg a 40 mg em dose única diária à noite (ao deitar).',
      pediatric: 'Hipercolesterolemia familiar heterozigótica (10-17 anos): 10 a 40 mg/dia à noite.',
      maxDailyDose: '40 mg/dia (a dose de 80 mg é restrita apenas a pacientes que já a utilizam cronicamente sem miopatia devido ao alto risco de rabdomiólise).',
      renalAdjustment: 'Insuficiência renal grave (ClCr < 30 mL/min): iniciar com 5 mg/dia e monitorar de perto.',
    },
    pharmacokinetics: {
      bioavailability: '< 5% (extensa extração hepática de primeira passagem — o próprio fígado é o órgão-alvo)',
      halfLife: '2 a 3 horas (curta meia-vida, exigindo tomada noturna)',
      metabolism: 'Hepático via CYP3A4',
      excretion: 'Biliar/Fecal (~60%) e Renal (~13%)',
      onsetOfAction: 'Redução de LDL visível em 2 semanas; efeito máximo em 4 a 6 semanas',
      proteinBinding: '95%',
    },
    interactions: [
      {
        interactingSubstance: 'Anlodipino / Amiodarona / Diltiazem / Verapamil',
        severity: 'Grave',
        effect: 'Inibem a CYP3A4, aumentando os níveis plasmáticos da sinvastatina e o risco de miopatia/rabdomiólise.',
        conduct: 'Não exceder 20 mg/dia de Sinvastatina com Anlodipino/Amiodarona, ou 10 mg/dia com Verapamil/Diltiazem (ou trocar por Rosuvastatina/Pravastatina).',
      },
      {
        interactingSubstance: 'Genfibrozila / Fibratos',
        severity: 'Grave',
        effect: 'Inibe a glicuronidação das estatinas (OATP1B1), elevando drasticamente o risco de rabdomiólise.',
        conduct: 'Associação com Genfibrozila é contraindicada; se necessário associar fibrato, preferir Fenofibrato com estatina de menor interação.',
      },
    ],
    pregnancyCategory: 'X',
    lactationSafety: 'Contraindicada na amamentação.',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Cronofarmacologia clássica: Por que a Sinvastatina deve ser tomada À NOITE? Porque a síntese endógena de colesterol pelo fígado obedece ao ritmo circadiano, atingindo seu pico durante a madrugada (entre 0h e 4h), e a Sinvastatina tem meia-vida curta (~2h). Já a Atorvastatina e a Rosuvastatina têm meia-vida longa (14h–19h) e podem ser tomadas a qualquer hora do dia!',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'clonazepam',
    name: 'Rivotril (Clonazepam)',
    activeIngredient: 'Clonazepam',
    englishActiveIngredient: 'clonazepam',
    anvisaRegistry: '1.0100.0072',
    atcCode: 'N03AE01',
    therapeuticClass: 'Ansiolítico, Anticonvulsivante e Hipnótico',
    pharmacologicalGroup: 'Benzodiazepínico de Longa Ação',
    mechanismOfAction:
      'Modulador alostérico positivo dos receptores GABA-A no Sistema Nervoso Central. Aumenta a afinidade do neurotransmissor inibitório GABA pelo seu receptor, aumentando a frequência de abertura dos canais de cloreto (Cl-), hiperpolarizando a membrana neuronal e reduzindo a excitabilidade sináptica.',
    genericsAndSimilars: [
      'Clonazepam Genérico (Medley, EMS, Eurofarma, Germed, Teuto)',
      'Clopam',
      'Navotrax',
      'Zilepam',
    ],
    presentations: [
      'Comprimido 0,5 mg e 2 mg',
      'Comprimido sublingual 0,25 mg',
      'Solução oral (gotas) 2,5 mg/mL (1 gota = 0,1 mg)',
    ],
    concentrations: ['0,25 mg', '0,5 mg', '2 mg', '2,5 mg/mL'],
    routeOfAdministration: ['Oral', 'Sublingual'],
    indications: [
      'Transtorno do Pânico (com ou sem agorafobia) e Transtornos de Ansiedade',
      'Crises epilépticas (ausência típica/atípica, crises mioclônicas, acinéticas e Síndrome de Lennox-Gastaut)',
      'Acatisia e Distúrbio Comportamental do Sono REM',
    ],
    contraindications: [
      'Hipersensibilidade aos benzodiazepínicos',
      'Insuficiência respiratória grave ou Apneia do Sono severa não tratada',
      'Glaucoma agudo de ângulo fechado',
      'Insuficiência hepática grave (pode precipitar encefalopatia hepática)',
    ],
    adverseEffects: {
      common: [
        'Sonolência diurna, sedação, ataxia, tontura e incoordenação motora',
        'Prejuízo da memória anterógrada e redução dos reflexos psicomotores',
      ],
      serious: [
        'Tolerância, dependência física e psíquica e Síndrome de Abstinência na retirada abrupta (ansiedade rebote, tremores, convulsões)',
        'Depressão respiratória (especialmente se associado a álcool ou opioides)',
        'Aumento do risco de quedas e fraturas de fêmur em idosos (Critérios de Beers)',
      ],
    },
    dosageGuide: {
      adult: 'Ansiedade/Pânico: iniciar com 0,25 a 0,5 mg 1x a 2x/dia; manutenção usual 1 a 2 mg/dia. Epilepsia: 1,5 a 6 mg/dia divididos.',
      pediatric: 'Lactentes e crianças (< 10 anos): iniciar com 0,01 a 0,03 mg/kg/dia divididos.',
      maxDailyDose: '20 mg/dia (em epilepsia refratária); até 4 mg/dia no transtorno do pânico.',
      renalAdjustment: 'Cautela; metabólitos são excretados pelos rins.',
    },
    pharmacokinetics: {
      bioavailability: '90%',
      halfLife: '18 a 50 horas (longa meia-vida de eliminação)',
      metabolism: 'Hepático via CYP3A4 (redução do grupo nitro em 7-aminoclonazepam inativo) e acetilação',
      excretion: 'Renal (metabólitos)',
      onsetOfAction: '20 a 60 minutos (via oral); 5 a 15 minutos (sublingual)',
      proteinBinding: '85%',
    },
    interactions: [
      {
        interactingSubstance: 'Álcool (Etanol) / Opioides (Morfina, Tramadol, Codeína) / Outros Depressores do SNC',
        severity: 'Grave',
        effect: 'Sinergismo depressor do SNC com risco de sedação profunda, coma, depressão respiratória e óbito.',
        conduct: 'Proibir ingestão de bebidas alcoólicas e evitar associação com opioides.',
      },
      {
        interactingSubstance: 'Inibidores da CYP3A4 (Cetoconazol, Fluconazol, Claritromicina)',
        severity: 'Moderada',
        effect: 'Aumentam as concentrações séricas e o efeito sedativo do clonazepam.',
        conduct: 'Monitorar sedação excessiva e ajustar dose se necessário.',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Evitar ou usar com extrema cautela (monitorar sedação e sucção débil no lactente).',
    prescriptionType: 'Notificação B1/B2 (Tarja Preta - Azul)',
    clinicalPearls:
      'Portaria SVS/MS 344/98 (Lista B1 - Psicotrópicos): Exige Notificação de Receita B (cor AZUL), válida por 30 dias na unidade federativa (ou nacional conforme legislação vigente) para até 60 dias de tratamento. Cálculo de gotas essencial na prova e balcão: Na solução 2,5 mg/mL (1 mL = 25 gotas), cada 1 gota contém exatos 0,1 mg (logo, 5 gotas = 0,5 mg e 20 gotas = 2 mg). O antídoto na intoxicação aguda por benzodiazepínicos é o Flumazenil!',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'sertralina',
    name: 'Zoloft / Assert (Cloridrato de Sertralina)',
    activeIngredient: 'Cloridrato de Sertralina',
    englishActiveIngredient: 'sertraline',
    anvisaRegistry: '1.0216.0018',
    atcCode: 'N06AB06',
    therapeuticClass: 'Antidepressivo e Ansiolítico',
    pharmacologicalGroup: 'Inibidor Seletivo da Recaptação de Serotonina (ISRS)',
    mechanismOfAction:
      'Inibe potente e seletivamente o transportador pré-sináptico de serotonina (SERT), aumentando a disponibilidade de 5-hidroxitriptamina (5-HT) na fenda sináptica do SNC, levando à dessensibilização adaptativa (down-regulation) dos autorreceptores somatodendríticos 5-HT1A após 2 a 4 semanas.',
    genericsAndSimilars: [
      'Cloridrato de Sertralina Genérico (Eurofarma, Medley, EMS, Prati-Donaduzzi, Sandoz)',
      'Assert',
      'Tolrest',
      'Serenata',
    ],
    presentations: ['Comprimido revestido 25 mg, 50 mg e 100 mg'],
    concentrations: ['25 mg', '50 mg', '100 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Transtorno Depressivo Maior (TDM)',
      'Transtorno Obsessivo-Compulsivo (TOC), Transtorno do Pânico e Transtorno de Ansiedade Social',
      'Transtorno de Estresse Pós-Traumático (TEPT) e Transtorno Disfórico Pré-Menstrual (TDPM)',
    ],
    contraindications: [
      'Uso concomitante ou dentro de 14 dias após uso de Inibidores da Monoaminoxidase (IMAO)',
      'Uso concomitante com Pimozida ou Linezolida',
    ],
    adverseEffects: {
      common: [
        'Náuseas, diarreia ou fezes amolecidas (a sertralina é o ISRS com maior incidência de diarreia leve inicial)',
        'Insônia ou sonolência, cefaleia, tremor fino, xerostomia e disfunção sexual (redução da libido / anorgasmia)',
      ],
      serious: [
        'Síndrome Serotoninérgica (hipertermia, mioclonia, agitação, hiperreflexia, instabilidade autonômica)',
        'Hiponatremia por SIADH (especialmente em idosos)',
        'Virada maníaca em pacientes com transtorno bipolar não diagnosticado',
      ],
    },
    dosageGuide: {
      adult: 'Iniciar com 25 mg ou 50 mg 1x ao dia (pela manhã ou noite). Titular em incrementos de 50 mg a cada semana conforme resposta.',
      pediatric: 'TOC (6-12 anos): iniciar 25 mg/dia; (13-17 anos): iniciar 50 mg/dia.',
      maxDailyDose: '200 mg/dia.',
      renalAdjustment: 'Não necessita ajuste de dose na insuficiência renal.',
    },
    pharmacokinetics: {
      bioavailability: '44% (a ingestão com alimentos aumenta a Cmáx em ~25%)',
      halfLife: '26 horas (sertralina) e 62–104 horas (desmetilsertralina)',
      metabolism: 'Hepático via múltiplas isoenzimas (CYP2B6, CYP2C19, CYP2C9, CYP2D6, CYP3A4)',
      excretion: 'Fecal (~50%) e Renal (~45% como metabólitos)',
      onsetOfAction: 'Latência terapêutica de 2 a 4 semanas (efeito pleno em 6 a 8 semanas)',
      proteinBinding: '98%',
    },
    interactions: [
      {
        interactingSubstance: 'Tramadol / Triptanos (Sumatriptana) / Lítio / Erva-de-São-João / IMAO',
        severity: 'Grave',
        effect: 'Risco de desencadear Síndrome Serotoninérgica potencialmente fatal.',
        conduct: 'Evitar combinação; orientar sinais de alerta (tremores, sudorese intensa, confusão, febre).',
      },
      {
        interactingSubstance: 'AINEs / AAS / Anticoagulantes',
        severity: 'Moderada',
        effect: 'Os ISRS depletam a serotonina intraplaquetária, prejudicando a agregação plaquetária e aumentando o risco de sangramento digestivo.',
        conduct: 'Considerar gastroproteção com IBP se associação com AINE/AAS for indispensável.',
      },
    ],
    pregnancyCategory: 'C',
    lactationSafety: 'Compatível (é o antidepressivo ISRS de primeira escolha durante a amamentação devido aos níveis mínimos no leite).',
    prescriptionType: 'Retenção de Receita (Antimicrobiano / Controle Especial C1)',
    clinicalPearls:
      'Portaria 344/98 (Lista C1 - Outras Substâncias Sujeitas a Controle Especial): Receita de Controle Especial em 2 vias (1ª via retida na farmácia, 2ª via devolvida ao paciente), validade de 30 dias. Orientar o paciente que a melhora clínica demora 2 a 4 semanas, enquanto efeitos adversos leves (náuseas, ansiedade inicial) ocorrem nos primeiros dias e costumam desaparecer!',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'prednisona',
    name: 'Meticorten (Prednisona)',
    activeIngredient: 'Prednisona',
    englishActiveIngredient: 'prednisone',
    anvisaRegistry: '1.0093.0054',
    atcCode: 'H02AB07',
    therapeuticClass: 'Anti-inflamatório Esteroidal e Imunossupressor',
    pharmacologicalGroup: 'Glicocorticoide Sistêmico de Ação Intermediária',
    mechanismOfAction:
      'Pró-fármaco convertido no fígado em Prednisolona ativa. Atravessa a membrana celular e liga-se a receptores citoplasmáticos de glicocorticoides, translocando-se ao núcleo onde ativa a transcrição de proteínas anti-inflamatórias (como a anexina-1 / lipocortina-1, que inibe a fosfolipase A2) e reprime fatores pró-inflamatórios (NF-kB), bloqueando tanto prostaglandinas quanto leucotrienos.',
    genericsAndSimilars: [
      'Prednisona Genérico (Medley, EMS, Eurofarma, Neo Química, Prati-Donaduzzi)',
      'Prednisolon (Prednisolona solução oral)',
      'Cortorten',
    ],
    presentations: ['Comprimido simples 5 mg e 20 mg'],
    concentrations: ['5 mg', '20 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Exacerbações agudas de asma brônquica e DPOC',
      'Doenças reumatológicas e autoimunes (lúpus eritematoso sistêmico, artrite reumatoide, vasculites)',
      'Processos alérgicos graves (urticária aguda extensa, dermatites severas, rinossinusites)',
    ],
    contraindications: [
      'Infecções fúngicas sistêmicas não tratadas',
      'Administração de vacinas de vírus vivos atenuados durante doses imunossupressoras',
      'Hipersensibilidade à prednisona',
    ],
    adverseEffects: {
      common: [
        'Hiperglicemia, aumento do apetite, ganho de peso, retenção de sódio e líquido',
        'Insônia, euforia ou irritabilidade, dispepsia gástrica',
      ],
      serious: [
        'Supressão do eixo Hipotálamo-Hipófise-Adrenal (HHA) e Insuficiência Adrenal Aguda se suspenso abruptamente após uso > 14 dias',
        'Síndrome de Cushing iatrogênica, osteoporose, necrose avascular da cabeça do fêmur, catarata subcapsular e glaucoma em uso crônico',
      ],
    },
    dosageGuide: {
      adult: '5 mg a 60 mg/dia (geralmente 0,5 a 1 mg/kg/dia) em dose única matinal.',
      pediatric: '1 a 2 mg/kg/dia (em crianças pequenas prefere-se a Prednisolona solução oral).',
      maxDailyDose: '60 a 80 mg/dia.',
      renalAdjustment: 'Não requer ajuste específico; monitorar retenção hídrica.',
    },
    pharmacokinetics: {
      bioavailability: '70% a 80%',
      halfLife: 'Plasmática: 2,5 a 3,5 horas; Biológica (tecidual): 18 a 36 horas (ação intermediária)',
      metabolism: 'Hepático via 11-beta-hidroxiesteroide desidrogenase (converte Prednisona em Prednisolona ativa) e CYP3A4',
      excretion: 'Renal',
      onsetOfAction: '1 a 2 horas',
      proteinBinding: '70% a 90%',
    },
    interactions: [
      {
        interactingSubstance: 'AINEs (Ibuprofeno, Diclofenaco, Cetoprofeno, AAS)',
        severity: 'Grave',
        effect: 'Aumenta em até 4 a 10 vezes o risco de ulceração e sangramento gastrointestinal.',
        conduct: 'Evitar combinação; caso necessário, associar IBP (Omeprazol/Pantoprazol).',
      },
      {
        interactingSubstance: 'Antidiabéticos Orais e Insulina',
        severity: 'Moderada',
        effect: 'Os glicocorticoides promovem resistência insulínica e gliconeogênese, elevando a glicemia.',
        conduct: 'Monitorar glicemia capilar e ajustar doses de hipoglicemiantes se necessário.',
      },
    ],
    pregnancyCategory: 'C',
    lactationSafety: 'Compatível com a amamentação em doses habituais.',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Regra de Ouro da Farmacologia: Tomar pela manhã (entre 7h e 8h) junto com o café da manhã para mimetizar o pico fisiológico circadiano do cortisol endógeno, reduzindo a insônia e a supressão do eixo adrenal! Se o uso durar mais de 14 dias, NUNCA suspender de forma abrupta (exige desmame gradual).',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'levotiroxina-sodica',
    name: 'Puran T4 / Euthyrox (Levotiroxina Sódica)',
    activeIngredient: 'Levotiroxina Sódica (T4 Sintético)',
    englishActiveIngredient: 'levothyroxine',
    anvisaRegistry: '1.1300.1088',
    atcCode: 'H03AA01',
    therapeuticClass: 'Hormônio Tireoidiano',
    pharmacologicalGroup: 'Hormônio Tireoidiano Sintético (L-Tiroxina)',
    mechanismOfAction:
      'Pró-hormônio sintético idêntico à tiroxina (T4) endógena. Nos tecidos periféricos (fígado, rins), sofre desiodação pela enzima 5-desiodase convertendo-se em tri-iodotironina (T3), que se liga aos receptores nucleares de hormônios tireoidianos regulando a transcrição gênica, o metabolismo basal, a termogênese e o crescimento.',
    genericsAndSimilars: [
      'Levotiroxina Sódica Genérico (Merck, Abbott, Aché)',
      'Euthyrox',
      'Synthroid',
      'Levoid',
    ],
    presentations: [
      'Comprimidos de 25 mcg, 37,5 mcg, 50 mcg, 62,5 mcg, 75 mcg, 88 mcg, 100 mcg, 112 mcg, 125 mcg, 150 mcg, 175 mcg e 200 mcg',
    ],
    concentrations: ['25 mcg', '50 mcg', '75 mcg', '88 mcg', '100 mcg', '125 mcg', '150 mcg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Hipotireoidismo primário (ex: Tireoidite de Hashimoto, pós-tireoidectomia), secundário ou terciário',
      'Supressão do TSH no tratamento do carcinoma diferenciado de tireoide',
      'Hipotireoidismo congênito',
    ],
    contraindications: [
      'Tireotoxicose / Hipertireoidismo não tratado',
      'Infarto Agudo do Miocárdio recente ou miocardite aguda',
      'Insuficiência adrenal não corrigida (a levotiroxina aumenta o clearance de cortisol e pode precipitar crise adrenal aguda)',
    ],
    adverseEffects: {
      common: [
        'Em doses fisiológicas corretas não há efeitos adversos; os sintomas decorrem de superdosagem (hipertireoidismo iatrogênico): taquicardia, palpitações, tremores, insônia, perda de peso, intolerância ao calor',
      ],
      serious: [
        'Fibrilação atrial e angina pectoris (especialmente em idosos ou cardiopatas se iniciada em dose alta)',
        'Redução da densidade mineral óssea (osteoporose) se TSH mantido cronicamente suprimido',
      ],
    },
    dosageGuide: {
      adult: 'Reposição plena média: 1,6 mcg/kg/dia em jejum (30 a 60 minutos antes do café da manhã). Em idosos ou cardiopatas: iniciar com 12,5 a 25 mcg/dia.',
      pediatric: 'Varia conforme faixa etária (Recém-nascidos: 10 a 15 mcg/kg/dia).',
      maxDailyDose: 'Individualizada conforme níveis séricos de TSH e T4 livre (geralmente até 200–300 mcg/dia).',
      renalAdjustment: 'Não requer ajuste de dose.',
    },
    pharmacokinetics: {
      bioavailability: '40% a 80% (reduzida significativamente por alimentos, café, fibras e pH gástrico elevado)',
      halfLife: '6 a 7 dias em eutireoideos (9 a 10 dias no hipotireoidismo)',
      metabolism: 'Desiodação periférica para T3 (ativo) e rT3 (inativo); conjugação hepática',
      excretion: 'Renal (~80%) e Fecal (~20%)',
      onsetOfAction: 'Início em 3 a 5 dias; equilíbrio estável (steady-state) para dosar TSH em 4 a 6 semanas',
      proteinBinding: '> 99% (ligada à TBG, transtirretina e albumina)',
    },
    interactions: [
      {
        interactingSubstance: 'Carbonato de Cálcio / Sulfato Ferroso / Antiácidos (Hidróxido de Alumínio/Magnésio)',
        severity: 'Grave',
        effect: 'Quelam a levotiroxina no trato gastrointestinal formando complexos insolúveis, reduzindo drasticamente sua absorção e elevando o TSH.',
        conduct: 'Administrar cálcio, ferro ou antiácidos com intervalo mínimo de 4 horas após a levotiroxina.',
      },
      {
        interactingSubstance: 'Omeprazol e demais IBPs / Café Expresso / Soja',
        severity: 'Moderada',
        effect: 'Reduzem a absorção intestinal da levotiroxina.',
        conduct: 'Tomar exclusivamente com água pura, 30 a 60 minutos antes do café da manhã.',
      },
    ],
    pregnancyCategory: 'A',
    lactationSafety: 'Totalmente compatível e essencial durante a gestação e lactação (Categoria A — geralmente requer aumento de 25% a 30% da dose na gravidez).',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Medicamento de Índice Terapêutico Estreito (ITE): orientar o paciente a evitar trocar de marca/fabricante sem acompanhamento médico e dosagem de TSH após 6 semanas, pois pequenas variações de biodisponibilidade podem descompensar o controle tireoidiano.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'enalapril',
    name: 'Renitec (Maleato de Enalapril)',
    activeIngredient: 'Maleato de Enalapril',
    englishActiveIngredient: 'enalapril',
    anvisaRegistry: '1.0029.0031',
    atcCode: 'C09AA02',
    therapeuticClass: 'Anti-hipertensivo e Vasodilatador',
    pharmacologicalGroup: 'Inibidor da Enzima Conversora de Angiotensina (IECA)',
    mechanismOfAction:
      'Pró-fármaco hidrolisado no fígado em Enalaprilato ativo, que inibe competitivamente a Enzima Conversora de Angiotensina (ECA / cininase II). Impede a conversão de Angiotensina I em Angiotensina II (potente vasoconstritor e estimulador da aldosterona) e inibe a degradação da bradicinina (vasodilatadora).',
    genericsAndSimilars: [
      'Maleato de Enalapril Genérico (Medley, EMS, Teuto, Neo Química, Biosintética)',
      'Eupressin',
      'Vasopril',
    ],
    presentations: ['Comprimido 5 mg, 10 mg e 20 mg'],
    concentrations: ['5 mg', '10 mg', '20 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Hipertensão Arterial Sistêmica (HAS) em todos os estágios',
      'Insuficiência Cardíaca com fração de ejeção reduzida (reduz mortalidade e remodelamento cardíaco)',
      'Nefropatia diabética e redução de proteinúria',
    ],
    contraindications: [
      'Gravidez (teratogênico — Categoria D)',
      'Histórico de angioedema (idiopático, hereditário ou induzido por IECA prévio)',
      'Estenose bilateral da artéria renal',
      'Uso concomitante com Sacubitril/Valsartana (aguardar washout de 36 horas)',
    ],
    adverseEffects: {
      common: [
        'Tosse seca persistente não produtiva (ocorre em 5% a 20% dos pacientes pelo acúmulo de bradicinina e substância P nos brônquios)',
        'Tontura, hipotensão de primeira dose, hipercalemia',
      ],
      serious: [
        'Angioedema de face, lábios, língua e glote (emergência médica)',
        'Insuficiência renal aguda em pacientes com estenose de artéria renal',
      ],
    },
    dosageGuide: {
      adult: 'Iniciar com 5 mg a 10 mg 1x ao dia; manutenção usual: 10 a 20 mg 1x ou 2x ao dia (12/12h).',
      pediatric: '0,08 mg/kg/dia (até 5 mg/dia inicialmente).',
      maxDailyDose: '40 mg/dia.',
      renalAdjustment: 'ClCr < 30 mL/min: iniciar com 2,5 mg/dia e titular conforme resposta.',
    },
    pharmacokinetics: {
      bioavailability: '60% (não afetada por alimentos, ao contrário do Captopril)',
      halfLife: '11 horas (metabólito ativo Enalaprilato)',
      metabolism: 'Hepático (esterases convertem Enalapril no Enalaprilato ativo)',
      excretion: 'Renal (~60-80%) e Fecal',
      onsetOfAction: '1 hora (pico em 4 a 6 horas)',
      proteinBinding: '50% a 60%',
    },
    interactions: [
      {
        interactingSubstance: 'Espironolactona / Amilorida / Suplementos de Potássio',
        severity: 'Grave',
        effect: 'Risco de hipercalemia grave devido à redução da aldosterona.',
        conduct: 'Monitorar potássio sérico e função renal regularmente.',
      },
      {
        interactingSubstance: 'AINEs (Ibuprofeno, Nimesulida, Diclofenaco)',
        severity: 'Grave',
        effect: 'Bloqueiam a síntese de prostaglandinas vasodilatadoras renais, antagonizando o efeito anti-hipertensivo e precipitando lesão renal aguda.',
        conduct: 'Evitar uso de AINEs.',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Compatível com a amamentação (baixa excreção no leite; um dos anti-hipertensivos preferidos no pós-parto).',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Questão clássica de Atenção Farmacêutica: Se o paciente desenvolver tosse seca persistente com Enalapril ou Captopril, antitussígenos não resolvem! A conduta correta é encaminhar ao médico para substituir o IECA por um BRA (ex: Losartana), que não inibe a degradação da bradicinina.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'hidroclorotiazida',
    name: 'Clorana (Hidroclorotiazida)',
    activeIngredient: 'Hidroclorotiazida',
    englishActiveIngredient: 'hydrochlorothiazide',
    anvisaRegistry: '1.1300.1095',
    atcCode: 'C03AA03',
    therapeuticClass: 'Diurético e Anti-hipertensivo',
    pharmacologicalGroup: 'Diurético Tiazídico',
    mechanismOfAction:
      'Inibe o cotransportador Na+/Cl- (NCC) na porção inicial do túbulo contorcido distal dos néfrons, aumentando a excreção urinária de sódio, cloreto, água, potássio e magnésio, enquanto aumenta a reabsorção tubular de cálcio. Em uso crônico, reduz a resistência vascular periférica.',
    genericsAndSimilars: [
      'Hidroclorotiazida Genérico (Medley, EMS, Neo Química, Prati-Donaduzzi)',
      'Clorana',
      'Drenol',
    ],
    presentations: ['Comprimido simples 12,5 mg, 25 mg e 50 mg'],
    concentrations: ['12,5 mg', '25 mg', '50 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Hipertensão Arterial Sistêmica (isolada ou associada a IECA/BRA)',
      'Edema associado a insuficiência cardíaca, cirrose hepática ou síndrome nefrótica',
      'Prevenção de nefrolitíase recorrente por hipercalciúria idiopática',
    ],
    contraindications: [
      'Anúria ou insuficiência renal grave ( perde eficácia se TFG < 30 mL/min)',
      'Hipersensibilidade às tiazidas ou outros derivados sulfonamídicos',
      'Hipocalemia ou hiponatremia refratárias e Gota aguda sintomática',
    ],
    adverseEffects: {
      common: [
        'Hipocalemia (queda de potássio), hiponatremia, hipomagnesemia',
        'Hiperuricemia (compete pela secreção tubular de ácido úrico, podendo precipitar crise de gota)',
        'Hiperglicemia leve e discreto aumento de LDL/triglicerídeos em doses altas',
        'Fotossensibilidade cutânea',
      ],
      serious: [
        'Arritmias cardíacas secundárias à hipocalemia severa',
        'Pancreatite aguda ou discrasias sanguíneas (raras)',
      ],
    },
    dosageGuide: {
      adult: 'Hipertensão: 12,5 mg a 25 mg 1x ao dia pela manhã. Edema: 25 mg a 50 mg/dia.',
      pediatric: '1 a 2 mg/kg/dia em 1 ou 2 tomadas.',
      maxDailyDose: '50 mg/dia para hipertensão (doses > 25-50 mg aumentam distúrbios metabólicos sem ganho anti-hipertensivo adicional).',
      renalAdjustment: 'Ineficaz quando TFG < 30 mL/min (nesse caso, substituir por diurético de alça como Furosemida).',
    },
    pharmacokinetics: {
      bioavailability: '65% a 75%',
      halfLife: '6 a 15 horas',
      metabolism: 'Não é metabolizada',
      excretion: 'Renal (> 95% inalterada na urina)',
      onsetOfAction: 'Diurese inicia em 2 horas (pico em 4h e duração de 6 a 12h)',
      proteinBinding: '40% a 68%',
    },
    interactions: [
      {
        interactingSubstance: 'Digoxina',
        severity: 'Grave',
        effect: 'A hipocalemia e hipomagnesemia induzidas pela hidroclorotiazida aumentam drasticamente a ligação da digoxina à Na+/K+-ATPase, precipitando intoxicação digitálica e arritmias fatais.',
        conduct: 'Monitorar potássio e magnésio rigorosamente.',
      },
      {
        interactingSubstance: 'Lítio',
        severity: 'Grave',
        effect: 'A depleção de sódio estimula a reabsorção proximal de sódio e lítio, aumentando a litemia em até 40%.',
        conduct: 'Monitorar litemia e ajustar dose.',
      },
    ],
    pregnancyCategory: 'B',
    lactationSafety: 'Compatível em doses baixas (doses elevadas podem reduzir a produção láctea).',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Orientar sempre a tomada PELA MANHÃ para evitar noctúria (acordar várias vezes à noite para urinar, o que aumenta o risco de quedas em idosos). Lembrar da regra mnemônica dos 4 "Hiper" dos Tiazídicos: Hiperglicemia, Hiperlipidemia, Hiperuricemia e Hipercalcemia!',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'ciprofloxacino',
    name: 'Cipro (Cloridrato de Ciprofloxacino)',
    activeIngredient: 'Cloridrato de Ciprofloxacino',
    englishActiveIngredient: 'ciprofloxacin',
    anvisaRegistry: '1.7056.0044',
    atcCode: 'J01MA02',
    therapeuticClass: 'Antibiótico / Antimicrobiano',
    pharmacologicalGroup: 'Fluoroquinolona de 2ª Geração',
    mechanismOfAction:
      'Antibiótico bactericida concentração-dependente. Inibe as enzimas bacterianas DNA-girase (topoisomerase II, principal alvo em Gram-negativos) e topoisomerase IV (principal alvo em Gram-positivos), impedindo o superenrolamento, a replicação e o reparo do DNA bacteriano.',
    genericsAndSimilars: [
      'Cloridrato de Ciprofloxacino Genérico (Medley, EMS, Eurofarma, Sandoz, Prati-Donaduzzi)',
      'Ciprobiot',
      'Quinoflox',
      'Proflox',
    ],
    presentations: [
      'Comprimido revestido 250 mg e 500 mg',
      'Solução para infusão EV 2 mg/mL (bolsa 100 mL e 200 mL)',
      'Colírio e Solução Otológica 3 mg/mL',
    ],
    concentrations: ['250 mg', '500 mg', '2 mg/mL'],
    routeOfAdministration: ['Oral', 'Endovenosa', 'Tópica Oftálmica / Otológica'],
    indications: [
      'Infecções complicadas do trato urinário e pielonefrite aguda (Excelente cobertura para Enterobacterales e Pseudomonas aeruginosa)',
      'Prostatite bacteriana aguda e crônica',
      'Infecções gastrointestinais bacterianas graves, febre tifoide e infecções osteoarticulares',
    ],
    contraindications: [
      'Hipersensibilidade ao ciprofloxacino ou outras quinolonas',
      'Uso concomitante com Tizanidina (relaxante muscular)',
      'Miastenia Gravis (risco de exacerbação da fraqueza muscular respiratória)',
      'Crianças, adolescentes em fase de crescimento e gestantes (exceto indicações específicas como fibrose cística com Pseudomonas ou antraz)',
    ],
    adverseEffects: {
      common: ['Náuseas, diarreia, desconforto abdominal, tontura, cefaleia'],
      serious: [
        'Tendinite e Ruptura do Tendão de Aquiles (risco aumentado em > 60 anos, transplantados e uso concomitante de corticosteroides)',
        'Neuropatia periférica e efeitos no SNC (confusão, alucinações, redução do limiar convulsivo)',
        'Aneurisma/dissecção de aorta e prolongamento do intervalo QT',
      ],
    },
    dosageGuide: {
      adult: '250 mg a 750 mg VO a cada 12 horas por 3 a 14 dias conforme o foco infeccioso (geralmente 500 mg de 12/12h).',
      pediatric: 'Uso restrito (10 a 20 mg/kg VO a cada 12h em casos selecionados).',
      maxDailyDose: '1.500 mg/dia (via oral).',
      renalAdjustment: 'ClCr 30-50 mL/min: 250-500 mg 12/12h; ClCr < 30 mL/min: 250-500 mg a cada 18–24h.',
    },
    pharmacokinetics: {
      bioavailability: '70% a 80%',
      halfLife: '4 horas',
      metabolism: 'Hepático parcial (~15%) — potente inibidor da enzima CYP1A2!',
      excretion: 'Renal (~40-50% inalterado) e Fecal (~20-35%)',
      onsetOfAction: 'Tmáx em 1 a 2 horas',
      proteinBinding: '20% a 40%',
    },
    interactions: [
      {
        interactingSubstance: 'Cátions Divalentes e Trivalentes: Leite/Laticínios (Ca²⁺), Antiácidos (Mg²⁺/Al³⁺), Sulfato Ferroso (Fe²⁺), Zinco',
        severity: 'Grave',
        effect: 'Formação de complexo insolúvel (quelação) no lúmen intestinal, reduzindo a absorção do ciprofloxacino em até 90% e levando à falha terapêutica.',
        conduct: 'Tomar o Ciprofloxacino 2 horas antes ou 6 horas após antiácidos, suplementos minerais, leite ou derivados.',
      },
      {
        interactingSubstance: 'Tizanidina / Teofilina / Clozapina / Cafeína',
        severity: 'Grave',
        effect: 'O ciprofloxacino inibe fortemente a CYP1A2, aumentando em até 10x a concentração da tizanidina (hipotensão grave) e elevando a toxicidade da teofilina/clozapina.',
        conduct: 'Contraindicado com Tizanidina; monitorar substratos da CYP1A2.',
      },
    ],
    pregnancyCategory: 'C',
    lactationSafety: 'Evitar se houver alternativa mais segura (excretado no leite materno).',
    prescriptionType: 'Retenção de Receita (Antimicrobiano / Controle Especial C1)',
    clinicalPearls:
      'Interação clássica de prova e farmácia clínica: NUNCA tomar Ciprofloxacino com leite, iogurte ou antiácido! Os íons Ca²⁺, Mg²⁺, Al³⁺ e Fe²⁺ quelam os grupos carbonila e carboxila da fluoroquinolona, impedindo sua absorção.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'loratadina',
    name: 'Claritin (Loratadina)',
    activeIngredient: 'Loratadina',
    englishActiveIngredient: 'loratadine',
    anvisaRegistry: '1.0093.0169',
    atcCode: 'R06AX13',
    therapeuticClass: 'Anti-histamínico / Antialérgico',
    pharmacologicalGroup: 'Anti-histamínico H1 de 2ª Geração (Não Sedativo)',
    mechanismOfAction:
      'Agonista inverso seletivo dos receptores periféricos de histamina H1. Possui baixa lipofilicidade e é substrato da glicoproteína-P na barreira hematoencefálica, o que impede sua entrada significativa no SNC e evita a sonolência típica dos anti-histamínicos de 1ª geração (como Dexclorfeniramina e Prometazina).',
    genericsAndSimilars: [
      'Loratadina Genérico (Medley, EMS, Cimed, Neo Química, Biosintética)',
      'Loralerg',
      'Histadin',
    ],
    presentations: [
      'Comprimido simples 10 mg',
      'Xarope / Solução oral 1 mg/mL (frasco 100 mL)',
    ],
    concentrations: ['10 mg', '1 mg/mL'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Rinite alérgica sazonal e perene (espirros, coriza, prurido nasal e ocular)',
      'Urticária crônica idiopática e outras dermatoses alérgicas pruriginosas',
    ],
    contraindications: ['Hipersensibilidade à loratadina ou desloratadina', 'Menores de 2 anos de idade'],
    adverseEffects: {
      common: ['Cefaleia leve, boca seca (xerostomia) rara, fadiga ocasional'],
      serious: ['Reações de hipersensibilidade ou taquicardia supraventricular (muito raras)'],
    },
    dosageGuide: {
      adult: '10 mg (1 comprimido ou 10 mL do xarope) 1x ao dia.',
      pediatric: 'Crianças de 2 a 12 anos (< 30 kg): 5 mL (5 mg) 1x ao dia; (> 30 kg): 10 mL (10 mg) 1x ao dia.',
      maxDailyDose: '10 mg/dia.',
      renalAdjustment: 'TFG < 30 mL/min ou insuficiência hepática grave: 10 mg em dias alternados (a cada 48h).',
    },
    pharmacokinetics: {
      bioavailability: 'Alta absorção oral (sofre efeito de primeira passagem gerando o metabólito ativo Desloratadina)',
      halfLife: '8,4 horas (loratadina) e 28 horas (metabólito ativo descarboetoxiloratadina / desloratadina)',
      metabolism: 'Hepático via CYP3A4 e CYP2D6 gerando a Desloratadina',
      excretion: 'Renal (~40%) e Fecal (~40%)',
      onsetOfAction: '1 a 3 horas (duração de 24 horas)',
      proteinBinding: '97% a 99%',
    },
    interactions: [
      {
        interactingSubstance: 'Cetoconazol / Eritromicina / Cimetidina',
        severity: 'Leve',
        effect: 'Aumentam as concentrações plasmáticas da loratadina por inibição da CYP3A4/2D6, porém sem prolongamento clinicamente relevante do intervalo QT.',
        conduct: 'Monitorar efeitos adversos leves como boca seca ou sonolência.',
      },
    ],
    pregnancyCategory: 'B',
    lactationSafety: 'Compatível com a amamentação (anti-histamínico de escolha na lactação pela baixa excreção no leite e ausência de sedação no lactente).',
    prescriptionType: 'MIP (Isento de Prescrição)',
    clinicalPearls:
      'Relação estrutura-atividade: A Desloratadina (Desalex) é exatamente o metabólito ativo da Loratadina! Por que estudantes e trabalhadores preferem anti-histamínicos de 2ª geração (Loratadina, Cetirizina, Fexofenadina, Bilastina)? Porque não atravessam a barreira hematoencefálica e não possuem efeito anticolinérgico central, preservando a atenção e memória.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'rivaroxabana',
    name: 'Xarelto (Rivaroxabana)',
    activeIngredient: 'Rivaroxabana',
    englishActiveIngredient: 'rivaroxaban',
    anvisaRegistry: '1.7056.0048',
    atcCode: 'B01AF01',
    therapeuticClass: 'Anticoagulante Oral',
    pharmacologicalGroup: 'Anticoagulante Oral Direto (DOAC) — Inibidor Direto do Fator Xa',
    mechanismOfAction:
      'Inibidor direto, altamente seletivo e reversível do Fator Xa (tanto livre quanto ligado ao complexo protrombinase). Bloqueia a via comum da cascata de coagulação (impedindo a conversão de protrombina em trombina e a formação de fibrina) sem necessitar da antitrombina III como cofator.',
    genericsAndSimilars: [
      'Rivaroxabana Genérico (EMS, Eurofarma, Medley, Biolab, Prati-Donaduzzi)',
      'Xarelto',
      'Rivaxa',
      'Trombex',
    ],
    presentations: ['Comprimido revestido 2,5 mg, 10 mg, 15 mg e 20 mg'],
    concentrations: ['2,5 mg', '10 mg', '15 mg', '20 mg'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Prevenção de AVC e embolia sistêmica em pacientes com Fibrilação Atrial não valvar',
      'Tratamento e prevenção de recorrência de Trombose Venosa Profunda (TVP) e Embolia Pulmonar (TEP)',
      'Profilaxia de tromboembolismo venoso após artroplastia eletiva de quadril ou joelho',
    ],
    contraindications: [
      'Sangramento ativo clinicamente significativo',
      'Doença hepática associada a coagulopatia e risco de sangramento (Child-Pugh B e C)',
      'Gravidez e lactação',
      'Prótese valvar cardíaca mecânica ou estenose mitral moderada a grave (usar Varfarina)',
    ],
    adverseEffects: {
      common: ['Epistaxe, sangramento gengival, equimoses, hematúria, menorragia, anemia'],
      serious: [
        'Hemorragia gastrointestinal grave ou hemorragia intracraniana',
        'Hematoma epidural/espinhal após punção lombar ou anestesia neuraxial',
      ],
    },
    dosageGuide: {
      adult: 'FA não valvar: 20 mg 1x/dia junto com a refeição (15 mg 1x/dia se ClCr 15–49 mL/min). TVP/TEP aguda: 15 mg 12/12h por 21 dias, seguido de 20 mg 1x/dia.',
      pediatric: 'Ajustado por peso corporal conforme protocolo pediátrico.',
      maxDailyDose: '30 mg/dia (nos primeiros 21 dias de tratamento de TVP/TEP aguda) ou 20 mg/dia em manutenção.',
      renalAdjustment: 'FA: 15 mg 1x/dia se ClCr 15-49 mL/min; contraindicado se ClCr < 15 mL/min.',
    },
    pharmacokinetics: {
      bioavailability: '80% a 100% para 10 mg (independe de alimento); para 15 mg e 20 mg é de 66% em jejum e sobe para > 80% quando tomada COM ALIMENTOS!',
      halfLife: '5 a 9 horas em adultos jovens; 11 a 13 horas em idosos',
      metabolism: 'Hepático (~2/3) via CYP3A4, CYP2J2 e hidrólise; substrato da glicoproteína-P (P-gp)',
      excretion: 'Renal (~66%, sendo 36% inalterada) e Fecal (~28%)',
      onsetOfAction: 'Pico de ação (Tmáx) em 2 a 4 horas (rápido início de ação, ao contrário da Varfarina)',
      proteinBinding: '92% a 95%',
    },
    interactions: [
      {
        interactingSubstance: 'Cetoconazol / Itraconazol / Ritonavir (Inibidores duplos potentes de CYP3A4 e P-gp)',
        severity: 'Grave',
        effect: 'Aumentam em 2,5x a concentração plasmática da rivaroxabana, elevando drasticamente o risco de hemorragia fatal.',
        conduct: 'Uso concomitante é contraindicado.',
      },
      {
        interactingSubstance: 'AINEs / AAS / Clopidogrel / ISRS',
        severity: 'Grave',
        effect: 'Sinergismo farmacodinâmico no risco de sangramento.',
        conduct: 'Evitar AINEs; usar antiagregantes apenas quando estritamente prescrito pelo cardiologista.',
      },
    ],
    pregnancyCategory: 'C',
    lactationSafety: 'Contraindicada na amamentação.',
    prescriptionType: 'Receita Simples (Tarja Vermelha)',
    clinicalPearls:
      'Orientação farmacêutica vital na dispensação: Os comprimidos de 15 mg e 20 mg de Rivaroxabana OBRIGATORIAMENTE devem ser tomados JUNTO COM O ALMOÇO OU JANTAR! Em jejum, a biodisponibilidade de 20 mg cai de ~90% para 66%, deixando o paciente sub-anticoagulado e sob risco de AVC ou trombose!',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'acido-valproico-depakene',
    name: 'Depakene / Depakote (Ácido Valproico / Valproato de Sódio)',
    activeIngredient: 'Ácido Valproico / Valproato de Sódio (e Divalproato de Sódio)',
    englishActiveIngredient: 'valproic acid',
    anvisaRegistry: '1.0553.0315',
    atcCode: 'N03AG01',
    therapeuticClass: 'Anticonvulsivante / Antiepiléptico e Estabilizador de Humor',
    pharmacologicalGroup: 'Derivado de Ácido Graxo de Cadeia Ramificada (Modulador GABAérgico e de Canais de Na⁺/Ca²⁺)',
    mechanismOfAction:
      'Atua por múltiplos mecanismos sinérgicos no SNC: 1) Prolonga a recuperação dos canais de sódio dependentes de voltagem (Naᵥ) inativados; 2) Bloqueia correntes de cálcio tipo T (Caᵥ3) nos neurônios talâmicos (explicando sua eficácia nas crises de ausência); 3) Aumenta a disponibilidade sináptica do neurotransmissor inibitório GABA ao inibir a enzima GABA-transaminase (GABA-T) e a semialdeído succínico desidrogenase, além de estimular a ácido glutâmico descarboxilase (GAD).',
    genericsAndSimilars: [
      'Depakene (Abbott — Referência)',
      'Depakote / Depakote ER / Depakote Sprinkle (Divalproato de Sódio)',
      'Ácido Valproico / Valproato de Sódio Genérico (Biolab, Prati-Donaduzzi, EMS)',
      'Torval CR',
      'Valpakine',
      'Epilenil',
    ],
    presentations: [
      'Cápsula gelatinosa mole 250 mg (Ácido Valproico)',
      'Comprimido revestido entérico 300 mg e 500 mg (Valproato de Sódio)',
      'Xarope / Solução oral 50 mg/mL (250 mg/5 mL — frasco 100 mL)',
      'Comprimido revestido de liberação prolongada 250 mg e 500 mg (Divalproato de Sódio - Depakote ER)',
    ],
    concentrations: ['250 mg', '300 mg', '500 mg', '50 mg/mL (250 mg/5 mL)'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Epilepsia: crises generalizadas tônico-clônicas, crises de ausência (simples e complexas), crises mioclônicas e crises focais (parciais)',
      'Episódios de Mania aguda e manutenção no Transtorno Afetivo Bipolar (TAB)',
      'Profilaxia da Enxaqueca (Migrânea) em adultos',
    ],
    contraindications: [
      'Gravidez (especialmente na profilaxia de enxaqueca — Categoria X; na epilepsia usar apenas se nenhuma outra opção controlar as crises)',
      'Doença hepática aguda ou crônica significativa',
      'Distúrbios conhecidos do ciclo da ureia (risco de encefalopatia hiperamonêmica fatal)',
      'Doenças mitocondriais causadas por mutações no gene POLG (ex: Síndrome de Alpers-Huttenlocher) e Porfiria',
    ],
    adverseEffects: {
      common: [
        'Náuseas, vômitos, dispepsia e dor abdominal (menores com comprimido entérico ou Divalproato)',
        'Ganho de peso, aumento do apetite, tremor fino postural, sonolência',
        'Alopecia transitória (queda de cabelo ou cabelo encaracolado — associada à depleção de Zinco e Selênio)',
      ],
      serious: [
        'Teratogenicidade grave: Defeitos de Fechamento do Tubo Neural (Espinha Bífida / Mielomeningocele em 1-2%), malformações craniofaciais e redução do QI fetal',
        'Hepatotoxicidade idiossincrática fulminante (maior risco em crianças < 2 anos em politerapia)',
        'Pancreatite aguda hemorrágica',
        'Trombocitopenia dose-dependente e Hiperamonemia (mesmo com transaminases normais)',
      ],
    },
    dosageGuide: {
      adult: 'Iniciar com 10 a 15 mg/kg/dia divididos em 2 a 3 tomadas (ou 1x/dia na forma ER), aumentando 5 a 10 mg/kg/semana até resposta clínica (faixa sérica terapêutica: 50 a 100 mcg/mL).',
      pediatric: '15 a 30 mg/kg/dia divididos de 8/8h ou 12/12h (xarope 50 mg/mL).',
      maxDailyDose: '60 mg/kg/dia.',
      renalAdjustment: 'Não requer ajuste inicial, mas a uremia aumenta a fração livre plasmática do valproato.',
    },
    pharmacokinetics: {
      bioavailability: '90% a 100% (alimentos retardam a Tmáx mas não reduzem a extensão da absorção)',
      halfLife: '9 a 16 horas (reduzida para 6–12h se associado a indutores enzimáticos como Carbamazepina ou Fenitoína)',
      metabolism: 'Hepático (> 95%): Glicuronidação (UGT, ~50%), Beta-oxidação mitocondrial (~40%) e oxidação via CYP2C9/2C19 (< 10%, formando o metabólito hepatotóxico 4-eno-valproato). É um POTENTE INIBIDOR ENZIMÁTICO (CYP2C9, UGT e Epóxido Hidrolase)!',
      excretion: 'Renal (< 3% inalterado; excretado como conjugados glicuronídeos)',
      onsetOfAction: 'Equilíbrio estável (steady-state) em 2 a 4 dias',
      proteinBinding: '90% a 95% (saturável em concentrações > 100 mcg/mL, aumentando a fração livre)',
    },
    interactions: [
      {
        interactingSubstance: 'Lamotrigina',
        severity: 'Grave',
        effect: 'O ácido valproico inibe a glicuronidação (UGT1A4) da lamotrigina, DOBRANDO sua meia-vida (de 25h para > 50h) e aumentando drasticamente o risco de Síndrome de Stevens-Johnson (SSJ) e NET.',
        conduct: 'Reduzir a dose de Lamotrigina pela metade e titular de forma muito lenta quando associada ao Valproato.',
      },
      {
        interactingSubstance: 'Antibióticos Carbapenêmicos (Meropenem, Imipenem, Ertapenem)',
        severity: 'Grave',
        effect: 'Os carbapenêmicos inibem a acilpeptídeo hidrolase, reduzindo os níveis séricos do ácido valproico em 60% a 90% em menos de 24 horas e precipitando crises convulsivas refratárias (Estado de Mal Epiléptico).',
        conduct: 'Evitar carbapenêmicos em usuários de Depakene/Valproato; se indispensável, associar outro anticonvulsivante parenteral.',
      },
      {
        interactingSubstance: 'Fenobarbital / Fenitoína / Carbamazepina',
        severity: 'Grave',
        effect: 'O valproato inibe o metabolismo do fenobarbital (aumentando sedação), desloca a fenitoína da albumina e inibe a epóxido-hidrolase (acumulando o metabólito tóxico carbamazepina-10,11-epóxido).',
        conduct: 'Monitorização terapêutica (nível sérico) e observação clínica de ataxia/diplopia.',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Compatível com a amamentação (baixa transferência para o leite materno, < 5% da dose materna ajustada).',
    prescriptionType: 'Retenção de Receita (Antimicrobiano / Controle Especial C1)',
    clinicalPearls:
      'Dica de Prova e Balcão (Portaria 344/98 - Lista C1): Por ser ANTICONVULSIVANTE, a Receita de Controle Especial em 2 vias permite dispensação para até 180 DIAS (6 meses) de tratamento! As cápsulas de Depakene 250 mg NUNCA devem ser abertas ou mastigadas (o ácido valproico livre causa intensa irritação na mucosa oral e esofágica). Administrar com alimentos para reduzir náuseas.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
  {
    id: 'carbamazepina',
    name: 'Tegretol / Tegretol CR (Carbamazepina)',
    activeIngredient: 'Carbamazepina',
    englishActiveIngredient: 'carbamazepine',
    anvisaRegistry: '1.0068.0049',
    atcCode: 'N03AF01',
    therapeuticClass: 'Anticonvulsivante / Antiepiléptico e Estabilizador de Humor',
    pharmacologicalGroup: 'Derivado Tricíclico Iminostilbeno (Bloqueador de Canais de Sódio Naᵥ)',
    mechanismOfAction:
      'Liga-se preferencialmente aos canais de sódio dependentes de voltagem (Naᵥ) no estado inativado, estabilizando a membrana neuronal hiperexcitada e inibindo disparos repetitivos de alta frequência nos focos epilépticos e no nervo trigêmeo.',
    genericsAndSimilars: [
      'Tegretol / Tegretol CR (Novartis)',
      'Carbamazepina Genérico (Teuto, Medley, EMS, União Química)',
      'Tegretard',
    ],
    presentations: [
      'Comprimido simples 200 mg e 400 mg',
      'Comprimido divisível de liberação controlada (CR) 200 mg e 400 mg',
      'Suspensão oral 20 mg/mL (2%)',
    ],
    concentrations: ['200 mg', '400 mg', '20 mg/mL'],
    routeOfAdministration: ['Oral'],
    indications: [
      'Epilepsia: crises focais (parciais) simples ou complexas e crises tônico-clônicas generalizadas (Nota: pode PIORAR crises de ausência e mioclônicas!)',
      'Neuralgia do Trigêmeo e Neuralgia Glossofaríngea (tratamento de 1ª linha)',
      'Transtorno Afetivo Bipolar (mania aguda e profilaxia)',
    ],
    contraindications: [
      'Bloqueio atrioventricular (BAV)',
      'Histórico de depressão da medula óssea ou porfiria hepática',
      'Uso concomitante ou dentro de 14 dias de IMAO',
    ],
    adverseEffects: {
      common: ['Diplopia (visão dupla), ataxia, tontura, sonolência, náuseas', 'Hiponatremia dilucional (induz efeito semelhante ao ADH / SIADH)'],
      serious: [
        'Síndrome de Stevens-Johnson (SSJ) e NET (fortemente associada ao alelo HLA-B*1502)',
        'Agranulocitose e Anemia Aplástica (exige hemograma periódico)',
        'Teratogenicidade (defeitos do tubo neural — Categoria D)',
      ],
    },
    dosageGuide: {
      adult: 'Epilepsia: iniciar com 100 a 200 mg 1x a 2x/dia; titular até 800 a 1.200 mg/dia divididos de 8/8h ou 12/12h (faixa terapêutica: 4 a 12 mcg/mL).',
      pediatric: '10 a 20 mg/kg/dia divididos em 2 a 4 tomadas.',
      maxDailyDose: '1.600 mg/dia (adultos).',
      renalAdjustment: 'Se TFG < 10 mL/min, administrar 75% da dose e monitorar níveis séricos.',
    },
    pharmacokinetics: {
      bioavailability: '75% a 85%',
      halfLife: 'Inicial: 25 a 65 horas -> cai para 12 a 17 horas após 3 a 4 semanas devido ao fenômeno de AUTOINDUÇÃO ENZIMÁTICA!',
      metabolism: 'Hepático via CYP3A4 gerando o metabólito ativo Carbamazepina-10,11-epóxido. POTENTE INDUTOR ENZIMÁTICO (CYP3A4, CYP2C9, CYP1A2, UGT e P-gp)',
      excretion: 'Renal (72%) e Fecal (28%)',
      onsetOfAction: 'Estabilização sérica completa após conclusão da autoindução (3 a 5 semanas)',
      proteinBinding: '75% a 78%',
    },
    interactions: [
      {
        interactingSubstance: 'Anticoncepcionais Orais / Varfarina / Rivaroxabana / Ciclosporina',
        severity: 'Grave',
        effect: 'Por ser potente indutor da CYP3A4, a carbamazepina acelera a degradação de anticoncepcionais hormonais (causando gravidez indesejada) e anticoagulantes (causando trombose).',
        conduct: 'Orientar método contraceptivo não afetado (ex: DIU de cobre/mirena) e evitar DOACs.',
      },
      {
        interactingSubstance: 'Claritromicina / Eritromicina / Fluconazol / Suco de Toranja (Grapefruit)',
        severity: 'Grave',
        effect: 'Inibem a CYP3A4, elevando os níveis de carbamazepina a faixas tóxicas (ataxia intensa, diplopia, vômitos).',
        conduct: 'Substituir o macrolídeo por Azitromicina (que não inibe CYP3A4).',
      },
    ],
    pregnancyCategory: 'D',
    lactationSafety: 'Compatível com a amamentação (monitorar lactente quanto a possível sonolência).',
    prescriptionType: 'Retenção de Receita (Antimicrobiano / Controle Especial C1)',
    clinicalPearls:
      'Conceito clássico de Farmacocinética: A Carbamazepina sofre AUTOINDUÇÃO ENZIMÁTICA — ela induz a própria enzima CYP3A4 que a metaboliza! Por isso, uma dose que era eficaz no 1º mês pode tornar-se subterapêutica na 4ª semana, exigindo reajuste posológico.',
    sourceUrl: 'https://consultas.anvisa.gov.br/#/bulario/',
  },
];

// Tabela de Massas Molares e Valências de Insumos Farmacêuticos Comuns (Farmacotécnica & Físico-Química)
export interface ChemicalCompoundRef {
  name: string;
  formula: string;
  molarMass: number; // g/mol
  valence: number; // para cálculo de mEq e Normalidade
  dissociationParticles: number; // i (fator de van't Hoff aproximado para osmolaridade)
}

export const COMMON_PHARMA_COMPOUNDS: ChemicalCompoundRef[] = [
  { name: 'Cloreto de Sódio (NaCl)', formula: 'NaCl', molarMass: 58.44, valence: 1, dissociationParticles: 2 },
  { name: 'Cloreto de Potássio (KCl)', formula: 'KCl', molarMass: 74.55, valence: 1, dissociationParticles: 2 },
  { name: 'Glicose Anidra (Dextrose)', formula: 'C₆H₁₂O₆', molarMass: 180.16, valence: 1, dissociationParticles: 1 },
  { name: 'Bicarbonato de Sódio (NaHCO₃)', formula: 'NaHCO₃', molarMass: 84.01, valence: 1, dissociationParticles: 2 },
  { name: 'Sulfato de Magnésio Heptaidratado', formula: 'MgSO₄·7H₂O', molarMass: 246.47, valence: 2, dissociationParticles: 2 },
  { name: 'Gluconato de Cálcio', formula: 'C₁₂H₂₂CaO₁₄', molarMass: 430.37, valence: 2, dissociationParticles: 3 },
  { name: 'Cloreto de Cálcio Di-hidratado', formula: 'CaCl₂·2H₂O', molarMass: 147.01, valence: 2, dissociationParticles: 3 },
  { name: 'Hidróxido de Sódio (NaOH)', formula: 'NaOH', molarMass: 40.0, valence: 1, dissociationParticles: 2 },
  { name: 'Ácido Clorídrico (HCl)', formula: 'HCl', molarMass: 36.46, valence: 1, dissociationParticles: 2 },
  { name: 'Ácido Ascórbico (Vitamina C)', formula: 'C₆H₈O₆', molarMass: 176.12, valence: 1, dissociationParticles: 1 },
  { name: 'Paracetamol (Insumo IFA)', formula: 'C₈H₉NO₂', molarMass: 151.16, valence: 1, dissociationParticles: 1 },
  { name: 'Dipirona Sódica Monoidratada (IFA)', formula: 'C₁₃H₁₆N₃NaO₄S·H₂O', molarMass: 351.36, valence: 1, dissociationParticles: 2 },
];

// Presets de Farmácia Magistral (Fator de Equivalência Sal/Base e Diluídos)
export interface ManipulationActivePreset {
  name: string;
  prescribedAs: string;
  weighedAs: string;
  feq: number;
  defaultAssayPercent: number;
  defaultMoisturePercent: number;
  note: string;
}

export const MANIPULATION_FEQ_PRESETS: ManipulationActivePreset[] = [
  {
    name: 'Fluoxetina (Cloridrato -> Base)',
    prescribedAs: 'Fluoxetina Base (ex: 20 mg)',
    weighedAs: 'Cloridrato de Fluoxetina (MM 345,79 / Base 309,33)',
    feq: 1.12,
    defaultAssayPercent: 99.2,
    defaultMoisturePercent: 0.5,
    note: 'A prescrição médica refere-se à fluoxetina base, mas o insumo pesado na farmácia é o sal cloridrato (FEq = 1,12).',
  },
  {
    name: 'Sertralina (Cloridrato -> Base)',
    prescribedAs: 'Sertralina Base (ex: 50 mg)',
    weighedAs: 'Cloridrato de Sertralina (MM 342,69 / Base 306,23)',
    feq: 1.12,
    defaultAssayPercent: 99.5,
    defaultMoisturePercent: 0.3,
    note: 'FEq = 342,69 / 306,23 = 1,12. Sempre aplicar FEq quando prescrito como base.',
  },
  {
    name: 'Alendronato Sódico Tri-hidratado',
    prescribedAs: 'Ácido Alendrônico (ex: 70 mg)',
    weighedAs: 'Alendronato Sódico Tri-hidratado',
    feq: 1.31,
    defaultAssayPercent: 99.0,
    defaultMoisturePercent: 0.0,
    note: 'Já hidratado na estrutura molecular do sal tri-hidratado (FEq = 1,31 em relação ao ácido alendrônico livre).',
  },
  {
    name: 'Omeprazol Pellets 8,5% (Insumo Diluído)',
    prescribedAs: 'Omeprazol 20 mg',
    weighedAs: 'Omeprazol Microgrânulos Gastrorresistentes (Teor 8,5%)',
    feq: 1.0,
    defaultAssayPercent: 8.5,
    defaultMoisturePercent: 0.0,
    note: 'Os pellets de omeprazol têm teor de ~8,5% (FC = 100 / 8,5 = 11,76). Nunca triturar os pellets no gral!',
  },
  {
    name: 'Vitamina D3 (Colecalciferol 1:100.000 UI/g)',
    prescribedAs: 'Vitamina D3 (UI -> mg)',
    weighedAs: 'Colecalciferol Pó Diluído 100.000 UI/g',
    feq: 1.0,
    defaultAssayPercent: 100.0,
    defaultMoisturePercent: 0.0,
    note: '1 g do insumo padrão contém 100.000 UI (logo, 1 mg = 100 UI; para 2.000 UI pesa-se 20 mg do insumo diluído).',
  },
];

// Tabela Oficial de Deontologia e Legislação Farmacêutica (Portaria SVS/MS 344/98 e RDC 471/2021)
export interface Portaria344Rule {
  listCode: string;
  listTitle: string;
  prescriptionDocument: string;
  colorBadge: 'yellow' | 'blue' | 'white' | 'special';
  validityDays: string;
  maxTreatmentQuantity: string;
  examples: string[];
  keyRules: string;
}

export const PORTARIA_344_LISTS: Portaria344Rule[] = [
  {
    listCode: 'Listas A1, A2 e A3',
    listTitle: 'Entorpecentes (A1/A2) e Psicotrópicos Estimulantes (A3)',
    prescriptionDocument: 'Notificação de Receita "A" (Talonário Oficial fornecido pela Vigilância Sanitária)',
    colorBadge: 'yellow',
    validityDays: '30 dias a partir da emissão (válida em todo o território nacional)',
    maxTreatmentQuantity: 'Até 30 dias de tratamento (ou até 5 ampolas para injetáveis)',
    examples: ['Morfina (A1)', 'Metadona (A1)', 'Fentanila (A1)', 'Oxicodona (A1)', 'Metilfenidato / Ritalina (A3)', 'Lisdexanfetamina / Venvanse (A3)'],
    keyRules: 'Retenção obrigatória da Notificação Amarela na farmácia. Acima da quantidade máxima exige justificativa médica com CID.',
  },
  {
    listCode: 'Lista B1',
    listTitle: 'Substâncias Psicotrópicas (Ansiolíticos, Hipnóticos, Sedativos)',
    prescriptionDocument: 'Notificação de Receita "B" (Numeração controlada pela VISA)',
    colorBadge: 'blue',
    validityDays: '30 dias a partir da emissão (válida em todo o território nacional - Lei 13.732/18)',
    maxTreatmentQuantity: 'Até 60 dias de tratamento (ou até 5 ampolas para injetáveis)',
    examples: ['Clonazepam (Rivotril)', 'Alprazolam (Frontal)', 'Diazepam (Valium)', 'Bromazepam', 'Midazolam (Dormonid)', 'Zolpidem (> 10 mg ou conforme RDC vigente)'],
    keyRules: 'Notificação de cor AZUL. Retenção obrigatória na farmácia e escrituração no SNGPC.',
  },
  {
    listCode: 'Lista B2',
    listTitle: 'Psicotrópicos Anorexígenos',
    prescriptionDocument: 'Notificação de Receita "B2" + Termo de Responsabilidade do Prescritor',
    colorBadge: 'blue',
    validityDays: '30 dias a partir da emissão',
    maxTreatmentQuantity: 'Sibutramina: até 60 dias de tratamento (dose máx 15 mg/dia); demais B2: até 30 dias',
    examples: ['Sibutramina', 'Anfepramona', 'Femproporex', 'Mazindol'],
    keyRules: 'Exige assinatura do Termo de Responsabilidade e Esclarecimento pelo médico e pelo paciente (em 3 vias).',
  },
  {
    listCode: 'Lista C1',
    listTitle: 'Outras Substâncias Sujeitas a Controle Especial (Antidepressivos, Anticonvulsivantes, Antipsicóticos)',
    prescriptionDocument: 'Receita de Controle Especial em 2 vias (1ª via Farmácia / 2ª via Paciente)',
    colorBadge: 'white',
    validityDays: '30 dias a partir da emissão',
    maxTreatmentQuantity: 'Até 60 dias de tratamento (Antiparkinsonianos e Anticonvulsivantes: até 180 dias!)',
    examples: ['Sertralina', 'Fluoxetina', 'Escitalopram', 'Amitriptilina', 'Pregabalina', 'Quetiapina', 'Risperidona', 'Carbamazepina', 'Ácido Valproico', 'Tramadol (até 100 mg)', 'Codeína (até 100 mg)'],
    keyRules: 'Podem ser prescritas até 3 substâncias da Lista C1 por receita (ou até 5 amp).',
  },
  {
    listCode: 'Lista C2',
    listTitle: 'Substâncias Retinóicas de Uso Sistêmico',
    prescriptionDocument: 'Notificação de Receita Especial de Retinoides + Termo de Consentimento Pós-Informação',
    colorBadge: 'white',
    validityDays: '7 dias a partir da emissão!',
    maxTreatmentQuantity: 'Até 30 dias de tratamento (1 caixa)',
    examples: ['Isotretinoína (Roacutan)', 'Acitretina', 'Tretinoína sistêmica'],
    keyRules: 'Altamente teratogênico (Categoria X). Mulheres em idade fértil exigem teste de gravidez negativo (Beta-hCG) e dupla contracepção.',
  },
  {
    listCode: 'Lista C5',
    listTitle: 'Substâncias Anabolizantes',
    prescriptionDocument: 'Receita de Controle Especial em 2 vias (deve conter CPF do médico, endereço e CID-10!)',
    colorBadge: 'white',
    validityDays: '30 dias a partir da emissão',
    maxTreatmentQuantity: 'Até 60 dias de tratamento (ou até 5 ampolas)',
    examples: ['Durateston (Ésteres de Testosterona)', 'Decanoato de Nandrolona (Deca-Durabolin)', 'Oxandrolona'],
    keyRules: 'Lei Federal 9.965/2000: É obrigatório constar na receita o código CID-10 da doença e o CPF do médico prescritor.',
  },
  {
    listCode: 'RDC 471/2021 (Antimicrobianos)',
    listTitle: 'Antibióticos / Antimicrobianos Sujeitos a Retenção de Receita',
    prescriptionDocument: 'Receita Simples em 2 vias (1ª via devolvida ao paciente / 2ª via retida na farmácia)',
    colorBadge: 'special',
    validityDays: '10 dias a partir da emissão (exceto uso prolongado até 90 dias se indicado)',
    maxTreatmentQuantity: 'Conforme duração do tratamento prescrito',
    examples: ['Amoxicilina', 'Azitromicina', 'Ciprofloxacino', 'Cefalexina', 'Sulfametoxazol + Trimetoprima', 'Levofloxacino', 'Metronidazol'],
    keyRules: 'Deve conter nome completo do paciente, idade e sexo (RDC 471/2021 / antiga RDC 20/2011).',
  },
];

// Tabela de Toxicologia Clínica e Antídotos Específicos (Essencial para Provas e Emergência)
export interface ToxicologyAntidote {
  toxicAgent: string;
  antidote: string;
  toxicityMechanism: string;
  antidoteMechanism: string;
  clinicalSign: string;
}

export const TOXICOLOGY_ANTIDOTES: ToxicologyAntidote[] = [
  {
    toxicAgent: 'Paracetamol (Acetaminofeno)',
    antidote: 'N-Acetilcisteína (NAC / Fluimucil)',
    toxicityMechanism: 'Saturação da glicuronidação/sulfatação com formação excessiva do metabólito hepatotóxico NAPQI via CYP2E1 e depleção de glutationa.',
    antidoteMechanism: 'Precursor de L-cisteína que regenera os estoques hepáticos de Glutationa reduzida (GSH), conjugando e inativando o NAPQI.',
    clinicalSign: 'Elevação acentuada de TGO/TGP após 24–48h, icterícia, coagulopatia e necrose hepática centrolobular.',
  },
  {
    toxicAgent: 'Benzodiazepínicos (Clonazepam, Diazepam, Midazolam)',
    antidote: 'Flumazenil (Lanexat)',
    toxicityMechanism: 'Potencialização alostérica do GABA no receptor GABA-A, aumentando influxo de cloreto (Cl⁻).',
    antidoteMechanism: 'Antagonista competitivo específico do sítio de ligação dos benzodiazepínicos no complexo receptor GABA-A.',
    clinicalSign: 'Ataxia, disartria, sonolência profunda, hiporreflexia e depressão respiratória (cautela: Flumazenil pode precipitar convulsão em dependentes crônicos).',
  },
  {
    toxicAgent: 'Opioides (Morfina, Fentanil, Tramadol, Heroína)',
    antidote: 'Naloxona (Narcan)',
    toxicityMechanism: 'Agonismo dos receptores opioides µ (mu) no tronco encefálico, reduzindo a sensibilidade bulbar ao CO₂.',
    antidoteMechanism: 'Antagonista competitivo puro dos receptores opioides (µ, κ, δ) com rápido início de ação EV (1 a 2 minutos).',
    clinicalSign: 'Tríade clássica opioide: Miose puntiforme ("pupila em ponta de alfinete"), Depressão Respiratória (bradipneia) e Coma.',
  },
  {
    toxicAgent: 'Inseticidas Organofosforados (Malation) e Carbamatos (Chumbinho / Aldicarb)',
    antidote: 'Atropina + Pralidoxima (Contrathion)',
    toxicityMechanism: 'Inibição da enzima Acetilcolinesterase (irreversível nos organofosforados e reversível nos carbamatos), gerando acúmulo maciço de Acetilcolina.',
    antidoteMechanism: 'A Atropina bloqueia os receptores muscarínicos (seca secreções brônquicas); a Pralidoxima reativa a acetilcolinesterase fosforilada (antes do "envelhecimento" da ligação).',
    clinicalSign: 'Síndrome Colinérgica ("SLUDGE"): Sialorreia, Lacrimejamento, Urina/Incontinência, Diarreia, Broncorreia intensa, Bradicardia e Miose.',
  },
  {
    toxicAgent: 'Varfarina e Rodenticidas Cumarínicos',
    antidote: 'Vitamina K1 (Fitomenadiona) + Complexo Protrombínico',
    toxicityMechanism: 'Inibição da enzima epóxido-redutase da vitamina K (VKORC1), impedindo a gama-carboxilação hepática dos fatores II, VII, IX e X.',
    antidoteMechanism: 'Fornece Vitamina K1 reduzida necessária para retomar a síntese hepática dos fatores de coagulação dependentes de vitamina K.',
    clinicalSign: 'Alargamento do TAP/INR, epistaxe, gengivorragia, hematúria e hemorragias graves.',
  },
  {
    toxicAgent: 'Heparina Não Fracionada (HNF) e HBPM (Enoxaparina)',
    antidote: 'Sulfato de Protamina',
    toxicityMechanism: 'Ativação da Antitrombina III, inativando a Trombina (Fator IIa) e o Fator Xa.',
    antidoteMechanism: 'Antagonismo químico (neutralização ácido-base): a Protamina (fortemente básica/catiônica) liga-se à Heparina (fortemente ácida/aniônica) formando complexo inativo (1 mg de protamina neutraliza ~100 UI de HNF).',
    clinicalSign: 'Sangramento ativo e alargamento do TTPa.',
  },
  {
    toxicAgent: 'Beta-Bloqueadores (Propranolol, Atenolol)',
    antidote: 'Glucagon (em altas doses EV)',
    toxicityMechanism: 'Bloqueio dos receptores beta-1 adrenérgicos cardíacos, reduzindo AMPc intracelular, cronotropismo e inotropismo.',
    antidoteMechanism: 'Antagonismo fisiológico: ativa receptores específicos de glucagon no miocárdio acoplados à proteína Gs, aumentando o AMPc e a contratilidade cardíaca de forma independente do receptor beta-adrenérgico!',
    clinicalSign: 'Bradicardia severa, hipotensão refratária, bloqueio atrioventricular e broncoespasmo.',
  },
  {
    toxicAgent: 'Metanol (bebidas adulteradas) e Etilenoglicol',
    antidote: 'Fomepizol ou Etanol (Álcool Etílico)',
    toxicityMechanism: 'A enzima Álcool Desidrogenase (ADH) converte o Metanol em Formaldeído e Ácido Fórmico (tóxico ao nervo óptico) e o Etilenoglicol em Ácido Oxálico (nefrotoxicidade).',
    antidoteMechanism: 'Inibição competitiva da enzima Álcool Desidrogenase (o Etanol tem afinidade 10 a 20x maior pela ADH que o metanol, impedindo a formação dos ácidos tóxicos).',
    clinicalSign: 'Acidose metabólica com Anion Gap e Gap Osmolar elevados, visão em "tempestade de neve" e cegueira (metanol) ou cristais de oxalato de cálcio na urina (etilenoglicol).',
  },
];

