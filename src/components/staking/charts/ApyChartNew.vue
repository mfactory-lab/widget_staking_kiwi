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
  <div v-if="showTitle" class="apy-chart__title">HISTORIC APY</div>
  <line-chart v-bind="lineChartProps" />
</template>

<script lang="ts">
  import { PropType, defineComponent } from 'vue';
  import { LineChart, useLineChart } from 'vue-chart-3';
  // @ts-ignore
  import { ChartData } from 'chart.js';

  export default defineComponent({
    components: {
      LineChart,
    },
    props: {
      chartData: {
        type: Object as PropType<ChartData<'line'>>,
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
      const { lineChartProps, lineChartRef } = useLineChart({
        chartData: props.chartData,
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
      };
    },
  });
</script>
