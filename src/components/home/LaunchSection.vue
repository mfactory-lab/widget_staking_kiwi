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
  <section class="launch-section">
    <div class="container">
      <div class="section-title text-center text-primary"
        >Validator launch timeline by blockchain
      </div>
      <div class="section-subtitle text-center"
        >We plan to launch following launch in 2021–2023:</div
      >
    </div>
    <div class="column">
      <launch-validator-pair v-for="(pair, index) in launchPairs" :key="index" :items="pair" />
    </div>
    <div class="launch-section__b-block"></div>
  </section>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import LaunchValidatorPair from '@/components/home/LaunchValidatorPair.vue';
  import { Validator } from '@utils/launch-validators';
  import { useLaunchValidators } from '@/hooks/launch-validators';

  export default defineComponent({
    components: { LaunchValidatorPair },
    props: {
      color: {
        type: String,
      },
    },
    setup() {
      const { launchValidators } = useLaunchValidators();
      return {
        launchPairs: computed(() => {
          const arr: Validator[][] = [];
          let tempArr: Validator[] = [];
          launchValidators.value.forEach((item, index) => {
            tempArr.push(item);
            if (index % 2) {
              arr.push(tempArr);
              tempArr = [];
            }
          });
          return arr;
        }),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .launch-section {
    .section-title {
      margin: 48px 0;
      @media (max-width: $breakpoint-xs) {
        margin: 16px 0;
      }
    }
    .section-subtitle {
      margin-bottom: 48px;
      @media (max-width: $breakpoint-xs) {
        margin-bottom: 16px;
      }
    }
    &__validator-box {
      padding-bottom: 24px;
      @media (min-width: $breakpoint-sm) {
        border-right: 1px solid#CFCFCF;
      }
    }
    &__square-link {
      border-radius: 15px;
      width: 110px;
      height: 120px;
      margin-right: 4px;
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
    &__b-block {
      height: 150px;
      background: $accent;
      @media (max-width: $breakpoint-sm) {
        margin-top: 50px;
      }
      @media (max-width: $breakpoint-xs) {
        height: 70px;
        margin-top: 24px;
      }
    }
  }
</style>
