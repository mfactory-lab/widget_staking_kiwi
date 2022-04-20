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
    <div class="container">
      <validators-list-title />
      <validators-list-filters />

      <div> Shown validators: {{ loading ? 'loading...' : items.length }} </div>

      <q-card class="q-mb-md q-mt-md validators-list__main">
        <validators-list-table-head />

        <q-virtual-scroll
          scroll-target="#html"
          :class="{ 'v-scroll-desk': $q.screen.gt.sm }"
          :items="items"
          virtual-scroll-item-size="123"
          virtual-scroll-slice-size="20"
          virtual-scroll-slice-ratio-after="0.7"
          virtual-scroll-slice-ratio-before="2"
        >
          <template #default="{ item, index }">
            <div
              :key="index"
              class="stake-accounts-container col-12 q-px-none q-pt-md"
              :class="{ 'q-mx-md': $q.screen.gt.sm }"
            >
              <validator-row
                :item="item"
                :index="index + 1"
                :loading="loading"
                :cluster="cluster"
              />
              <!--                <validator-row-mob-->
              <!--                  v-else-->
              <!--                  :item="item"-->
              <!--                  :index="(currentPage - 1) * perPageNum + index + 1"-->
              <!--                  :loading="loading"-->
              <!--                  :cluster="cluster"-->
              <!--                />-->
            </div>
          </template>
        </q-virtual-scroll>

        <!--          <div-->
        <!--            v-else-->
        <!--            class="validators-list__list"-->
        <!--            :class="{ 'validators-list__list-desk': $q.screen.gt.sm }"-->
        <!--          >-->
        <!--            <div class="relative-position">-->
        <!--              <div-->
        <!--                class="fit row wrap justify-start items-start content-start"-->
        <!--                style="min-height: 100px"-->
        <!--              >-->
        <!--                <template v-if="items.length">-->
        <!--                  <div-->
        <!--                    v-for="(item, index) of itemsShowed"-->
        <!--                    :key="item.voter"-->
        <!--                    class="stake-accounts-container col-12 q-px-none q-pt-md"-->
        <!--                    :class="{ 'q-mx-md': $q.screen.gt.sm }"-->
        <!--                  >-->
        <!--                    <validator-row-->
        <!--                      v-if="$q.screen.gt.sm"-->
        <!--                      :item="item"-->
        <!--                      :index="index + (currentPage - 1) * perPageNum + 1"-->
        <!--                      :loading="loading"-->
        <!--                      :cluster="cluster"-->
        <!--                    />-->
        <!--                    <validator-row-mob-->
        <!--                      v-else-->
        <!--                      :item="item"-->
        <!--                      :index="(currentPage - 1) * perPageNum + index + 1"-->
        <!--                      :loading="loading"-->
        <!--                      :cluster="cluster"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                </template>-->
        <!--                <template v-else>-->
        <!--                  <div class="validators-list__no-validators text-center text-grey-6">-->
        <!--                    There are currently no validators in the {{ cluster }} cluster.-->
        <!--                  </div>-->
        <!--                </template>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          -->
      </q-card>
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';

  const connectionStore = useConnectionStore();
  const validatorsAllStore = useValidatorsAllStore();

  const loading = computed(() => validatorsAllStore.loading);
  const items = computed(() => validatorsAllStore.itemsComputed);
  const cluster = computed(() => connectionStore.cluster);
</script>
