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
  <!--  <div class="apy-chart" v-if="data.data.length > 0 && cluster === 'mainnet-beta'">-->
  <div v-if="true">
    <div v-if="showTitle" class="apy-chart__title">HISTORIC APY</div>

    <!--    <apexchart-->
    <!--      width="100%"-->
    <!--      :height="height"-->
    <!--      :options="chartOptions"-->
    <!--      :series="[data, averageData]"-->
    <!--    />-->

    <div :style="{ height: height + 'px' }" class="relative-position">
      <line-chart v-if="!loading" v-bind="lineChartProps" />
      <!--      <q-inner-loading :showing="loading" />-->
    </div>
  </div>
  <div class="apy-chart" v-else>
    <sol-svg class="q-icon" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { LineChart, useLineChart } from 'vue-chart-3';
  import { useQuasar } from 'quasar';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';
  import { getApyHistory } from '@/utils';

  export default defineComponent({
    components: {
      LineChart,
    },
    props: {
      voterKey: {
        type: String,
        required: true,
      },
      showYAxis: {
        type: Boolean,
        default: true,
      },
      showTitle: {
        type: Boolean,
        default: true,
      },
      height: {
        type: Number,
        default: 84,
      },
    },
    setup(props) {
      const { dark } = useQuasar();
      const connectionStore = useConnectionStore();
      const validatorsAllStore = useValidatorsAllStore();

      const cluster = computed(() => connectionStore.cluster);
      const averageApy = computed(() => validatorsAllStore.averageApy);
      const categories = computed(() => averageApy.value.map((item) => item.epoch));

      const loading = ref(true);

      const lineOpts = {
        backgroundColor: '#30e5b6',
        borderWidth: 1,
      };

      const chartData = ref({
        labels: categories.value.map((c) => `Epoch ${c}`),
        datasets: [
          {
            ...lineOpts,
            data: categories.value.map(() => 0),
          },
        ],
      });

      watch(
        categories,
        () => {
          if (categories.value.length === 0) {
            return;
          }
          if (cluster.value === 'mainnet-beta') {
            loading.value = true;
            console.log('loading');
            getApyHistory(props.voterKey).then((apyData) => {
              chartData.value = {
                labels: apyData.map((d) => `Epoch ${d.epoch}`),
                datasets: [
                  {
                    ...lineOpts,
                    data: apyData.map((d) => d.apy * 100),
                  },
                ],
              };
              loading.value = false;
            });
          }
        },
        { immediate: true },
      );

      const { lineChartProps, lineChartRef } = useLineChart({
        chartData,
        height: Number(props.height),
        options: {
          interaction: {
            intersect: false,
            mode: 'index',
          },
          responsive: true,
          plugins: {
            legend: false,
            // tooltip: {
            //   usePointStyle: true,
            // },
          },
          elements: {
            line: {
              fill: true,
            },
            point: {
              radius: 0,
            },
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
          },
        },
      });

      return {
        lineChartProps,
        lineChartRef,
        loading,
        dark,
      };
    },
  });
</script>
