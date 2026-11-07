import { Medication, DrugInteraction } from '@/types/pharma';
import { normalizePlain } from '@/utils/phonetic-search';

export interface DetectedInteraction {
  pair: string;
  severity: DrugInteraction['severity'];
  effect: string;
  conduct: string;
}

function matchesTargetSubstance(inter: DrugInteraction, candidate: Medication): boolean {
  const target = normalizePlain(inter.interactingSubstance);
  const activeFirst = normalizePlain(candidate.activeIngredient).split(/[\s(]+/)[0];
  const medClass = normalizePlain(candidate.therapeuticClass);
  const medGroup = normalizePlain(candidate.pharmacologicalGroup);

  return (
    (activeFirst.length >= 3 && target.includes(activeFirst)) ||
    (target.includes('aine') && (medClass.includes('aine') || medGroup.includes('cox') || medClass.includes('anti-inflamatorio'))) ||
    (target.includes('diuretico') && medClass.includes('diuretico')) ||
    (target.includes('ieca') && medGroup.includes('ieca')) ||
    (target.includes('bra') && medGroup.includes('bra')) ||
    (target.includes('opioide') && (medClass.includes('opioide') || medGroup.includes('opioide'))) ||
    (target.includes('benzodiazepinico') && (medClass.includes('benzodiazepinico') || medGroup.includes('benzodiazepinico')))
  );
}

/**
 * Detecta interações medicamentosas de forma simétrica (verifica A -> B e B -> A)
 * e sem duplicatas entre uma lista de medicamentos.
 */
export function findPairwiseInteractions(meds: Medication[]): DetectedInteraction[] {
  const alerts: DetectedInteraction[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < meds.length; i++) {
    for (let j = i + 1; j < meds.length; j++) {
      const medA = meds[i];
      const medB = meds[j];
      if (medA.id === medB.id) continue;

      const pairLabel = `${medA.name.split('(')[0].trim()} + ${medB.name.split('(')[0].trim()}`;
      const sortedIds = [medA.id, medB.id].sort().join(':');

      const checkDirection = (source: Medication, target: Medication) => {
        for (const inter of source.interactions) {
          if (matchesTargetSubstance(inter, target)) {
            const dedupKey = `${sortedIds}:${normalizePlain(inter.effect).slice(0, 40)}`;
            if (!seen.has(dedupKey)) {
              seen.add(dedupKey);
              alerts.push({
                pair: pairLabel,
                severity: inter.severity,
                effect: inter.effect,
                conduct: inter.conduct,
              });
            }
          }
        }
      };

      checkDirection(medA, medB);
      checkDirection(medB, medA);
    }
  }

  return alerts;
}
