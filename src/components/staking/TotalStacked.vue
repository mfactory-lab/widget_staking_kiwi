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
  <div class="total-staked">
    <div class="total-staked__logo">
      <sol-svg fill="#FFCD29" class="q-icon" />
    </div>
    <div class="q-ml-sm total-staked__value" v-if="loading && !savedValidator">
      <q-skeleton width="70px" height="18px" class="q-mx-sm" />
      <q-skeleton width="70px" height="18px" class="q-mx-sm q-mt-sm" />
    </div>
    <div class="q-ml-sm total-staked__value" v-else>
      <div class="total-staked__label">Total Staked</div>
      <div class="row justify-between">
        <div class="total-staked__sol">≈ {{ solStakedFormat }}</div>
        <q-tooltip class="bg-gray text-body2" :offset="[10, 10]">
          {{ formatMoney(solStaked) }} SOL</q-tooltip
        >
      </div>
    </div>
    <div class="q-ml-sm total-staked__value" v-if="loading && !savedValidator">
      <q-skeleton width="70px" height="18px" class="q-mx-sm" />
      <q-skeleton width="70px" height="18px" class="q-mx-sm q-mt-sm" />
    </div>
    <div class="total-staked__value" v-else>
      <div class="total-staked__label">Validator Commission</div>
      <div class="row justify-between">
        <div class="total-staked__sol">{{ commission }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useValidatorJstakingStore, useValidatorsAllStore } from '@/store';
  import { formatAmount, formatPct, lamportsToSol } from '@jpool/common/utils';
  import SolSvg from '@/components/icons/SolSvg.vue';
  import { formatMoney } from '@jpool/common/utils/check-number';
  import { storeToRefs } from 'pinia';

  export default defineComponent({
    components: {
      SolSvg,
    },
    setup(_props) {
      const { savedValidator, totalStake, commission } = storeToRefs(useValidatorJstakingStore());
      const { loading } = storeToRefs(useValidatorsAllStore());

      const solStaked = computed(() => {
        return lamportsToSol(
          loading && savedValidator.value
            ? savedValidator.value.validatorStake
            : totalStake.value ?? 0,
        );
      });

      return {
        loading,
        savedValidator,
        solStaked,
        formatMoney,
        solStakedFormat: computed(() => formatAmount(solStaked.value, 3)),
        commission: computed(() =>
          formatPct.format(
            (loading && savedValidator.value
              ? savedValidator.value.validatorFee
              : commission.value) / 100,
          ),
        ),
      };
    },
  });
</script>
