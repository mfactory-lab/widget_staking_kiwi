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
  <div class="launch-pair">
    <div class="launch-pair__t-block"></div>
    <div class="container">
      <div class="launch-pair__row">
        <launch-validator
          v-for="item in items"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          :cap="item.cap"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import LaunchValidator from '@/components/home/LaunchValidator.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { LaunchValidator },
    props: {
      items: {
        type: Array,
      },
    },
  });
</script>

<style lang="scss" scoped>
  .launch-pair {
    &__t-block {
      height: 90px;
      background: $accent;
      @media (max-width: $breakpoint-xs) {
        height: 70px;
      }
    }
    &:not(:first-child) &__t-block {
      @media (max-width: $breakpoint-sm) {
        display: none;
      }
    }
    &__row {
      display: flex;
      justify-content: center;
      padding: 65px 0;

      @media (max-width: $breakpoint-sm) {
        padding: 50px 0 0;
      }
      @media (max-width: $breakpoint-sm) {
        padding-top: 24px;
        align-items: flex-start;
      }

      > :first-child {
        @media (min-width: $breakpoint-sm) {
          padding-right: 50px;
        }
        @media (max-width: $breakpoint-sm) {
          margin-bottom: 50px;
        }
        @media (max-width: $breakpoint-sm) {
          margin-bottom: 24px;
        }
      }
      > :last-child {
        @media (min-width: $breakpoint-sm) {
          padding-left: 49px;
          border-left: 1px solid $gray;
        }
      }
      @media (max-width: $breakpoint-sm) {
        flex-direction: column;
      }
    }
  }
</style>
