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
  <section class="launch-section q-pt-lg">
    <div class="container">
      <div class="section-title text-center text-primary q-my-xl"
        >Validator launch timeline by blockchain
      </div>
      <div class="section-subtitle text-center q-mb-xl"
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
  import ethIcon from '@/assets/img/eth.svg';
  import dotIcon from '@/assets/img/dot.svg';
  import atomIcon from '@/assets/img/atom.svg';
  import terraIcon from '@/assets/img/terra.svg';
  import nearIcon from '@/assets/img/near-logo.svg';
  import minaIcon from '@/assets/img/mina.svg';

  interface Validator {
    title: string;
    icon: string;
    apy: number;
    cap: number;
  }

  export default defineComponent({
    components: { LaunchValidatorPair },
    props: {
      color: {
        type: String,
      },
    },
    setup() {
      //TODO: make real values
      const validators: Validator[] = [
        {
          title: 'Etherium 2.0',
          icon: ethIcon,
          apy: 0.05,
          cap: 462764000000,
        },
        {
          title: 'Polkadot',
          icon: dotIcon,
          apy: 0.14,
          cap: 32234000000,
        },
        {
          title: 'Cosmos',
          icon: atomIcon,
          apy: 0.1,
          cap: 5512000000,
        },
        {
          title: 'Terra',
          icon: terraIcon,
          apy: 0.11,
          cap: 12164000000,
        },
        {
          title: 'Near',
          icon: nearIcon,
          apy: 0.11,
          cap: 2312000000,
        },
        {
          title: 'Mina',
          icon: minaIcon,
          apy: 0.12,
          cap: 804000000,
        },
      ];
      return {
        launchPairs: computed(() => {
          const arr: Validator[][] = [];
          let tempArr: Validator[] = [];
          validators.forEach((item, index) => {
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
    }
  }
</style>
