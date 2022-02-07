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
  <q-btn
    class="q-mx-lg roi-calc-btn"
    flat
    padding="none"
    color="white"
    size="md"
    @click="RoiDialog = true"
  >
    <img src="@/assets/img/calculator.svg" alt="" class="q-ml-xs" />
  </q-btn>
  <roi-calculator v-model="RoiDialog" />
</template>

<script lang="ts">
  import RoiCalculator from './RoiCalculator.vue';
  import { defineComponent, ref } from 'vue';
  import { useEmitter } from '@jpool/common/hooks';

  export default defineComponent({
    components: {
      RoiCalculator,
    },
    setup() {
      const RoiDialog = ref(false);

      const emitter = useEmitter();

      emitter.on('closeCalculator', () => {
        RoiDialog.value = false;
      });

      return {
        RoiDialog,
      };
    },
  });
</script>

<style lang="scss">
  .roi-calc-btn {
    height: 46px !important;
    width: 46px !important;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
