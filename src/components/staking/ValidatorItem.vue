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
      <div class="validator-item__name row items-center">
        <div class="validator-item__logo column q-mr-md justify-center">
          <q-skeleton v-if="loading" type="QAvatar" class="shadow-5" size="60px" />
          <a v-else :href="validatorUrl" target="_blank">
            <q-avatar class="shadow-1" size="60px">
              <q-img :src="validatorImage" spinner-color="white">
                <template #default v-if="!validatorImage">
                  <q-icon :name="evaPerson" />
                </template>
                <template #error>
                  <q-icon :name="evaPerson" />
                </template>
              </q-img>
            </q-avatar>
          </a>
        </div>
        <div class="validator-item__name__text column justify-start">
          <q-skeleton width="100%" v-if="loading" />
          <div v-else class="q-mt-xs">
            {{ validatorName }}
            <q-tooltip class="text-body2">
              {{ validatorName }}
            </q-tooltip>
          </div>
          <q-skeleton width="100%" class="q-mt-sm" v-if="loading" />
          <div v-else class="validator-item__name__details q-mt-xs">
            {{ validatorDetails }}
            <q-tooltip class="text-body2">
              {{ validatorDetails }}
            </q-tooltip>
          </div>
        </div>
      </div>
      <div class="validator-item__btns row q-px-sm items-center justify-center">
        <q-skeleton width="48px" height="48px" class="q-mx-sm" v-if="loading" />
        <q-btn
          v-else
          type="a"
          :href="validatorUrl"
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
        <q-skeleton width="48px" height="48px" class="q-mx-sm" v-if="loading" />
        <q-btn
          v-else
          type="a"
          :href="validatorSolanaBeach"
          unelevated
          target="_blank"
          label=""
          color="solana-dark"
          size="19px"
          padding="8px"
          :icon="'img:' + solanaBeachImg"
          class="validator-item__btns__btn q-mx-sm"
        />
        <q-skeleton width="48px" height="48px" class="q-mx-sm" v-if="loading" />
        <q-btn
          v-else
          type="a"
          :href="validatorWebsite"
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
        <q-skeleton width="350px" style="max-width: 100%" v-if="loading" />
        <div class="text-right" v-else>
          <span class="validator-item__address__text">{{ validatorId }}</span>
          <copy-to-clipboard :text="validatorId" />
        </div>
        <q-skeleton width="350px" style="max-width: 100%" class="q-mt-sm" v-if="loading" />
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

  export default defineComponent({
    components: {},
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
      } = storeToRefs(useValidatorJstakingStore());
      const { loading } = storeToRefs(useValidatorStore());

      return {
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
