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
    :label="endpoint.name"
    :model-value="false"
    :ripple="false"
    auto-close
    color="primary"
    text-color="text-white"
    padding="5px 16px 3px"
    size="11px"
    rounded
  >
    <q-list class="cluster-selector__list">
      <q-item v-for="item in items" :key="item.name" clickable @click="select(item)">
        <q-item-section>
          <q-item-label>
            <b>{{ item.name }}</b>
          </q-item-label>
          {{ item.url }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useWallet } from 'solana-wallets-vue';
  import { ENDPOINTS } from '@/config';
  import { Endpoint, useConnectionStore } from '@/store';

  export default defineComponent({
    setup() {
      const connectionStore = useConnectionStore();
      const { connected, connect, disconnect, autoConnect } = useWallet();
      return {
        items: ENDPOINTS,
        endpoint: computed(() => connectionStore.endpoint),
        select: (e: Endpoint) => {
          if (connected && connectionStore.cluster !== e.cluster) {
            disconnect();
            if (autoConnect.value) {
              connect();
            }
          }
          connectionStore.setRpc(e.id);
        },
      };
    },
  });
</script>
