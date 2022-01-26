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
  <q-card class="q-mt-lg full-width my-stake">
    <q-card-section v-if="loading" class="flex flex-center">
      <q-spinner size="md" />
    </q-card-section>

    <template v-else>
      <q-card-section class="wallet-balance__head">
        <div>MY STAKE</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div v-if="connected">
          <q-list v-if="accounts.length > 0" separator>
            <stake-account-item
              v-for="(acc, index) in accounts"
              :index="index + 1"
              :key="acc.pubkey"
              :stake-account="acc"
              :loading="acc.pubkey.toBase58() === loadingPubkey"
              @deactivate="deactivate"
              @withdraw="withdraw"
              @deposit="deposit"
            />
          </q-list>
          <div v-else class="flex flex-center">
            Your stake accounts will be shown here.
            <br />
            You don't have any valid stake accounts.
          </div>
        </div>
      </q-card-section>
    </template>
  </q-card>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { evaClose } from '@quasar/extras/eva-icons';
  // @ts-ignore
  import { PublicKey, StakeProgram } from '@solana/web3.js';
  import {
    ProgramAccount,
    sendTransaction,
    useConnectionStore,
    useStakeAccountStore,
    useWalletStore,
  } from '@jpool/common/store';
  import { useDeposit, useMonitorTransaction } from '@jpool/common/hooks';
  import StakeAccountItem from './StakeAccountItem.vue';

  export default defineComponent({
    components: { StakeAccountItem },
    props: {
      voter: {
        type: String,
        required: false,
      },
    },
    emits: [
      'beforeDeposit',
      'afterDeposit',
      'beforeDeactivate',
      'afterDeactivate',
      'beforeWithdraw',
      'afterWithdraw',
    ],
    setup(props, { emit }) {
      const connectionStore = useConnectionStore();
      const { wallet, connected } = storeToRefs(useWalletStore());
      const stakeAccountStore = useStakeAccountStore();
      const { monitorTransaction } = useMonitorTransaction();
      const { depositStake } = useDeposit();

      const dialog = computed(() => stakeAccountStore.dialog);
      const loading = computed(() => stakeAccountStore.loading);
      const loadingPubkey = ref();

      return {
        connected,
        dialog,
        loading,
        loadingPubkey,

        accounts: computed(() => {
          if (props.voter) {
            return stakeAccountStore.data.filter(
              (acc) => acc.account.data?.parsed?.info?.stake?.delegation?.voter == props.voter,
            );
          }
          return stakeAccountStore.data;
        }),

        updateDialog: (v: boolean) => (stakeAccountStore.dialog = v),

        deposit: async (stakeAccount: ProgramAccount) => {
          emit('beforeDeposit');
          loadingPubkey.value = stakeAccount.pubkey.toBase58();
          await depositStake(stakeAccount);
          loadingPubkey.value = null;
          await stakeAccountStore.load();
          emit('afterDeposit');
        },

        deactivate: async (address: string) => {
          emit('beforeDeactivate');
          loadingPubkey.value = address;
          await monitorTransaction(
            sendTransaction(
              connectionStore.connection,
              wallet.value!,
              StakeProgram.deactivate({
                stakePubkey: new PublicKey(address),
                authorizedPubkey: wallet.value!.publicKey!,
              }).instructions,
              [],
            ),
          );
          loadingPubkey.value = null;
          emit('afterDeactivate');
        },

        withdraw: async (address: string, lamports: number) => {
          emit('beforeWithdraw');
          loadingPubkey.value = address;
          await monitorTransaction(
            sendTransaction(
              connectionStore.connection,
              wallet.value!,
              StakeProgram.withdraw({
                stakePubkey: new PublicKey(address),
                authorizedPubkey: wallet.value!.publicKey!,
                toPubkey: wallet.value!.publicKey!,
                lamports: lamports,
                // custodianPubkey: wallet.value!.publicKey!,
              }).instructions,
              [],
            ),
          );
          loadingPubkey.value = null;
          await stakeAccountStore.load();
          emit('afterWithdraw');
        },
        evaClose,
      };
    },
  });
</script>
