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
  <div class="total-staked">
    <div class="total-staked__logo">
      <sol-svg class="q-icon" fill="#fff" />
    </div>
    <div class="total-staked__value">
      <div class="total-staked__label">Total Staked</div>
      <div class="row justify-between">
        <div class="total-staked__sol">≈ {{ solStaked }}</div>
        <div class="total-staked__usd">$ {{ usdStaked }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, toRef } from 'vue';
  import { useCoinRateStore, useStakePoolStore } from '@jpool/common/store';
  import { formatAmount, lamportsToSol } from '@jpool/common/utils';
  import SolSvg from '@/components/icons/TelegramSvg.vue';

  export default defineComponent({
    components: {
      SolSvg,
    },
    setup() {
      const coinRateStore = useCoinRateStore();
      const stakePoolStore = useStakePoolStore();

      const stakePool = toRef(stakePoolStore, 'stakePool');

      const solStaked = computed(() =>
        lamportsToSol(stakePool.value?.totalLamports.toNumber() ?? 0),
      );

      return {
        solStaked: computed(() => formatAmount(solStaked.value, 3)),
        usdStaked: computed(() => formatAmount(solStaked.value * coinRateStore.solPrice, 1)),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .total-staked {
    position: relative;
    display: flex;

    &__logo {
      border-radius: 28px 0 0 28px;
      display: flex;
      background: $accent;
      align-items: center;
      padding: 0 12px 0 16px;

      .q-icon {
        width: 18px;
      }
    }
    &__value {
      border-radius: 0 28px 28px 0;
      background: $textWhite;
      font-weight: 500;
      height: 42px;
      font-size: 13px;
      padding: 6px 24px 6px 12px;
      min-width: 150px;
      position: relative;
    }
    &__label {
      text-transform: uppercase;
      color: $primary;
      font-size: 10px;
    }
    &__sol {
      font-weight: 900;
      color: $accent;
    }
    &__usd {
      color: #647e82;
    }
  }
</style>
