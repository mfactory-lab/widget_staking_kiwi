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
  <section class="validators-section">
    <div class="container">
      <div class="row justify-center">
        <div
          class="column col-12 col-md-6 items-center items-md-end q-pr-md-xl validators-section__validator-box"
        >
          <validator
            title="SOLANA NETWORK validator"
            :icon="solIcon"
            :link="{
              href: 'https://solstake.io/#/app/validator/DPmsofVJ1UMRZADgwYAHotJnazMwohHzRHSoomL6Qcao',
              label: 'STAKE SOL NOW',
              color: 'accent',
            }"
          />
          <div class="row justify-between">
            <q-btn
              v-for="(item, index) in squareLinks"
              :key="index"
              type="a"
              :href="item.href"
              target="_blank"
              rounded
              color="text-white"
              text-color="primary"
              size="12px"
              padding="sm"
              class="validators-section__square-link"
            >
              <div class="column items-center justify-center">
                <img :src="item.icon" alt="" class="q-mt-xs" />
                <div class="text-center q-mt-sm">{{ item.label }}</div>
              </div>
            </q-btn>
          </div>
        </div>
        <div class="column col-12 col-md-6 items-center items-md-start q-pl-md-xl">
          <validator
            title="NEAR NETWORK validator"
            :icon="nearIcon"
            :link="{
              href: 'https://explorer.near.org/accounts/jstaking.poolv1.near',
              label: 'STAKE NEAR',
              color: 'dark',
            }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Validator from '@/components/home/Validator.vue';
  import solIcon from '@/assets/img/sol-logo-round.svg';
  import nearIcon from '@/assets/img/near-logo.svg';
  import monitoringIcon from '@/assets/img/monitor-icon.svg';
  import rackingIcon from '@/assets/img/racking-icon.svg';
  import statisticsIcon from '@/assets/img/stat-icon.svg';

  export default defineComponent({
    components: { Validator },
    props: {
      color: {
        type: String,
      },
    },
    setup() {
      return {
        solIcon,
        nearIcon,
        squareLinks: [
          {
            icon: monitoringIcon,
            label: 'monitoring',
            href: 'https://solana.thevalidators.io/d/e-8yEOXMwerfwe/solana-monitoring?orgId=2&refresh=30s&from=now-1h&to=now&var-cluster=mainnet-beta&var-server=joogh-mainnet-hetzner',
          },
          {
            icon: rackingIcon,
            label: 'rating',
            href: 'https://www.validators.app/validators/8yjHdsCgx3bp2zEwGiWSMgwpFaCSzfYAHT1vk7KJBqhN?locale=en&network=mainnet&order=&refresh=',
          },
          {
            icon: statisticsIcon,
            label: 'statistics',
            href: 'https://solanabeach.io/validator/DPmsofVJ1UMRZADgwYAHotJnazMwohHzRHSoomL6Qcao',
          },
        ],
      };
    },
  });
</script>

<style lang="scss" scoped>
  .validators-section {
    padding: 24px 0 0;

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
  }
</style>
