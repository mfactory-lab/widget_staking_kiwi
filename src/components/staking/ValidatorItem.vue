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
  <q-card class="shadow-sm q-pa-md q-mb-md full-width">
    <div class="validator-item">
      <div class="validator-item__stats row items-center">
        <total-stacked />
      </div>
      <div class="validator-item__btns row q-px-sm items-center justify-center">
        <q-skeleton width="48px" height="48px" class="q-mx-sm" v-if="loading && !savedValidator" />
        <q-btn
          v-else
          type="a"
          :href="loading ? savedValidator.validatorUrl : validatorUrl"
          unelevated
          target="_blank"
          :outline="!$q.dark.isActive"
          label=""
          :color="$q.dark.isActive ? 'text-white' : 'primary'"
          :text-color="$q.dark.isActive ? 'text-white' : 'primary'"
          size="19px"
          padding="8px"
          :icon="'img:' + validatorsAppsImg"
          class="validator-item__btns__btn q-mx-sm"
        />
        <q-skeleton width="48px" height="48px" class="q-mx-sm" v-if="loading && !savedValidator" />
        <q-btn
          v-else
          type="a"
          :href="loading ? savedValidator.validatorSolanaBeach : validatorSolanaBeach"
          unelevated
          target="_blank"
          label=""
          color="solana-dark"
          size="19px"
          padding="8px"
          :icon="'img:' + solanaBeachImg"
          class="validator-item__btns__btn q-mx-sm"
        />
        <q-skeleton width="48px" height="48px" class="q-mx-sm" v-if="loading && !savedValidator" />
        <q-btn
          v-else
          type="a"
          :href="loading ? savedValidator.validatorWebsite : validatorWebsite"
          unelevated
          target="_blank"
          label=""
          :text-color="$q.dark.isActive ? 'primary' : 'text-white'"
          :color="$q.dark.isActive ? 'text-white' : 'primary'"
          size="19px"
          padding="8px"
          :icon="evaGlobe"
          class="validator-item__btns__btn q-mx-sm"
        />
      </div>
      <div class="validator-item__address column items-end justify-start">
        <q-skeleton width="350px" style="max-width: 100%" v-if="loading && !savedValidator" />
        <div class="text-right" v-else>
          <span class="validator-item__address__text">{{
            loading ? savedValidator.validatorId : validatorId
          }}</span>
          <copy-to-clipboard :text="loading ? savedValidator.validatorId : validatorId" />
        </div>
        <q-skeleton
          width="350px"
          style="max-width: 100%"
          class="q-mt-sm"
          v-if="loading && !savedValidator"
        />
        <div class="text-right" v-else>
          <span class="validator-item__address__text">{{ voterKey }}</span>
          <copy-to-clipboard :text="voterKey" />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { evaGlobe, evaPerson } from '@quasar/extras/eva-icons';
  import { storeToRefs } from 'pinia';
  import validatorsAppsImg from '@/assets/img/validators-apps.png';
  import solanaBeachImg from '@/assets/img/solana-beach.png';
  import { useValidatorJstakingStore, useValidatorStore } from '@/store';
  import TotalStacked from '@/components/staking/TotalStacked.vue';
  import CopyToClipboard from '@/components/CopyToClipboard.vue';

  export default defineComponent({
    components: { CopyToClipboard, TotalStacked },
    setup() {
      const {
        validatorId,
        voterKey,
        validatorName,
        validatorDetails,
        validatorImage,
        validatorUrl,
        validatorSolanaBeach,
        validatorWebsite,
        savedValidator,
      } = storeToRefs(useValidatorJstakingStore());
      const { loading } = storeToRefs(useValidatorStore());

      return {
        savedValidator,
        evaGlobe,
        evaPerson,
        validatorsAppsImg,
        solanaBeachImg,
        loading,
        validatorId,
        voterKey,
        validatorName,
        validatorDetails,
        validatorImage,
        validatorUrl,
        validatorSolanaBeach,
        validatorWebsite,
      };
    },
  });
</script>
