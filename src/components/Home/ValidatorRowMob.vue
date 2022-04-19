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
  <router-link :to="`/app/${item.voter}`">
    <div class="validator-row-mob row justify-between q-pb-md relative-position">
      <div class="validator-row-mob__index column q-mr-sm justify-center items-center">
        {{ index }}
      </div>
      <div class="validator-row-mob__logo column q-mr-sm justify-center relative-position">
        <q-skeleton v-if="loading" type="QAvatar" class="shadow-5" size="34px" />
        <router-link v-else :to="`/app/${item.voter}`">
          <q-avatar class="shadow-1" size="34px">
            <q-img :key="item.voter" :src="item.image" spinner-size="20px" spinner-color="white">
              <template #default v-if="!item.image">
                <q-icon :name="evaPerson" />
              </template>
              <template #error>
                <q-icon :name="evaPerson" />
              </template>
            </q-img>
          </q-avatar>
        </router-link>
      </div>
      <div class="validator-row-mob__name column justify-start">
        <q-skeleton width="100%" class="q-mt-xs" height="16px" v-if="loading" />
        <div v-else class="q-mt-xs q-mr-sm">
          {{ name }}
          <q-tooltip class="text-body2" :class="{ 'break-words': !item.name }">
            {{ name }}
          </q-tooltip>
        </div>
      </div>
      <div class="validator-row-mob column no-wrap relative-position">
        <div class="row justify-between relative-position">
          <div class="validator-row-mob__apy column q-pl-sm justify-start">
            <q-skeleton class="q-mt-xs" height="16px" v-if="loading" width="100%" />
            <div class="validator-row-mob__apy__val q-mr-auto q-mt-xs" v-else>
              <b>{{ item.apy }}</b>
              <q-tooltip class="text-body2"> Average APY for the previous 3 epochs </q-tooltip>
            </div>
          </div>
          <div class="validator-row-mob__stake no-wrap column q-pl-sm q-mr-sm justify-start">
            <div class="row justify-between">
              <div class="validator-row-mob__stake column justify-start">
                <q-skeleton v-if="loading" width="100%" height="16px" class="q-mt-xs" />
                <div class="column validator-row-mob__stake__values q-mt-xs" v-else>
                  <div class="validator-row-mob__stake__sol">
                    <b class="sol-xs">{{ item.totalSolStacked }}&nbsp;SOL</b>
                    <b class="sol-xxs">{{ item.totalSolStacked.split('.')[0] }}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-skeleton v-if="loading" width="140px" height="16px" class="q-ml-sm q-mt-xs" />
        <div class="validator-row-mob__fee column q-mt-xs justify-start" v-else>
          Commission: {{ item.fee }}
        </div>
      </div>
      <div class="validator-row-mob__badges row no-wrap absolute">
        <a
          v-if="!loading && item.inJpool"
          href="https://jpool.one"
          class="row q-mr-sm"
          target="_blank"
        >
          <q-badge class="validator-row-mob__status-badge" color="warning" text-color="primary">
            JPOOL
          </q-badge>
        </a>
        <a
          v-if="!loading && item.svName && cluster"
          class="row q-mr-sm"
          :href="`https://solana.thevalidators.io/d/e-8yEOXMwerfwe/solana-monitoring?orgId=2&refresh=30s&from=now-3h&to=now&var-cluster=${cluster}&var-server=${item.svName}`"
          target="_blank"
        >
          <q-badge class="validator-row-mob__status-badge" color="accent" text-color="text-white">
            SVT MEMBER
          </q-badge>
        </a>
        <q-badge
          v-if="!loading && item.isDelinquent"
          class="validator-row-mob__status-badge"
          color="negative"
          text-color="text-white"
        >
          DELINQUENT FOR
          {{ delinquentTime.split(' ')[0] }}
          <q-tooltip class="text-body2">
            Delinquent for
            {{ delinquentTime }}
          </q-tooltip>
        </q-badge>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { evaPerson } from '@quasar/extras/eva-icons';
  import { shortenAddress } from '@jpool/common/utils';
  import { useWallet } from 'solana-wallets-vue';
  import { isoTimeDifference } from '@/utils';
  import { DELINQ_UPDATE_EVENT } from '@/store';
  import { useEmitter } from '@jpool/common/hooks';

  export default defineComponent({
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      item: {
        type: Object,
        required: true,
      },
      cluster: {
        type: String,
      },
      index: {
        type: Number,
      },
    },
    setup(props) {
      const delinquentTime = ref(
        props.item.isDelinquent ? isoTimeDifference(props.item.lastVote) : '',
      );
      const emitter = useEmitter();
      const { connected } = useWallet();
      if (props.item.isDelinquent) {
        emitter.on(DELINQ_UPDATE_EVENT, () => {
          delinquentTime.value = isoTimeDifference(props.item.lastVote);
        });
      }
      return {
        connected,
        evaPerson,
        name: props.item.name ?? props.item.id,
        buttonProps({ href }) {
          return {
            to: href,
          };
        },
        shortAddress: props.item?.voter ? shortenAddress(props.item.voter, 7) : '',
        delinquentTime,
      };
    },
  });
</script>
