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
  <div class="validator-name row items-center">
    <div class="validator-name__logo column q-mr-md justify-center relative-position">
      <q-skeleton v-if="loading && !savedValidator" type="QAvatar" class="shadow-5" size="56px" />
      <a v-else :href="loading ? savedValidator.validatorUrl : validatorUrl" target="_blank">
        <q-avatar class="shadow-1" size="56px">
          <q-img
            :src="loading ? savedValidator.validatorImage : validatorImage"
            spinner-color="white"
          >
            <template
              #default
              v-if="!((loading && savedValidator.validatorImage) || validatorImage)"
            >
              <q-icon :name="evaPerson" />
            </template>
            <template #error>
              <q-icon :name="evaPerson" />
            </template>
          </q-img>
        </q-avatar>
      </a>
    </div>
    <div class="validator-name__text column justify-start relative-position">
      <div v-if="!loading || savedValidator" class="validator-name__badges row no-wrap absolute">
        <q-badge
          v-if="isDelinquent"
          class="validator-name__badges__item q-mr-sm"
          color="negative"
          text-color="text-white"
        >
          DELINQUENT FOR
          {{ delinquentTime }}
          <q-tooltip class="text-body2">
            Delinquent for
            {{ delinquentTime }}
          </q-tooltip>
        </q-badge>
        <a
          v-if="loading ? savedValidator.validatorInJpool : validatorInJpool"
          class="row"
          href="https://jpool.one"
          target="_blank"
        >
          <q-badge
            class="validator-name__badges__item q-mr-sm"
            color="warning"
            text-color="primary"
          >
            JPOOL
          </q-badge>
        </a>
        <a
          v-if="(loading ? savedValidator.validatorSVM : validatorSVM) && cluster"
          class="row"
          :href="`https://solana.thevalidators.io/d/e-8yEOXMwerfwe/solana-monitoring?orgId=2&refresh=30s&from=now-3h&to=now&var-cluster=${cluster}&var-server=${
            loading ? savedValidator.validatorSVM : validatorSVM
          }`"
          target="_blank"
        >
          <q-badge class="validator-name__badges__item" color="accent" text-color="text-white">
            SVT MEMBER
          </q-badge>
        </a>
      </div>
      <q-skeleton width="250px" v-if="loading && !savedValidator" />
      <div v-else class="q-mt-sm">
        {{ loading ? savedValidator.validatorName : validatorName }}
        <q-tooltip class="text-body2">
          {{ loading ? savedValidator.validatorName : validatorName }}
        </q-tooltip>
      </div>
      <q-skeleton width="250px" class="q-mt-sm" v-if="loading && !savedValidator" />
      <div v-else class="validator-name__details">
        {{ loading ? savedValidator.validatorDetails : validatorDetails }}
        <q-tooltip class="text-body2">
          {{ loading ? savedValidator.validatorDetails : validatorDetails }}
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { useConnectionStore, useValidatorJstakingStore, useValidatorsAllStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import { isoTimeDifference } from '@/utils';
  import { evaPerson } from '@quasar/extras/eva-icons';
  import { DELINQ_UPDATE_EVENT } from '@/store';
  import { useEmitter } from '@jpool/common/hooks';

  export default defineComponent({
    components: {},
    setup() {
      const {
        savedValidator,
        validatorName,
        validatorDetails,
        validatorImage,
        validatorUrl,
        validatorInJpool,
        validatorDelinquent,
        validatorSVM,
        validatorLastVote,
      } = storeToRefs(useValidatorJstakingStore());
      const { loading } = storeToRefs(useValidatorsAllStore());
      const connectionStore = useConnectionStore();
      const cluster = computed(() => connectionStore.cluster);
      const isDelinquent = computed(() =>
        loading.value ? savedValidator.value?.validatorDelinquent : validatorDelinquent.value,
      );
      const lastVote = computed(() =>
        loading.value ? savedValidator.value?.validatorLastVote : validatorLastVote.value,
      );
      const delinquentTime = ref('');
      watch(
        [isDelinquent, lastVote],
        () => {
          if (isDelinquent.value && lastVote.value) {
            delinquentTime.value = isoTimeDifference(lastVote.value);
          }
        },
        { immediate: true },
      );

      const emitter = useEmitter();
      emitter.on(DELINQ_UPDATE_EVENT, () => {
        if (isDelinquent.value && lastVote.value) {
          delinquentTime.value = isoTimeDifference(lastVote.value);
        }
      });

      return {
        evaPerson,
        savedValidator,
        validatorName,
        validatorDetails,
        validatorImage,
        validatorUrl,
        validatorInJpool,
        isDelinquent,
        validatorSVM,
        validatorLastVote,
        cluster,
        loading,
        delinquentTime,
      };
    },
  });
</script>
