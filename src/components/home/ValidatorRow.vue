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
  <div class="validator-row row justify-between q-pb-md relative-position">
    <div class="validator-row__index column q-mr-md justify-center items-center">
      {{ index }}
    </div>
    <div class="validator-row__main-block column no-wrap justify-center relative-position">
      <div class="row justify-between relative-position">
        <div class="validator-row__logo column q-mr-md justify-center relative-position">
          <q-skeleton v-if="loading" type="QAvatar" class="shadow-5" size="60px" />
          <router-link v-else :to="`/app/${item.voter}`">
            <q-avatar class="shadow-1" size="60px">
              <q-img :key="item.voter" :src="item.image" spinner-color="white">
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
        <div class="validator-row__badges row no-wrap absolute">
          <a v-if="!loading && item.inJpool" href="https://jpool.one" target="_blank">
            <img src="@/assets/img/badge-jpool.svg" alt="" class="validator-row__status-badge" />
          </a>
          <a
            v-if="!loading && item.svName && cluster"
            :href="`https://solana.thevalidators.io/d/e-8yEOXMwerfwe/solana-monitoring?orgId=2&refresh=30s&from=now-3h&to=now&var-cluster=${cluster}&var-server=${item.svName}`"
            target="_blank"
          >
            <img src="@/assets/img/badge-svm.svg" alt="" class="validator-row__status-badge" />
          </a>
          <img
            v-if="!loading && item.isDelinquent"
            src="@/assets/img/badge-delinq.svg"
            alt=""
            class="validator-row__status-badge"
          />
        </div>
        <div class="validator-row__name column q-pt-xs justify-start">
          <q-skeleton width="100%" v-if="loading" />
          <div v-else class="q-mt-sm">
            {{ name }}
            <q-tooltip class="text-body2" :class="{ 'break-words': !item.name }">
              {{ name }}
            </q-tooltip>
          </div>
          <q-skeleton width="100%" height="28px" class="q-mt-sm" v-if="loading" />
          <div v-else class="validator-row__name__details">
            {{ item.details }}
            <q-tooltip v-if="item.details" class="text-body2">
              {{ item.details }}
            </q-tooltip>
          </div>
        </div>
        <div class="validator-row__apy column q-pl-md justify-start">
          <q-skeleton width="100%" height="16px" class="q-mt-xs" v-if="loading" />
          <div class="validator-row__apy__fee q-mt-xs" v-else>
            <!-- <span>Commission:</span> <b>{{ item.fee }}</b> -->
            <span>Current APY:</span> <b>{{ item.apyEst }}</b>
          </div>
          <q-skeleton class="q-mt-sm" height="18px" v-if="loading" width="100%" />
          <div class="validator-row__apy__val q-mb-xs" v-else>
            <average-svg :fill="$q.dark.isActive ? '#fff' : '#252B42'" />
            APY: <b>{{ item.apy }}</b>
            <q-tooltip class="text-body2"> Average APY for the previous 3 epochs </q-tooltip>
          </div>
          <q-skeleton class="q-mt-sm" height="10px" v-if="loading" width="100%" />
          <linear-progress v-else :val="item.apyComparedMax" />
        </div>
        <div class="validator-row__apy-chart column q-px-sm justify-start">
          <div class="q-px-sm q-mt-xs" v-if="loading">
            <q-skeleton width="100%" height="60px" class="" />
          </div>
          <apy-chart
            v-else
            :key="item.voter"
            :voter-key="item.voter"
            :show-y-axis="false"
            :show-title="false"
            height="82px"
          />
        </div>
      </div>
      <div
        class="validator-row__addresses q-pt-sm row justify-between q-pb-xs q-pr-md relative-position"
      >
        <q-skeleton
          width="288px"
          height="16px"
          style="max-width: 48%"
          class="q-mt-xs"
          v-if="loading"
        />
        <div class="text-right" v-else>
          <span class="validator-row__address__text">
            {{ item.id }}
            <q-tooltip class="text-body2 break-words"> Identity: {{ item.id }} </q-tooltip>
          </span>
          <copy-to-clipboard :text="item.voter" />
        </div>
        <q-skeleton
          width="296px"
          height="16px"
          style="max-width: 48%"
          class="q-mt-xs"
          v-if="loading"
        />
        <div class="text-right" v-else>
          <span class="validator-row__address__text">
            {{ item.voter }}
            <q-tooltip class="text-body2 break-words"> Vote Account: {{ item.voter }} </q-tooltip>
          </span>
          <copy-to-clipboard :text="item.voter" />
        </div>
      </div>
    </div>
    <div class="validator-row__btns no-wrap column q-pl-md justify-start">
      <div class="row q-mb-xs justify-between">
        <div class="validator-row__stake column justify-start">
          <q-skeleton v-if="loading" width="100%" height="35px" class="q-mt-xs" />
          <div class="column validator-row__stake__values" v-else>
            <div class="validator-row__stake__sol">
              <span class="validator-row__stake__label">TOTAL STAKE:</span>
              <br />
              <b>{{ item.totalSolStacked }}&nbsp;SOL</b>
            </div>
          </div>
          <q-skeleton v-if="loading" width="100%" height="35px" class="q-mt-md" />
          <div class="column validator-row__stake__values" v-else>
            <div class="validator-row__stake__sol validator-row__stake__sol--my q-mt-sm q-pt-sm">
              <span class="validator-row__stake__label">MY STAKE:</span>
              <br />
              <b v-if="!loading && connected">{{ item.myStakeSol }}&nbsp;SOL</b>
              <span v-else>Connect a wallet</span>
            </div>
          </div>
        </div>
        <q-skeleton class="q-mt-xs" v-if="loading" width="106px" height="86px" />
        <router-link v-else :to="`/app/${item.voter}`" custom v-slot="props">
          <q-btn
            v-bind="buttonProps(props)"
            label="Stake now"
            color="warning"
            text-color="primary"
            size="14px"
            padding="11px 32px 7px"
            class="q-mt-xs validator-row__stake-btn"
          />
        </router-link>
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
  import ApyChart from '@/components/staking/charts/ApyChart.vue';
  import LinearProgress from '@/components/home/LinearProgress.vue';
  import AverageSvg from '@/components/icons/AverageSvg.vue';

  export default defineComponent({
    components: { ApyChart, AverageSvg, CopyToClipboard, LinearProgress },
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
      const { connected } = storeToRefs(useWalletStore());
      return {
        connected,
        evaPerson,
        name: props.item.name ?? props.item.id,
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
