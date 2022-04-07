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
import { computed, onMounted, ref, watch } from 'vue';
import { useConnectionStore, useEpochStore, useStakeAccountStore, useWalletStore } from '@/store';
import { formatPct, lamportsToSol, priceFormatter } from '@jpool/common/utils';
import { ApyStats, ValidatorStats, getAverageApy, getValidatorsStats } from '@/utils';
import { useLocalStorage } from '@vueuse/core';

export const useValidatorsAllStore = defineStore('validators-all', () => {
  const connectionStore = useConnectionStore();
  const walletStore = useWalletStore();
  const stakeAccountStore = useStakeAccountStore();
  const stakeAccounts = computed(() => stakeAccountStore.data);
  const epochStore = useEpochStore();
  const cluster = computed(() => connectionStore.cluster);
  const epoch = computed(() => epochStore.epochNumber);
  const connected = computed(() => walletStore.connected);

  const currentPage = ref(1);
  const perPage = useLocalStorage<number | string>('per-page', '10');
  const validatorsStats = ref<Array<ValidatorStats>>([]);
  const averageApy = ref<Array<ApyStats>>([]);
  const loading = ref(false);
  const nameFilter = ref('');
  const perPageOptions = ref([5, 10, 15, 20, 30, 50, 70 /*, 100, 150, 200, 'all'*/]);
  const sortType = useLocalStorage<string>('sort-type', 'desc');
  const sortParam = useLocalStorage<string>('sort-param', 'apyNum');
  const filterTop33 = useLocalStorage<boolean>('filter-top-staked', true);
  const filterPrivate = useLocalStorage<boolean>('filter-private', true);
  const filterFee = useLocalStorage<boolean>('filter-fee', false);
  const filterNoname = useLocalStorage<boolean>('filter-noname', false);
  const filterDelinq = useLocalStorage<boolean>('filter-delinq', false);
  const filterNotJpool = useLocalStorage<boolean>('filter-not-jpool', false);
  const filterNotSvm = useLocalStorage<boolean>('filter-not-svm', false);
  const filterHasStake = ref(false);

  const loadAllValidators = async () => {
    console.log('[validators all] loadAllValidators');
    if (!loading.value) {
      const network = connectionStore.cluster.replace('-beta', '');
      loading.value = true;
      try {
        validatorsStats.value = await getValidatorsStats(network);
      } catch {
      } finally {
        loading.value = false;
      }
    }
  };

  const loadAverageApy = async () => {
    if (cluster.value === 'mainnet-beta') {
      averageApy.value = await getAverageApy();
    } else {
      averageApy.value = [];
    }
    console.log('[validators all] getAverageApy === ', averageApy.value);
  };

  onMounted(async () => {
    console.log('[validators all] onMounted store all');
    loadAverageApy();
    if (validatorsStats.value.length < 1) {
      await loadAllValidators();
    }
  });

  const perPageMax = computed(() => perPageOptions.value[perPageOptions.value.length - 1] ?? 10);
  watch(
    perPage,
    () => {
      if (isNaN(Number(perPage.value)) || perPage.value > perPageMax.value) {
        perPage.value = perPageMax.value;
      }
    },
    { immediate: true },
  );

  const perPageNum = computed(() => {
    const itemsLength = itemsSorted.value.length;
    const count = isNaN(Number(perPage.value))
      ? itemsLength > 0
        ? itemsLength
        : 5
      : Number(perPage.value);
    return count <= perPageMax.value ? count : perPageMax.value;
  });

  watch(connected, (connected) => {
    if (!connected) filterHasStake.value = false;
  });
  watch([cluster, epoch], loadAllValidators);
  watch([cluster, epoch], loadAverageApy);

  function formatAmountPrice(val: number | bigint) {
    return priceFormatter.format(val);
  }

  const items = computed(() => {
    // skeleton preloader
    // console.log('[validators all] start');
    if (loading.value) {
      // console.log('[validators all] skeleton');
      return Array(5).fill({});
    }

    // console.log('[validators all] calc ', validatorsStats.value.length);
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
        image: keybaseUsername ? `https://keybase.io/${keybaseUsername}/picture` : undefined,
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
      };
    });
  });

  const itemsFiltered = computed(() => {
    // console.log('[validators all] filter');
    if (loading.value) {
      return items.value;
    }
    const array = [...items.value];
    if (
      nameFilter.value ||
      filterPrivate.value ||
      filterTop33.value ||
      filterFee.value ||
      filterNoname.value ||
      filterDelinq.value ||
      filterNotJpool.value ||
      filterHasStake.value ||
      filterNotSvm.value
    ) {
      const search = nameFilter.value.toLowerCase();
      return array.filter((item) => {
        if (
          search &&
          (!item.name || item.name?.toLowerCase().indexOf(search) === -1) &&
          item.voter.toLowerCase().indexOf(search) === -1 &&
          item.id.toLowerCase().indexOf(search) === -1
        ) {
          return false;
        }
        if (filterFee.value && item.feeNum > 0) {
          return false;
        }
        if (filterNoname.value && !item.name) {
          return false;
        }
        if (filterDelinq.value && item.isDelinquent) {
          return false;
        }
        if (filterNotSvm.value && !item.svName) {
          return false;
        }
        if (filterPrivate.value && item.feeNum === 100) {
          return false;
        }
        if (filterTop33.value && item.inTop33) {
          return false;
        }
        if (filterNotJpool.value && !item.inJpool) {
          return false;
        }
        if (filterHasStake.value && !item.myStake) {
          return false;
        }

        return true;
      });
    }
    return array;
  });

  const itemsSorted = computed(() => {
    console.log('[validators all] sort ===', itemsFiltered.value.length);
    if (loading.value) {
      return itemsFiltered.value;
    }
    return [...itemsFiltered.value].sort((a, b) => {
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
    });
  });

  const pages = computed(() => {
    const pageCount = Math.ceil(itemsFiltered.value.length / perPageNum.value);
    return pageCount > 0 ? pageCount : 1;
  });

  watch(pages, (pages) => {
    if (pages < currentPage.value) {
      currentPage.value = pages;
    }
  });

  return {
    validatorsStats,
    sortType,
    sortParam,
    nameFilter,
    currentPage,
    perPage,
    perPageNum,
    perPageOptions,
    pages,
    filterPrivate,
    filterTop33,
    filterFee,
    filterNoname,
    filterDelinq,
    filterNotSvm,
    filterNotJpool,
    filterHasStake,
    items,
    itemsSorted,
    itemsShowed: computed(() =>
      itemsSorted.value.slice(
        perPageNum.value * (currentPage.value - 1),
        perPageNum.value * currentPage.value,
      ),
    ),
    loadAllValidators,
    loadAverageApy,
    averageApy,
    loading,
  };
});
