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
  <div class="epoch row justify-center">
    <div class="column items-center">
      <div class="epoch__title">Epoch {{ epochNumber }}</div>
      <div class="epoch__label">estimated time remaining</div>
      <div class="epoch__value">{{ time.h }}h {{ time.m }}m {{ time.s }}s</div>
    </div>
    <q-circular-progress
      show-value
      class="q-ml-md q-my-auto epoch__progress"
      :value="epochProgress"
      size="70px"
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
  import { storeToRefs } from 'pinia';
  import { computed, defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const { epochTimeRemaining, epochProgress, epochNumber } = storeToRefs(useEpochStore());
      return {
        epochNumber,
        epochProgress: computed(() => Number(epochProgress.value)),
        time: computed(() => {
          const timeInMs = epochTimeRemaining.value;
          const _h = timeInMs / 1000 / 60 / 60;
          const h = Math.floor(_h);
          const m = Math.floor((_h - h) * 60);
          const s = Math.ceil(((_h - h) * 60 - m) * 60);
          return { h, m: m < 10 ? `0${m}` : m, s: s < 10 ? `0${s}` : s };
        }),
      };
    },
  });
</script>

<style scoped lang="scss">
  .epoch {
    &__label {
      color: $primary;
      font-size: 12px;
      line-height: 16px;
    }

    &__title {
      font-weight: 500;
      font-size: 30px;
      line-height: 35px;
      text-transform: uppercase;
      color: $accent;
    }

    &__value {
      color: $primary;
      font-size: 22px;
      line-height: 26px;
    }

    &__number {
      color: #000;
      font-size: 18px;
    }
  }
</style>
