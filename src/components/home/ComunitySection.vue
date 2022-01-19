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
  - will be useful, but WITHOUT ANY comunityY; without even the implied
  - comunityy of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
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
  <section class="comunity-section">
    <div class="container">
      <div class="column">
        <div class="section-title text-center text-primary q-mb-xl">Our community projects</div>
        <div class="row no-wrap">
          <left-line :color="getColor('accent')" />
          <div class="column comunity-section__content section-text">
            <div class="section-subtitle q-mb-md"
              >Here are a few of our other projects created for the blockchain community</div
            >
            <div class="q-my-sm"
              >sv-manager is a service for fast and simple bootstrapping of a new validator
              node</div
            >
            <div class="q-my-sm">sv-alert is a monitoring and alerting service for validators</div>
            <div class="q-my-sm"
              >stake pool is a Solana project for automated, optimal distribution of stake between
              the network’s top-performing validators</div
            >
          </div>
        </div>
        <div class="comunity-section__delimiter"></div>
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
  .comunity-section {
    margin-top: 40px;

    &__content {
      flex-basis: 0;
      flex-grow: 1;
    }
    &__delimiter {
      max-width: 100%;
      width: 690px;
      margin: 80px auto 60px;
      border-bottom: 1px solid #000;
    }
  }
</style>
