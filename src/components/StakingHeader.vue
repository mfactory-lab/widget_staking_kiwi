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
  <q-header class="staking-header">
    <div class="staking-header__top q-pt-sm q-pb-xs text-right">
      <div class="container row items-center justify-end q-mb-xs">
        <theme-mode-selector />
        <div
          v-if="showValidator"
          class="staking-header__faq-btn q-ml-sm"
          @click="scrollTo('faq-section')"
          >How to use staking.kiwi</div
        >
        <div
          v-if="showValidator"
          class="staking-header__faq-btn q-ml-md"
          @click="scrollTo('widget-section')"
          >widget</div
        >
      </div>
    </div>
    <div class="staking-header__main q-py-md">
      <div class="container relative-position">
        <div class="row items-center">
          <router-link class="row items-center q-mr-lg" to="/">
            <img src="@/assets/img/kiwi-logo-2.svg" alt="" class="staking-header__logo" />
            <q-badge class="staking-header__beta" color="negative" text-color="text-white">
              BETA
            </q-badge>
          </router-link>
          <div class="row items-center col-grow">
            <div class="q-mr-auto staking-header__btn">
              <validator-name v-if="showValidator" />
              <validators-total v-if="!showValidator" />
            </div>
            <epoch-circle v-if="!showValidator" />
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
  </q-header>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import ClusterSelector from '@/components/staking/ClusterSelector.vue';
  import ValidatorName from '@/components/staking/ValidatorName.vue';
  import ConnectWallet from '@/components/staking/ConnectWallet.vue';
  import ThemeModeSelector from '@/components/ThemeModeSelector.vue';
  import handleScroll from '@jpool/common/utils/scroller';
  import router from '@/router';
  import EpochCircle from '@/components/EpochCircle.vue';
  import ValidatorsTotal from '@/components/home/ValidatorsTotal.vue';

  export default defineComponent({
    components: {
      ClusterSelector,
      ValidatorName,
      ConnectWallet,
      ThemeModeSelector,
      EpochCircle,
      ValidatorsTotal,
    },
    setup() {
      return {
        showValidator: computed(() => {
          const validator = router.currentRoute.value.params.validator;
          if (!!validator && typeof validator === 'string') {
            return true;
          }
          return false;
        }),
        scrollTo(id) {
          const header = document.querySelector('.q-header');
          handleScroll(id, header?.offsetHeight - 10 ?? 0);
        },
      };
    },
  });
</script>
