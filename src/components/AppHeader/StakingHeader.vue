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
  <div class="staking-header__top q-pt-md q-pb-xs text-right">
    <div class="container row items-center justify-end q-mb-xs">
      <theme-mode-selector />
      <div class="staking-header__faq-btn q-ml-sm" @click="scrollTo('faq-section')">
        How to use staking.kiwi
      </div>
      <div class="staking-header__faq-btn q-ml-md" @click="scrollTo('widget-section')">
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
        <div v-if="$q.screen.lt.md" class="column q-ml-auto">
          <div class="staking-header__btn q-mb-sm">
            <cluster-selector />
          </div>
          <div class="staking-header__btn">
            <connect-wallet />
          </div>
        </div>
        <div class="col-12 col-md-auto q-mr-auto col-grow" :class="{ 'q-mt-md': $q.screen.lt.md }">
          <validator-name />
        </div>
        <div v-if="$q.screen.gt.sm" class="row items-center col-grow">
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
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { handleScroll } from '@/utils';

  export default defineComponent({
    setup() {
      return {
        version: process.env.npm_package_version,
        scrollTo(id) {
          const header = document.querySelector('.q-header') as HTMLElement;
          handleScroll(id, header?.offsetHeight - 10 ?? 0);
        },
      };
    },
  });
</script>
