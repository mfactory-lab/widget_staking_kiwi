<!--
  - This file is part of the Web3 Library developed by mFactory GmbH.
  -
  - Copyright © 2021, mFactory GmbH
  -
  - Solana Reference Stake Pool is free software: you can redistribute it
  - and/or modify it under the terms of the GNU Affero General Public License
  - as published by the Free Software Foundation, either version 3
  - of the License, or (at your option) any later version.
  -
  - Solana Reference Stake Pool is distributed in the hope that it
  - will be useful, but WITHOUT ANY WARRANTY; without even the implied
  - warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  - See the GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program.
  - If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
  -
  - You can be released from the requirements of the Affero GNU General Public License
  - by purchasing a commercial license. The purchase of such a license is
  - mandatory as soon as you develop commercial activities using the
  - Solana Reference Stake Pool code without disclosing the source code of
  - your own applications.
  -
  - The developer of this program can be contacted at <info@mfactory.ch>.
  -->

<template>
  <q-card class="stake-box shadow-sm q-pa-sm">
    <q-card-section class="stake-box__top-section">
      <div class="row justify-center">
        <div class="col-xs-12 col-sm-6">
          <div class="stake-box__title"> Amount to stake </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="stake-box__title" :class="{ 'text-right': $q.screen.gt.xs }">
            Available {{ availableSol }} SOL
          </div>
        </div>
      </div>
      <div
        v-if="connected && Number(stake.from) > Number(availableSol)"
        class="stake-box__warning lt-sm"
      >
        Insufficient funds to stake
      </div>
    </q-card-section>

    <q-card-section>
      <q-input
        ref="stakeFromInput"
        :maxlength="14"
        v-model="stake.from"
        color="text-white"
        bg-color="primary"
        label=""
        class="stake-box__input"
        input-class="stake-box__input__field"
        :class="{ 'stake-box__input--highlight-fix': highlightFix }"
        placeholder="0.0"
        :readonly="connectionLost"
        @focus="onFocus"
        v-click-outside="onBlur"
        @keypress="onlyNumber"
        borderless
      >
        <template #append>
          <q-btn
            dense
            color="natural-light-gray"
            text-color="primary"
            class="q-mr-sm"
            unelevated
            size="12px"
            padding="2px 8px 0"
            @click="stakeMax"
          >
            MAX
          </q-btn>
          <img alt="" class="stake-box__sol-icon" src="@/assets/img/sol-logo.svg" />
          <span class="stake-box__symbol">SOL</span>
        </template>
      </q-input>
    </q-card-section>

    <q-card-section>
      <div class="row items-between">
        <div class="col-sm-6 col-xs-12 q-pr-sm q-mt-sm">
          <stake-slide-wrapper :value="stakePercent">
            <q-slider
              v-model="stakePercent"
              :disable="!connected"
              track-size="2px"
              thumb-size="33px"
              thumb-color="primary"
              :min="0"
              :max="100"
              :step="25"
              :label="false"
              color="primary"
            />
          </stake-slide-wrapper>
        </div>

        <div class="col-sm-6 col-xs-12 q-mt-md" :class="{ 'q-mb-md': $q.screen.lt.sm }">
          <div v-if="connected" class="text-right q-ml-auto">
            <q-btn
              :loading="creating"
              class="stake-box__btn q-ml-auto"
              color="red"
              rounded
              size="14px"
              padding="9px xl"
              text-color="text-white"
              @click="stakeHandler"
            >
              STAKE NOW
            </q-btn>
          </div>
          <div v-else class="text-right q-ml-auto">
            <connect-wallet />
          </div>
        </div>
      </div>
      <div class="row items-between q-mt-sm">
        <div class="col-sm-5 col-xs-12 column justify-center">
          <apy />
        </div>
        <div class="col-sm-7 col-xs-12">
          <stake-info :data="stakeInfoData" :isStake="true" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import { storeToRefs } from 'pinia';
  import {
    useBalanceStore,
    useConnectionStore,
    useStakePoolStore,
    useWalletStore,
  } from '@jpool/common/store';
  import { formatAmount, formatPct, lamportsToSol } from '@jpool/common/utils';
  import { useStakeAccounts } from '@/hooks/stake-accounts';
  import StakeInfo from '@/components/staking/stake/StakeInfo.vue';
  import StakeSlideWrapper from '@/components/staking/stake/StakeSlideWrapper.vue';
  import ConnectWallet from '@/components/staking/ConnectWallet.vue';
  import { useApyStore } from '@jpool/common/store/modules/apy';
  import { clickOutside } from '@jpool/common/directives';

  export default defineComponent({
    components: {
      ConnectWallet,
      StakeInfo,
      StakeSlideWrapper,
    },
    directives: {
      clickOutside,
    },
    setup() {
      const { notify } = useQuasar();
      const connectionStore = useConnectionStore();
      const { connected } = storeToRefs(useWalletStore());
      const { solBalance } = storeToRefs(useBalanceStore());
      const { fees, connectionLost } = storeToRefs(useStakePoolStore());
      const { depositFee, creating, createAccount } = useStakeAccounts();
      const { apy } = storeToRefs(useApyStore());

      const stake = reactive<{ from: any; to: any }>({
        from: null,
        to: null,
      });

      const stakeFromInput = ref<any>(null);

      onMounted(() => {
        nextTick(() => {
          if (stakeFromInput.value) {
            stakeFromInput.value?.focus();
          }
        });
      });

      // Calculate amount to deposit
      const depositAmount = computed(() => {
        const sol = Number(stake.from);
        if (sol <= 0) {
          return 0;
        }
        let value = sol - lamportsToSol(depositFee.value);
        return value > 0 ? value : 0;
      });

      watch(depositAmount, (amount) => {
        if (!amount) {
          stake.to = null;
          return;
        }
        stake.to = amount > 0 ? amount.toFixed(5) : 0;
      });

      const stakePercent = ref(0);
      watch(stakePercent, () => {
        if (stakePercent.value === 100) {
          stake.from = solBalance.value;
        } else {
          const value = solBalance.value * stakePercent.value;
          stake.from = value ? formatAmount(value / 100) : value;
        }
      });

      const highlightFix = ref(true);

      return {
        stake,
        cluster: computed(() => connectionStore.cluster),
        connected,
        creating,
        stakeFromInput,
        stakePercent,
        connectionLost,
        apy: computed(() => formatPct.format(apy.value)),
        stakeInfoData: computed(() => {
          const from = stake.from;
          const depositFeeVal = lamportsToSol(depositFee.value);
          return [
            {
              name: 'SOL to stake:',
              value: `${from ? from : '0'} SOL`,
            },
            {
              name: 'Network Fee:',
              value: depositFeeVal + ' SOL',
            },
            {
              name: 'YOU GET:',
              value: `${stake.to ? stake.to : '0'} SOL`,
              isBold: true,
            },
          ];
        }),
        availableSol: computed(() => (solBalance.value ? solBalance.value : '0')),
        solDepositFee: computed(() => fees?.value.solDepositFee),

        stakeMax() {
          if (!connected.value) {
            notify({
              message: 'Wallet is not connected',
              caption: 'Please connect your wallet',
            });
            return;
          }
          stake.from = solBalance.value;
        },

        stakeHandler: async () => {
          if (depositAmount.value <= 0) {
            // @ts-ignore
            stakeFromInput.value?.focus();
            return;
          }
          await createAccount(stake.from - lamportsToSol(depositFee.value));
          stake.from = 0;
          stake.to = 0;
          stakePercent.value = 0;
        },

        formatPct(v: number) {
          return formatPct.format(v);
        },

        onlyNumber(e: any) {
          let keyCode = e.keyCode ? e.keyCode : e.which;
          if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
            e.preventDefault();
          }
          if (keyCode == 46 && String(e.target.value).includes('.')) {
            e.preventDefault();
          }
        },

        highlightFix,
        onFocus() {
          highlightFix.value = true;
        },
        onBlur() {
          highlightFix.value = false;
        },
      };
    },
  });
</script>
