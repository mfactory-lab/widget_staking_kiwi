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
  <div class="apy-chart" v-if="data.data.length > 0 && cluster === 'mainnet-beta'">
    <div v-if="showTitle" class="apy-chart__title">HISTORIC APY</div>
    <div>
      <apexchart
        width="100%"
        :height="height"
        :options="chartOptions"
        :series="[data, averageData]"
      />
    </div>
  </div>
  <div class="apy-chart" v-else>
    <sol-svg class="q-icon" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import SolSvg from '@/components/icons/SolSvg.vue';
  import { useQuasar } from 'quasar';
  import { getApyHistory } from '@/utils';

  interface ChartData {
    data: number[];
    type: String;
    name: String;
  }

  export default defineComponent({
    components: {
      SolSvg,
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
        type: String,
        default: '84px',
      },
    },
    setup(props) {
      const data = ref<ChartData>({
        name: 'APY',
        type: 'area',
        data: [0, 0],
      });
      // const categories = ref<Array<number | string>>([0, 1]);
      const connectionStore = useConnectionStore();
      const cluster = computed(() => connectionStore.cluster);
      const { averageApy } = storeToRefs(useValidatorsAllStore());
      const { dark } = useQuasar();

      const averageData = computed(() => {
        return {
          name: 'APY',
          type: 'line',
          data: averageApy.value.map((item) => item.apy * 100),
          // data: categories.value.map((item) => {
          //   const average = averageApy.value.find((aa) => aa.epoch == item);
          //   return average ? average.apy * 100 : 0;
          // }),
        };
      });

      const categories = computed(() => averageApy.value.map((item) => item.epoch));

      watch(
        [categories],
        async () => {
          if (cluster.value === 'mainnet-beta') {
            const apyData = await getApyHistory(props.voterKey);

            const arrayLength = averageApy.value.length - apyData.length;
            const array: number[] = [];
            for (let i = 0; i < arrayLength; i++) {
              array.push(0);
            }

            data.value = {
              name: 'APY',
              type: 'area',
              data: [...array, ...apyData.map((item) => item.apy * 100)],
            };
            console.log('data == ', data.value);
          }
        },
        { immediate: true },
      );

      return {
        categories,
        data,
        cluster,
        averageData,
        chartOptions: computed(() => ({
          colors: ['#1DE3B0', '#5A7683'],
          legend: {
            showForSingleSeries: false,
            show: false,
          },
          fill: {
            opacity: 1,
            gradient: {
              shade: 'light',
              type: 'vertical',
              shadeIntensity: 0.1,
              opacityFrom: 1,
              opacityTo: 1,
            },
            pattern: {
              style: 'verticalLines',
              strokeWidth: 30,
            },
          },
          chart: {
            type: 'area',
            // offsetX: -7,
            offsetY: 0,
            parentHeightOffset: 0,
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 1,
            dashArray: [0, 2],
          },
          grid: {
            show: true,
            borderColor: '#cccccc70',
            strokeDashArray: 2,
            position: 'back',
            xaxis: {
              lines: {
                show: false,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
            row: {
              colors: undefined,
              opacity: 0.5,
            },
            column: {
              colors: undefined,
              opacity: 0.5,
            },
            padding: {
              top: -12,
              right: 10,
              bottom: -5,
              left: 0,
            },
          },
          yaxis: {
            axisBorder: {
              show: false,
            },
            labels: {
              show: props.showYAxis,
              offsetX: -8,
              style: {
                colors: [dark.isActive ? '#ffffff90' : '#707585'],
                fontSize: '10px',
              },
              formatter: (value) => {
                return `${value.toFixed(2)}%`;
              },
            },
            min: (_value) => {
              return 0;
            },
            max: (value) => {
              return value + 0.5;
            },
            tickAmount: 5,
          },
          xaxis: {
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            type: 'datetime',
            labels: {
              show: false,
            },
            categories: categories.value,
            tooltip: {
              enabled: false,
            },
          },
          tooltip: {
            x: {
              show: true,
              formatter: (value) => {
                return `Epoch ${value}`;
              },
            },
          },
        })),
      };
    },
  });
</script>
