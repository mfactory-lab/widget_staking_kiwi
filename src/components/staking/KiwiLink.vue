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
  <div class="kiwi-link column items-center justify-between">
    <div class="kiwi-link__title">STAKE ACCOUNTS</div>
    <div class="kiwi-link__text">& more details</div>
    <q-btn
      type="a"
      :href="`https://staking.kiwi/app/${voterKey}`"
      target="_blank"
      rounded
      label="STAKING.KIWI"
      color="primary"
      text-color="text-white"
      size="10px"
      padding="5px 12px"
      class="q-mt-sm"
    />
  </div>
</template>

<script lang="ts">
  import { useValidatorJstakingStore } from '@/store';
  import { computed, defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const validatorJstakingStore = useValidatorJstakingStore();
      const voterKey = computed(() => validatorJstakingStore.voterKey);
      return {
        voterKey,
      };
    },
  });
</script>
