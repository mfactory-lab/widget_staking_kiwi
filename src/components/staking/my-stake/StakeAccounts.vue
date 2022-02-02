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
    <q-card-section v-if="loading && 0" class="flex flex-center">
      <q-spinner size="md" />
    </q-card-section>

    <template v-else>
      <q-card-section class="wallet-balance__head">
        <q-spinner size="md" v-if="loading" class="wallet-balance__head__loader" />
        <q-btn
          rounded
          outline
          color="white"
          class="q-mr-md q-mb-xs"
          padding="4px 12px 1px"
          :disable="connectionLost"
          @click="refresh"
        >
          Refresh
        </q-btn>
        <div>MY STAKE</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div v-if="connected">
          <q-list v-if="accountsSorted.length > 0" separator>
            <stake-account-item
              v-for="(acc, index) in accountsSorted"
              :index="index + 1"
              :key="acc.stakeAccount.pubkey"
              :stake-account="acc.stakeAccount"
              :status="acc.state"
              :loading="acc.stakeAccount.pubkey.toBase58() === loadingPubkey"
              @deactivate="deactivate"
              @withdraw="withdraw"
              @activate="activate"
            />
          </q-list>
          <div v-else class="flex flex-center q-mt-md q-mb-xs">
            Your stake accounts will be shown here. You don't have any valid stake accounts.
          </div>
        </div>
        <div v-else class="text-center q-mt-md text-bold">Please connect a wallet</div>
      </q-card-section>
    </template>
  </q-card>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  // @ts-ignore
  import { PublicKey, StakeProgram } from '@solana/web3.js';
  import {
    ProgramAccount,
    sendTransaction,
    useConnectionStore,
    useStakeAccountStore,
    useWalletStore,
  } from '@jpool/common/store';
  import { useMonitorTransaction } from '@jpool/common/hooks';
  import StakeAccountItem from './StakeAccountItem.vue';
  import { useValidator } from '@/hooks/validator';
  import { useStakeAccounts } from '@/hooks/stake-accounts';

  interface StakeAccount {
    stakeAccount: ProgramAccount;
    state: String;
  }
  export default defineComponent({
    components: { StakeAccountItem },
    emits: [
      'beforeDeposit',
      'afterDeposit',
      'beforeDeactivate',
      'afterDeactivate',
      'beforeWithdraw',
      'afterWithdraw',
    ],
    setup(_props, { emit }) {
      const connectionStore = useConnectionStore();
      const { wallet, connected } = storeToRefs(useWalletStore());
      const stakeAccountStore = useStakeAccountStore();
      const { monitorTransaction } = useMonitorTransaction();
      const { voterKey } = useValidator();
      const { delegateAccount } = useStakeAccounts();

      const dialog = computed(() => stakeAccountStore.dialog);
      const loading = computed(() => stakeAccountStore.loading);
      const loadingPubkey = ref();

      const accounts = computed(() => {
        if (voterKey.value) {
          return stakeAccountStore.data.filter(
            (acc) =>
              acc.account.data?.parsed?.type !== 'delegated' ||
              acc.account.data?.parsed?.info?.stake?.delegation?.voter == voterKey.value,
          );
        }
        return stakeAccountStore.data;
      });
      const accountsSorted = ref<StakeAccount[]>([]);

      const statusWeights = {
        active: 0,
        activating: 1,
        deactivating: 2,
        inactive: 3,
      };

      const getStatusWeight = (acc, status) => {
        if (acc.account.data?.parsed?.type !== 'delegated') return 4;
        return statusWeights[status];
      };

      watch(accounts, async () => {
        const accountsSorts = await Promise.all(
          accounts.value.map(async (acc) => {
            const stakeActivation = await connectionStore.connection!.getStakeActivation(
              acc.pubkey,
            );
            return {
              stakeAccount: acc,
              state: stakeActivation.state,
            };
          }),
        );
        accountsSorted.value = accountsSorts.sort((a, b) => {
          return (
            getStatusWeight(b.stakeAccount, b.state) - getStatusWeight(a.stakeAccount, a.state)
          );
        });
      });

      return {
        connected,
        dialog,
        loading,
        loadingPubkey,
        accounts,
        accountsSorted,

        updateDialog: (v: boolean) => (stakeAccountStore.dialog = v),

        refresh: () => {
          stakeAccountStore.load();
        },

        activate: async (stakeAccount: ProgramAccount) => {
          emit('beforeDeposit');
          loadingPubkey.value = stakeAccount.pubkey.toBase58();
          await delegateAccount(stakeAccount.pubkey);
          loadingPubkey.value = null;
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
          await stakeAccountStore.load();
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
      };
    },
  });
</script>
