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
  <div class="stake-box__slider">
    <slot></slot>
    <div class="stake-box__slider__steps">
      <span v-for="(val, idx) in steps" :key="idx">{{ val }}%</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    props: {
      value: {
        type: Number,
      },
    },
    setup() {
      return {
        steps: [0, 25, 50, 75, 100],
      };
    },
  });
</script>

<style lang="scss">
  .stake-box {
    &__slider {
      margin-top: 5px;
      padding: 0 28px 0 12px;
      position: relative;
      color: $primary;

      &__steps {
        font-size: 12px;
        margin-left: -5px;
        width: calc(100% + 20px);
        display: flex;
        justify-content: space-between;

        > span {
          margin-left: 9px;
          &:first-child,
          &:last-child {
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
