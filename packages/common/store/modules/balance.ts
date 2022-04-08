/*
 * This file is part of Solana Reference Stake Pool code.
 *
 * Copyright © 2021, mFactory GmbH
 *
 * Solana Reference Stake Pool is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Solana Reference Stake Pool is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 * If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 *
 * You can be released from the requirements of the Affero GNU General Public License
 * by purchasing a commercial license. The purchase of such a license is
 * mandatory as soon as you develop commercial activities using the
 * Solana Reference Stake Pool code without disclosing the source code of
 * your own applications.
 *
 * The developer of this program can be contacted at <info@mfactory.ch>.
 */

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Buffer } from 'buffer';
import { debounce } from 'lodash-es';
import { useWallet } from 'solana-wallets-vue';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { useConnectionStore, useStakePoolStore } from '@/store';
import { findAssociatedTokenAddress, lamportsToSol } from '@jpool/common/utils';
import { ACCOUNT_CHANGE_EVENT, WALLET_DISCONNECT_EVENT, useEmitter } from '@jpool/common/hooks';

export const useBalanceStore = defineStore('balance', () => {
  const connectionStore = useConnectionStore();
  const stakePoolStore = useStakePoolStore();
  const { wallet, connected } = useWallet();
  const emitter = useEmitter();

  const nativeBalance = ref(0);
  const hasTokenAccount = ref<boolean>(false);
  const tokenBalance = ref(0);

  const stakePool = computed(() => stakePoolStore.stakePool);

  const _onAccountChange = debounce(async function (acc: AccountInfo<Buffer> | null) {
    nativeBalance.value = acc?.lamports ?? 0;
    console.log(`SOL Balance: ${nativeBalance.value}`);
    await _getTokenBalance();
    console.log(`Token Balance: ${tokenBalance.value}`);
  }, 300);

  async function _getTokenBalance() {
    const walletPubKey = wallet.value?.publicKey;
    const stakePoolMint = stakePool.value?.poolMint;
    if (!walletPubKey || !stakePoolMint) {
      return;
    }
    const balance = await getTokenBalance(connectionStore.connection, walletPubKey, stakePoolMint);
    hasTokenAccount.value = balance !== null;
    tokenBalance.value = balance ?? 0;
  }

  emitter.on(ACCOUNT_CHANGE_EVENT, _onAccountChange);
  emitter.on(WALLET_DISCONNECT_EVENT, () => {
    nativeBalance.value = 0;
    tokenBalance.value = 0;
  });

  watch(
    [connected, wallet],
    async ([c, w]) => {
      if (c && w?.publicKey) {
        connectionStore.connection.getAccountInfo(w.publicKey).then(_onAccountChange);
      }
    },
    { immediate: true },
  );

  const solBalance = computed(() => lamportsToSol(nativeBalance.value));

  return {
    hasTokenAccount,
    tokenBalance,
    nativeBalance,
    solBalance,
  };
});

/**
 * Gets TokenAccountBalance from the associated token account
 */
export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  mint: PublicKey,
): Promise<number | null> {
  try {
    const associatedTokenAcc = await findAssociatedTokenAddress(walletAddress, mint);
    const tBalance = await connection.getTokenAccountBalance(associatedTokenAcc);
    return tBalance.value.uiAmount;
  } catch (ex) {
    // No token account found
    return null;
  }
}
