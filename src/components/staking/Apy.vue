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
    APY
    <div class="apy__value">≈{{ apy }}</div>
    <q-inner-loading :showing="apyLoading" />
  </div>
</template>

<script lang="ts">
  import { useApyStore } from '@jpool/common/store';
  import { storeToRefs } from 'pinia';
  import { computed, defineComponent } from 'vue';
  import { formatPct } from '@jpool/common/utils';

  export default defineComponent({
    props: {
      selected: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const { apy, apyLoading } = storeToRefs(useApyStore());
      return {
        apyLoading,
        apy: computed(() => formatPct.format(apy.value)),
      };
    },
  });
</script>

<style scoped lang="scss">
  .apy {
    font-size: 19px;
    line-height: 19px;
    color: $primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &__value {
      font-size: 29px;
      line-height: 29px;
      font-weight: 900;

      @media (max-width: $breakpoint-xs) {
        font-size: 24px;
      }
    }

    // //css for apy in stake-box
    // position: absolute;
    // color: $gray;
    // background-color: $lightGrayNatural;
    // width: 100px;
    // height: 85px;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: flex-end;
    // top: -35px;
    // left: calc(50% - 126px);
    // border-radius: 50% 50% 0 0 !important;
    // z-index: 1;
    // cursor: pointer;
    // transition: color 0.3s, background-color 0.3s;
    // transition-property: color, background-color;
    // transition-duration: 0.3s, 0.3s;
    // transition-timing-function: ease, ease;
    // transition-delay: 0s, 0s;
    // font-weight: 500;
    // font-size: 21px;
    // color: #fff;

    // &--selected {
    //   background-color: $secondary;
    // }

    // @media (max-width: $breakpoint-xs) {
    //   height: 66px;
    //   top: -38px;
    // }

    // &__value {
    //   font-size: 33px;
    //   font-weight: bold;
    //   color: #000000;
    //   // margin: 7px 0 10px;

    //   @media (max-width: $breakpoint-xs) {
    //     margin: -10px 0 10px;
    //     font-size: 24px;
    //   }
    // }

    // .q-inner-loading {
    //   border-radius: 50%;
    // }
  }
</style>
