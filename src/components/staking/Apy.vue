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
  <div class="apy" :class="{ 'apy--selected': selected }">
    AVERAGE APY
    <div class="apy__value">≈{{ apy }}</div>
    <q-inner-loading :showing="apyLoading" />
  </div>
</template>

<script lang="ts">
  import { useValidatorJstakingStore } from '@/store';
  import { computed, defineComponent } from 'vue';
  import { formatPct } from '@jpool/common/utils';
  import { storeToRefs } from 'pinia';

  export default defineComponent({
    props: {
      selected: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const { apy, apyLoading } = storeToRefs(useValidatorJstakingStore());
      return {
        apyLoading,
        apy: computed(() => formatPct.format(apy.value)),
      };
    },
  });
</script>

<style scoped lang="scss">
  .apy {
    font-size: 12px;
    line-height: 14px;
    color: $primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &__value {
      font-size: 26px;
      line-height: 30px;
      font-weight: 900;
      margin-top: 4px;

      @media (max-width: $breakpoint-xs) {
        font-size: 24px;
        line-height: 28px;
      }
    }
  }
</style>
