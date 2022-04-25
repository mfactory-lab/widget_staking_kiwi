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
  <div
    v-show="($q.screen.gt.sm && showControls) || ($q.screen.lt.md && showControlsMob)"
    class="row q-mt-md"
    :class="{ 'justify-start': $q.screen.lt.md, 'justify-between': $q.screen.gt.sm }"
  >
    <div class="row validators-list__filters q-mb-md" :class="{ 'q-mr-md': $q.screen.gt.sm }">
      <div class="column q-ml-md q-my-xs">
        <div class="validators-list__dropdown-label q-mb-xs">Hide Private</div>
        <q-toggle
          v-model="filters.private"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          size="40px"
          toggle-order="tf"
          color="primary"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Hide Top Staked</div>
        <q-toggle
          v-model="filters.top33"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="primary"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Hide with Commission</div>
        <q-toggle
          v-model="filters.withFee"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="primary"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Hide Anonymous</div>
        <q-toggle
          v-model="filters.noname"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="primary"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Hide Delinquent</div>
        <q-toggle
          v-model="filters.delinquent"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="red-dark"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
    </div>
    <div class="row validators-list__filters q-mb-md" :class="{ 'q-mr-md': $q.screen.gt.sm }">
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">JPool members</div>
        <q-toggle
          v-model="filters.onlyJpool"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="warning"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">SVT members</div>
        <q-toggle
          v-model="filters.onlySvm"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="accent"
          keep-color
          label=""
          unchecked-icon="eva-close-outline"
        />
      </div>
      <div v-if="$q.screen.lt.md" class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Show my Stake</div>
        <q-toggle
          v-model="filters.hasStake"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="secondary"
          keep-color
          label=""
          :disable="!connected"
          unchecked-icon="eva-close-outline"
        />
        <q-tooltip v-if="!connected" class="text-body2">Available with connected wallet</q-tooltip>
      </div>
    </div>
    <div v-if="$q.screen.gt.sm" class="row validators-list__filters q-mb-md">
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Show my Stake</div>
        <q-toggle
          v-model="filters.hasStake"
          class="styled-toggle"
          checked-icon="eva-checkmark-outline"
          toggle-order="tf"
          color="secondary"
          keep-color
          label=""
          :disable="!connected"
          unchecked-icon="eva-close-outline"
        />
        <q-tooltip v-if="!connected" class="text-body2">Available with connected wallet</q-tooltip>
      </div>
    </div>
  </div>

  <div
    v-show="($q.screen.gt.sm && showControls) || ($q.screen.lt.md && showControlsMob)"
    class="q-pt-sm q-pb-sm row"
  >
    <q-input
      v-model="nameFilter"
      class="q-mb-xs q-mt-sm col-grow validators-list__search"
      :class="{ 'full-width': $q.screen.lt.sm }"
      label="Search"
      placeholder="Enter a validator name, identity or vote key"
      stack-label
    />

    <div
      v-show="$q.screen.gt.sm && showControls"
      class="row q-ml-auto q-my-xs col-sm-auto"
      :class="{ 'justify-between': $q.screen.lt.sm }"
    >
      <div class="q-ml-lg"></div>
      <sort-item
        title="Sort by APY"
        param="apyNum"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
      />
      <sort-item
        title="Sort by Stake"
        param="totalStake"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
        add-class="q-ml-lg"
      />
    </div>
    <!-- <div v-if="$q.screen.gt.sm" class="row justify-end q-ml-lg">
      <div class="column q-my-xs q-ml-md">
        <div class="validators-list__dropdown-label q-mb-xs">Per page</div>
        <q-btn-dropdown
          class=""
          :label="perPage"
          :model-value="false"
          auto-close
          text-color="text-white"
          color="primary"
          padding="9px 12px 7px"
        >
          <q-list>
            <q-item
              v-for="item in perPageOptions"
              :key="item"
              clickable
              @click="perPage = item"
            >
              <q-item-section>
                {{ item }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, toRef } from 'vue';
  import { useConnectionStore, useValidatorsAllStore } from '@/store';
  import { useWallet } from 'solana-wallets-vue';

  export default defineComponent({
    setup() {
      const connectionStore = useConnectionStore();
      const { connected } = useWallet();

      const validatorsAllStore = useValidatorsAllStore();
      const filters = toRef(validatorsAllStore, 'filters');
      const sortType = toRef(validatorsAllStore, 'sortType');
      const sortParam = toRef(validatorsAllStore, 'sortParam');
      const nameFilter = toRef(validatorsAllStore, 'nameFilter');
      const showControls = toRef(validatorsAllStore, 'showControls');
      const showControlsMob = toRef(validatorsAllStore, 'showControlsMob');

      const cluster = computed(() => connectionStore.cluster);

      return {
        connected,
        sortType,
        sortParam,
        nameFilter,
        filters,
        cluster,
        showControls,
        showControlsMob,
        sort: (param, type) => {
          sortParam.value = param;
          sortType.value = type;
        },
      };
    },
  });
</script>
