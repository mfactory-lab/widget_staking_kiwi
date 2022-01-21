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
  <q-card class="stake-box shadow-sm">
    <q-tabs v-model="tab" align="justify" indicator-color="transparent" active-bg-color="secondary">
      <q-tab :ripple="false" label="STAKE" name="stake" :disable="connectionLost" />
      <q-tab :ripple="false" label="UNSTAKE" name="unstake" :disable="connectionLost" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <q-tab-panel name="stake">
        <q-card-section class="top-section">
          <div class="row justify-center stake-box__note">
            <div class="col">
              <div>
                For staking through JPool, you receive rewards of ~{{ apy }}. Use our Profit
                Calculator for a detailed estimate.
              </div>
            </div>
          </div>
          <div class="row justify-center">
            <div class="col">
              <div class="stake-box__title">
                Available {{ availableSol }} SOL<span
                  v-if="connected && Number(stake.from) > Number(availableSol)"
                  class="stake-box__warning gt-xs"
                  >Insufficient funds to unstake</span
                >
              </div>
            </div>
            <div>
              <div class="stake-box__rate">
                <span class="text-dark">1</span>
                <span> SOL</span>
                <span class="q-px-sm">≈</span>
                <span class="text-dark">{{ solToJsolRate }}</span>
                <span> JSOL</span>
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

        <q-card-section class="with-arrow">
          <q-input
            ref="stakeFromInput"
            :maxlength="14"
            v-model="stake.from"
            label="Amount to stake"
            class="stake-box__input"
            :class="{ 'stake-box__input--highlight-fix': highlightFix }"
            outlined
            placeholder="0.0"
            stack-label
            :readonly="connectionLost"
            @focus="onFocus"
            v-click-outside="onBlur"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn
                dense
                color="natural-light-gray"
                text-color="primary-gray"
                unelevated
                size="14px"
                padding="2px 8px 1px 8px"
                @click="stakeMax"
              >
                MAX
              </q-btn>
              <img alt="" class="stake-field__icon" src="@/assets/img/sol-logo.svg" />
              <span class="stake-field__symbol">SOL</span>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="stake-to-input">
          <q-input
            v-model="stake.to"
            label="JSOL"
            outlined
            placeholder="0.0"
            class="stake-box__input-to"
            readonly
            stack-label
            bg-color="transparent"
            @keypress="onlyNumber"
          >
            <template #append>
              <jsol-svg class="stake-field__icon" />
              <span class="stake-field__symbol">JSOL</span>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <div class="row items-between">
            <div class="column col-sm-6 col-xs-12 q-pr-sm q-mt-sm">
              <stake-slide-wrapper :value="stakePercent">
                <q-slider
                  v-model="stakePercent"
                  :disable="!connected"
                  track-size="2px"
                  thumb-size="33px"
                  thumb-color="light-gray"
                  :min="0"
                  :max="100"
                  :step="25"
                  :label="false"
                  color="light-gray"
                />
              </stake-slide-wrapper>

              <stake-info :data="stakeInfoData" :isStake="true" />
            </div>
            <div
              class="column justify-between col-sm-6 col-xs-12 q-pl-sm stake-box__action-section"
            >
              <div class="stake-info__info">
                <div class="stake-info__info__title">How to stake:</div>
                <ul>
                  <li>Connect your wallet</li>
                  <li>Enter the amount of SOL you want to stake</li>
                  <li>Click STAKE NOW</li>
                  <li>Confirm the transaction in your wallet</li>
                  <li>Done, you’ve staked your SOL!</li>
                </ul>
              </div>
              <q-btn
                v-if="connected"
                :loading="depositing"
                class="stake-box__btn q-ml-sm"
                color="secondary"
                rounded
                size="lg"
                text-color="dark"
                :disable="connectionLost || Number(stake.from) > Number(availableSol)"
                @click="stakeHandler"
              >
                STAKE NOW
              </q-btn>
              <div v-else class="text-right q-ml-sm">
                <connect-wallet />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-tab-panel>

      <q-tab-panel name="unstake">
        <q-card-section class="top-section">
          <div class="row justify-center stake-box__note">
            <div class="col">
              <div>
                PLEASE NOTE: There is a fee charged by the Solana blockchain for unstaking. Please
                refer to the table below.
              </div>
            </div>
          </div>
          <div class="row justify-center">
            <div class="col">
              <div class="stake-box__title">
                Available {{ availableJsol }} JSOL<span
                  v-if="connected && Number(unstake.from) > Number(availableJsol)"
                  class="stake-box__warning gt-xs"
                  >Insufficient funds to unstake</span
                >
              </div>
            </div>
            <div>
              <div class="stake-box__rate">
                <span class="text-dark">1</span>
                <span> JSOL</span>
                <span class="q-px-sm">≈</span>
                <span class="text-dark">{{ jsolToSolRate }}</span>
                <span> SOL</span>
              </div>
            </div>
          </div>
          <div
            v-if="connected && Number(unstake.from) > Number(availableJsol)"
            class="stake-box__warning lt-sm"
          >
            Insufficient funds to unstake
          </div>
        </q-card-section>

        <q-card-section class="with-arrow">
          <q-input
            ref="unstakeFromInput"
            :maxlength="14"
            v-model="unstake.from"
            class="stake-box__input"
            label="Staked JSOL"
            outlined
            placeholder="0.0"
            stack-label
            :readonly="connectionLost"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn
                dense
                color="natural-light-gray"
                text-color="primary-gray"
                unelevated
                size="14px"
                padding="2px 8px 1px 8px"
                @click="unstakeMax"
              >
                MAX
              </q-btn>
              <jsol-svg class="stake-field__icon" />
              <span class="stake-field__symbol">JSOL</span>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="stake-to-input">
          <q-input
            v-model="unstake.to"
            label="Amount to unstake"
            outlined
            placeholder="0.0"
            class="stake-box__input-to"
            readonly
            stack-label
            bg-color="transparent"
          >
            <template #append>
              <img alt="" class="stake-field__icon" src="@/assets/img/sol-logo.svg" />
              <span class="stake-field__symbol">SOL</span>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <div class="row items-between">
            <div class="column col-sm-6 col-xs-12 q-pr-sm stake-box__action-section">
              <!-- <stake-slide-wrapper :value="unstakePercent">
                <q-slider
                  v-model="unstakePercent"
                  :disable="!connected"
                  :step="25"
                  :min="0"
                  :max="100"
                  :label="false"
                  color="light-gray"
                />
              </stake-slide-wrapper> -->

              <stake-info :data="unstakeInstantInfoData" :isStake="false" v-if="useWithdrawSol" />
              <div class="row justify-center stake-box__note" v-else>
                <div class="col">
                  <div>Reserve balance insufficient for instant unstaking.</div>
                  <div>
                    You can however swap JSOL using one of our DeFi partners’ liquidity pools
                  </div>
                  <q-btn
                    type="a"
                    href="https://raydium.io/swap/?from=7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn&to=11111111111111111111111111111111"
                    target="_blank"
                    rounded
                    label="SWAP JSOL/SOL"
                    color="info"
                    text-color="white"
                  />
                </div>
              </div>

              <q-btn
                v-if="connected"
                :loading="withdrawing && unstakeType === 'instant'"
                class="stake-box__btn q-mt-sm"
                color="secondary"
                rounded
                size="lg"
                text-color="dark"
                :disable="
                  connectionLost ||
                  !useWithdrawSol ||
                  unstakeType === 'delayed' ||
                  Number(unstake.from) > Number(availableJsol)
                "
                @click="unstakeHandler(false)"
              >
                <div>UNSTAKE NOW</div>
                <div><span class="text-bold">0.05%</span> FEE</div>
              </q-btn>
            </div>

            <div class="column col-sm-6 col-xs-12 q-pl-sm stake-box__action-section">
              <stake-info :data="unstakeInfoData" :isStake="false" v-if="connected" />
              <q-btn
                v-if="connected"
                :loading="withdrawing && unstakeType === 'delayed'"
                class="stake-box__btn q-mt-sm q-ml-sm"
                color="secondary"
                rounded
                size="lg"
                text-color="dark"
                :disable="
                  connectionLost ||
                  unstakeType === 'instant' ||
                  Number(unstake.from) > Number(availableJsol)
                "
                @click="unstakeHandler(true)"
              >
                <div>UNSTAKE DELAYED</div>
                <div><span class="text-bold">0.00%</span> FEE</div>
              </q-btn>
              <div v-else class="text-right q-ml-sm q-mt-auto">
                <connect-wallet />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
  <stake-success-dialog v-model="stakeSuccessDialog" />
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import { storeToRefs } from 'pinia';
  import {
    useBalanceStore,
    useConnectionStore,
    useStakeAccountStore,
    useStakePoolStore,
    useWalletStore,
  } from '@jpool/common/store';
  import { formatAmount, formatAndTrimAmount, formatPct, lamportsToSol } from '@jpool/common/utils';
  import { useDeposit, useWithdraw } from '@jpool/common/hooks';
  import StakeInfo from '@/components/staking/stake/StakeInfo.vue';
  import StakeSlideWrapper from '@/components/staking/stake/StakeSlideWrapper.vue';
  import StakeSuccessDialog from '@/components/staking/stake/StakeSuccessDialog.vue';
  import ConnectWallet from '@/components/staking/ConnectWallet.vue';
  import { useApyStore } from '@jpool/common/store/modules/apy';
  import { clickOutside } from '@jpool/common/directives';
  import { useEmitter } from '@jpool/common/hooks';

  enum Tab {
    stake = 'stake',
    unstake = 'unstake',
  }

  export default defineComponent({
    components: {
      ConnectWallet,
      StakeInfo,
      StakeSlideWrapper,
      StakeSuccessDialog,
    },
    directives: {
      clickOutside,
    },
    setup() {
      const { notify } = useQuasar();
      const connectionStore = useConnectionStore();
      const { connected } = storeToRefs(useWalletStore());
      const { solBalance, tokenBalance } = storeToRefs(useBalanceStore());
      const { fees, exchangeRate, connectionLost } = storeToRefs(useStakePoolStore());
      const { depositFee, depositing, depositSol, stakeSuccessDialog } = useDeposit();
      const { withdrawFee, withdrawSolFee, withdrawing, setAmount, withdraw, useWithdrawSol } =
        useWithdraw();
      const stakeAccounts = useStakeAccountStore();
      const { apy } = storeToRefs(useApyStore());

      const emitter = useEmitter();

      emitter.on('closeStakeSuccessDialog', () => {
        stakeSuccessDialog.value = false;
      });

      const stake = reactive<{ from: any; to: any }>({
        from: null,
        to: null,
      });

      const unstake = reactive<{ from: any; to: any }>({
        from: null,
        to: null,
      });

      const tab = ref(Tab.stake);
      const stakeFromInput = ref<any>(null);
      const unstakeFromInput = ref<any>(null);

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
        let value = (sol - lamportsToSol(depositFee.value)) * exchangeRate.value;
        value -= value * fees.value.solDepositFee;
        return value > 0 ? value : 0;
      });

      // Calculate amount to withdraw
      const withdrawAmount = computed(() => {
        const sol = Number(unstake.from);
        if (sol <= 0) {
          return 0;
        }
        let value = (sol - lamportsToSol(withdrawFee.value)) * (1 / exchangeRate.value);
        value -= value * fees.value.withdrawalFee;
        return value > 0 ? value : 0;
      });

      const withdrawInstantAmount = computed(() => {
        const sol = Number(unstake.from);
        if (sol <= 0) {
          return 0;
        }
        let value = (sol - lamportsToSol(withdrawSolFee.value)) * (1 / exchangeRate.value);
        value -= value * fees.value.solWithdrawalFee;
        return value > 0 ? value : 0;
      });

      watch(depositAmount, (amount) => {
        if (!amount) {
          stake.to = null;
          return;
        }
        stake.to = amount > 0 ? amount.toFixed(5) : 0;
      });

      watch(withdrawAmount, (amount) => {
        if (!amount) {
          unstake.to = null;
          return;
        }
        setAmount(unstake.from);
        unstake.to = amount > 0 ? amount.toFixed(5) : 0;
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

      const unstakePercent = ref(0);
      watch(unstakePercent, () => {
        const value = tokenBalance.value * unstakePercent.value;
        unstake.from = value ? formatAmount(value / 100) : value;
      });

      const highlightFix = ref(true);
      const unstakeType = ref('');

      return {
        tab,
        stake,
        unstake,
        cluster: computed(() => connectionStore.cluster),
        connected,
        depositing,
        withdrawing,
        stakeFromInput,
        unstakeFromInput,
        stakePercent,
        unstakePercent,
        stakeSuccessDialog,
        connectionLost,
        useWithdrawSol,
        unstakeType,
        apy: computed(() => formatPct.format(apy.value)),
        stakeInfoData: computed(() => {
          const from = stake.from;
          const depositFeeVal = lamportsToSol(depositFee.value);
          const value = from ? (from - depositFeeVal) * exchangeRate.value : 0;
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
              name: 'Subtotal, SOL:',
              value: (from ? formatAndTrimAmount(from - depositFeeVal) : '0') + ' SOL',
              isBold: true,
            },
            {
              name: 'Subtotal, JSOL:',
              value: formatAndTrimAmount(value) + ' JSOL',
            },
            {
              name: `JPool Fee (${formatPct.format(fees.value.solDepositFee)}):`,
              value: formatAndTrimAmount(value * fees.value.solDepositFee) + ' JSOL',
            },
            {
              name: 'YOU GET:',
              value: `${stake.to ? stake.to : '0'} JSOL`,
              isBold: true,
            },
          ];
        }),
        unstakeInfoData: computed(() => {
          const from = unstake.from;
          const withdrawRealFee = fees.value.withdrawalFee;
          const withdrawFeeVal = from * withdrawRealFee;
          const value = from ? (from - withdrawFeeVal) * (1 / exchangeRate.value) : 0;
          return [
            {
              name: 'JSOL to unstake:',
              value: `${from ? from : '0'} JSOL`,
            },
            {
              name: `JPool fee (${formatPct.format(withdrawRealFee)}):`,
              value: formatAndTrimAmount(withdrawFeeVal) + ' JSOL',
            },
            {
              name: 'Subtotal, JSOL:',
              value: (from ? formatAndTrimAmount(from - withdrawFeeVal) : '0') + ' JSOL',
              isBold: true,
            },
            {
              name: 'Subtotal, SOL:',
              value: formatAndTrimAmount(value) + ' SOL',
            },
            {
              name: 'Network fee:',
              value: lamportsToSol(withdrawFee.value) + ' SOL',
            },
            {
              name: 'YOU GET:',
              value: `${unstake.to ? unstake.to : '0'} SOL`,
              isBold: true,
            },
          ];
        }),
        unstakeInstantInfoData: computed(() => {
          const from = unstake.from;
          const withdrawRealFee = fees.value.solWithdrawalFee;
          const withdrawFeeVal = from * withdrawRealFee;
          const value = from ? (from - withdrawFeeVal) * (1 / exchangeRate.value) : 0;
          return [
            {
              name: 'JSOL to unstake:',
              value: `${from ? from : '0'} JSOL`,
            },
            {
              name: `JPool fee (${formatPct.format(withdrawRealFee)}):`,
              value: formatAndTrimAmount(withdrawFeeVal) + ' JSOL',
            },
            {
              name: 'Subtotal, JSOL:',
              value: (from ? formatAndTrimAmount(from - withdrawFeeVal) : '0') + ' JSOL',
              isBold: true,
            },
            {
              name: 'Subtotal, SOL:',
              value: formatAndTrimAmount(value) + ' SOL',
            },
            {
              name: 'Network fee:',
              value: lamportsToSol(withdrawSolFee.value) + ' SOL',
            },
            {
              name: 'YOU GET:',
              value: `${
                withdrawInstantAmount.value > 0 ? withdrawInstantAmount.value.toFixed(5) : 0
              } SOL`,
              isBold: true,
            },
          ];
        }),
        availableSol: computed(() => (solBalance.value ? solBalance.value : '0')),
        availableJsol: computed(() => (tokenBalance.value ? tokenBalance.value : '0')),
        solDepositFee: computed(() => fees?.value.solDepositFee),
        withdrawalFee: computed(() => fees?.value.withdrawalFee),
        solToJsolRate: computed(() =>
          exchangeRate.value == 1 ? 1 : formatAmount(exchangeRate.value),
        ),
        jsolToSolRate: computed(() =>
          exchangeRate.value == 1 ? 1 : formatAmount(1 / exchangeRate.value),
        ),

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

        unstakeMax() {
          if (!connected.value) {
            notify({
              message: 'Wallet is not connected',
              caption: 'Please connect your wallet',
            });
            return;
          }
          unstake.from = tokenBalance.value;
        },

        stakeHandler: async () => {
          if (depositAmount.value <= 0) {
            // @ts-ignore
            stakeFromInput.value?.focus();
            return;
          }
          await depositSol(stake.from - lamportsToSol(depositFee.value));
          stake.from = 0;
          stake.to = 0;
        },

        unstakeHandler: async (forceDelayed = false) => {
          if (withdrawAmount.value <= 0) {
            //   notify({
            //     message: 'Too low balance',
            //     caption: '',
            //   });
            unstakeFromInput.value?.focus();
            return;
          }
          unstakeType.value = forceDelayed ? 'delayed' : 'instant';
          await withdraw(forceDelayed);
          unstakeType.value = '';
          // await withdraw(unstake.from)
          unstake.from = 0;
          unstake.to = 0;
          stakeAccounts.load();
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
