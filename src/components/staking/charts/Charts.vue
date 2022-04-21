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
  <div class="charts" v-if="!loading">
    <chart
      v-for="(series, index) in pairsData"
      :key="index"
      :series="series.series"
      :categories="categories"
      :min="min"
      :max="max"
    />
  </div>
  <div class="charts" v-if="loading">
    <q-inner-loading :showing="loading" />
  </div>
</template>

<script lang="ts">
  import Chart from './Chart.vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { CHARTS_PAIRS } from '@/config';
  import { priceFormatter } from '@/utils';
  import { getPairIntervalPrice } from '@/utils/coinmarket';

  export default defineComponent({
    components: {
      Chart,
    },
    setup() {
      const pairsData = ref<Object[]>([]);
      const categories = ref<Array<number | string>>([]);
      const min = ref(0);
      const max = ref(10);
      const loading = ref(false);

      onMounted(async () => {
        let firstVal = true;
        loading.value = true;
        pairsData.value = await Promise.all(
          CHARTS_PAIRS.map(async (item) => {
            return {
              title: item.title,
              series: await Promise.all(
                item.pairs.map(async (pair) => {
                  const pairData = await getPairIntervalPrice(pair.id, pair.convertTo);
                  if (categories.value.length < 1) {
                    categories.value = pairData.map((pairValues) => pairValues.timeClose);
                  }
                  const data = pairData.map((pairValues) => {
                    const price = pairValues.quote.close;
                    if (price < min.value || firstVal) {
                      min.value = price;
                    }
                    if (price > max.value || firstVal) {
                      max.value = price;
                    }
                    if (firstVal) {
                      firstVal = false;
                    }
                    return priceFormatter.format(price);
                  });
                  return {
                    name: pair.chartName,
                    data,
                  };
                }),
              ),
            };
          }),
        );
        loading.value = false;
      });

      return {
        categories,
        pairsData,
        loading,
        min,
        max,
      };
    },
  });
</script>

<style lang="scss">
  .charts {
    width: 100%;
    padding: 0 8px;
    position: relative;
    height: 100%;
    overflow: hidden;
    border-radius: 12px;
  }
</style>
