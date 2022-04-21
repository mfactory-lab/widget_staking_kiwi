<template>
  <q-virtual-scroll
    scroll-target="#html"
    class="v-scroll-desk"
    :items="items"
    virtual-scroll-item-size="123"
    virtual-scroll-slice-size="20"
    virtual-scroll-slice-ratio-after="0.7"
    virtual-scroll-slice-ratio-before="2"
  >
    <template #default="{ item, index }">
      <lazy
        render-on-idle
        :min-height="123"
        :key="item.id"
        class="stake-accounts-container col-12 q-px-none q-pt-md q-mx-md"
      >
        <validator-row
          :item="item"
          :index="index + 1"
          :loading="loading"
          :wallet-connected="connected"
          :cluster="cluster"
        />
      </lazy>
    </template>
  </q-virtual-scroll>

  <div v-if="items.length === 0" class="validators-list__no-validators text-center text-grey-6">
    There are currently no validators in the {{ cluster }} cluster.
  </div>
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
