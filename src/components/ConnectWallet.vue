<!--
  - This file is part of Solana Reference Stake Pool code.
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
  <template v-if="connected">
    <q-btn
      class="app-header__wallet-btn"
      :class="$style.btn"
      :ripple="false"
      color="warning"
      text-color="primary"
      rounded
      @click="dialog = true"
    >
      {{ walletShortAddress }}
    </q-btn>
  </template>

  <template v-else>
    <q-btn
      class="app-header__wallet-btn"
      :class="$style.btn"
      :ripple="false"
      color="warning"
      text-color="primary"
      rounded
      @click="connect"
    >
      <span>CONNECT WALLET</span>
    </q-btn>
  </template>

  <q-dialog v-model="dialog">
    <q-card v-if="connected">
      <q-card-section class="relative-position">
        <div class="text-h6 text-center">Your wallet</div>
        <q-btn
          padding="md"
          color="transparent"
          text-color="primary-gray"
          unelevated
          class="absolute-right"
          :icon="icons.close"
          size="md"
          @click="ok"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <copy-to-clipboard :text="walletAddress" />
        {{ walletAddress }}
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-md row justify-between">
          <q-btn outline rounded @click="disconnect"> Disconnect</q-btn>
          <q-btn outline rounded @click="ok"> Ok</q-btn>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-else class="wallet-connect-card">
      <q-card-section>
        <div class="text-h6">Connect to a wallet</div>
        <q-btn
          padding="md"
          color="transparent"
          text-color="primary-gray"
          unelevated
          class="absolute-right"
          :icon="icons.close"
          size="md"
          @click="ok"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll" style="max-height: 70vh">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6" v-for="wallet in wallets" :key="wallet.name">
            <q-item clickable @click="select(wallet)" :disable="!isActiveWallet(wallet)">
              <q-item-section>{{ wallet.name }}</q-item-section>
              <q-item-section avatar>
                <q-avatar square>
                  <img
                    :src="dark.isActive ? wallet.icon : wallet['darkIcon'] ?? wallet.icon"
                    alt=""
                  />
                </q-avatar>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { Wallet, useWallet } from 'solana-wallets-vue';
  import { evaClose } from '@quasar/extras/eva-icons';
  import { WalletReadyState } from '@solana/wallet-adapter-base';
  import { shortenAddress } from '@/utils';
  import ledgerDarkSvg from '@/assets/img/wallets/ledger.svg';
  import mathWalletDarkSvg from '@/assets/img/wallets/mathwallet.svg';
  import { useQuasar } from 'quasar';

  const walletPriority = {
    solflare: 10,
    phantom: 20,
    sollet: 5,
    blocto: 4,
  };

  export default defineComponent({
    setup() {
      const {
        wallets,
        select: selectWallet,
        publicKey,
        connected,
        disconnect,
        connect,
      } = useWallet();
      const walletAddress = computed(() => publicKey.value?.toBase58() ?? '');
      const walletShortAddress = computed(() => shortenAddress(walletAddress.value));

      const dialog = ref(false);

      const { dark } = useQuasar();
      const darkIcons = {
        ledger: ledgerDarkSvg,
        mathwallet: mathWalletDarkSvg,
      };

      function isActiveWallet(wallet: Wallet) {
        return [WalletReadyState.Installed, WalletReadyState.Loadable].includes(wallet.readyState);
      }

      return {
        walletAddress,
        walletShortAddress,
        dialog,
        connected,
        dark,
        wallets: computed(() =>
          [...wallets.value]
            .map((w) => {
              w['darkIcon'] = darkIcons[w.name.toLowerCase()];
              return w;
            })
            .sort((a, b) => {
              const aPriority = walletPriority[a.name.toLowerCase()] ?? 1;
              const bPriority = walletPriority[b.name.toLowerCase()] ?? 1;
              return (
                bPriority - aPriority + ((isActiveWallet(b) ? 1 : 0) - (isActiveWallet(a) ? 1 : 0))
              );
            }),
        ),
        icons: {
          close: evaClose,
        },
        isActiveWallet,
        async select(wallet: Wallet) {
          await selectWallet(wallet.name);
          await connect();
          dialog.value = false;
        },
        connect() {
          dialog.value = true;
        },
        disconnect() {
          disconnect();
          dialog.value = false;
        },
        ok() {
          dialog.value = false;
        },
      };
    },
  });
</script>

<style scoped lang="scss">
  .wallet-connect-card {
    .q-item {
      border: 1px solid #e8e8e8;
    }
  }
</style>

<style lang="scss" module>
  .btn {
    white-space: nowrap;
    flex-wrap: nowrap;

    img {
      height: 0.6em;
      margin-right: 0.2em;
    }
  }
</style>
