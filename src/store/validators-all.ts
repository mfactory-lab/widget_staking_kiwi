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
import { computed, ref, shallowRef, watch } from 'vue';
import { useDebounce, useDebounceFn, useLocalStorage } from '@vueuse/core';
import { useWallet } from 'solana-wallets-vue';
import { useConnectionStore, useStakeAccountStore } from '@/store';
import { useEmitter } from '@/hooks';
import {
  ApyStats,
  ValidatorStats,
  formatPct,
  getAverageApy,
  getValidatorsStats,
  lamportsToSol,
  priceFormatter,
} from '@/utils';

export const DELINQ_UPDATE_EVENT = Symbol();
export const DELINQ_UPDATE_INTERVAL = 60000;

export interface ValidatorItem {
  id: string;
  apyNum: number;
  apyEstNum: number;
  feeNum: number;
  apy: number;
  apyEst: number;
  fee: number;
  voter: string;
  totalStake: number;
  totalSolStacked: number;
  name: string;
  details: string;
  website: string;
  keybaseUsername: string;
  image: string;
  url: string;
  inTop33: boolean;
  inJpool: boolean;
  isDelinquent: boolean;
  svName: string;
  apyComparedMax: number;
  network: string;
  lamports: 0;
  myStake: number;
  myStakeSol: number;
  lastVote: string;
}

export interface Filters {
  top33: boolean;
  private: boolean;
  withFee: boolean;
  noname: boolean;
  delinquent: boolean;
  onlyJpool: boolean;
  onlySvm: boolean;
  hasStake: boolean;
}

export const useValidatorsAllStore = defineStore('validators-all', () => {
  const emitter = useEmitter();
  const connectionStore = useConnectionStore();
  const stakeAccountStore = useStakeAccountStore();
  const stakeAccounts = computed(() => stakeAccountStore.data);
  // const epochStore = useEpochStore();
  const cluster = computed(() => connectionStore.cluster);
  // const epoch = computed(() => epochStore.epochNumber);
  const { connected } = useWallet();

  const validatorsStats = shallowRef<Array<ValidatorStats>>([]);
  const averageApy = shallowRef<Array<ApyStats>>([]);
  const averageApyLoading = ref(false);
  const loading = ref(false);

  const nameFilter = ref('');
  const nameFilterDebounce = useDebounce(nameFilter, 500);

  const sortType = useLocalStorage<string>('sort-type', 'desc');
  const sortParam = useLocalStorage<string>('sort-param', 'apyNum');

  const filters = useLocalStorage<Filters>('filters', {
    top33: true,
    private: true,
    withFee: false,
    noname: false,
    delinquent: false,
    onlyJpool: false,
    onlySvm: false,
    hasStake: false,
  });

  const showControls = useLocalStorage<boolean>('show-controls', true);
  const showControlsMob = useLocalStorage<boolean>('show-controls-mob', false);

  const loadAllValidators = async () => {
    if (loading.value) {
      return;
    }
    const network = connectionStore.cluster.replace('-beta', '');
    loading.value = true;
    try {
      console.log('[useValidatorsAllStore] Loading validator stats...');
      validatorsStats.value = await getValidatorsStats(network);
    } catch (e) {
      console.log('[useValidatorsAllStore] Error:', e);
    } finally {
      loading.value = false;
    }
  };

  const loadAverageApy = async () => {
    if (averageApyLoading.value) {
      return;
    }
    if (cluster.value === 'mainnet-beta') {
      averageApyLoading.value = true;
      console.log('[useValidatorsAllStore] Loading average APY...');
      averageApy.value = await getAverageApy();
      averageApyLoading.value = false;
    } else {
      averageApy.value = [];
    }
  };

  // onBeforeMount(() => {
  //   loadAverageApy();
  //   if (validatorsStats.value.length < 1) {
  //     loadAllValidators();
  //   }
  // });

  watch(
    connected,
    (connected) => {
      if (!connected) filters.value.hasStake = false;
    },
    { immediate: true },
  );

  watch(
    cluster,
    useDebounceFn(() => {
      loadAllValidators();
      loadAverageApy();
    }, 250),
    { immediate: true },
  );

  function formatAmountPrice(val: number | bigint) {
    return priceFormatter.format(val);
  }

  setInterval(async () => {
    emitter.emit(DELINQ_UPDATE_EVENT);
  }, DELINQ_UPDATE_INTERVAL);

  const items = computed<ValidatorItem[]>(() => {
    if (loading.value) {
      return Array(10).fill({});
    }

    return validatorsStats.value.map((voteAccount) => {
      const pubKey = voteAccount.validatorId;
      const keybaseUsername = voteAccount.keybaseUsername;
      const solTotal = lamportsToSol(Number(voteAccount.totalStake));

      let myStake = 0;
      if (stakeAccounts.value.length > 0) {
        myStake = lamportsToSol(
          Number(
            stakeAccounts.value
              .filter(
                (item) =>
                  item.account.data?.parsed?.info?.stake?.delegation?.voter == voteAccount.voteId,
              )
              .reduce((prev, curr) => prev + curr.account.lamports, 0),
          ),
        );
      }

      return {
        id: pubKey,
        apyNum: voteAccount.apy,
        apyEstNum: voteAccount.apyEst,
        feeNum: voteAccount.fee,
        apy: formatPct.format(voteAccount.apy ?? 0),
        apyEst: formatPct.format(voteAccount.apyEst ?? 0),
        fee: formatPct.format(voteAccount.fee / 100),
        voter: voteAccount.voteId,
        totalStake: voteAccount.totalStake,
        totalSolStacked: formatAmountPrice(solTotal),
        name: voteAccount.name,
        details: voteAccount.details,
        website: voteAccount.website,
        keybaseUsername: keybaseUsername,
        image: keybaseUsername
          ? `https://keybase.io/${keybaseUsername}/picture?format=square_200`
          : undefined,
        //url: `https://www.validators.app/validators/${voteAccount.network}/${pubKey}`,
        inTop33: voteAccount.inTop33,
        inJpool: voteAccount.inJpool,
        isDelinquent: voteAccount.isDelinquent,
        svName: voteAccount.svName,
        apyComparedMax: voteAccount.apyComparedMax,
        network: voteAccount.network,
        lamports: 0,
        myStake: myStake,
        myStakeSol: myStake > 1 ? formatAmountPrice(myStake) : myStake,
        lastVote: voteAccount.lastVote,
      };
    });
  });

  // filters & sort
  const itemsComputed = computed(() => {
    if (loading.value) {
      return items.value;
    }

    const search = nameFilterDebounce.value?.toLowerCase();

    return Object.freeze(
      [...items.value]
        .filter((item) => {
          if (
            search &&
            (!item.name || item.name?.toLowerCase().indexOf(search) === -1) &&
            item.voter.toLowerCase().indexOf(search) === -1 &&
            item.id.toLowerCase().indexOf(search) === -1
          ) {
            return false;
          }
          if (filters.value.withFee && item.feeNum > 0) {
            return false;
          }
          if (filters.value.noname && !item.name) {
            return false;
          }
          if (filters.value.delinquent && item.isDelinquent) {
            return false;
          }
          if (filters.value.onlySvm && !item.svName) {
            return false;
          }
          if (filters.value.private && item.feeNum === 100) {
            return false;
          }
          if (filters.value.top33 && item.inTop33) {
            return false;
          }
          if (filters.value.onlyJpool && !item.inJpool) {
            return false;
          }
          if (filters.value.hasStake && !item.myStake) {
            return false;
          }

          return true;
        })

        // sort items

        .sort((a, b) => {
          if (sortParam.value === 'name') {
            const aName = a.name ?? a.id;
            const bName = b.name ?? b.id;
            if (sortType.value === 'asc') {
              return aName.localeCompare(bName);
            }
            return bName.localeCompare(aName);
          }
          if (sortType.value === 'asc') {
            return a[sortParam.value] - b[sortParam.value];
          }
          return b[sortParam.value] - a[sortParam.value];
        }),
    );
  });

  return {
    validatorsStats,
    sortType,
    sortParam,
    nameFilter,
    filters,
    itemsTotal: computed(() => items.value.length),
    items: itemsComputed,
    averageApy,
    loading,
    showControls,
    showControlsMob,

    loadAllValidators,
    loadAverageApy,
  };
});