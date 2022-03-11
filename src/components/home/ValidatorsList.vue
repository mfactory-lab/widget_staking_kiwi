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
    <div class="validators-list__main">
      <div class="container">
        <div class="validators-list__title container q-pt-md q-pb-sm">
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

        <div class="q-pt-sm q-pb-lg row">
          <q-input v-model="nameFilter" class="q-mr-md" label="Filter by name" stack-label />

          <div class="column q-mr-auto">
            <div class="validators-list__dropdown-label q-mt-sm">Sort by</div>
            <q-btn-dropdown
              class=""
              :label="sortParam.title"
              :model-value="false"
              auto-close
              color="text-white"
              text-color="primary"
            >
              <q-list>
                <q-item
                  v-for="item in sortOptions"
                  :key="item.value"
                  clickable
                  @click="sortParam = item"
                >
                  <q-item-section>
                    {{ item.title }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <div class="column">
            <div class="validators-list__dropdown-label q-mt-sm">Per page</div>
            <q-btn-dropdown
              class=""
              :label="perPage"
              :model-value="false"
              auto-close
              color="text-white"
              text-color="primary"
            >
              <q-list>
                <q-item
                  v-for="item in perPageOptions"
                  :key="item"
                  clickable
                  @click="perPage = item"
                >
                  <q-item-section>
                    {{ item }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
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
                <template v-if="itemsSorted.length">
                  <div
                    v-for="item of itemsShowed"
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
        <div class="q-pt-sm q-pb-lg flex flex-center">
          <q-pagination
            v-model="currentPage"
            :max="pages"
            :max-pages="5"
            direction-links
            boundary-links
            :color="$q.dark.isActive ? 'text-white' : 'primary'"
            :text-color="$q.dark.isActive ? 'primary' : 'text-white'"
            icon-first="eva-arrowhead-left-outline"
            icon-last="eva-arrowhead-right-outline"
            icon-prev="eva-arrow-ios-back-outline"
            icon-next="eva-arrow-ios-forward-outline"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import {
    useConnectionStore,
    useStakeAccountStore,
    useStakePoolStore,
    useValidatorStore,
    useValidatorsAllStore,
  } from '@/store';
  import ValidatorRow from '@/components/home/ValidatorRow.vue';

  export default defineComponent({
    components: { ValidatorRow },
    setup() {
      const connectionStore = useConnectionStore();
      const stakeAccountStore = useStakeAccountStore();
      const stakePoolStore = useStakePoolStore();
      const validatorStore = useValidatorStore();

      const { connectionLost } = storeToRefs(stakePoolStore);
      const {
        sortOptions,
        sortParam,
        nameFilter,
        currentPage,
        perPage,
        perPageOptions,
        pages,
        itemsSorted,
        itemsShowed,
      } = storeToRefs(useValidatorsAllStore());

      const refresh = async () => {
        await validatorStore.load();
        await stakeAccountStore.load();
      };

      onMounted(async () => {
        console.log('sortOptions === ', sortOptions.value);
        console.log('sortParam === ', sortParam.value);
        console.log('nameFilter === ', nameFilter.value);
        console.log('perPage === ', perPage.value);
        console.log('perPageOptions === ', perPageOptions.value);
        console.log('pages === ', pages.value);
        console.log('itemsSorted === ', itemsSorted.value);
        console.log('itemsShowed === ', itemsShowed.value);
        if (validatorStore.data.length < 1) {
          await validatorStore.load();
        }
        await stakeAccountStore.load();
      });

      const cluster = computed(() => connectionStore.cluster);

      return {
        sortOptions,
        sortParam,
        nameFilter,
        currentPage,
        perPage,
        perPageOptions,
        pages,
        cluster,
        connectionLost,
        loading: computed(() => validatorStore.loading),
        itemsSorted,
        itemsShowed,
        refresh,
      };
    },
  });
</script>
