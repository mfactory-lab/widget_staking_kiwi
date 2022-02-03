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
      <div class="my-stake__index">{{ index }}</div>
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
        <q-badge :color="stateColor">
          {{ state }}
        </q-badge>
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-circular-progress
        :show-value="false"
        :value="state === 'activating' || state === 'deactivating' ? epochProgress : 0"
        size="34px"
        :thickness="0.2"
        color="secondary"
        track-color="primary"
        center-color="white"
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
        <q-btn-group
          v-if="jpoolPossible && state === 'active'"
          class="full-width"
          rounded
          unelevated
        >
          <q-btn rounded unelevated color="primary" class="full-width" @click="deactivate(address)">
            DEACTIVATE
          </q-btn>
          <q-btn color="warning" text-color="dark" @click="depositJpool"> DEPOSIT TO JPOOL </q-btn>
        </q-btn-group>
        <q-btn
          v-else
          rounded
          unelevated
          color="primary"
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
      <copy-to-clipboard :text="address" />
    </div>
    <q-inner-loading :showing="loading || stateLoading">
      <q-spinner color="primary" />
    </q-inner-loading>
  </q-item>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  // @ts-ignore
  import { ProgramAccount, useCoinRateStore, useEpochStore } from '@jpool/common/store';
  import { formatAmount, lamportsToSol, shortenAddress } from '@jpool/common/utils';
  import CopyToClipboard from '@/components/CopyToClipboard.vue';
  import { formatMoney } from '@jpool/common/utils/check-number';
  import BN from 'bn.js';

  const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1));

  export default defineComponent({
    components: { CopyToClipboard },
    props: {
      index: Number,
      loading: Boolean,
      jpoolPossible: Boolean,
      onlyDeposit: {
        type: Boolean,
        default: false,
      },
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
        return bnEpoch.eq(MAX_EPOCH) ? '---' : epoch;
      };

      const stateLoading = ref(false);
      const coinRateStore = useCoinRateStore();
      const { epochProgress } = storeToRefs(useEpochStore());

      const amount = computed(() => {
        return formatAmount(lamportsToSol(props.stakeAccount?.account?.lamports ?? 0));
      });

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
