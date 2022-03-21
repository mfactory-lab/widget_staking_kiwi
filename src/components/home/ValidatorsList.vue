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
        <div class="validators-list__title q-pt-md q-pb-sm row">
          <div class="col-12 col-md-4"></div>
          <div
            class="validators-list__title__text col-12 col-sm-4"
            :class="{ 'text-center': $q.screen.lt.sm || $q.screen.gt.sm }"
            >Validators</div
          >
          <div
            class="col-12 col-sm-8 col-md-4 row"
            :class="{ 'justify-center': $q.screen.lt.sm, 'justify-end': $q.screen.gt.xs }"
          >
            <q-btn
              rounded
              class="home-page__std-btn"
              color="gray-dark-theme"
              text-color="text-white"
              :disable="connectionLost"
              padding="4px 17px"
              @click="refresh"
            >
              Refresh
            </q-btn>
          </div>
        </div>

        <div class="q-pt-sm q-pb-lg row">
          <q-input
            v-model="nameFilter"
            class="q-mr-md q-mb-xs q-mt-sm"
            :class="{ 'full-width': $q.screen.lt.md }"
            label="Search"
            stack-label
          />

          <div
            class="row q-mr-auto q-my-xs col-12 col-sm-auto"
            :class="{ 'justify-between': $q.screen.lt.sm }"
          >
            <sort-item
              title="Sort by APY"
              param="apyNum"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
            />
            <sort-item
              title="Sort by Fee"
              param="feeNum"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
              add-class="q-ml-lg"
            />
            <sort-item
              title="Sort by Stake"
              param="totalStake"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
              add-class="q-ml-lg"
            />
          </div>

          <div class="row justify-end" :class="{ 'q-ml-auto': $q.screen.lt.sm }">
            <div class="column q-my-xs">
              <div class="validators-list__dropdown-label q-mb-xs">Hide Private</div>
              <q-toggle
                v-model="filterPrivate"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="primary"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Hide Top Staked</div>
              <q-toggle
                v-model="filterTop33"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="primary"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Per page</div>
              <q-btn-dropdown
                class=""
                :label="perPage"
                :model-value="false"
                auto-close
                text-color="text-white"
                color="primary"
                padding="9px 12px 7px"
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
        </div>

        <q-card class="q-mb-md full-width validators-list__main">
          <q-card-section class="validators-list__list__head validator-row row justify-between">
            <div class="validator-row__name column q-mr-sm justify-start">VALIDATOR</div>
            <div class="validator-row__apy column q-mr-sm q-pl-sm justify-start">REWARDS</div>
            <div class="validator-row__apy-chart column q-mr-sm q-pl-sm justify-start"
              >HISTORY APY</div
            >
            <div class="validator-row__btns column justify-start q-pl-sm"
              >TOTAL STAKE & VOTE KEY</div
            >
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
                    <validator-row :item="item" :loading="loading" :cluster="cluster" />
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
            :max-pages="$q.screen.gt.sm ? 14 : 5"
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
    // useStakeAccountStore,
    useStakePoolStore,
    useValidatorStore,
    useValidatorsAllStore,
  } from '@/store';
  import ValidatorRow from '@/components/home/ValidatorRow.vue';
  import SortItem from '@/components/home/SortItem.vue';

  export default defineComponent({
    components: { ValidatorRow, SortItem },
    setup() {
      const connectionStore = useConnectionStore();
      // const stakeAccountStore = useStakeAccountStore();
      const stakePoolStore = useStakePoolStore();
      const validatorStore = useValidatorStore();

      const { connectionLost } = storeToRefs(stakePoolStore);
      const validatorsAllStore = useValidatorsAllStore();
      const {
        sortType,
        sortParam,
        nameFilter,
        currentPage,
        perPage,
        perPageOptions,
        pages,
        itemsSorted,
        itemsShowed,
        filterPrivate,
        filterTop33,
        loading,
      } = storeToRefs(validatorsAllStore);

      const refresh = async () => {
        await validatorsAllStore.loadAllValidators();
      };

      onMounted(async () => {
        if (validatorStore.data.length < 1) {
          await validatorStore.load();
        }
      });

      const cluster = computed(() => connectionStore.cluster);

      return {
        sortType,
        sortParam,
        nameFilter,
        currentPage,
        perPage,
        perPageOptions,
        pages,
        filterPrivate,
        filterTop33,
        cluster,
        connectionLost,
        loading,
        itemsSorted,
        itemsShowed,
        refresh,
        sort: (param, type) => {
          sortParam.value = param;
          sortType.value = type;
        },
      };
    },
  });
</script>
