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
  <q-card class="q-mt-md full-width my-stake">
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
          class="q-mr-md my-stake__refresh-btn"
          padding="2px 12px 1px"
          :disable="connectionLost"
          @click="refresh"
        >
          Refresh
        </q-btn>
        <div>MY STAKING ACCOUNTS</div>
      </q-card-section>

      <q-card-section class="my-stake__list q-py-none">
        <div v-if="connected">
          <div v-if="accountsSorted.length > 0" class="my-stake__total-stats row justify-end">
            <stake-stats
              v-for="(item, i) in totalStats"
              :key="i"
              :title="item.title"
              :title-color="item.color"
              :sol="item.value"
            />
            <sol-svg class="q-pl-md q-icon my-stake__total-stats__logo" />
          </div>
          <q-list v-if="accountsSorted.length > 0" separator>
            <stake-account-item
              v-for="(acc, index) in accountsSorted"
              :index="index + 1"
              :key="acc.stakeAccount.pubkey"
              :stake-account="acc.stakeAccount"
              :status="acc.state"
              :loading="acc.stakeAccount.pubkey.toBase58() === loadingPubkey"
              :jpool-possible="validatorInJpool"
              @deactivate="deactivate"
              @withdraw="withdraw"
              @activate="activate"
              @deposit-jpool="depositJpool"
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
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
  // @ts-ignore
  import { PublicKey, StakeProgram } from '@solana/web3.js';
  import {
    ProgramAccount,
    useConnectionStore,
    useStakeAccountStore,
    useStakePoolStore,
  } from '@/store';
  import { useDeposit, useMonitorTransaction, useStakeAccounts } from '@/hooks';
  import { useValidatorJstakingStore } from '@/store';
  import { lamportsToSol, sendTransaction } from '@/utils';

  interface StakeAccount {
    stakeAccount: ProgramAccount;
    state: String;
  }
  export default defineComponent({
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
      const { wallet, connected } = useWallet();
      const anchorWallet = useAnchorWallet();
      const stakeAccountStore = useStakeAccountStore();
      const { monitorTransaction } = useMonitorTransaction();
      const { voterKey, validatorInJpool } = storeToRefs(useValidatorJstakingStore());
      const { delegateAccount } = useStakeAccounts();
      const { connectionLost } = storeToRefs(useStakePoolStore());
      const { depositStake } = useDeposit();

      const loading = computed(() => stakeAccountStore.loading);
      const loadingPubkey = ref();
      const totalStats = ref([
        {
          title: 'NON-DELEGATED',
          color: '#E33B3B',
          value: 0,
        },
        {
          title: 'INACTIVE',
          color: '#647E82',
          value: 0,
        },
        {
          title: 'ACTIVE',
          color: '#00A5B9',
          value: 0,
        },
        {
          title: 'TOTAL',
          color: '#37A98C',
          value: 0,
        },
      ]);

      const refresh = () => {
        stakeAccountStore.load();
      };

      onMounted(() => {
        if (stakeAccountStore.data.length < 1) {
          refresh();
        }
      });

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
      const accountsFull = ref<StakeAccount[]>([]);

      const statusWeights = {
        active: 0,
        deactivating: 1,
        activating: 2,
        inactive: 3,
      };

      const getStatusWeight = (acc, status) => {
        if (acc.account.data?.parsed?.type !== 'delegated') return 4;
        return statusWeights[status];
      };

      const accountsSorted = computed(() =>
        [...accountsFull.value].sort((a, b) => {
          return (
            getStatusWeight(b.stakeAccount, b.state) - getStatusWeight(a.stakeAccount, a.state)
          );
        }),
      );

      const updateAccounts = async (pubkey?: PublicKey) => {
        const newStats = [0, 0, 0, 0];
        const source = pubkey ? accountsFull.value : accounts.value;
        accountsFull.value = await Promise.all(
          source.map(async (item) => {
            const acc = pubkey ? item.stakeAccount : item;
            const needUpdate = !pubkey || pubkey.equals(acc.pubkey);
            const stakeActivation = needUpdate
              ? await connectionStore.connection!.getStakeActivation(acc.pubkey)
              : item;
            const state = stakeActivation.state;
            if (acc.account.data?.parsed?.type == 'delegated') {
              if (state === 'active' || state === 'deactivating') {
                newStats[2] += lamportsToSol(acc.account.lamports);
              } else {
                newStats[1] += lamportsToSol(acc.account.lamports);
              }
            } else {
              newStats[0] += lamportsToSol(acc.account.lamports);
            }
            return {
              stakeAccount: acc,
              state,
            };
          }),
        );
        newStats[3] = (newStats[0] ?? 0) + (newStats[1] ?? 0) + (newStats[2] ?? 0);
        totalStats.value.forEach((item, index) => {
          item.value = newStats[index] ?? 0;
        });
      };

      watch(accounts, () => updateAccounts(), { immediate: true });

      return {
        connected,
        loading,
        loadingPubkey,
        accounts,
        accountsSorted,
        totalStats,
        connectionLost,
        validatorInJpool,
        refresh,

        activate: async (stakeAccount: ProgramAccount) => {
          emit('beforeDeposit');
          loadingPubkey.value = stakeAccount.pubkey.toBase58();
          await delegateAccount(stakeAccount.pubkey);
          updateAccounts(stakeAccount.pubkey);
          loadingPubkey.value = null;
          emit('afterDeposit');
        },

        depositJpool: async (stakeAccount: ProgramAccount) => {
          emit('beforeDeposit');
          loadingPubkey.value = stakeAccount.pubkey.toBase58();
          const success = await depositStake(stakeAccount);
          if (success) {
            stakeAccountStore.removeAccount(stakeAccount.pubkey.toBase58());
          }
          loadingPubkey.value = null;
          emit('afterDeposit');
        },

        deactivate: async (address: string) => {
          emit('beforeDeactivate');
          loadingPubkey.value = address;
          const stakePubkey = new PublicKey(address);
          await monitorTransaction(
            sendTransaction(
              connectionStore.connection,
              anchorWallet.value!,
              StakeProgram.deactivate({
                stakePubkey,
                authorizedPubkey: wallet.value!.publicKey!,
              }).instructions,
              [],
            ),
            {
              commitment: 'finalized',
            },
          );
          updateAccounts(stakePubkey);
          loadingPubkey.value = null;
          // await stakeAccountStore.load({
          //   delay: 1000,
          // });
          emit('afterDeactivate');
        },

        withdraw: async (address: string, lamports: number) => {
          emit('beforeWithdraw');
          loadingPubkey.value = address;
          await monitorTransaction(
            sendTransaction(
              connectionStore.connection,
              anchorWallet.value!,
              StakeProgram.withdraw({
                stakePubkey: new PublicKey(address),
                authorizedPubkey: wallet.value!.publicKey!,
                toPubkey: wallet.value!.publicKey!,
                lamports: lamports,
              }).instructions,
              [],
            ),
            {
              onSuccess: () => stakeAccountStore.removeAccount(address),
            },
          );
          loadingPubkey.value = null;
          emit('afterWithdraw');
        },
      };
    },
  });
</script>
