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
      <div class="section-title q-py-md">How to use staking.kiwi</div>
      <q-card class="faq-section__block q-pa-md q-mb-md">
        <div class="faq-section__title">TO STAKE SOL FROM YOUR WALLET</div>
        <ul class="faq-section__list">
          <li class="faq-section__list__item">Connect your wallet.</li>
          <li class="faq-section__list__item">Enter the amount of SOL you want to stake.</li>
          <li class="faq-section__list__item">Click STAKE NOW</li>
          <li class="faq-section__list__item"
            >Done! You have staked your SOL to
            <span v-if="loading && !savedValidator">Validator</span
            ><span v-else>{{ loading ? savedValidator.validatorName : validatorName }}</span></li
          >
        </ul>
      </q-card>
      <q-card class="faq-section__block q-pa-md q-mb-md">
        <div class="faq-section__title">MANAGING YOUR STAKING ACCOUNTS</div>
        <div class="faq-section__text">
          <div class="faq-section__text__item"
            >Account inactive or in the process of deactivation:
          </div>
          <div class="faq-section__text__item"
            >Click DEACTIVATE if you want to withdraw your SOL at the end of the current epoc
          </div>
        </div>
        <div class="faq-section__text">
          <div class="faq-section__text__item">Account active or in the process of activation:</div>
          <div class="faq-section__text__item"
            >Click ACTIVATE so the account starts producing rewards in the next epoch.
          </div>
        </div>
        <div class="faq-section__text">
          <div class="faq-section__text__item">Account inactive:</div>
          <div class="faq-section__text__item">You can WITHDRAW your SOL at any time.</div>
        </div>
        <div class="faq-section__text">
          <div class="faq-section__text__item"
            >If an account is active and delegated to a validator within a stake pool, you can move
            your staking account into that pool without deactivating it. You will receive the pool’s
            token (e.g. JSOL for JPool) and immediately start to earn rewards from the pool
          </div>
          <div class="faq-section__text__item"
            >Click DEPOSIT TO JPOOL to move your staking account into the pool.
          </div>
        </div>
      </q-card>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, toRef } from 'vue';
  import { useValidatorJstakingStore, useValidatorsAllStore } from '@/store';

  export default defineComponent({
    components: {},
    setup() {
      const validatorJstakingStore = useValidatorJstakingStore();
      const savedValidator = toRef(validatorJstakingStore, 'savedValidator');
      const validatorName = toRef(validatorJstakingStore, 'validatorName');

      const validatorsAllStore = useValidatorsAllStore();
      const loading = toRef(validatorsAllStore, 'loading');

      return {
        savedValidator,
        validatorName,
        loading,
      };
    },
  });
</script>
