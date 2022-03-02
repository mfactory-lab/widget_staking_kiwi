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
  <q-card class="stake-box shadow-sm q-px-none q-py-sm">
    <q-card-section class="stake-box__top-section">
      <div class="row justify-between items-center q-mb-xs">
        <div class="stake-box__title q-mt-sm"> Balance: {{ availableSol }} SOL </div>
        <div class="q-ml-auto row justify-end q-mb-xs">
          <div>
            <cluster-selector />
          </div>
          <div class="q-ml-sm">
            <connect-wallet />
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-input
        ref="stakeFromInput"
        :maxlength="14"
        rounded
        v-model="stake.from"
        :color="$q.dark.isActive ? 'primary' : 'text-white'"
        :bg-color="$q.dark.isActive ? 'text-white' : 'primary'"
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
            :color="$q.dark.isActive ? 'primary' : 'natural-light-gray'"
            :text-color="$q.dark.isActive ? 'text-white' : 'primary'"
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
      <div class="row items-center q-mt-sm stake-box__row">
        <div class="row justify-center q-mb-sm">
          <total-stacked />
        </div>

        <div class="col-auto q-mb-sm">
          <div v-if="connected" class="text-right">
            <q-btn
              :loading="creating"
              class="stake-box__btn"
              color="accent"
              rounded
              size="14px"
              padding="9px 24px"
              text-color="text-white"
              @click="stakeHandler"
            >
              STAKE NOW
            </q-btn>
          </div>
          <div v-else class="text-center text-bold">Please connect a wallet</div>
        </div>
      </div>
      <div
        class="row items-center"
        :class="{ 'justify-center': $q.screen.lt.sm, 'justify-between': !$q.screen.lt.sm }"
      >
        <div class="main-section__block q-my-sm">
          <kiwi-link />
        </div>
        <div class="main-section__block main-section__block--epoch">
          <epoch />
        </div>
        <div class="main-section__block column q-my-sm">
          <div class="row justify-end items-end">
            <roi-calculator-btn />
            <apy />
          </div>
          <div class="q-mt-sm stake-box__fee-info text-center"
            >Network Fee: {{ depositFeeVal }} SOL</div
          >
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="maxStakeDialog">
    <q-card>
      <q-card-section class="relative-position">
        <div class="text-h6 text-center">Warning</div>
        <q-btn
          padding="md"
          :color="$q.dark.isActive ? 'primary-gray' : 'text-white'"
          :text-color="$q.dark.isActive ? 'text-white' : 'primary-gray'"
          unelevated
          class="absolute-right"
          :icon="evaClose"
          size="md"
          @click="maxStakeDialog = false"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        After the transaction, the funds in the account may not be enough for the network commission
        of the next transaction
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-md row justify-between">
          <q-btn outline rounded @click="maxStakeDialog = false"> Cancel </q-btn>
          <q-btn outline rounded @click="doStake"> Ok </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <stake-success-dialog v-model="stakeSuccessDialog" />
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useBalanceStore, useConnectionStore, useStakePoolStore, useWalletStore } from '@/store';
  import { formatPct, lamportsToSol } from '@jpool/common/utils';
  import { useStakeAccounts } from '@/hooks/stake-accounts';
  import Apy from '@/components/staking/Apy.vue';
  import ConnectWallet from '@/components/staking/ConnectWallet.vue';
  import RoiCalculatorBtn from '../roi-calculator/RoiCalculatorBtn.vue';
  import { clickOutside } from '@jpool/common/directives';
  import { evaClose } from '@quasar/extras/eva-icons';
  import TotalStacked from '@/components/staking/TotalStacked.vue';
  import Epoch from '@/components/staking/Epoch.vue';
  import KiwiLink from '@/components/staking/KiwiLink.vue';
  import ClusterSelector from '@/components/staking/ClusterSelector.vue';
  import StakeSuccessDialog from '@/components/staking/stake/StakeSuccessDialog.vue';
  import { useEmitter } from '@jpool/common/hooks';

  export default defineComponent({
    components: {
      Apy,
      ConnectWallet,
      ClusterSelector,
      RoiCalculatorBtn,
      TotalStacked,
      Epoch,
      KiwiLink,
      StakeSuccessDialog,
    },
    directives: {
      clickOutside,
    },
    setup() {
      const connectionStore = useConnectionStore();
      const { connected } = storeToRefs(useWalletStore());
      const { solBalance } = storeToRefs(useBalanceStore());
      const { connectionLost } = storeToRefs(useStakePoolStore());
      const { depositFee, creating, createAccount, stakeSuccessDialog } = useStakeAccounts();
      const maxStakeDialog = ref(false);

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

      watch([stake, connected, solBalance], ([amount, connected, solBalance]) => {
        if (amount.from < 0) stake.from = 0;
        if (!connected) return;
        const sol = Number(amount.from);
        const solFee = lamportsToSol(depositFee.value);
        if (solBalance && sol + solFee > solBalance) {
          stake.from = solBalance - solFee;
        }
      });

      // Calculate amount to deposit
      const depositAmount = computed(() => {
        const sol = Number(stake.from);
        if (sol <= 0) {
          return 0;
        }
        let value = sol + lamportsToSol(depositFee.value);
        return value > 0 ? value : 0;
      });

      watch(depositAmount, (amount) => {
        if (!amount) {
          stake.to = null;
          return;
        }
        stake.to = amount > 0 ? amount.toFixed(9) : 0;
      });

      const highlightFix = ref(true);

      const doStake = async () => {
        if (maxStakeDialog.value) maxStakeDialog.value = false;
        await createAccount(stake.from);
        stake.from = 0;
        stake.to = 0;
      };

      const emitter = useEmitter();
      emitter.on('closeStakeSuccessDialog', () => {
        stakeSuccessDialog.value = false;
      });

      return {
        stake,
        cluster: computed(() => connectionStore.cluster),
        evaClose,
        connected,
        creating,
        stakeFromInput,
        connectionLost,
        maxStakeDialog,
        stakeSuccessDialog,
        depositFeeVal: computed(() => lamportsToSol(depositFee.value)),
        availableSol: computed(() => (solBalance.value ? solBalance.value : '0')),

        stakeMax() {
          if (!connected.value) {
            return;
          }
          stake.from = solBalance.value;
        },

        stakeHandler: () => {
          if (depositAmount.value <= 0) {
            // @ts-ignore
            stakeFromInput.value?.focus();
            return;
          }
          if (Number(stake.to) + lamportsToSol(depositFee.value) > solBalance.value) {
            maxStakeDialog.value = true;
          } else {
            doStake();
          }
        },
        doStake,

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
