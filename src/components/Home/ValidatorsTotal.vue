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
  <div v-if="$q.screen.lt.md && !alt" class="total-validators row">EPOCH {{ epochNumber }}</div>
  <div v-if="!alt" class="total-validators row">
    <div>
      <sol-svg class="total-validators__logo q-icon" fill="#1CE4B0" />
    </div>
    <div class="column total-validators__text">
      <div>VALIDATORS</div>
      <div class="column total-validators__text__total">TOTAL: {{ validatorsCount }}</div>
    </div>
  </div>
  <div v-if="alt" class="total-validators row">
    <div>
      <sol-svg class="total-validators__logo q-icon" fill="#1CE4B0" />
    </div>
    <div class="column total-validators__text">
      <div>EPOCH {{ epochNumber }}</div>
      <div
        >VALIDATORS TOTAL:
        <span class="total-validators__text__total">{{ validatorsCount }}</span></div
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { useEpochStore, useValidatorsAllStore } from '@/store';
  import { computed, defineComponent } from 'vue';
  import SolSvg from '@/components/icons/SolSvg.vue';

  export default defineComponent({
    components: {
      SolSvg,
    },
    props: {
      alt: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const epochStore = useEpochStore();
      const validatorStore = useValidatorsAllStore();
      const epochNumber = computed(() => epochStore.epochNumber);
      const validatorsCount = computed(() =>
        validatorStore.loading ? '...' : `${validatorStore.items.length}`,
      );
      return {
        validatorsCount,
        epochNumber,
      };
    },
  });
</script>

<style scoped lang="scss">
  .total-validators {
    @media (max-width: $breakpoint-xs) {
      font-size: 12px;
      line-height: 15px;
    }
    &__logo {
      width: 47px;
      height: 37px;
      margin-top: 4px;
      margin-right: 12px;
      @media (max-width: $breakpoint-xs) {
        width: 32px;
        height: 24px;
        margin-right: 4px;
      }
    }
    &__text {
      font-size: 19px;
      line-height: 23px;
      @media (max-width: $breakpoint-xs) {
        font-size: 12px;
        line-height: 15px;
      }
      &__total {
        font-weight: 500;
        @media (max-width: $breakpoint-xs) {
          font-size: 14px;
          line-height: 16px;
        }
      }
    }
  }
</style>
