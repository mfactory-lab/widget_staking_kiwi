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

import { computed, ref, watch } from 'vue';
import { loadApyInfo, useConnectionStore, useEpochStore } from '@jpool/common/store';
import { DEFAULT_APY, DEFAULT_VALIDATOR, DEFAULT_VOTER } from '@/config';

const validatorId = ref<string>(DEFAULT_VALIDATOR);
const voterKey = ref<string>(DEFAULT_VOTER);
interface ApyValidatorInfo {
  id: string;
  vote: string;
  apy: number;
}
interface ApyInfo {
  beginTimestamp: number;
  collectionTimestamp: number;
  endTimestamp: number;
  firstEpoch: number;
  isEstimated: boolean;
  lastEpoch: number;
  validators: ApyValidatorInfo[];
}

import { useLocalStorage } from '@vueuse/core';

export function useValidator() {
  const apyInfo = useLocalStorage<ApyInfo>('apy', {
    beginTimestamp: 0,
    collectionTimestamp: 0,
    endTimestamp: 0,
    firstEpoch: 0,
    isEstimated: false,
    lastEpoch: 0,
    validators: [],
  });
  const connectionStore = useConnectionStore();
  const cluster = computed(() => connectionStore.cluster);
  const epochStore = useEpochStore();
  const epochInfo = computed(() => epochStore.epochInfo);
  const loading = ref(!apyInfo.value?.lastEpoch);

  watch([epochInfo], async ([epochInfo]) => {
    if (epochInfo?.epoch) {
      if (apyInfo.value?.lastEpoch == epochInfo.epoch) {
        loading.value = false;
        return;
      }
      loading.value = true;
      try {
        const res = await loadApyInfo('prev10');
        apyInfo.value = {
          ...res,
          validators: res?.validators.filter((v) => v.vote == voterKey.value) ?? [],
        };
      } finally {
        loading.value = false;
      }
    }
  });
  const apy = computed(() => {
    if (cluster.value !== 'mainnet-beta') {
      return DEFAULT_APY;
    }
    const voteApy = apyInfo.value?.validators ?? [];
    const validatorInfo = voteApy.find((v) => v.id == validatorId.value);
    return validatorInfo?.apy ?? 0;
  });

  return {
    validatorId,
    voterKey,
    apyLoading: computed(() => loading.value),
    apy,
  };
}
