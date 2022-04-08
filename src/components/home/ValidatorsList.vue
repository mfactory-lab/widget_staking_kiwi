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
            >Solana Validators</div
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

        <div
          class="row q-mt-md"
          :class="{ 'justify-start': $q.screen.lt.md, 'justify-between': $q.screen.gt.sm }"
        >
          <div class="row validators-list__filters q-mb-md q-mr-md">
            <div class="column q-ml-md q-my-xs">
              <div class="validators-list__dropdown-label q-mb-xs">Hide Private</div>
              <q-toggle
                v-model="filterPrivate"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                size="40px"
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
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="primary"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Hide with Commission</div>
              <q-toggle
                v-model="filterFee"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="primary"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Hide anonymous</div>
              <q-toggle
                v-model="filterNoname"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="primary"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Hide Delinquent</div>
              <q-toggle
                v-model="filterDelinq"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="red-dark"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
          </div>
          <div class="row validators-list__filters q-mb-md q-mr-md">
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">JPool-Members only</div>
              <q-toggle
                v-model="filterNotJpool"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="warning"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">SVM-Members only</div>
              <q-toggle
                v-model="filterNotSvm"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="accent"
                keep-color
                label=""
                unchecked-icon="eva-close-outline"
              />
            </div>
          </div>
          <div class="row validators-list__filters q-mb-md">
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Show my Stake only</div>
              <q-toggle
                v-model="filterHasStake"
                class="styled-toggle"
                checked-icon="eva-checkmark-outline"
                toggle-order="tf"
                color="secondary"
                keep-color
                label=""
                :disable="!connected"
                unchecked-icon="eva-close-outline"
              />
              <q-tooltip v-if="!connected" class="text-body2"
                >Available with connected wallet</q-tooltip
              >
            </div>
          </div>
        </div>

        <div class="q-pt-sm q-pb-sm row">
          <div
            class="col q-mt-xs q-mb-sm q-mr-lg main-section__block"
            :class="{ 'col-12': $q.screen.lt.sm }"
          >
            <price-stats />
          </div>

          <q-input
            v-model="nameFilter"
            class="q-mb-xs q-mt-sm col-grow validators-list__search"
            :class="{ 'full-width': $q.screen.lt.sm }"
            label="Search"
            placeholder="enter a validator name, identity or vote key"
            stack-label
          />

          <div
            class="row q-ml-auto q-my-xs col-sm-auto"
            :class="{ 'justify-between': $q.screen.lt.sm }"
          >
            <div class="q-ml-lg"></div>
            <sort-item
              title="Sort by APY"
              param="apyNum"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
            />
            <!-- <sort-item
              title="Sort by Commission"
              param="feeNum"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
              add-class="q-ml-lg"
            /> -->
            <sort-item
              title="Sort by Stake"
              param="totalStake"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
              add-class="q-ml-lg"
            />
          </div>

          <div class="row justify-end q-ml-lg" :class="{ 'q-ml-auto': $q.screen.lt.sm }">
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
        <q-card class="q-mb-md full-width validators-list__main">
          <q-card-section class="validators-list__list__head validator-row row justify-between">
            <div class="validator-row__name row q-pr-md items-center justify-between">
              <span>VALIDATOR</span>
              <sort-item
                size="xs"
                margin-size="xs"
                param="name"
                @sort="sort"
                :current-param="sortParam"
                :current-type="sortType"
              />
            </div>
            <div class="validator-row__apy row q-pl-md q-pr-md items-center justify-between">
              <span>REWARDS</span>
              <sort-item
                size="xs"
                margin-size="xs"
                param="apyNum"
                @sort="sort"
                :current-param="sortParam"
                :current-type="sortType"
              />
            </div>
            <div class="validator-row__apy-chart row q-pl-md q-pr-md items-center justify-between">
              <span>HISTORY APY</span>
            </div>
            <div class="validator-row__btns row q-pl-md items-center justify-between">
              <span>TOTAL STAKE</span>
              <sort-item
                size="xs"
                margin-size="xs"
                param="totalStake"
                @sort="sort"
                :current-param="sortParam"
                :current-type="sortType"
              />
            </div>
          </q-card-section>

          <div class="validators-list__list">
            <div class="relative-position">
              <div
                class="fit row wrap justify-start items-start q-px-md content-start"
                style="min-height: 100px"
              >
                <template v-if="itemsSorted.length">
                  <div
                    v-for="(item, index) of itemsShowed"
                    :key="item.voter"
                    class="stake-accounts-container col-12 q-px-none q-pt-md"
                  >
                    <validator-row
                      :item="item"
                      :index="index + (currentPage - 1) * perPageNum + 1"
                      :loading="loading"
                      :cluster="cluster"
                    />
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
  import { computed, defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useConnectionStore, useStakePoolStore, useValidatorsAllStore } from '@/store';
  import ValidatorRow from '@/components/home/ValidatorRow.vue';
  import SortItem from '@/components/home/SortItem.vue';
  import PriceStats from '@/components/staking/PriceStats.vue';
  import { useWallet } from 'solana-wallets-vue';

  export default defineComponent({
    components: { ValidatorRow, PriceStats, SortItem },
    setup() {
      const connectionStore = useConnectionStore();
      const stakePoolStore = useStakePoolStore();
      const { connected } = useWallet();

      const { connectionLost } = storeToRefs(stakePoolStore);
      const validatorsAllStore = useValidatorsAllStore();
      const {
        sortType,
        sortParam,
        nameFilter,
        currentPage,
        perPage,
        perPageNum,
        perPageOptions,
        pages,
        itemsSorted,
        itemsShowed,
        filterPrivate,
        filterTop33,
        filterFee,
        filterNoname,
        filterDelinq,
        filterNotSvm,
        filterNotJpool,
        filterHasStake,
        loading,
      } = storeToRefs(validatorsAllStore);

      const refresh = async () => {
        await validatorsAllStore.loadAllValidators();
        validatorsAllStore.loadAverageApy();
      };

      const cluster = computed(() => connectionStore.cluster);

      return {
        connected,
        sortType,
        sortParam,
        nameFilter,
        currentPage,
        perPage,
        perPageNum,
        perPageOptions,
        pages,
        filterPrivate,
        filterTop33,
        filterFee,
        filterNoname,
        filterDelinq,
        filterNotSvm,
        filterNotJpool,
        filterHasStake,
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
