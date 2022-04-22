<template>
  <q-virtual-scroll
    scroll-target="#html"
    :items="items"
    virtual-scroll-item-size="79"
    virtual-scroll-slice-size="20"
    virtual-scroll-slice-ratio-after="0.7"
    virtual-scroll-slice-ratio-before="2"
  >
    <template #default="{ item, index }">
      <lazy
        render-on-idle
        :min-height="79"
        :key="item.voter"
        class="stake-accounts-container col-12 q-px-none q-pt-md"
      >
        <validator-row-mob :item="item" :index="index + 1" :loading="loading" :cluster="cluster" />
      </lazy>
    </template>
  </q-virtual-scroll>

  <div v-if="items.length === 0" class="validators-list__no-validators text-center text-grey-6">
    There are currently no validators in the {{ cluster }} cluster.
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';
  import Lazy from '@/components/Lazy.vue';

  const connectionStore = useConnectionStore();
  const validatorsAllStore = useValidatorsAllStore();

  const loading = computed(() => validatorsAllStore.loading);
  const items = computed(() => validatorsAllStore.items);
  const cluster = computed(() => connectionStore.cluster);
</script>
