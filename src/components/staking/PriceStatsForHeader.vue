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
  <div class="row">
    <div class="column">
      <div class="price-stats-header__title">SOL PRICE</div>
      <div class="price-stats-header__price">${{ price }}</div>
    </div>
    <div class="column">
      <div
        class="price-stats-header__grow"
        :class="{ 'price-stats-header__main__grow--negative': growIsNegative }"
      >
        <img src="@/assets/img/arrow-grow.svg" class="price-stats-header-arrow" alt="" />
        {{ grow }}
      </div>
      <div class="row price-stats-header__additional">
        <div class="price-stats-header__additional__price">
          Last 24h {{ growIsNegative ? '-' : '+' }}${{ last24 }}
        </div>
        <div class="price-stats-header__additional__value">${{ value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useCoinRateStore } from '@/store';
  import { formatMoney } from '@jpool/common/utils/check-number';
  import { formatAmount, formatAndTrimAmount, formatPct } from '@jpool/common/utils';

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
    padding: 8px 16px;
    width: 100%;
    font-weight: 500;
    margin-left: auto;
    margin-right: auto;
    &-arrow {
      height: 12px;
      margin-right: 5px;
    }
    &__title {
      font-size: 12px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__price {
      line-height: 22px;
    }
    &__grow {
      font-size: 12px;
      color: $text-white;
      background: $secondary;
      padding: 3px 6px;
      border-radius: 6px;
      height: 22px;
      display: flex;
      align-items: center;

      &--negative {
        background: $negative;

        .price-stats-header-arrow {
          transform: rotate(180deg);
        }
      }
    }
    &__main {
      font-size: 22px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    &__additional {
      display: flex;
      justify-content: space-between;
      padding-left: 5px;
      font-size: 11px;
    }
  }
</style>
