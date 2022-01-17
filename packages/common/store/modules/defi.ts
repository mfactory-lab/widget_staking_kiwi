/*
 * This file is part of the Web3 Library developed by mFactory GmbH.
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

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DEFI_RELOAD_DURATION } from '@/config';
import { getRaydiumPairs } from '@jpool/common/utils/raydium';
import { DEFI } from '@/config';

interface DefiValue {
  apr: number | null,
  tvl: number | null
}

export const useDefiStore = defineStore('defi', () => {
  // const { connection } = storeToRefs(useConnection());
  const defiValues = ref<{ [key: string]: DefiValue }>({});

  const getPairs = async () => {
    const pairsRaydium = await getRaydiumPairs();
    DEFI.forEach((item) => {
      if (item.type === 'raydium') {
        const obj = pairsRaydium.find((pair) => pair.name === item.pairName);
        if (item.liquidityLink && item.swapLink) {
          defiValues.value[item.id] = {
            apr: obj?.apy ?? null,
            tvl: obj?.liquidity ?? null,
          };
        } else {
          defiValues.value[item.id] = {
            apr: null,
            tvl: null,
          };
        }
      }
    });
  };
  getPairs();

  setInterval(async () => {
    await getPairs();
  }, DEFI_RELOAD_DURATION);

  return {
    defiValues,
  };
});
