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
  <div class="price-stats-header row">
    <div class="column q-mr-dm">
      <div class="price-stats-header__title">SOL PRICE</div>
      <div class="price-stats-header__price">${{ price }}</div>
    </div>
    <div class="column q-ml-md">
      <div
        class="price-stats-header__grow"
        :class="{ 'price-stats-header__grow--negative': growIsNegative }"
      >
        <img src="@/assets/img/arrow-grow.svg" class="price-stats-header-arrow" alt="" />
        {{ grow }}
      </div>
      <div class="row price-stats-header__additional">
        <div> LAST 24H: {{ growIsNegative ? '-' : '+' }}${{ last24 }} </div>
        <div class="q-pl-sm">${{ value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useCoinRateStore } from '@/store';
  import { formatAmount, formatAndTrimAmount, formatMoney, formatPct } from '@/utils';

  export default defineComponent({
    setup() {
      const coinRateStore = useCoinRateStore();
      return {
        growIsNegative: computed(() => coinRateStore.solChangePercentage24 < 0),
        price: computed(() => formatMoney(coinRateStore.solPrice)),
        grow: computed(() => formatPct.format(coinRateStore.solChangePercentage24 / 100)),
        last24: computed(() => formatAndTrimAmount(Math.abs(coinRateStore.solChange24), 2)),
        value: computed(() => formatAmount(coinRateStore.solVol24, 2).replace('G', 'B')),
      };
    },
  });
</script>

<style scoped lang="scss">
  .price-stats-header {
    margin-bottom: -25px;
    padding-right: 70px;
    font-weight: 500;
    &-arrow {
      height: 12px;
      margin-right: 5px;
    }
    &__title {
      font-size: 12px;
      line-height: 13px;
      text-transform: uppercase;
      display: flex;
    }
    &__price {
      font-size: 24px;
      line-height: 26px;
    }
    &__grow {
      font-size: 12px;
      color: $text-white;
      background: $secondary;
      margin-bottom: 4px;
      margin-top: -4px;
      padding: 3px 6px;
      border-radius: 6px;
      height: 22px;
      display: flex;
      align-items: center;
      margin-right: auto;

      &--negative {
        background: $negative;

        .price-stats-header-arrow {
          transform: rotate(180deg);
        }
      }
    }
    &__additional {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      line-height: 17px;
    }
  }
</style>
