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
  <div class="price-stats">
    <div class="price-stats__title">
      <div>Price (Solana) (SOL)</div>
      <q-btn
        href="https://www.coingecko.com/en/coins/solana"
        class="price-stats__link"
        color="white"
        round
        target="_blank"
        type="a"
        unelevated
      >
        <img src="@/assets/img/CoinGecko-Logo.svg" class="q-icon" alt="" />
      </q-btn>
    </div>
    <div class="price-stats__main">
      <div class="price-stats__main__price">${{ price }}</div>
      <div
        class="price-stats__main__grow"
        :class="{ 'price-stats__main__grow--negative': growIsNegative }"
      >
        <img src="@/assets/img/arrow-grow.svg" class="price-stats-arrow" alt="" />
        {{ grow }}
      </div>
    </div>
    <div class="price-stats__additional">
      <div class="price-stats__additional__price">
        Last 24h {{ growIsNegative ? '-' : '+' }}${{ last24 }}
      </div>
      <div class="price-stats__additional__value">${{ value }}</div>
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
  .price-stats {
    padding: 8px 16px;
    width: 100%;
    color: #5b5b5b;
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
    &__link {
      width: 24px;
      height: 24px;
      min-width: auto;
      min-height: auto;
    }
    &__main {
      font-size: 22px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      &__price {
        color: #000000;
        line-height: 22px;
      }
      &__grow {
        font-size: 12px;
        color: #ffffff;
        background: $secondary;
        padding: 3px 6px;
        border-radius: 6px;
        height: 22px;
        display: flex;
        align-items: center;

        &--negative {
          background: $negative;

          .price-stats-arrow {
            transform: rotate(180deg);
          }
        }
      }
    }
    &__additional {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      border-top: 1px solid #9a9090;
      padding-top: 5px;
      font-size: 11px;
    }
  }
</style>
