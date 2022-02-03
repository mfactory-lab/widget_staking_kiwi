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
  <div class="stake-stats column q-pl-md q-ml-md">
    <div class="stake-stats__title text-right" :style="{ color: titleColor }">{{ title }}</div>
    <div class="stake-stats__values row justify-end">
      <div class="stake-stats__values__usd">
        {{ solShow ? `$ ${moneyShow}` : '' }}
      </div>
      <div class="stake-stats__values__sol q-ml-md">
        {{ solShow }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useCoinRateStore } from '@/store';
  import { formatAmount } from '@jpool/common/utils';
  import { formatMoney } from '@jpool/common/utils/check-number';

  export default defineComponent({
    props: {
      title: {
        type: String,
      },
      sol: {
        type: [String, Number],
        default: () => -1,
      },
      titleColor: {
        type: String,
      },
    },
    setup(props) {
      console.log('stats props ==== ', props);
      const coinRateStore = useCoinRateStore();
      return {
        solShow: computed(() => (props.sol >= 0 ? formatAmount(Number(props.sol), 6) : '')),
        moneyShow: computed(() =>
          props.sol >= 0 ? formatMoney(Number(props.sol) * coinRateStore.solPrice) : '',
        ),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .stake-stats {
    &:not(:first-child) {
      @media (min-width: $breakpoint-sm) {
        border-left: 1px solid $primary;
      }
    }
    &:not(:last-child) {
      @media (max-width: $breakpoint-sm) {
        margin-bottom: 16px;
      }
    }
    &__title {
      font-family: $font-secondary;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      text-transform: uppercase;
    }
    &__values {
      font-family: $font-secondary;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-transform: uppercase;
      &__sol {
        color: #000;
      }
      &__usd {
        color: $primary;
      }
    }
  }
</style>
