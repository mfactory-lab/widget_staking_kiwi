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
              class="col main-section__block q-mb-md q-mr-md"
              :class="{ 'col-12': $q.screen.lt.sm }"
              ><epoch
            /></div>
            <div
              class="main-section__rect-btn"
              :class="{ 'q-mx-auto': $q.screen.lt.sm, 'q-mb-md': $q.screen.lt.sm }"
            >
              <q-btn
                class="q-mx-lg main-section__calc-btn"
                flat
                padding="none"
                color="white"
                size="md"
                @click="RoiDialog = true"
              >
                <img src="@/assets/img/calculator.svg" alt="" class="q-mt-xs q-ml-xs" />
              </q-btn>
            </div>
          </div>
          <div class="row full-width">
            <div
              class="col q-mb-md main-section__block q-mr-md"
              :class="{ 'col-12': $q.screen.lt.sm }"
              ><charts
            /></div>
            <div
              class="main-section__rect-btn"
              :class="{ 'q-mx-auto': $q.screen.lt.sm, 'q-mb-md': $q.screen.lt.sm }"
            >
              <q-btn
                class="q-mx-lg main-section__calc-btn"
                flat
                padding="none"
                color="white"
                size="md"
              >
                <div class="main-section__faq-title">FAQ</div>
                <img src="@/assets/img/question.svg" alt="" />
              </q-btn>
            </div>
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
  <roi-calculator v-model="RoiDialog" />
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useEmitter } from '@jpool/common/hooks';
  import RoiCalculator from './roi-calculator/RoiCalculator.vue';
  import StakeAccounts from './my-stake/StakeAccounts.vue';
  import WalletBalance from './WalletBalance.vue';
  import StakeBox from './stake/StakeBox.vue';
  import Charts from './charts/Charts.vue';
  import Epoch from './Epoch.vue';

  export default defineComponent({
    components: {
      RoiCalculator,
      StakeAccounts,
      WalletBalance,
      StakeBox,
      Charts,
      Epoch,
    },
    setup() {
      const RoiDialog = ref(false);
      const emitter = useEmitter();

      emitter.on('closeCalculator', () => {
        RoiDialog.value = false;
      });

      return {
        RoiDialog,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .main-section {
    padding: 32px 0;
    min-height: calc(100vh - 96px);
    background: url(/src/assets/img/bg-sol.svg) no-repeat center center;
    background-color: #f4f4f4;

    &__rect-btn,
    &__block {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 12px;
      height: 100px;
      box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%),
        0 3px 1px -2px rgb(0 0 0 / 12%);
    }
    &__rect-btn {
      width: 100px;
    }
    &__calc-btn {
      min-height: 62px !important;
      min-width: 62px !important;

      img {
        max-width: 100%;
        max-height: 100%;
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
