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
  <div class="validators-list__title q-pt-md q-pb-sm row">
    <div class="col-auto row nowrap justify-start q-mr-auto">
      <q-btn
        rounded
        class="home-page__std-btn q-pl-sm"
        color="gray-dark-theme"
        text-color="text-white"
        :disable="connectionLost"
        :ripple="false"
        padding="4px 17px"
        @click="refresh"
      >
        REFRESH <br v-if="$q.screen.lt.md" />
        LIST
      </q-btn>
    </div>
    <div class="validators-list__title__text col-6 text-center">
      <span class="validators-list__title__text--light">
        {{ $q.screen.gt.sm ? 'Solana' : '' }} Validators
      </span>
      <span class="validators-list__title__text--strong" v-if="!loading">
        {{ items.length }} / {{ itemsTotal }}
      </span>
    </div>
    <div class="col-auto row items-center justify-end q-ml-auto">
      <q-btn
        v-if="$q.screen.gt.sm"
        rounded
        class="home-page__std-btn"
        color="gray-dark-theme"
        text-color="text-white"
        :disable="connectionLost"
        :ripple="false"
        padding="4px 17px"
        @click="() => (showControls = !showControls)"
      >
        {{ showControls ? 'HIDE' : 'SHOW' }} FILTERS
      </q-btn>
      <q-btn
        v-if="$q.screen.lt.md"
        rounded
        class="home-page__std-btn"
        color="gray-dark-theme"
        text-color="text-white"
        :disable="connectionLost"
        padding="4px 17px"
        @click="() => (showControlsMob = !showControlsMob)"
      >
        {{ showControlsMob ? 'HIDE' : 'SHOW' }} <br v-if="$q.screen.lt.md" />
        FILTERS
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRef } from 'vue';
  import { useWallet } from 'solana-wallets-vue';
  import { useStakePoolStore, useValidatorsAllStore } from '@/store';

  export default defineComponent({
    setup() {
      const { connected } = useWallet();
      const stakePoolStore = useStakePoolStore();
      const validatorsAllStore = useValidatorsAllStore();

      const connectionLost = toRef(stakePoolStore, 'connectionLost');
      const itemsTotal = toRef(validatorsAllStore, 'itemsTotal');
      const items = toRef(validatorsAllStore, 'items');
      const loading = toRef(validatorsAllStore, 'loading');
      const showControls = toRef(validatorsAllStore, 'showControls');
      const showControlsMob = toRef(validatorsAllStore, 'showControlsMob');

      const refresh = async () => {
        validatorsAllStore.loadAllValidators();
        validatorsAllStore.loadAverageApy();
      };

      return {
        connected,
        connectionLost,
        loading,
        items,
        itemsTotal,
        showControls,
        showControlsMob,
        refresh,
      };
    },
  });
</script>
