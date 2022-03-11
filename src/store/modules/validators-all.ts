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
  const perPageOptions = ref([5, 10, 15, 25, 50]);
  const sortParam = ref({
    value: 'apyNum',
    title: 'APY',
  });
  const sortOptions = ref([
    {
      value: 'apyNum',
      title: 'APY',
    },
    {
      value: 'totalStake',
      title: 'Total staked',
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
    if (nameFilter.value) {
      return items.value.filter(
        (item) => item.name.toLowerCase().indexOf(nameFilter.value.toLowerCase()) > -1,
      );
    }
    return items.value;
  });

  const itemsSorted = computed(() => {
    console.log('[validators all] sort');
    return [...itemsFiltered.value].sort((a, b) => {
      return b[sortParam.value.value] - a[sortParam.value.value];
    });
  });

  const pages = computed(() => Math.ceil(itemsFiltered.value.length / perPage.value));
  watch(pages, (pages) => {
    if (pages < currentPage.value) {
      currentPage.value = pages;
    }
  });

  return {
    sortOptions,
    sortParam,
    nameFilter,
    currentPage,
    perPage,
    perPageOptions,
    pages,
    itemsSorted,
    itemsShowed: computed(() =>
      itemsSorted.value.slice(
        perPage.value * (currentPage.value - 1),
        perPage.value * currentPage.value,
      ),
    ),
  };
});
