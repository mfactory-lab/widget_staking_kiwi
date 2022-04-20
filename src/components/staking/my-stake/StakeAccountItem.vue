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
  <q-item class="justify-end">
    <q-item-section side class="q-mr-auto">
      <div :class="`my-stake__index my-stake__index--${state}`">{{ index }}</div>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption class="row">
        <div class="column justify-evenly q-mr-sm items-end">
          <div class="my-stake__sol">{{ amount }} SOL</div>
          <div class="my-stake__usd">$ {{ solUsd }}</div>
        </div>
        <img alt="" src="@/assets/img/sol-logo.svg" />
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label class="items-center">
        <q-badge class="my-stake__state" :color="stateColor" :text-color="stateTextColor">
          {{ state }}
        </q-badge>
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-circular-progress
        :show-value="false"
        :value="state === 'activating' || state === 'deactivating' ? epochProgress : 0"
        size="34px"
        :thickness="0.4"
        color="secondary"
        :center-color="$q.dark.isActive ? 'primary' : 'white'"
        :track-color="$q.dark.isActive ? 'white' : 'primary'"
      />
    </q-item-section>

    <q-item-section class="my-stake__epoch-info q-mr-sm" side>
      <div class="my-stake__epoch-info__row">
        <div>Activation epoch:</div>
        <div>{{ activationEpoch }}</div>
      </div>
      <div class="my-stake__epoch-info__row">
        <div>Deactivation epoch:</div>
        <div>{{ deactivationEpoch }}</div>
      </div>
    </q-item-section>

    <q-item-section class="my-stake__btns" side>
      <template v-if="state === 'active' || state === 'activating'">
        <div v-if="jpoolPossible && state === 'active'" class="my-stake__btns-diff">
          <q-btn rounded unelevated color="warning" text-color="dark" @click="depositJpool">
            DEPOSIT TO JPOOL
            <q-badge color="red-dark" rounded class="my-stake__btn-badge"> new </q-badge>
          </q-btn>
          <q-btn
            rounded
            unelevated
            :color="$q.dark.isActive ? 'gray-secondary' : 'primary'"
            @click="deactivate(address)"
          >
            DEACTIVATE
          </q-btn>
        </div>
        <q-btn
          v-else
          rounded
          unelevated
          :color="$q.dark.isActive ? 'gray-secondary' : 'primary'"
          class="full-width"
          @click="deactivate(address)"
        >
          DEACTIVATE
        </q-btn>
      </template>
      <template v-else>
        <q-btn-group class="full-width" rounded unelevated>
          <q-btn
            :disabled="state === 'deactivating'"
            color="accent"
            rounded
            unelevated
            @click="withdraw(address, lamports)"
          >
            WITHDRAW
          </q-btn>
          <q-btn
            color="warning"
            :disabled="state === 'deactivating'"
            text-color="dark"
            @click="activate"
          >
            ACTIVATE
          </q-btn>
        </q-btn-group>
      </template>
    </q-item-section>
    <div class="row full-width justify-end items-center my-stake__address">
      <span class="q-mx-sm">{{ $q.screen.gt.xs ? address : shortAddress }}</span>
      <copy-to-clipboard :text="address" :fill="$q.dark.isActive ? '#fff' : undefined" />
    </div>
    <q-inner-loading :showing="loading || stateLoading">
      <q-spinner-gears size="48px" color="warning" />
    </q-inner-loading>
  </q-item>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import BN from 'bn.js';
  import { ProgramAccount, useCoinRateStore, useEpochStore } from '@/store';
  import { formatAmount, formatMoney, lamportsToSol, shortenAddress } from '@/utils';

  const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1));

  export default defineComponent({
    props: {
      index: Number,
      loading: Boolean,
      jpoolPossible: Boolean,
      stakeAccount: {
        type: Object as () => ProgramAccount,
        required: true,
      },
      status: String,
    },
    emits: ['activate', 'deactivate', 'withdraw', 'depositJpool'],
    setup(props, { emit }) {
      const formatEpoch = (epoch: string) => {
        const bnEpoch = new BN(epoch);
        return !epoch || bnEpoch.eq(MAX_EPOCH) ? '---' : epoch;
      };

      const stateLoading = ref(false);
      const coinRateStore = useCoinRateStore();
      const { epochProgress } = storeToRefs(useEpochStore());

      const solAmount = computed(() => lamportsToSol(props.stakeAccount?.account?.lamports ?? 0));

      const amount = computed(() =>
        solAmount.value < 100 ? formatAmount(solAmount.value) : solAmount.value.toFixed(2),
      );

      return {
        amount,
        solUsd: computed(() => formatMoney(coinRateStore.solPrice * Number(amount.value))),
        address: computed(() => props.stakeAccount.pubkey.toBase58()),
        voter: computed(
          () => props.stakeAccount.account.data?.parsed?.info?.stake?.delegation?.voter,
        ),
        activationEpoch: computed(() =>
          formatEpoch(
            props.stakeAccount.account.data?.parsed?.info?.stake?.delegation?.activationEpoch,
          ),
        ),
        deactivationEpoch: computed(() =>
          formatEpoch(
            props.stakeAccount.account.data?.parsed?.info?.stake?.delegation?.deactivationEpoch,
          ),
        ),
        shortAddress: computed(() => shortenAddress(props.stakeAccount.pubkey.toBase58(), 10)),
        lamports: computed(() => props.stakeAccount?.account?.lamports),
        state: computed(() =>
          props.stakeAccount.account.data?.parsed?.type !== 'delegated'
            ? 'not delegated'
            : props.status,
        ),
        stateColor: computed(() => {
          switch (props.status) {
            case 'activating':
              return 'accent';
            case 'active':
              return 'secondary';
            case 'inactive':
              return 'gray-inactive';
            default:
              return 'primary';
          }
        }),
        stateTextColor: computed(() => {
          switch (props.status) {
            case 'activating':
              return 'text-white';
            case 'active':
              return 'text-black';
            case 'inactive':
              return 'text-black';
            default:
              return 'text-white';
          }
        }),
        stateLoading,
        epochProgress: computed(() => Number(epochProgress.value)),
        activate() {
          emit('activate', props.stakeAccount);
        },
        deactivate(address: string) {
          emit('deactivate', address);
        },
        withdraw(address: string, lamports: number) {
          emit('withdraw', address, lamports);
        },
        depositJpool() {
          emit('depositJpool', props.stakeAccount);
        },
      };
    },
  });
</script>
