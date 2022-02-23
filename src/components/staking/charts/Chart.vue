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
  <div class="charts__item">
    <div v-if="title" class="charts__title">{{ title }}</div>
    <div>
      <apexchart width="100%" height="100px" type="area" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useQuasar } from 'quasar';

  export default defineComponent({
    props: {
      title: {
        type: String,
        required: false,
      },
      series: {
        type: Array,
        required: true,
      },
      categories: {
        type: Array,
        required: true,
      },
      colors: {
        type: Array,
        default: () => ['#1DE3B0', '#455A64'],
      },
    },
    setup(props) {
      const { dark } = useQuasar();

      return {
        chartOptions: computed(() => ({
          colors: props.colors,
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
                colors: [dark.isActive ? '#fff' : '#707585'],
                fontSize: '10px',
              },
              formatter: (value) => {
                return `$${value}`;
              },
            },
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
            categories: props.categories,
            tooltip: {
              enabled: false,
            },
          },
          tooltip: {
            // enabled: false,
          },
        })),
      };
    },
  });
</script>
