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
  <q-card-section
    v-if="$q.screen.gt.sm"
    class="validators-list__list__head validators-list__list-desk__head validator-row row justify-between"
  >
    <div class="validator-row__index column q-mr-md items-center"> # </div>
    <div class="validator-row__name row q-pr-md items-center justify-between">
      <span>VALIDATOR</span>
      <sort-item
        size="xs"
        margin-size="xs"
        param="name"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
      />
    </div>
    <div class="validator-row__apy row q-pl-md q-pr-md items-center justify-between">
      <span>REWARDS</span>
      <sort-item
        size="xs"
        margin-size="xs"
        param="apyNum"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
      />
    </div>
    <div class="validator-row__apy-chart row q-pl-md q-pr-md items-center justify-between">
      <span>APY HISTORY</span>
    </div>
    <div class="validator-row__btns row q-pl-md items-center justify-between">
      <span>TOTAL STAKE</span>
      <sort-item
        size="xs"
        margin-size="xs"
        param="totalStake"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
      />
    </div>
  </q-card-section>
  <q-card-section
    v-else
    class="validators-list__list__head validators-list__list-mob__head validator-row-mob row justify-between"
  >
    <div class="validator-row-mob__index column q-mr-sm items-center"> # </div>
    <div class="validator-row-mob__name row q-pr-sm items-center justify-between">
      <span>NAME</span>
      <sort-item
        size="xs"
        margin-size="xs"
        param="name"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
        :only-desc="$q.screen.lt.sm"
      />
    </div>
    <div class="validator-row-mob__apy row q-pl-sm q-pr-sm items-center justify-between">
      <span>APY</span>
      <sort-item
        size="xs"
        margin-size="xs"
        param="apyNum"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
        :only-desc="$q.screen.lt.sm"
      />
    </div>
    <div class="validator-row-mob__stake row q-pl-sm items-center justify-between">
      <span>STAKE</span>
      <sort-item
        size="xs"
        margin-size="xs"
        param="totalStake"
        @sort="sort"
        :current-param="sortParam"
        :current-type="sortType"
        :only-desc="$q.screen.lt.sm"
      />
    </div>
  </q-card-section>
</template>

<script lang="ts">
  import { defineComponent, toRef } from 'vue';
  import { useValidatorsAllStore } from '@/store';

  export default defineComponent({
    setup() {
      const validatorsAllStore = useValidatorsAllStore();
      const sortType = toRef(validatorsAllStore, 'sortType');
      const sortParam = toRef(validatorsAllStore, 'sortParam');

      return {
        sortType,
        sortParam,
        sort: (param, type) => {
          sortParam.value = param;
          sortType.value = type;
        },
      };
    },
  });
</script>
