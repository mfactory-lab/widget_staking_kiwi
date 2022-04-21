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
  <q-header id="app-header" class="staking-header">
    <div
      v-if="showValidator || $q.screen.gt.sm"
      class="staking-header__top q-pt-md q-pb-xs text-right"
    >
      <div class="container row items-center justify-end q-mb-xs">
        <price-stats-for-header v-if="!showValidator" />
        <theme-mode-selector />
        <div
          v-if="showValidator"
          class="staking-header__faq-btn q-ml-sm"
          @click="scrollTo('faq-section')"
        >
          How to use staking.kiwi
        </div>
        <div
          v-if="showValidator"
          class="staking-header__faq-btn q-ml-md"
          @click="scrollTo('widget-section')"
        >
          widget
        </div>
      </div>
    </div>
    <div class="staking-header__main row items-end q-py-md">
      <div class="container relative-position">
        <div class="row items-end justify-between full-width">
          <router-link
            class="row items-center"
            :class="{ 'q-mr-md': $q.screen.lt.sm, 'q-mr-lg': $q.screen.gt.xs }"
            to="/"
          >
            <img src="@/assets/img/kiwi-logo-2.svg" alt="" class="staking-header__logo" />
            <q-badge
              v-if="$q.screen.gt.sm"
              class="staking-header__beta"
              color="accent"
              text-color="text-white"
            >
              v{{ version }}
            </q-badge>
          </router-link>
          <div v-if="!showValidator && $q.screen.lt.md" class="total-validators-nxs q-mr-auto">
            <validators-total />
          </div>
          <div v-if="$q.screen.lt.md" class="column q-ml-auto">
            <div class="staking-header__btn q-mb-sm">
              <cluster-selector />
            </div>
            <div class="staking-header__btn">
              <connect-wallet />
            </div>
          </div>
          <div
            v-if="showValidator"
            class="col-12 col-md-auto q-mr-auto col-grow"
            :class="{ 'q-mt-md': $q.screen.lt.md }"
          >
            <validator-name />
          </div>
          <div v-if="$q.screen.gt.sm" class="row items-center col-grow">
            <div v-if="!showValidator" class="q-mr-auto">
              <validators-total />
            </div>
            <epoch-circle v-if="!showValidator" />
            <div class="row q-ml-auto q-mt-auto">
              <div class="q-mr-md staking-header__btn">
                <cluster-selector />
              </div>
              <div class="staking-header__btn">
                <connect-wallet />
              </div>
            </div>
          </div>
        </div>
        <div class="row items-center full-width total-validators-xs">
          <div v-if="!showValidator && $q.screen.lt.sm" class="q-mt-sm">
            <validators-total :alt="true" />
          </div>
        </div>
      </div>
    </div>
  </q-header>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import router from '@/router';
  import { handleScroll } from '@/utils';

  export default defineComponent({
    setup() {
      return {
        // TODO: package.json
        version: '1.2',
        showValidator: computed(() => {
          const validator = router.currentRoute.value.params.validator;
          console.log('validator === ', validator);
          return !!validator && typeof validator === 'string';
        }),
        scrollTo(id) {
          const header = document.querySelector('.q-header') as HTMLElement;
          handleScroll(id, header?.offsetHeight - 10 ?? 0);
        },
      };
    },
  });
</script>
