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
  <q-card class="shadow-sm q-pa-md q-mb-md">
    <div class="validator-item row justify-between">
      <div class="validator-item__logo column q-mr-md q-mt-sm justify-center">
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
      <div class="validator-item__name column q-mr-sm q-mt-sm justify-start">
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
      <div class="validator-item__address column q-mr-sm q-mt-sm items-center justify-start">
        <q-skeleton width="33%" v-if="loading" />
        <q-btn
          v-else
          type="a"
          :href="validatorUrl"
          target="_blank"
          outline
          rounded
          label="PERFORMANCE"
          color="primary-gray"
          text-color="primary-gray"
          size="12px"
          padding="0 12px"
          :icon="'img:' + validatorsApps"
          class="validator-item__address__link"
        />
        <q-skeleton width="33%" v-if="loading" />
        <q-btn
          v-else
          type="a"
          :href="validatorUrl"
          target="_blank"
          outline
          rounded
          label="PERFORMANCE"
          color="primary-gray"
          text-color="primary-gray"
          size="12px"
          padding="0 12px"
          :icon="'img:' + validatorsApps"
          class="validator-item__address__link"
        />
        <q-skeleton width="33%" v-if="loading" />
        <q-btn
          v-else
          type="a"
          :href="validatorUrl"
          target="_blank"
          outline
          rounded
          label="PERFORMANCE"
          color="primary-gray"
          text-color="primary-gray"
          size="12px"
          padding="0 12px"
          :icon="'img:' + validatorsApps"
          class="validator-item__address__link"
        />
      </div>
      <div class="validator-item__address column q-mt-sm items-center justify-start">
        <q-skeleton width="100%" v-if="loading" />
        <div v-else>
          <span class="validator-item__address__text">{{ validatorId }}</span>
          <copy-to-clipboard :text="validatorId" />
        </div>
        <q-skeleton width="100%" class="q-mt-sm" v-if="loading" />
        <div v-else>
          <span class="validator-item__address__text q-mt-sm">{{ voterKey }}</span>
          <copy-to-clipboard :text="voterKey" />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { evaPerson } from '@quasar/extras/eva-icons';
  import { storeToRefs } from 'pinia';
  import validatorsApps from '@/assets/img/validators-apps.png';
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
      } = storeToRefs(useValidatorJstakingStore());
      const { loading } = storeToRefs(useValidatorStore());

      return {
        evaPerson,
        validatorsApps,
        loading,
        validatorId,
        voterKey,
        validatorName,
        validatorDetails,
        validatorImage,
        validatorUrl,
      };
    },
  });
</script>
