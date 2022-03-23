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
import { useConnectionStore, useEpochStore } from '@/store';
import { formatPct, lamportsToSol, priceFormatter } from '@jpool/common/utils';
import { shortenAddress } from '@jpool/common/utils';
import { ValidatorStats, getValidatorsStats } from '@/utils';

export const useValidatorsAllStore = defineStore('validators-all', () => {
  const connectionStore = useConnectionStore();
  const epochStore = useEpochStore();

  const currentPage = ref(1);
  const perPage = ref<number | string>(10);
  const validatorsStats = ref<Array<ValidatorStats>>([]);
  const loading = ref(false);
  const nameFilter = ref('');
  const perPageOptions = ref([5, 10, 15, 20, 30, 50, 70, 100, 150, 200, 'all']);
  const sortType = ref('desc');
  const sortParam = ref('apyNum');
  const filterTop33 = ref(false);
  const filterPrivate = ref(false);

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
    // console.log('[validators all] onMounted store all');
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

      return {
        id: pubKey,
        apy: formatPct.format(voteAccount.apy ?? 0),
        fee: formatPct.format(voteAccount.fee / 100),
        apyNum: voteAccount.apy,
        feeNum: voteAccount.fee,
        voter: voteAccount.voteId,
        totalStake: voteAccount.totalStake,
        totalSolStacked: formatAmountPrice(solTotal),
        name: voteAccount.name ?? shortenAddress(pubKey),
        details: voteAccount.details,
        website: voteAccount.website,
        keybaseUsername: keybaseUsername,
        image: keybaseUsername ? `https://keybase.io/${keybaseUsername}/picture` : undefined,
        url: `https://www.validators.app/validators/${voteAccount.network}/${pubKey}`,
        inTop33: voteAccount.inTop33,
        isDelinquent: voteAccount.isDelinquent,
        svName: voteAccount.svName,
        apyComparedMax: voteAccount.apyComparedMax,
        lamports: 0,
      };
    });
  });

  const itemsFiltered = computed(() => {
    // console.log('[validators all] filter');
    const array = [...items.value];
    if (nameFilter.value || filterPrivate.value || filterTop33.value) {
      return array.filter((item) => {
        if (
          nameFilter.value &&
          item.name?.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1 &&
          item.voter.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1 &&
          item.id.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1
        ) {
          return false;
        }
        if (filterPrivate.value && item.feeNum === 100) {
          return false;
        }
        if (filterTop33.value && item.inTop33) {
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
