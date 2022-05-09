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
import { useConnectionStore } from '@/store';
import { useDebounceFn } from '@vueuse/core';
import { getValidatorsStats } from '@/utils';

export const useValidatorStore = defineStore('validator', () => {
  const validatorId = ref<string>('');
  const voterKey = ref<string>('');
  const totalStake = ref(0);
  const commission = ref(0);
  const apy = ref(0);
  const validatorDelinquent = ref(false);
  const loading = ref(false);
  const wrongVote = ref(false);

  const connectionStore = useConnectionStore();
  const cluster = computed(() => connectionStore.cluster);

  const network = computed(() => connectionStore.cluster.replace('-beta', ''));

  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const validator = params.get('validator');
  if (!!validator) {
    voterKey.value = validator;
  } else {
    wrongVote.value = true;
  }

  const loadValidator = async () => {
    console.log('[useValidatorStore] Loading ===', loading.value);
    console.log('[useValidatorStore] validator ===', validator);
    if (loading.value || !validator) {
      return;
    }
    loading.value = true;
    try {
      console.log('[useValidatorStore] Loading validator stats...');
      const validatorsStats = await getValidatorsStats(network.value, validator);
      if (!!validatorsStats[0]) {
        wrongVote.value = false;
        const voterData = validatorsStats[0];
        totalStake.value = Number(voterData.totalStake);
        commission.value = voterData.fee;
        apy.value = voterData.apy;
        validatorId.value = voterData.validatorId;
        validatorDelinquent.value = voterData.isDelinquent;
      } else {
        totalStake.value = 0;
        commission.value = 0;
        apy.value = 0;
        validatorId.value = '';
        wrongVote.value = true;
      }
    } catch (e) {
      console.log('[useValidatorStore] Error:', e);
    } finally {
      loading.value = false;
    }
  };

  watch(
    cluster,
    useDebounceFn(() => {
      loadValidator();
    }, 250),
    { immediate: true },
  );

  return {
    validatorId,
    voterKey,
    totalStake,
    commission,
    loading,
    apy,
    validatorDelinquent,
    wrongVote,
  };
});
