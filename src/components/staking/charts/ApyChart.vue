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
    <div class="apy-chart__title">HISTORIC APY</div>
    <div>
      <apexchart width="100%" height="84px" type="area" :options="chartOptions" :series="[data]" />
    </div>
  </div>
  <div class="apy-chart" v-else>
    <sol-svg class="q-icon" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { useConnectionStore, useEpochStore, useValidatorJstakingStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import { API_URL } from '@/config';
  import SolSvg from '@/components/icons/SolSvg.vue';

  interface ApyStats {
    apy: number;
    epoch: number;
  }

  interface ChartData {
    data: number[];
    name: String;
  }

  export default defineComponent({
    components: {
      SolSvg,
    },
    setup() {
      const data = ref<ChartData>({
        name: '',
        data: [],
      });
      const categories = ref<Array<number | string>>([]);
      const { voterKey } = storeToRefs(useValidatorJstakingStore());
      const connectionStore = useConnectionStore();
      const cluster = computed(() => connectionStore.cluster);
      const { epochNumber } = storeToRefs(useEpochStore());

      async function getApyHistory() {
        return new Promise<Array<ApyStats>>((resolve, _reject) => {
          fetch(`${API_URL}/history?voter_id=${voterKey.value}`)
            .then((res) => res.json())
            .then(
              (res) => {
                if (res.data?.length > 0) {
                  resolve(res.data);
                } else {
                  resolve([]);
                  // reject(Error('Promise rejected'));
                }
              },
              (error) => {
                console.error(error);
              },
            );
        });
      }

      watch(
        [voterKey, epochNumber],
        async () => {
          if (cluster.value === 'mainnet-beta') {
            const apyData = await getApyHistory();

            data.value = {
              name: 'APY',
              data: apyData.map((item) => item.apy * 100),
            };
            categories.value = apyData.map((item) => item.epoch);
          }
        },
        { immediate: true },
      );

      return {
        voterKey,
        categories,
        data,
        cluster,
        chartOptions: computed(() => ({
          colors: ['#455A64'],
          legend: {
            showForSingleSeries: false,
          },
          fill: {
            opacity: 0.9,
            gradient: {
              shade: 'light',
              type: 'vertical',
              shadeIntensity: 0.1,
              opacityFrom: 1,
              opacityTo: 0.9,
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
            dashArray: 0,
          },
          grid: {
            show: true,
            borderColor: '#ccc',
            strokeDashArray: 2,
            position: 'back',
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
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
              show: true,
              offsetX: -8,
              style: {
                colors: ['#707585'],
                fontSize: '10px',
              },
              formatter: (value) => {
                return `${value.toFixed(2)}%`;
              },
            },
            min: (value) => {
              return value - 0.5;
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

<style lang="scss" scoped>
  .apy-chart {
    width: 100%;
    padding: 8px 0 0;
    &__title {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      text-transform: uppercase;
      color: $primary;
    }
    .q-icon {
      height: 82px;
      width: 100%;
      padding: 8px 0;
    }
  }
</style>
