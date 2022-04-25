<template>
  <section class="validators-list q-pb-lg">
    <div class="container">
      <validators-list-title />
      <validators-list-filters />

      <q-card class="q-mb-md q-mt-md validators-list__main">
        <validators-list-table-head />
        <validators-list-desk v-if="$q.screen.gt.sm" />
        <validators-list-mob v-else />
      </q-card>
    </div>
  </section>
</template>

<script lang="ts" setup></script>
