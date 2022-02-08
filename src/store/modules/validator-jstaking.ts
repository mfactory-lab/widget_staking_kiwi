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
import { computed, ref, watch } from 'vue';
import { loadApyInfo, useConnectionStore, useEpochStore, useValidatorStore } from '@/store';
import { DEFAULT_APY, DEFAULT_VALIDATOR } from '@/config';
import { useLocalStorage } from '@vueuse/core';

// const validatorId = ref<string>(DEFAULT_VALIDATOR['mainnet-beta'].idPubkey);
const voterKey = ref<string>(DEFAULT_VALIDATOR['mainnet-beta'].voterKey);
const totalStake = ref(0);
const commission = ref(0);
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

export const useValidatorJstakingStore = defineStore('validators-jstaking', () => {
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
  const connection = computed(() => connectionStore.connection);
  const epochStore = useEpochStore();
  const epochInfo = computed(() => epochStore.epochInfo);
  const loading = ref(!apyInfo.value?.lastEpoch);
  const validatorStore = useValidatorStore();

  watch(
    cluster,
    (cluster) => {
      // validatorId.value = DEFAULT_VALIDATOR[cluster].idPubkey;
      const queryString = location.search;
      const params = new URLSearchParams(queryString);
      const validator = params.get('validator');
      if (!!validator) {
        voterKey.value = validator;
      } else {
        voterKey.value = DEFAULT_VALIDATOR[cluster].voterKey;
      }
      validatorStore.load();
    },
    { immediate: true },
  );

  watch(
    [epochInfo],
    async ([epochInfo]) => {
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
            validators: res?.validators ?? [],
          };
        } finally {
          loading.value = false;
        }
      }
    },
    { immediate: true },
  );
  const apy = computed(() => {
    if (cluster.value !== 'mainnet-beta') {
      return DEFAULT_APY;
    }
    const voteApy = apyInfo.value?.validators ?? [];
    const validatorInfo = voteApy.find((v) => v.vote == voterKey.value);
    return validatorInfo?.apy ?? 0;
  });

  watch(
    [voterKey],
    async ([voter]) => {
      const validators = await connection.value.getVoteAccounts();
      const voterData = validators.current.find((item) => item.votePubkey === voter);
      if (voterData) {
        totalStake.value = voterData.activatedStake;
        commission.value = voterData.commission;
      } else {
        voterKey.value = DEFAULT_VALIDATOR[cluster.value].voterKey;
        // totalStake.value = 0;
        // commission.value = 0;
      }
    },
    { immediate: true },
  );

  return {
    jpoolVoters: computed(() => validatorStore.voteIds),
    // validatorId,
    voterKey,
    totalStake,
    commission,
    apyLoading: computed(() => loading.value),
    apy,
  };
});
