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
  <div class="launch-validator">
    <img :src="icon" alt="" class="launch-validator__icon" />
    <div class="column justify-between full-height q-py-sm">
      <div class="launch-validator__title">{{ title }}</div>
      <div class="launch-validator__apy">APY: {{ apyFormatted }}</div>
      <div class="launch-validator__cap">Market cap: ${{ capFormatted }}</div>
      <div class="launch-validator__soon">coming soon</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { formatAmount, formatPct } from '@jpool/common/utils';

  export default defineComponent({
    props: {
      icon: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      apy: {
        type: Number,
        required: true,
      },
      cap: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      return {
        apyFormatted: computed(() => formatPct.format(props.apy)),
        capFormatted: computed(() => formatAmount(props.cap, 2).replace('G', 'B')),
      };
    },
  });
</script>

<style lang="scss" scoped>
  $textColor: #647e82;
  .launch-validator {
    display: flex;
    align-items: center;
    @media (max-width: $breakpoint-sm) {
      margin: 0 auto;
    }
    &__icon {
      width: 160px;
      margin-right: 30px;
    }
    &__title {
      font-family: $fontSecondary;
      font-size: 34px;
      line-height: 41px;
      color: $textColor;
      font-weight: 700;
      margin-bottom: auto;
    }
    &__apy {
      font-size: 23px;
      line-height: 27px;
      color: $textColor;
      font-weight: 700;
    }
    &__cap {
      font-size: 23px;
      line-height: 27px;
      color: $textColor;
    }
    &__soon {
      font-family: $fontSecondary;
      font-size: 23px;
      line-height: 28px;
      color: #000000;
      text-transform: uppercase;
      margin-top: auto;
    }
  }
</style>
