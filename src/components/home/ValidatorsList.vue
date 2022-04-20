<template>
  <section class="validators-list q-pb-lg">
    <div class="container">
      <validators-list-title />
      <validators-list-filters />

      <q-card class="q-mb-md q-mt-md validators-list__main">
        <validators-list-table-head />

        <q-virtual-scroll
          scroll-target="#html"
          :class="{ 'v-scroll-desk': $q.screen.gt.sm }"
          :items="items"
          virtual-scroll-item-size="123"
          virtual-scroll-slice-size="10"
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

        <div
          v-if="items.length === 0"
          class="validators-list__no-validators text-center text-grey-6"
        >
          There are currently no validators in the {{ cluster }} cluster.
        </div>

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
