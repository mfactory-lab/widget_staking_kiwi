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
        <validators-list-title />

        <validators-list-filters />

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

        <q-card class="q-mb-md q-mt-md validators-list__main">
          <validators-list-table-head />

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

<script lang="ts">
  import { computed, defineComponent, toRef } from 'vue';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';
  import ValidatorRow from '@/components/home/ValidatorRow.vue';
  import ValidatorRowMob from '@/components/home/ValidatorRowMob.vue';
  import ValidatorsListFilters from '@/components/home/ValidatorsListFilters.vue';
  import ValidatorsListTableHead from '@/components/home/ValidatorsListTableHead.vue';
  import ValidatorsListTitle from '@/components/home/ValidatorsListTitle.vue';

  export default defineComponent({
    components: {
      ValidatorsListFilters,
      ValidatorsListTableHead,
      ValidatorsListTitle,
      ValidatorRow,
      ValidatorRowMob,
    },
    setup() {
      const connectionStore = useConnectionStore();

      const validatorsAllStore = useValidatorsAllStore();
      const currentPage = toRef(validatorsAllStore, 'currentPage');
      const perPageNum = toRef(validatorsAllStore, 'perPageNum');
      const pages = toRef(validatorsAllStore, 'pages');
      const itemsSorted = toRef(validatorsAllStore, 'itemsSorted');
      const itemsShowed = toRef(validatorsAllStore, 'itemsShowed');
      const loading = toRef(validatorsAllStore, 'loading');

      const cluster = computed(() => connectionStore.cluster);

      return {
        currentPage,
        perPageNum,
        pages,
        cluster,
        loading,
        itemsSorted,
        itemsShowed,
      };
    },
  });
</script>
