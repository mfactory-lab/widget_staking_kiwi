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
  <section class="staking-header">
    <div class="staking-header__top q-py-lg text-right">
      <div class="container">
        <div class="staking-header__faq-btn" @click="scrollToFaq">How to use staking.kiwi</div>
      </div>
    </div>
    <div class="staking-header__main q-py-lg">
      <div class="container">
        <div class="row items-center">
          <router-link class="row items-center q-mr-auto" to="/">
            <img src="@/assets/img/kiwi-logo.svg" alt="" class="staking-header__logo" />
          </router-link>
          <div class="row items-center">
            <div class="q-mr-lg staking-header__btn">
              <total-stacked />
            </div>
            <div class="row">
              <div class="q-mr-md staking-header__btn">
                <cluster-selector />
              </div>
              <div class="staking-header__btn">
                <connect-wallet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import ClusterSelector from '@/components/staking/ClusterSelector.vue';
  import TotalStacked from '@/components/staking/TotalStacked.vue';
  import ConnectWallet from '@/components/staking/ConnectWallet.vue';
  import handleScroll from '@jpool/common/utils/scroller';

  export default defineComponent({
    components: {
      ClusterSelector,
      TotalStacked,
      ConnectWallet,
    },
    setup() {
      return {
        scrollToFaq() {
          handleScroll('faq-section');
        },
      };
    },
  });
</script>

<style lang="scss" scoped>
  .staking-header {
    background: #fff;
    font-family: $font-secondary;
    &__top {
      position: relative;
      z-index: 1;
    }
    &__faq-btn {
      cursor: pointer;
      font-family: $font-secondary;
      font-weight: 500;
      font-size: 14px;
      text-transform: uppercase;
    }
    &__main {
      background: $primary;
    }
    &__logo {
      margin-top: -86px;
      margin-left: -28px;
    }
    &__btn {
      @media (max-width: $breakpoint-sm) {
        margin-top: 16px;
      }
    }
  }
</style>
