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
  <q-item class="q-pt-md">
    <q-item-section side>
      <div>{{ index }}</div>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption class="row">
        <div class="column justify-evenly q-mr-sm">
          <div>{{ amount }} SOL</div>
          <div>$ {{ solUsd }}</div>
        </div>
        <img alt="" src="@/assets/img/sol-logo.svg" />
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label class="items-center">
        <q-badge :color="stateColor">
          {{ state }}
        </q-badge>
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <template v-if="state === 'active' || state === 'activating'">
        <q-btn
          rounded
          unelevated
          :disabled="state === 'activating'"
          color="primary"
          @click="deactivate(address)"
        >
          DEACTIVATE
        </q-btn>
      </template>
      <template v-else>
        <q-btn-group rounded unelevated>
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
            @click="deposit"
          >
            ACTIVATE
          </q-btn>
        </q-btn-group>
      </template>
    </q-item-section>
    <div class="row full-width justify-end items-center my-stake__address">
      <span class="q-mx-sm">{{ address }}</span>
      <copy-to-clipboard :text="address" />
    </div>
    <q-inner-loading :showing="loading || stateLoading">
      <q-spinner color="primary" />
    </q-inner-loading>
  </q-item>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watchEffect } from 'vue';
  // @ts-ignore
  import type { StakeActivationData } from '@solana/web3.js';
  import { ProgramAccount, useCoinRateStore, useConnectionStore } from '@jpool/common/store';
  import { formatAmount, lamportsToSol, shortenAddress } from '@jpool/common/utils';
  import CopyToClipboard from '@/components/CopyToClipboard.vue';
  import { formatMoney } from '@jpool/common/utils/check-number';

  export default defineComponent({
    components: { CopyToClipboard },
    props: {
      index: Number,
      loading: Boolean,
      onlyDeposit: {
        type: Boolean,
        default: false,
      },
      stakeAccount: {
        type: Object as () => ProgramAccount,
        required: true,
      },
    },
    emits: ['deposit', 'deactivate', 'withdraw'],
    setup(props, { emit }) {
      const connectionStore = useConnectionStore();
      const stakeActivation = ref<StakeActivationData>();
      const stateLoading = ref(true);
      const coinRateStore = useCoinRateStore();

      watchEffect(async () => {
        stateLoading.value = true;
        stakeActivation.value = await connectionStore.connection!.getStakeActivation(
          props.stakeAccount.pubkey,
        );
        stateLoading.value = false;
      });

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
        shortAddress: computed(() => shortenAddress(props.stakeAccount.pubkey.toBase58())),
        lamports: computed(() => props.stakeAccount?.account?.lamports),
        state: computed(() => stakeActivation.value?.state),
        stateColor: computed(() => {
          switch (stakeActivation.value?.state) {
            case 'activating':
              return 'positive';
            case 'active':
              return 'secondary';
            case 'inactive':
              return 'accent';
            default:
              return 'primary';
          }
        }),
        stateLoading,
        deposit() {
          emit('deposit', props.stakeAccount);
        },
        deactivate(address: string) {
          emit('deactivate', address);
        },
        withdraw(address: string, lamports: number) {
          emit('withdraw', address, lamports);
        },
      };
    },
  });
</script>
