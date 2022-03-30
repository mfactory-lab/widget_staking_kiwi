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
import { useConnectionStore, useEpochStore, useStakeAccountStore } from '@/store';
import { formatPct, lamportsToSol, priceFormatter } from '@jpool/common/utils';
import { ValidatorStats, getValidatorsStats } from '@/utils';

export const useValidatorsAllStore = defineStore('validators-all', () => {
  const connectionStore = useConnectionStore();
  const stakeAccountStore = useStakeAccountStore();
  const stakeAccounts = computed(() => stakeAccountStore.data);
  const epochStore = useEpochStore();

  const currentPage = ref(1);
  const perPage = ref<number | string>(10);
  const validatorsStats = ref<Array<ValidatorStats>>([]);
  const loading = ref(false);
  const nameFilter = ref('');
  const perPageOptions = ref([5, 10, 15, 20, 30 /*, 50, 70, 100, 150, 200, 'all'*/]);
  const sortType = ref('desc');
  const sortParam = ref('apyNum');
  const filterTop33 = ref(true);
  const filterPrivate = ref(true);
  const filterFee = ref(false);
  const filterNoname = ref(false);
  const filterDelinq = ref(false);
  const filterNotJpool = ref(false);
  const filterNotSvm = ref(false);
  const filterHasStake = ref(false);

  const loadAllValidators = async () => {
    console.log('[validators all] loadAllValidators');
    if (!loading.value) {
      const network = connectionStore.cluster.replace('-beta', '');
      loading.value = true;
      validatorsStats.value = await getValidatorsStats(network);
      loading.value = false;
    }
  };

  onMounted(async () => {
    console.log('[validators all] onMounted store all');
    if (validatorsStats.value.length < 1) {
      await loadAllValidators();
    }
  });

  const cluster = computed(() => connectionStore.cluster);
  const epoch = computed(() => epochStore.epochNumber);
  const perPageNum = computed(() =>
    isNaN(Number(perPage.value)) ? itemsSorted.value.length : Number(perPage.value),
  );

  watch([cluster, epoch], loadAllValidators);

  function formatAmountPrice(val: number | bigint) {
    return priceFormatter.format(val);
  }

  const items = computed(() => {
    // skeleton preloader
    // console.log('[validators all] start');
    if (loading.value) {
      // console.log('[validators all] skeleton');
      return Array(10).fill({});
    }

    // console.log('[validators all] calc ', validatorsStats.value.length);
    return validatorsStats.value.map((voteAccount) => {
      const pubKey = voteAccount.validatorId;
      const keybaseUsername = voteAccount.keybaseUsername;
      const solTotal = lamportsToSol(Number(voteAccount.totalStake));

      let myStake = 0;
      if (stakeAccounts.value.length > 0) {
        myStake = stakeAccounts.value
          .filter(
            (item) =>
              item.account.data?.parsed?.info?.stake?.delegation?.voter == voteAccount.voteId,
          )
          .reduce((prev, curr) => prev + curr.account.lamports, 0);
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
        myStake,
      };
    });
  });

  const itemsFiltered = computed(() => {
    // console.log('[validators all] filter');
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
      return array.filter((item) => {
        if (
          nameFilter.value &&
          item.name?.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1 &&
          item.voter.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1 &&
          item.id.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1
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
    // console.log('[validators all] sort');
    return [...itemsFiltered.value].sort((a, b) => {
      if (sortType.value === 'asc') {
        if (sortParam.value === 'name') {
          return a.name.localeCompare(b.name);
        }
        return a[sortParam.value] - b[sortParam.value];
      }
      if (sortParam.value === 'name') {
        return b.name.localeCompare(a.name);
      }
      return b[sortParam.value] - a[sortParam.value];
    });
  });

  const pages = computed(() => Math.ceil(itemsFiltered.value.length / perPageNum.value));
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
    loading,
  };
});
