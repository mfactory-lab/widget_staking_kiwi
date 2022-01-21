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
  <section class="app-header q-py-lg">
    <div class="container">
      <q-toolbar>
        <router-link class="app-header__logo q-mr-auto" to="/">
          <img src="@/assets/img/staking-logo.svg" alt="" class="app-header__logo" />
        </router-link>
        <div class="xs-hide">
          <total-stacked />
        </div>
        <div class="justify-end row">
          <cluster-selector />
          <connect-wallet />
        </div>
      </q-toolbar>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import ClusterSelector from '@/components/staking/ClusterSelector.vue';
  import TotalStacked from '@/components/staking/TotalStacked.vue';
  import ConnectWallet from '@/components/staking/ConnectWallet.vue';

  export default defineComponent({
    components: {
      ClusterSelector,
      TotalStacked,
      ConnectWallet,
    },
    setup() {},
  });
</script>

<style lang="scss" scoped>
  .app-header {
    font-family: $fontSecondary;
    background: $primary;
    color: $textWhite;
    &__logo {
    }
    &__title {
      font-size: 82px;
      line-height: 84px;
      font-weight: 900;
      margin: 8px 0 0;
      @media (max-width: $breakpoint-xs) {
        margin: -8px 0 0;
        font-size: 36px;
        line-height: 44px;
      }
    }
    &__subtitle {
      font-size: 35px;
      line-height: 38px;
      font-weight: 700;
      margin: 0;
      @media (max-width: $breakpoint-xs) {
        font-size: 16px;
        line-height: 20px;
      }
    }
    &__flower {
      position: absolute;
      height: 400px;
      top: 50px;
    }
    &__btns {
      max-width: 760px;
    }
  }
</style>
