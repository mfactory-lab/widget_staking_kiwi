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
  <div class="epoch column items-center justify-between">
    <div class="epoch__title">Epoch {{ epochNumber }}</div>
    <q-circular-progress
      show-value
      class="epoch__progress"
      :value="epochProgress"
      size="51px"
      :thickness="0.2"
      color="warning"
      track-color="accent"
      center-color="white"
    >
      <div class="epoch__number"> {{ epochProgress }}% </div>
    </q-circular-progress>
  </div>
</template>

<script lang="ts">
  import { useEpochStore } from '@/store';
  import { computed, defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const epochStore = useEpochStore();
      const epochProgress = computed(() => epochStore.epochProgress);
      const epochNumber = computed(() => epochStore.epochNumber);
      return {
        epochNumber,
        epochProgress: computed(() => Number(epochProgress.value)),
      };
    },
  });
</script>
