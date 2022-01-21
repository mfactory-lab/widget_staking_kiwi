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
  <div class="stake-info">
    <div class="stake-info__table">
      <stake-info-row
        v-for="row in data"
        :key="row.name"
        :name="row.name"
        :value="row.value"
        :isBold="row.isBold"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import StakeInfoRow from '@/components/staking/stake/StakeInfoRow.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      StakeInfoRow,
    },
    props: {
      isStake: {
        type: Boolean,
      },
      data: {
        type: Array,
      },
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss">
  $colorBorder: #b3b3b3;

  .stake-info {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
    }

    &__table {
      padding: 8px 8px 0;
      // background: #fff;
      // border-radius: 8px;
      width: 100%;
      // min-width: 265px;

      &__row {
        display: flex;
        border-bottom: 1px solid $colorBorder;

        &:last-child {
          border-bottom: 0;
        }

        &--bold {
          font-weight: bold;
        }
      }

      &__text {
        font-size: 11px;
        line-height: 12px;

        &:first-child {
          padding: 6px 5px 6px 1px;
          border-right: 1px solid $colorBorder;
          text-align: left;
          width: 102px;
        }

        &:last-child {
          padding: 6px 1px 6px 5px;
          text-align: right;
          width: calc(100% - 102px);
        }
      }
    }

    &__info {
      font-size: 11px;
      flex-grow: 1;
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;

      &__title {
        width: 100%;
        text-align: left;
        font-weight: 500;
        font-size: 17px;
      }

      ul {
        margin: 5px 0 0 0;
        padding-left: 20px;
      }
    }
  }
</style>
