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
  <section class="validators-list">
    <div class="validators-list__main bg-white">
      <div class="container">
        <div class="validators-list__title container q-py-md">
          <div class="validators-list__title__text">Validators</div>
          <q-btn
            rounded
            color="primary"
            text-color="text-white"
            :disable="connectionLost"
            padding="4px 17px"
            @click="refresh"
          >
            Refresh
          </q-btn>
        </div>

        <q-card class="q-mb-md full-width validators-list__main">
          <q-card-section class="validators-list__list__head validator-row row justify-between">
            <div class="validator-row__name column q-mr-sm justify-start">VALIDATOR</div>
            <div class="validator-row__apy column q-mr-sm q-pl-sm justify-start">REWARDS</div>
            <div class="validator-row__stake column q-mr-sm justify-start">TOTAL STAKE</div>
            <div class="validator-row__btns column justify-start"></div>
          </q-card-section>

          <div class="validators-list__list">
            <div class="relative-position">
              <div
                class="fit row wrap justify-start items-start content-start"
                style="min-height: 100px"
              >
                <template v-if="items.length">
                  <div
                    v-for="item of items"
                    :key="item.name"
                    class="stake-accounts-container col-12 q-px-md q-pt-sm"
                  >
                    <validator-row :item="item" :loading="loading" />
                  </div>
                </template>
                <template v-else>
                  <div class="validators-list__no-validators text-center text-grey-6">
                    There are currently no validators in the {{ cluster }} cluster.
                  </div>
                </template>
              </div>
            </div>
          </div>
        </q-card>
        <div class="q-pa-lg flex flex-center">
          <q-pagination
            v-model="currentPage"
            :max="5"
            direction-links
            boundary-links
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import {
    useApyStore,
    useConnectionStore,
    useStakeAccountStore,
    useStakePoolStore,
    useValidatorStore,
    useWalletStore,
  } from '@/store';
  import { formatAmount, formatPct, lamportsToSol, priceFormatter } from '@jpool/common/utils';
  import ValidatorRow from '@/components/home/ValidatorRow.vue';

  export default defineComponent({
    components: { ValidatorRow },
    setup() {
      const connectionStore = useConnectionStore();
      const stakeAccountStore = useStakeAccountStore();
      const stakePoolStore = useStakePoolStore();
      const validatorStore = useValidatorStore();

      const { connected } = storeToRefs(useWalletStore());
      const { connectionLost } = storeToRefs(stakePoolStore);
      const { apyInfo } = storeToRefs(useApyStore());

      const refresh = async () => {
        await validatorStore.load();
        await stakeAccountStore.load();
      };

      onMounted(async () => {
        if (validatorStore.data.length < 1) {
          await validatorStore.load();
        }
        await stakeAccountStore.load();
      });

      const cluster = computed(() => connectionStore.cluster);

      watch(cluster, validatorStore.load);

      function formatAmountPrice(val: number | bigint) {
        return priceFormatter.format(val);
      }

      return {
        currentPage: ref(1),
        cluster,
        connected,
        connectionLost,
        loading: computed(() => validatorStore.loading),
        items: computed(() => {
          // skeleton preloader
          if (validatorStore.loading) {
            return Array(8).fill({});
          }
          const voteApy = apyInfo.value?.validators ?? [];

          return validatorStore.data
            .map((info) => {
              const apyInfo = voteApy.find((v) => v.id == info.id);
              const solTotalJpool = lamportsToSol(info.lamports);
              const solTotal = lamportsToSol(info.totalStake);
              return {
                ...info,
                fee: formatPct.format(info.fee / 100),
                apy: formatPct.format(apyInfo?.apy ?? 0),
                apyNum: apyInfo?.apy ?? 0,
                solStackedNum: stakeAccountStore.voterStake(info.voter).value ?? 0,
                solStacked: formatAmount(stakeAccountStore.voterStake(info.voter).value, 6),
                totalSolJpool: formatAmountPrice(solTotalJpool),
                totalSolStacked: formatAmountPrice(solTotal),
              };
            })
            .sort((a, b) => {
              if (b.solStackedNum > 0 && a.solStackedNum === 0) {
                return 1;
              }
              if (a.solStackedNum > 0 && b.solStackedNum === 0) {
                return -1;
              }
              return b.apyNum - a.apyNum;
            });
        }),
        refresh,
      };
    },
  });
</script>
