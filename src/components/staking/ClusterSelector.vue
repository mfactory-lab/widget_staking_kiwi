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
  <q-btn-dropdown
    class="app-header__cluster-btn"
    :label="filter(cluster)"
    :model-value="false"
    auto-close
    color="text-white"
    text-color="primary"
    rounded
  >
    <q-list>
      <q-item v-for="item in items" :key="item.name" clickable @click="select(item)">
        <q-item-section>
          <q-item-label>
            <b>{{ filter(item.name) }}</b>
          </q-item-label>
          {{ item.url }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts">
  import { computed } from 'vue';
  import { ENDPOINTS } from '@/config';
  import { Endpoint, useConnectionStore, useWalletStore } from '@/store';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const connectionStore = useConnectionStore();
      const walletStore = useWalletStore();
      return {
        items: ENDPOINTS,
        cluster: computed(() => connectionStore.cluster),
        select: (e: Endpoint) => {
          if (!!walletStore.wallet?.publicKey && connectionStore.cluster !== e.name) {
            walletStore.disconnect();
          }
          connectionStore.setCluster(e.name);
        },
        filter: (name: string) => name.replace('-beta', ''),
      };
    },
  });
</script>
