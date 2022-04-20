<template>
  <section class="validators-list q-pb-lg">
    <div class="container">
      <validators-list-title />
      <validators-list-filters />

      <q-card class="q-mb-md q-mt-md validators-list__main">
        <validators-list-table-head />

        <!--        <div-->
        <!--          v-for="(item, index) in items"-->
        <!--          :key="item.id"-->
        <!--          :data-id="index - 1"-->
        <!--          class="stake-accounts-container col-12 q-px-none q-pt-md"-->
        <!--          :class="{ 'q-mx-md': $q.screen.gt.sm }"-->
        <!--          v-intersection="onIntersection"-->
        <!--        >-->
        <!--          <transition name="q-transition&#45;&#45;scale">-->
        <!--            <validator-row-->
        <!--              v-if="inView[index - 1]"-->
        <!--              :item="item"-->
        <!--              :chart-data="validatorsAllStore.getChartData(item.voter)"-->
        <!--              :index="index + 1"-->
        <!--              :loading="loading"-->
        <!--              :wallet-connected="connected"-->
        <!--              :cluster="cluster"-->
        <!--            />-->
        <!--          </transition>-->
        <!--        </div>-->

        <q-virtual-scroll
          scroll-target="#html"
          :class="{ 'v-scroll-desk': $q.screen.gt.sm }"
          :items="items"
          virtual-scroll-item-size="50"
          virtual-scroll-slice-size="20"
          virtual-scroll-slice-ratio-after="0.7"
          virtual-scroll-slice-ratio-before="2"
        >
          <template #default="{ item, index }">
            <lazy
              render-on-idle
              :min-height="82"
              :key="item.id"
              class="stake-accounts-container col-12 q-px-none q-pt-md"
              :class="{ 'q-mx-md': $q.screen.gt.sm }"
            >
              <validator-row
                :item="item"
                :index="index + 1"
                :loading="loading"
                :wallet-connected="connected"
                :cluster="cluster"
              />
              <!--                <validator-row-mob-->
              <!--                  v-else-->
              <!--                  :item="item"-->
              <!--                  :index="(currentPage - 1) * perPageNum + index + 1"-->
              <!--                  :loading="loading"-->
              <!--                  :cluster="cluster"-->
              <!--                />-->
            </lazy>
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
  import { useWallet } from 'solana-wallets-vue';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';
  import Lazy from '@/components/Lazy.vue';

  const { connected } = useWallet();
  const connectionStore = useConnectionStore();
  const validatorsAllStore = useValidatorsAllStore();

  const loading = computed(() => validatorsAllStore.loading);
  const items = computed(() => validatorsAllStore.items);
  const cluster = computed(() => connectionStore.cluster);

  // const inView = ref(Array.apply(null, items.value).map(() => false));
  //
  // function onIntersection(entry) {
  //   const index = parseInt(entry.target.dataset.id, 10);
  //   setTimeout(() => {
  //     inView.value.splice(index, 1, entry.isIntersecting);
  //   }, 50);
  // }
</script>
