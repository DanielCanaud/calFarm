# Pull Request: feat(prescription): blindagem de segurança clínica, cálculo de dose máxima e validação regulatória no leitor inteligente

- **Branch de Origem**: `feat/prescription-clinical-safety-shield`
- **Branch de Destino**: `main`
- **Autor**: `git-version-specialist` & `tech-lead-architect`
- **Status**: Pronto para Merge / 100% dos testes aprovados (32/32)

---

## 🎯 Resumo Executivo & Dor Solucionada

Este Pull Request implementa a **Blindagem de Segurança Clínica e Pedagógica** no módulo **Leitor Inteligente de Prescrições** do CalcFarm. 

### Dor Solucionada:
Anteriormente, estudantes de Farmácia enfrentavam riscos de indução ao erro na interpretação de receitas médicas devido a 4 lacunas críticas:
1. **Falsa sensação de segurança em interações**: As interações só eram detectadas para um array fixo de 15 medicamentos, deixando prescrições reais com fármacos comuns (Varfarina, AINEs, Anti-hipertensivos) sem alertas de risco.
2. **Superdosagem oculta**: O leitor extraía a posologia por tomada, mas não calculava a dose acumulada no dia, permitindo que doses tóxicas (ex.: Paracetamol 4.500 mg/dia) passassem sem aviso.
3. **Duplicidade despercebida**: Prescrições com mesmo princípio ativo em marcas diferentes ou múltiplos AINEs não eram sinalizadas.
4. **Descompasso sanitário**: Não havia conferência da validade legal da receita médica (RDC 20/2011 para antibióticos - 10 dias; Portaria 344/98 para controle especial - 30 dias).
5. **Automação cega**: Possibilidade de imprimir a orientação de balcão sem conferência humana visual contra a receita física original.

### Regras de Negócio e Critérios Atendidos:
- **`RN-CLI-001` (Cálculo de Dose Máxima Diária - DMD)**: Toda posologia é multiplicada pela frequência diária e confrontada contra o teto oficial da ANVISA. Doses excedentes emitem alerta vermelho imediato.
- **`RN-CLI-002` (Detecção de Duplicidade Terapêutica)**: Bloqueio/aviso de mesma molécula ou sobreposição da mesma classe farmacológica (ex.: 2 AINEs simultâneos).
- **`RN-CLI-003` (Matriz Expandida de Interações Farmacológicas)**: Cobertura simétrica por classes terapêuticas (AINE + Anticoagulante, AINE + Corticoide, Benzodiazepínico + Opioide, Tríade Nefrotóxica "Triple Whammy", etc.).
- **`RN-CLI-004` (Conformidade Regulatória Deontológica)**: Identificação da exigência de receituário (RDC 20, Portaria 344 Listas A/B/C1) e cálculo de expiração a partir da data de emissão.
- **`RN-CLI-005` (Trava Pedagógica Human-in-the-Loop)**: O botão de impressão de orientação ao paciente é bloqueado até a validação de 100% dos itens e confirmação expressa do estudante.

---

## 🏗️ Alterações Técnicas por Camada

### 1. Camada de Domínio & Regras Clínicas (`src/utils/clinical-safety.ts` e `src/types/pharma.ts`)
- Criação de `MAX_DAILY_DOSES_DB` contendo parâmetros toxicológicos e doses máximas diárias da ANVISA para fármacos de alta prescrição.
- Função `parseDoseInMg`: parser de unidades de massa (mg, g, mcg) e gotas (20 gts = 1 mL).
- Função `parseDailyFrequencyMultiplier`: parser inteligente de aprazamentos em português (`de 8 em 8 horas`, `12/12h`, `se dor/febre`, etc.).
- Função `evaluateDailyDose`: cálculo da dose acumulada em 24h e emissão de alerta de superdosagem.
- Função `detectDuplications`: mapeamento de mesma substância ou mesma classe (AINE, IBP, benzo, opioide, estatina).
- Função `detectExpandedInteractions`: avaliação cruzada de 11 classes farmacológicas e detecção da síndrome do *Triple Whammy*.
- Função `validatePrescriptionRegulations`: conferência de tipo de notificação e dias decorridos vs. teto legal (10 dias para antimicrobianos, 30 dias para psicotrópicos).
- Adição dos tipos `DuplicationAlert`, `RegulatoryValidationResult` e campos de segurança em `PrescriptionItem`.

### 2. Camada de Extração & APIs (`src/utils/prescription-parser.ts` e `src/app/api/prescription/analyze/route.ts`)
- Enriquecimento automático de itens após a extração textual ou análise multimodal com a IA Gemini Vision.
- Associação de classes farmacológicas e cálculo preliminar de dose diária.

### 3. Camada de Apresentação & UI (`src/components/tools/PrescriptionReader.tsx` e `MedicationSearch.tsx`)
- Adição do componente de **Deontologia e Validação Sanitária** com seletor de data de emissão e alerta de receita vencida.
- Adição do banner visual de **Duplicidade Terapêutica**.
- Badges dinâmicos nos cartões de medicamentos exibindo classe terapêutica, dose calculada e caixa vermelha em caso de superdosagem.
- Implementação da **Trava Pedagógica Human-in-the-Loop** com bloqueio inteligente do botão de impressão.
- Correção no `MedicationSearch.tsx` para eliminar cascading renders no React 19 através de derivação pura com `useMemo`.

---

## 🧪 Validação de Qualidade (QA) & Segurança (AppSec)

- [x] **Testes Unitários Automatizados (`qa-validator`)**: 32 testes passando no Vitest (10 novos testes dedicados em `clinical-safety.test.ts`).
- [x] **Linter & Code Hygiene**: ESLint aprovado com **0 erros e 0 warnings**.
- [x] **Compilação de Produção**: `next build` com Turbopack concluído com sucesso em 872ms.
- [x] **Segurança de Código (AppSec)**: Nenhum dado de paciente ou chave de API é persistido em logs; sanitização estrita de strings na API.
- [x] **Commits Atômicos no Padrão Conventional Commits**:
  - `a59ae32 feat(clinical-safety): adicionar motor de calculo de dose diaria e interacoes por classe`
  - `4ffef96 feat(prescription-parser): enriquecer extracao com classes e regras de seguranca clinica`
  - `62ecab9 feat(prescription-reader): implementar trava human-in-the-loop e validacao regulatoria`
  - `a30cc33 test(clinical-safety): adicionar suite cobrindo teto de dose, duplicidades e deontologia`

---

## 🚀 Como Testar Localmente

1. Execute a aplicação:
   ```bash
   npm run dev
   ```
2. Acesse `http://localhost:3000` e selecione a ferramenta **03. Leitor Inteligente de Prescrições**.
3. **Teste 1 (Superdosagem)**: Adicione *Paracetamol 750 mg de 4/4h* $\rightarrow$ O sistema alerta $4.500\text{ mg/dia}$ (acima dos $4.000\text{ mg/dia}$).
4. **Teste 2 (Duplicidade)**: Adicione *Ibuprofeno* e *Diclofenaco* $\rightarrow$ Alerta de dois AINEs simultâneos.
5. **Teste 3 (Triple Whammy)**: Carregue a Receita Modelo 2 $\rightarrow$ Alerta máximo de tríade nefrotóxica.
6. **Teste 4 (Validade RDC 20)**: Na Receita 1 com Amoxicilina, coloque a data de emissão há 12 dias atrás $\rightarrow$ Alerta vermelho de **Receita Vencida**.
7. **Teste 5 (Trava de Impressão)**: O botão de impressão só libera após conferência de todos os itens e assinalamento da declaração pedagógica.

---

## 📤 Comandos Git para Push e Abertura no GitHub

Para subir a branch e abrir o Pull Request no repositório remoto:

```bash
# 1. Enviar a branch para o GitHub
git push -u origin feat/prescription-clinical-safety-shield

# 2. Criar o PR no navegador ou via GitHub CLI (quando instalado)
# Acesse: https://github.com/DanielCanaud/calFarm/pull/new/feat/prescription-clinical-safety-shield
```
