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
  <section class="how-section">
    <div class="container">
      <div class="how-section__main">
        <left-line />
        <div class="column how-section__content">
          <div class="section-title text-center">How a validator generates profit</div>
          <ul class="how-section__list">
            <li>A new block is sent to validators for verification</li>
            <li>Validators verify the block and respond with true or false</li>
            <li>Network disburses rewards for the work done</li>
            <li
              >The rewards is added to the delegated stake, after deduction of a fee that goes to
              the delegator</li
            >
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import LeftLine from '@/components/home/LeftLine.vue';
  import { getCssVar } from 'quasar';

  export default defineComponent({
    components: { LeftLine },
    setup() {
      return {
        getColor: (val: string) => getCssVar(val),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .how-section {
    margin-top: 32px;
    background: $primary;

    @media (max-width: $breakpoint-sm) {
      margin-top: 24px;
    }

    .section-title {
      @media (min-width: $breakpoint-sm) {
        margin-top: -10px;
      }
    }

    &__main {
      display: flex;
      padding: 62px 0;
      justify-content: center;
      color: $text-white;
    }
    &__content {
      flex-basis: 0;
      flex-grow: 1;
    }
    &__list {
      margin-bottom: 0;
      font-size: 20px;
      @media (max-width: $breakpoint-sm) {
        font-size: 14px;
        padding-left: 24px;
      }
    }
  }
</style>
