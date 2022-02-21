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
  <section id="faq-section" class="faq-section q-pb-lg">
    <div class="container">
      <div class="faq-section__title text-center">FAQ</div>
      <div class="faq-section__items">
        <faq-section-item>
          <template #title>What is "staking"?</template>
          <div
            >By staking your SOL tokens, you help secure the network and
            <a href="https://docs.solana.com/implemented-proposals/staking-rewards" target="_blank"
              >earn rewards</a
            >
            while doing so. You can stake by delegating your tokens to validators who process
            transactions and run the Solana network.</div
          >
        </faq-section-item>
        <faq-section-item>
          <template #title>Who is a delegator?</template>
          <div
            >You are. Any user who delegates their SOL to a validator, enabling them to validate new
            blocks and keep the network alive, becomes a delegator.</div
          >
          <div
            >Anyone who has some SOL in their wallet may delegate it – and earn rewards by doing so.
          </div>
        </faq-section-item>
        <faq-section-item>
          <template #title>What is a validator?</template>
          <div
            >For the Solana network to be fast, efficient, and censorship-resistant, it requires a
            number of independent validator nodes (or simply Validators). Validators participate in
            adding new blocks to the blockchain, which happens every 400 milliseconds—and to do it,
            they vote with <strong>your</strong> delegated SOL. This is what you get your rewards
            for.
          </div>
        </faq-section-item>
        <faq-section-item>
          <template #title>What is a staking account?</template>
          <div
            >It is a separate account where you place your SOL that you want to delegate (stake to a
            validator). When you stake, it is created automatically, then delegated to the
            validator. You can see it in your wallet—and watch your rewards stack up!
          </div>
        </faq-section-item>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import FaqSectionItem from './FaqSectionItem.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      FaqSectionItem,
    },
  });
</script>

<style lang="scss">
  $faqText: #000;
  .faq-section {
    &__title {
      font-family: $font-secondary;
      font-weight: 500;
      font-size: 30px;
      color: $faqText;
    }
    &__item {
      padding: 20px 32px;
      border: 1px solid #fff;
      background: #f5f5f5;
      box-shadow: -4px -4px 14px rgba(255, 255, 255, 0.71), 0px 4px 4px rgba(192, 191, 191, 0.25);
      border-radius: 12px;

      &__title {
        font-size: 20px;
        line-height: 23px;
        text-transform: uppercase;
        color: $faqText;
        padding-bottom: 10px;
        border-bottom: 1px solid $primary;
      }

      &__text {
        font-size: 14px;
        line-height: 16px;
        color: $faqText;

        > div {
          margin-top: 16px;

          a {
            color: $accent;
          }
        }
      }
    }
  }
</style>
