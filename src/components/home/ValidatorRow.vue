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
  <div class="validator-row row justify-between q-pb-md">
    <div class="validator-row__logo column q-mr-md q-mt-sm justify-center">
      <q-skeleton v-if="loading" type="QAvatar" class="shadow-5" size="60px" />
      <a v-else :href="item.url" target="_blank">
        <q-avatar class="shadow-1" size="60px">
          <q-img :src="item.image" spinner-color="white">
            <template #default v-if="!item.image">
              <q-icon :name="evaPerson" />
            </template>
            <template #error>
              <q-icon :name="evaPerson" />
            </template>
          </q-img>
        </q-avatar>
      </a>
    </div>
    <div class="validator-row__name column q-mr-sm q-mt-sm justify-start">
      <q-skeleton width="100%" v-if="loading" />
      <div v-else class="q-mt-xs">
        {{ item.name }}
        <q-tooltip class="text-body2">
          {{ item.name }}
        </q-tooltip>
      </div>
      <q-skeleton width="100%" class="q-mt-sm" v-if="loading" />
      <div v-else class="validator-row__name__details q-mt-xs">
        {{ item.details }}
        <q-tooltip class="text-body2">
          {{ item.details }}
        </q-tooltip>
      </div>
    </div>
    <div class="validator-row__apy column q-mr-sm q-mt-sm justify-start">
      <q-skeleton width="100%" v-if="loading" />
      <div class="validator-row__apy__fee q-mt-xs" v-else>
        Fee: <b>{{ item.fee }}</b>
      </div>
      <q-skeleton class="q-mt-sm" v-if="loading" width="100%" />
      <div class="validator-row__apy__val" v-else>
        APY: <b>{{ item.apy }}</b>
      </div>
    </div>
    <div class="validator-row__btns column q-mt-sm justify-start">
      <div class="row justify-between">
        <div class="validator-row__stake column q-mr-sm justify-start">
          <q-skeleton v-if="loading" width="100%" />
          <div class="column validator-row__stake__values q-mt-xs" v-else>
            <div class="validator-row__stake__sol"
              ><span>TOTAL:</span> <b>{{ item.totalSolStacked }}&nbsp;SOL</b></div
            >
          </div>
        </div>
        <q-skeleton class="" v-if="loading" width="106px" />
        <router-link v-else :to="`/app/${item.voter}`" custom v-slot="props">
          <q-btn
            v-bind="buttonProps(props)"
            rounded
            label="Stake"
            color="warning"
            text-color="primary"
            size="14px"
            padding="5px 32px 7px"
            class="q-mt-xs home-page__std-btn"
          />
        </router-link>
      </div>
      <q-skeleton width="377px" style="max-width: 100%" class="q-mt-sm q-ml-sm" v-if="loading" />
      <div class="text-right q-mt-xs" v-else>
        <span class="validator-item__address__text">{{ item.voter }}</span>
        <copy-to-clipboard :text="item.voter" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { evaPerson } from '@quasar/extras/eva-icons';
  import { shortenAddress } from '@jpool/common/utils';
  import { storeToRefs } from 'pinia';
  import { useWalletStore } from '@/store';
  import CopyToClipboard from '@/components/CopyToClipboard.vue';

  export default defineComponent({
    components: { CopyToClipboard },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      item: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const { connected } = storeToRefs(useWalletStore());
      return {
        connected,
        evaPerson,
        buttonProps({ href }) {
          const props = {
            to: href,
          };
          return props;
        },
        shortAddress: computed(() =>
          props.item?.voter ? shortenAddress(props.item.voter, 7) : '',
        ),
      };
    },
  });
</script>
