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
  <section class="validators-list q-pb-lg">
    <div class="">
      <div class="container">
        <div class="validators-list__title q-pt-md q-pb-sm row">
          <div class="col-4 row justify-start">
            <q-btn
              rounded
              class="home-page__std-btn q-pl-sm"
              color="gray-dark-theme"
              text-color="text-white"
              :disable="connectionLost"
              padding="4px 17px"
              @click="refresh"
            >
              REFRESH <br v-if="$q.screen.lt.sm" />
              LIST
            </q-btn>
          </div>
          <div class="validators-list__title__text col-4 text-center"
            >{{ $q.screen.gt.sm ? 'Solana' : '' }} Validators</div
          >
          <div class="col-4 row q-pl-md items-center justify-end">
            <q-btn
              v-if="$q.screen.gt.sm"
              rounded
              class="home-page__std-btn q-pl-sm"
              color="gray-dark-theme"
              text-color="text-white"
              :disable="connectionLost"
              padding="4px 17px"
              @click="() => (showControls = !showControls)"
            >
              {{ showControls ? 'HIDE' : 'SHOW' }} FILTERS
            </q-btn>
            <q-btn
              v-if="$q.screen.lt.md"
              rounded
              class="home-page__std-btn q-pl-sm"
              color="gray-dark-theme"
              text-color="text-white"
              :disable="connectionLost"
              padding="4px 17px"
              @click="() => (showControlsMob = !showControlsMob)"
            >
              {{ showControlsMob ? 'HIDE' : 'SHOW' }} <br v-if="$q.screen.lt.sm" />
              FILTERS
            </q-btn>
          </div>
        </div>

        <div
          v-show="($q.screen.gt.sm && showControls) || ($q.screen.lt.md && showControlsMob)"
          class="row q-mt-md"
          :class="{ 'justify-start': $q.screen.lt.md, 'justify-between': $q.screen.gt.sm }"
        >
          <div class="row validators-list__filters q-mb-md" :class="{ 'q-mr-md': $q.screen.gt.sm }">
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
              <div class="validators-list__dropdown-label q-mb-xs">Hide Anonymous</div>
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
          <div class="row validators-list__filters q-mb-md" :class="{ 'q-mr-md': $q.screen.gt.sm }">
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">JPool members</div>
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
              <div class="validators-list__dropdown-label q-mb-xs">SVT members</div>
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
            <div v-if="$q.screen.lt.md" class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Show my Stake</div>
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
          <div v-if="$q.screen.gt.sm" class="row validators-list__filters q-mb-md">
            <div class="column q-my-xs q-ml-md">
              <div class="validators-list__dropdown-label q-mb-xs">Show my Stake</div>
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
            v-show="$q.screen.gt.sm && showControls"
            class="col q-mt-xs q-mb-sm q-mr-lg main-section__block"
            :class="{ 'col-12': $q.screen.lt.sm }"
          >
            <price-stats />
          </div>

          <q-input
            v-show="($q.screen.gt.sm && showControls) || ($q.screen.lt.md && showControlsMob)"
            v-model="nameFilter"
            class="q-mb-xs q-mt-sm col-grow validators-list__search"
            :class="{ 'full-width': $q.screen.lt.sm }"
            label="Search"
            placeholder="enter a validator name, identity or vote key"
            stack-label
          />

          <div
            v-show="$q.screen.gt.sm && showControls"
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
            <sort-item
              title="Sort by Stake"
              param="totalStake"
              @sort="sort"
              :current-param="sortParam"
              :current-type="sortType"
              add-class="q-ml-lg"
            />
          </div>

          <!-- <div v-if="$q.screen.gt.sm" class="row justify-end q-ml-lg">
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
          </div> -->
        </div>

        <!-- <div v-if="$q.screen.gt.sm" class="q-pt-sm q-pb-lg flex flex-center">
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
        </div> -->
        <div> Shown validators: {{ loading ? 'loading...' : itemsSorted.length }} </div>
        <q-card class="q-mb-md q-mt-md validators-list__main">
          <q-card-section
            v-if="$q.screen.gt.sm"
            class="validators-list__list__head validators-list__list-desk__head validator-row row justify-between"
          >
            <div class="validator-row__index column q-mr-md items-center"> # </div>
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
              <span>APY HISTORY</span>
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
          <q-card-section
            v-else
            class="validators-list__list__head validators-list__list-mob__head validator-row-mob row justify-between"
          >
            <div class="validator-row-mob__index column q-mr-sm items-center"> # </div>
            <div class="validator-row-mob__name row q-pr-sm items-center justify-between">
              <span>NAME</span>
              <sort-item
                size="xs"
                margin-size="xs"
                param="name"
                @sort="sort"
                :current-param="sortParam"
                :current-type="sortType"
                :only-desc="$q.screen.lt.sm"
              />
            </div>
            <div class="validator-row-mob__apy row q-pl-sm q-pr-sm items-center justify-between">
              <span>APY</span>
              <sort-item
                size="xs"
                margin-size="xs"
                param="apyNum"
                @sort="sort"
                :current-param="sortParam"
                :current-type="sortType"
                :only-desc="$q.screen.lt.sm"
              />
            </div>
            <div class="validator-row-mob__stake row q-pl-sm items-center justify-between">
              <span>STAKE</span>
              <sort-item
                size="xs"
                margin-size="xs"
                param="totalStake"
                @sort="sort"
                :current-param="sortParam"
                :current-type="sortType"
                :only-desc="$q.screen.lt.sm"
              />
            </div>
          </q-card-section>

          <q-virtual-scroll
            v-if="!loading && itemsSorted.length > 0"
            scroll-target="#html"
            :class="{ 'v-scroll-desk': $q.screen.gt.sm }"
            :items="$q.screen.gt.sm ? itemsShowed : itemsSorted"
            virtual-scroll-item-size="123"
            virtual-scroll-slice-size="30"
            virtual-scroll-slice-ratio-after="0.7"
            virtual-scroll-slice-ratio-before="2"
          >
            <template #default="{ item, index }">
              <div
                :key="item.voter"
                class="stake-accounts-container col-12 q-px-none q-pt-md"
                :class="{ 'q-mx-md': $q.screen.gt.sm }"
              >
                <validator-row
                  v-if="$q.screen.gt.sm"
                  :item="item"
                  :index="(currentPage - 1) * perPageNum + index + 1"
                  :loading="loading"
                  :cluster="cluster"
                />
                <validator-row-mob
                  v-else
                  :item="item"
                  :index="(currentPage - 1) * perPageNum + index + 1"
                  :loading="loading"
                  :cluster="cluster"
                />
              </div>
            </template>
          </q-virtual-scroll>

          <div
            v-else
            class="validators-list__list"
            :class="{ 'validators-list__list-desk': $q.screen.gt.sm }"
          >
            <div class="relative-position">
              <div
                class="fit row wrap justify-start items-start content-start"
                style="min-height: 100px"
              >
                <template v-if="itemsSorted.length">
                  <div
                    v-for="(item, index) of itemsShowed"
                    :key="item.voter"
                    class="stake-accounts-container col-12 q-px-none q-pt-md"
                    :class="{ 'q-mx-md': $q.screen.gt.sm }"
                  >
                    <validator-row
                      v-if="$q.screen.gt.sm"
                      :item="item"
                      :index="index + (currentPage - 1) * perPageNum + 1"
                      :loading="loading"
                      :cluster="cluster"
                    />
                    <validator-row-mob
                      v-else
                      :item="item"
                      :index="(currentPage - 1) * perPageNum + index + 1"
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
        <!-- <div v-if="$q.screen.gt.sm" class="q-pt-sm q-pb-lg flex flex-center">
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
        </div> -->
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { computed, toRef } from 'vue';
  import { useConnectionStore, useStakePoolStore, useValidatorsAllStore } from '@/store';
  import { useWallet } from 'solana-wallets-vue';

  const connectionStore = useConnectionStore();
  const stakePoolStore = useStakePoolStore();
  const validatorsAllStore = useValidatorsAllStore();
  const { connected } = useWallet();

  const sortType = toRef(validatorsAllStore, 'sortType');
  const sortParam = toRef(validatorsAllStore, 'sortParam');
  const nameFilter = toRef(validatorsAllStore, 'nameFilter');
  const filterPrivate = toRef(validatorsAllStore, 'filterPrivate');
  const filterTop33 = toRef(validatorsAllStore, 'filterTop33');
  const filterFee = toRef(validatorsAllStore, 'filterFee');
  const filterNoname = toRef(validatorsAllStore, 'filterNoname');
  const filterDelinq = toRef(validatorsAllStore, 'filterDelinq');
  const filterNotSvm = toRef(validatorsAllStore, 'filterNotSvm');
  const filterNotJpool = toRef(validatorsAllStore, 'filterNotJpool');
  const filterHasStake = toRef(validatorsAllStore, 'filterHasStake');
  const showControls = toRef(validatorsAllStore, 'showControls');
  const showControlsMob = toRef(validatorsAllStore, 'showControlsMob');

  // const perPageOptions = computed(() => validatorsAllStore.perPageOptions);
  // const pages = computed(() => validatorsAllStore.pages);
  // const perPage = computed(() => validatorsAllStore.perPage);
  const currentPage = computed(() => validatorsAllStore.currentPage);
  const perPageNum = computed(() => validatorsAllStore.perPageNum);
  const itemsSorted = computed(() => validatorsAllStore.itemsSorted);
  const itemsShowed = computed(() => validatorsAllStore.itemsShowed);
  const loading = computed(() => validatorsAllStore.loading);

  function refresh() {
    validatorsAllStore.loadAllValidators();
    validatorsAllStore.loadAverageApy();
  }

  function sort(param, type) {
    sortParam.value = param;
    sortType.value = type;
  }

  const connectionLost = computed(() => stakePoolStore.connectionLost);
  const cluster = computed(() => connectionStore.cluster);
</script>
