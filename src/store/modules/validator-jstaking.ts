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
import {
  ApyInfo,
  loadApyInfo,
  useConnectionStore,
  useEpochStore,
  useValidatorStore,
} from '@/store';
import { DEFAULT_APY, DEFAULT_VALIDATOR } from '@/config';
import { useLocalStorage } from '@vueuse/core';
import { PublicKey } from '@solana/web3.js';
import { shortenAddress } from '@jpool/common/utils';
import router from '@/router';

interface ValidatorInfo {
  voterKey: string;
  validatorId: string;
  validatorName: string;
  validatorFee: number;
  validatorStake: number;
  validatorDetails: string | undefined;
  validatorImage: string | undefined;
  validatorUrl: string | undefined;
  validatorSolanaBeach: string | undefined;
  validatorWebsite: string | undefined;
  epoch: number | undefined;
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
  const validatorId = ref<string>(DEFAULT_VALIDATOR['mainnet-beta'].idPubkey);
  const voterKey = ref<string>(DEFAULT_VALIDATOR['mainnet-beta'].voterKey);
  const totalStake = ref(0);
  const commission = ref(0);
  const validatorName = ref('');
  const validatorDetails = ref(<string | undefined>'');
  const validatorImage = ref(<string | undefined>'');
  const validatorUrl = ref(<string | undefined>'');
  const validatorSolanaBeach = ref(<string | undefined>'');
  const validatorWebsite = ref(<string | undefined>'');

  const connectionStore = useConnectionStore();
  const cluster = computed(() => connectionStore.cluster);
  const epochStore = useEpochStore();
  const epochInfo = computed(() => epochStore.epochInfo);
  const loading = ref(!apyInfo.value?.lastEpoch);
  const validatorStore = useValidatorStore();
  const voteAccounts = computed(() => validatorStore.voteAccounts);
  const validatorsInfos = computed(() => validatorStore.validatorsInfos);

  const savedValidators = useLocalStorage<ValidatorInfo[]>('validators-cached', []);
  const savedValidator = ref<ValidatorInfo>();

  watch(
    [voterKey, epochInfo],
    () => {
      savedValidator.value = undefined;
      if (savedValidators.value.length > 0) {
        const savedVal = savedValidators.value.find((val) => val.voterKey === voterKey.value);
        if (savedVal && savedVal.epoch === epochInfo.value?.epoch) {
          savedValidator.value = savedVal;
        }
      }
    },
    { immediate: true },
  );

  watch([validatorName], () => {
    const savedValIndex = savedValidators.value.findIndex((val) => val.voterKey === voterKey.value);
    const saveVal = {
      voterKey: voterKey.value,
      validatorId: validatorId.value,
      validatorName: validatorName.value,
      validatorFee: commission.value,
      validatorStake: totalStake.value,
      validatorDetails: validatorDetails.value,
      validatorImage: validatorImage.value,
      validatorUrl: validatorUrl.value,
      validatorSolanaBeach: validatorSolanaBeach.value,
      validatorWebsite: validatorWebsite.value,
      epoch: epochInfo.value?.epoch,
    };
    if (savedValIndex > -1) {
      savedValidators.value = [
        ...savedValidators.value.slice(0, savedValIndex),
        saveVal,
        ...savedValidators.value.slice(savedValIndex + 1),
      ];
    } else {
      savedValidators.value = [...savedValidators.value, saveVal];
    }
  });

  watch(
    [cluster, router.currentRoute],
    async ([cluster, route]) => {
      const isValidatorPage = route.matched.find((item) => item.path === '/app/:validator');
      if (!isValidatorPage) return;
      const validator = route.params.validator;
      if (!!validator && typeof validator === 'string') {
        voterKey.value = validator;
      } else {
        voterKey.value = DEFAULT_VALIDATOR[cluster].voterKey;
      }
      await validatorStore.load();

      let voterData = voteAccounts.value.find((item) => item.votePubkey === voterKey.value);

      if (!voterData) {
        voterKey.value = DEFAULT_VALIDATOR[cluster].voterKey;
        voterData = voteAccounts.value.find((item) => item.votePubkey === voterKey.value);
      }

      if (voterData) {
        const network = connectionStore.cluster.replace('-beta', '');
        const clusterSolanaBeach = connectionStore.cluster.replace('mainnet-beta', '');
        const networkSolanaBeach = clusterSolanaBeach ? `?cluster=${clusterSolanaBeach}` : '';
        const pubKey = voterData.nodePubkey;

        totalStake.value = voterData.activatedStake;
        commission.value = voterData.commission;
        validatorId.value = pubKey;

        const validatorInfo = validatorsInfos.value.find((info) =>
          info.key.equals(new PublicKey(pubKey)),
        );
        validatorDetails.value = validatorInfo?.info?.details;
        validatorImage.value = validatorInfo?.info?.keybaseUsername
          ? `https://keybase.io/${validatorInfo.info.keybaseUsername}/picture`
          : undefined;
        validatorUrl.value = `https://www.validators.app/validators/${network}/${pubKey}`;
        validatorSolanaBeach.value = `https://solanabeach.io/validator/${voterKey.value}${networkSolanaBeach}`;
        validatorWebsite.value = validatorInfo?.info?.website;
        validatorName.value = validatorInfo?.info?.name ?? shortenAddress(pubKey);
      }
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

  return {
    jpoolVoters: computed(() => validatorStore.voteIds),
    validatorId,
    voterKey,
    totalStake,
    commission,
    apyLoading: computed(() => loading.value),
    apy,
    validatorName,
    validatorDetails,
    validatorImage,
    validatorUrl,
    validatorSolanaBeach,
    validatorWebsite,
    savedValidator,
  };
});
