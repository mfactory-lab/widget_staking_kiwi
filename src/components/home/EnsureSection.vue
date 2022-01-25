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
  - will be useful, but WITHOUT ANY ensureY; without even the implied
  - ensurey of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
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
  <section class="ensure-section">
    <div class="container">
      <div class="column">
        <div class="section-title text-center text-primary q-mb-xl">We ensure</div>
        <div class="row no-wrap">
          <left-line :color="getColor('warning')" />
          <div class="column ensure-section__content section-text">
            <div class="q-my-sm">— Top-notch maintenance and service, expert configuration</div>
            <div class="q-my-sm">— Hosting in world’s leading, high-security data centers</div>
            <div class="q-my-sm">— 24/7 advisory support</div>
            <div class="q-my-sm">— High-end servers</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { getCssVar } from 'quasar';

  export default defineComponent({
    setup() {
      return {
        getColor: (val: string) => getCssVar(val),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .ensure-section {
    margin-top: 32px;

    @media (max-width: $breakpoint-sm) {
      margin-top: 24px;
    }

    .section-title {
      margin-bottom: 40px;
      @media (max-width: $breakpoint-xs) {
        margin-bottom: 16px;
      }
    }

    &__content {
      flex-basis: 0;
      flex-grow: 1;
    }
  }
</style>
