/*
 * This file is part of Solana Reference Stake Pool code.
 *
 * Copyright © 2021, mFactory GmbH
 *
 * Solana Reference Stake Pool is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Solana Reference Stake Pool is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 * If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 *
 * You can be released from the requirements of the Affero GNU General Public License
 * by purchasing a commercial license. The purchase of such a license is
 * mandatory as soon as you develop commercial activities using the
 * Solana Reference Stake Pool code without disclosing the source code of
 * your own applications.
 *
 * The developer of this program can be contacted at <info@mfactory.ch>.
 */

import { ref, toRef } from 'vue';
import { useApyStore } from '@/store';

const epochHours = ref(60); // hours
const investmentAmount = ref<string>('100');
const investmentTime = ref<string>('12');
const investmentPeriod = ref('Month');
const totalAmount = ref(0);
const solDay = ref(0);
const solMonth = ref(0);
const solYear = ref(0);

export function useRoiCalculator() {
  const apyStore = useApyStore();
  const apy = toRef(apyStore, 'apy');

  function calc() {
    const amount = Number(investmentAmount.value);
    const period =
      Number(investmentTime.value) * getPeriodModifier(investmentPeriod.value, epochHours.value);
    const epochFreq = (365 / epochHours.value) * 24;
    const epochsPerYear = (365 * 24) / epochFreq;

    const apr = (Math.pow(1 + apy.value, 1 / epochsPerYear) - 1) * epochsPerYear;
    // const resultSol = amount * Math.pow(1 + apy.value / epochFreq, epochFreq * period);
    const resultSol = amount * Math.pow(1 + apr / epochFreq, epochFreq * period);

    totalAmount.value = resultSol;
    const interest = resultSol - amount;

    solYear.value = interest / period;
    solMonth.value = solYear.value / 12;
    solDay.value = solYear.value / 365;
  }

  return {
    apy,
    epochHours,
    investmentAmount,
    investmentTime,
    investmentPeriod,
    totalAmount,
    solDay,
    solMonth,
    solYear,
    calc,
  };
}

const getPeriodModifier = (val: string, epochHours: number): number => {
  switch (val) {
    case 'Year':
      return 1;
    case 'Month':
      return 1 / 12;
    default:
      return (0.0027397 * epochHours) / 24;
  }
};
