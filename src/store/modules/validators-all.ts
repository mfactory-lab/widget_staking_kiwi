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
import { storeToRefs } from 'pinia';
import { ApyInfo, useApyStore, useConnectionStore, useValidatorStore } from '@/store';
import { formatPct, lamportsToSol, priceFormatter } from '@jpool/common/utils';
import { PublicKey } from '@solana/web3.js';
import { shortenAddress } from '@jpool/common/utils';

export const useValidatorsAllStore = defineStore('validators-all', () => {
  const connectionStore = useConnectionStore();
  const validatorStore = useValidatorStore();

  const { apyInfoAll } = storeToRefs(useApyStore());
  const voteAccounts = computed(() => validatorStore.voteAccounts);
  const validatorsInfos = computed(() => validatorStore.validatorsInfos);
  const currentPage = ref(1);
  const perPage = ref(10);
  const apyInfos = ref<ApyInfo>();
  const nameFilter = ref('');
  const perPageOptions = ref([5, 10, 15, 20, 30]);
  const sortType = ref('desc');
  const sortParam = ref('apyNum');
  const additionalFilter = ref({ value: 'all', text: 'Show all' });
  const additionalFilterOptions = ref([
    {
      value: 'all',
      text: 'Show all',
    },
    {
      value: 'nonPrivate',
      text: 'Non-private',
    },
    {
      value: 'except20',
      text: 'Except top 20 by stake',
    },
    {
      value: 'top20',
      text: 'Top 20 by stake',
    },
  ]);

  watch(
    apyInfoAll,
    (apyInfoAll) => {
      if (!apyInfos.value || apyInfos.value.lastEpoch !== apyInfoAll.lastEpoch) {
        apyInfos.value = {
          ...apyInfoAll,
          validators: apyInfoAll.validators.map((item) => {
            return {
              ...item,
            };
          }),
        };
      }
    },
    { immediate: true },
  );

  const cluster = computed(() => connectionStore.cluster);

  watch(cluster, validatorStore.load);

  function formatAmountPrice(val: number | bigint) {
    return priceFormatter.format(val);
  }

  const items = computed(() => {
    // skeleton preloader
    console.log('[validators all] start');
    if (validatorStore.loading) {
      console.log('[validators all] skeleton');
      return Array(10).fill({});
    }

    console.log('[validators all] calc ', voteAccounts.value.length);
    const voteApy = apyInfos.value?.validators ?? [];

    return voteAccounts.value.map((voteAccount) => {
      const validatorInfo = validatorsInfos.value.find((info) =>
        info.key.equals(new PublicKey(voteAccount.nodePubkey)),
      );

      const pubKey = voteAccount.nodePubkey;
      const network = connectionStore.cluster.replace('-beta', '');

      const info = {
        id: pubKey,
        feeNum: voteAccount.commission,
        voter: voteAccount.votePubkey,
        totalStake: voteAccount?.activatedStake,
        name: validatorInfo?.info?.name ?? shortenAddress(pubKey),
        details: validatorInfo?.info?.details,
        website: validatorInfo?.info?.website,
        keybaseUsername: validatorInfo?.info?.keybaseUsername,
        image: validatorInfo?.info?.keybaseUsername
          ? `https://keybase.io/${validatorInfo.info.keybaseUsername}/picture`
          : undefined,
        url: `https://www.validators.app/validators/${network}/${pubKey}`,
        lamports: 0,
      };

      const apyInfo = voteApy.find((v) => v.id == info.id);
      const solTotal = lamportsToSol(info.totalStake);

      return {
        ...info,
        fee: formatPct.format(info.feeNum / 100),
        apy: formatPct.format(apyInfo?.apy ?? 0),
        apyNum: apyInfo?.apy ?? 0,
        totalSolStacked: formatAmountPrice(solTotal),
      };
    });
  });

  const itemsFiltered = computed(() => {
    console.log('[validators all] filter');
    let array = [...items.value];
    if (additionalFilter.value.value === 'except20' || additionalFilter.value.value === 'top20') {
      array.sort((a, b) => {
        if (sortType.value === 'asc') {
          return a.totalStake - b.totalStake;
        }
        return b.totalStake - a.totalStake;
      });
      if (additionalFilter.value.value === 'except20' && sortType.value === 'asc') {
        array = array.slice(0, array.length - 20);
      }
      if (additionalFilter.value.value === 'top20' && sortType.value === 'asc') {
        array = array.slice(-20);
      }
      if (additionalFilter.value.value === 'except20' && sortType.value === 'desc') {
        array = array.slice(20);
      }
      if (additionalFilter.value.value === 'top20' && sortType.value === 'desc') {
        array = array.slice(0, 20);
      }
    }
    if (nameFilter.value || additionalFilter.value.value === 'nonPrivate') {
      return array.filter((item) => {
        if (
          nameFilter.value &&
          item.name.toLowerCase().indexOf(nameFilter.value.toLowerCase()) === -1
        ) {
          return false;
        }
        if (additionalFilter.value.value === 'nonPrivate' && item.feeNum === 100) {
          return false;
        }
        return true;
      });
    }
    return array;
  });

  const itemsSorted = computed(() => {
    console.log('[validators all] sort');
    if (
      (additionalFilter.value.value === 'except20' || additionalFilter.value.value === 'top20') &&
      sortParam.value === 'totalStake'
    ) {
      return itemsFiltered.value;
    }
    return [...itemsFiltered.value].sort((a, b) => {
      if (sortType.value === 'asc') {
        return a[sortParam.value] - b[sortParam.value];
      }
      return b[sortParam.value] - a[sortParam.value];
    });
  });

  const pages = computed(() => Math.ceil(itemsFiltered.value.length / perPage.value));
  watch(pages, (pages) => {
    if (pages < currentPage.value) {
      currentPage.value = pages;
    }
  });

  return {
    sortType,
    sortParam,
    nameFilter,
    currentPage,
    perPage,
    perPageOptions,
    pages,
    additionalFilterOptions,
    additionalFilter,
    itemsSorted,
    itemsShowed: computed(() =>
      itemsSorted.value.slice(
        perPage.value * (currentPage.value - 1),
        perPage.value * currentPage.value,
      ),
    ),
  };
});
