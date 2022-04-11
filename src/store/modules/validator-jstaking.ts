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
import { useConnectionStore, useEpochStore, useValidatorsAllStore } from '@/store';
import { DEFAULT_VALIDATOR } from '@/config';
import { useLocalStorage } from '@vueuse/core';
import { shortenAddress } from '@jpool/common/utils';
import router from '@/router';

interface ValidatorInfo {
  voterKey: string;
  network: string;
  validatorId: string;
  validatorName: string;
  validatorFee: number;
  validatorApy: number;
  validatorStake: number;
  validatorDetails: string | undefined;
  validatorImage: string | undefined;
  validatorUrl: string | undefined;
  validatorSolanaBeach: string | undefined;
  validatorWebsite: string | undefined;
  epoch: number | undefined;
  validatorInJpool: boolean;
  validatorDelinquent: boolean;
  validatorSVM: string | undefined;
  validatorLastVote: string | undefined;
}

export const useValidatorJstakingStore = defineStore('validators-jstaking', () => {
  const validatorId = ref<string>(DEFAULT_VALIDATOR['mainnet-beta'].idPubkey);
  const voterKey = ref<string>(DEFAULT_VALIDATOR['mainnet-beta'].voterKey);
  const totalStake = ref(0);
  const commission = ref(0);
  const apy = ref(0);
  const validatorName = ref('');
  const validatorDetails = ref(<string | undefined>'');
  const validatorImage = ref(<string | undefined>'');
  const validatorUrl = ref(<string | undefined>'');
  const validatorSolanaBeach = ref(<string | undefined>'');
  const validatorWebsite = ref(<string | undefined>'');
  const validatorInJpool = ref(false);
  const validatorDelinquent = ref(false);
  const validatorSVM = ref(<string | undefined>'');
  const validatorLastVote = ref(<string | undefined>'');

  const connectionStore = useConnectionStore();
  const cluster = computed(() => connectionStore.cluster);
  const epochStore = useEpochStore();
  const epochInfo = computed(() => epochStore.epochInfo);
  const validatorsAllStore = useValidatorsAllStore();
  const validatorsAllItems = computed(() => validatorsAllStore.validatorsStats);

  const savedValidators = useLocalStorage<ValidatorInfo[]>('validators-cached', []);
  const savedValidator = ref<ValidatorInfo>();

  const networkSolanaBeach = computed(() => {
    const clusterSolanaBeach = connectionStore.cluster.replace('mainnet-beta', '');
    return clusterSolanaBeach ? `?cluster=${clusterSolanaBeach}` : '';
  });
  const network = computed(() => connectionStore.cluster.replace('-beta', ''));

  watch(
    [voterKey, epochInfo],
    () => {
      savedValidator.value = undefined;
      if (validatorsAllItems.value.length > 0) {
        const voterData = validatorsAllItems.value.find(
          (val) => val.voteId === voterKey.value && val.network === network.value,
        );
        if (voterData) {
          const pubKey = voterData.validatorId;
          savedValidator.value = {
            voterKey: voterData.voteId,
            validatorId: pubKey,
            network: voterData.network,
            validatorName: voterData?.name ?? shortenAddress(pubKey),
            validatorFee: voterData.fee,
            validatorApy: voterData.apy,
            validatorStake: Number(voterData.totalStake),
            validatorDetails: voterData.details,
            validatorImage: voterData?.keybaseUsername
              ? `https://keybase.io/${voterData.keybaseUsername}/picture`
              : undefined,
            validatorUrl: `https://www.validators.app/validators/${voterData.network}/${pubKey}`,
            validatorWebsite: voterData.website,
            validatorSolanaBeach: `https://solanabeach.io/validator/${voterKey.value}${networkSolanaBeach.value}`,
            epoch: epochInfo.value?.epoch,
            validatorInJpool: voterData.inJpool,
            validatorDelinquent: voterData.isDelinquent,
            validatorSVM: voterData.svName,
            validatorLastVote: voterData.lastVote,
          };
        }
      } else if (savedValidators.value.length > 0) {
        const savedVal = savedValidators.value.find(
          (val) => val.voterKey === voterKey.value && val.network === network.value,
        );
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
      network: network.value,
      validatorId: validatorId.value,
      validatorName: validatorName.value,
      validatorFee: commission.value,
      validatorApy: apy.value,
      validatorStake: totalStake.value,
      validatorDetails: validatorDetails.value,
      validatorImage: validatorImage.value,
      validatorUrl: validatorUrl.value,
      validatorSolanaBeach: validatorSolanaBeach.value,
      validatorWebsite: validatorWebsite.value,
      epoch: epochInfo.value?.epoch,
      validatorInJpool: validatorInJpool.value,
      validatorDelinquent: validatorDelinquent.value,
      validatorSVM: validatorSVM.value,
      validatorLastVote: validatorLastVote.value,
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
    async ([cluster, route], [clusterOld, _routeOld]) => {
      const isValidatorPage = route.matched.find((item) => item.path === '/app/:validator');
      if (!isValidatorPage) return;
      const validator = route.params.validator;
      if (!!validator && typeof validator === 'string') {
        voterKey.value = validator;
      } else {
        voterKey.value = DEFAULT_VALIDATOR[cluster].voterKey;
      }

      if (clusterOld !== cluster || validatorsAllItems.value.length < 1) {
        console.log('[validators all] onMounted validator page');
        await validatorsAllStore.loadAllValidators();
      }

      let voterData = validatorsAllItems.value.find((item) => item.voteId === voterKey.value);

      if (!voterData) {
        voterKey.value = DEFAULT_VALIDATOR[cluster].voterKey;
        voterData = validatorsAllItems.value.find((item) => item.voteId === voterKey.value);
      }

      if (voterData) {
        const pubKey = voterData.validatorId;

        totalStake.value = Number(voterData.totalStake);
        commission.value = voterData.fee;
        apy.value = voterData.apy;
        validatorId.value = pubKey;
        validatorDetails.value = voterData.details;
        validatorImage.value = voterData.keybaseUsername
          ? `https://keybase.io/${voterData.keybaseUsername}/picture`
          : undefined;
        validatorUrl.value = `https://www.validators.app/validators/${network.value}/${pubKey}`;
        validatorSolanaBeach.value = `https://solanabeach.io/validator/${voterKey.value}${networkSolanaBeach.value}`;
        validatorWebsite.value = voterData.website;
        validatorName.value = voterData.name ?? shortenAddress(pubKey);
        validatorInJpool.value = voterData.inJpool;
        validatorDelinquent.value = voterData.isDelinquent;
        validatorSVM.value = voterData.svName;
        validatorLastVote.value = voterData.lastVote;
      }
    },
    { immediate: true },
  );

  return {
    validatorId,
    voterKey,
    totalStake,
    commission,
    apyLoading: computed(() => validatorsAllStore.loading),
    apy,
    validatorName,
    validatorDetails,
    validatorImage,
    validatorUrl,
    validatorSolanaBeach,
    validatorWebsite,
    validatorInJpool,
    validatorDelinquent,
    validatorSVM,
    validatorLastVote,
    savedValidator,
  };
});
