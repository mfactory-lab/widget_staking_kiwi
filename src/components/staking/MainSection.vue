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
  <section class="main-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 row">
          <stake-box />
        </div>
        <div
          class="col-12 col-md-6 column"
          :class="{ 'q-pl-lg': $q.screen.gt.sm, 'q-mt-md': $q.screen.lt.md }"
        >
          <div class="row full-width">
            <div
              class="col main-section__block q-mb-md"
              :class="{ 'col-12': $q.screen.lt.sm, 'q-mr-md': $q.screen.gt.sm }"
              ><epoch
            /></div>
            <div class="main-section__rect-btn main-section__rect-btn--logo">
              <sol-svg class="q-icon" />
            </div>
          </div>
          <div class="row full-width">
            <div
              class="col q-mb-md main-section__block q-mr-md"
              :class="{ 'col-12': $q.screen.lt.sm }"
              ><charts
            /></div>
            <div class="col q-mb-md main-section__block" :class="{ 'col-12': $q.screen.lt.sm }"
              ><price-stats
            /></div>
          </div>
          <div class="row">
            <wallet-balance />
          </div>
        </div>
      </div>
      <div class="row">
        <stake-accounts />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StakeAccounts from './my-stake/StakeAccounts.vue';
  import WalletBalance from './WalletBalance.vue';
  import PriceStats from './PriceStats.vue';
  import StakeBox from './stake/StakeBox.vue';
  import Charts from './charts/Charts.vue';
  import Epoch from './Epoch.vue';
  import SolSvg from '@/components/icons/TelegramSvg.vue';

  export default defineComponent({
    components: {
      StakeAccounts,
      WalletBalance,
      PriceStats,
      StakeBox,
      Charts,
      Epoch,
      SolSvg,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped>
  .main-section {
    padding: 32px 0;

    &__rect-btn,
    &__block {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 12px;
      height: 105px !important;
      background: linear-gradient(107.48deg, #fcfcfc 2%, #ffffff 97.35%);
      box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%),
        0 3px 1px -2px rgb(0 0 0 / 12%);
    }
    &__rect-btn {
      width: 100px;

      &--logo {
        background: none;
        box-shadow: none;

        svg {
          width: 77px;
          height: 59px;
        }

        @media (max-width: $breakpoint-sm) {
          display: none;
        }
      }
    }
    &__faq-title {
      font-family: $fontSecondary;
      font-weight: 700;
      font-size: 15px;
      line-height: 18px;
      text-align: center;
      text-transform: uppercase;
      color: #000000;
      margin-bottom: 8px;
    }
  }
</style>
