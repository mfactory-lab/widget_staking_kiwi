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
  <div class="total-stacked">
    <div class="total-stacked__label">Total Staked</div>
    <div class="total-stacked__value">
      <div class="total-stacked__sol">
        {{ formatPrice(solStaked) }} /
        <span v-if="maxSolToStake">
          {{ formatPrice(maxSolToStake) }}
        </span>
      </div>
      <div class="total-stacked__usd">≈&nbsp;${{ formatPrice(usdStacked) }}</div>
      <div class="total-stacked__progressbar">
        <div class="total-stacked__progressbar__value" :style="progressStyle"></div>
        <q-tooltip v-if="maxSolToStake">
          <b>STAKE LIMIT</b>
          <br />
          {{ formatPrice(solStaked) }} SOL / {{ formatPrice(maxSolToStake) }} SOL
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, toRef } from 'vue';
  import { useCoinRateStore, useConnectionStore, useStakePoolStore } from '@jpool/common/store';
  import { formatAmount, lamportsToSol } from '@jpool/common/utils';

  export default defineComponent({
    setup() {
      const coinRateStore = useCoinRateStore();
      const connectionStore = useConnectionStore();
      const stakePoolStore = useStakePoolStore();

      const stakePool = toRef(stakePoolStore, 'stakePool');

      const solStaked = computed(() =>
        lamportsToSol(stakePool.value?.totalLamports.toNumber() ?? 0),
      );

      const tokenSupply = computed(() =>
        lamportsToSol(stakePool.value?.poolTokenSupply.toNumber() ?? 0),
      );

      const usdStacked = computed(() => solStaked.value * coinRateStore.solPrice);

      const rate = computed(() =>
        tokenSupply.value > 0 ? solStaked.value / tokenSupply.value : 0,
      );

      // reverse limit progress for rounded right part of progress bar
      const progressStyle = computed(() => {
        return {
          width: `calc(100% * ${
            connectionStore.stakeLimit ? 1 - solStaked.value / connectionStore.stakeLimit : 0
          })`,
        };
      });

      const maxSolToStake = computed(() => connectionStore.stakeLimit ?? 0);

      return {
        solStaked,
        tokenSupply,
        usdStacked,
        rate,
        progressStyle,
        maxSolToStake,
        formatPrice: (v: number) => formatAmount(v, 1),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .total-stacked {
    position: relative;
    padding-left: 1rem;
    z-index: 2;

    &__label {
      text-transform: uppercase;
      font-size: 14px;
      color: #5c5c5c;
      margin-bottom: 4px;
    }

    &__value {
      height: 48px;
      padding-right: 15px;
      padding-left: 72px;
      font-weight: 700;
      min-width: 150px;
      position: relative;
      width: 220px;

      &::before {
        content: '';
        //noinspection CssUnknownTarget
        background: url(@/assets/img/sol-logo.svg) no-repeat center center;
        background-size: contain;
        width: 62px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 2px;
      }
    }

    &__sol {
      white-space: nowrap;
      font-size: 19px;
      line-height: 1;
    }

    &__usd {
      color: #5c5c5c;
      font-size: 14px;
      line-height: 1;
      margin-top: 3px;
      margin-bottom: 5px;
    }

    &__progressbar {
      height: 9px;
      display: flex;
      border-radius: 12px;
      background: $secondary;

      &__value {
        border-radius: 12px;
        margin-left: auto;
        background: $blue-grey-8;
      }
    }
  }

  .total-stacked-alter {
    .total-stacked {
      &__label {
        color: #fff;
      }
      &__usd {
        color: #fff;
      }
      &__sol {
        color: #fff;
      }

      &__progressbar {
        background: $secondary;

        &__value {
          background: #fff;
        }
      }
    }
  }
</style>
