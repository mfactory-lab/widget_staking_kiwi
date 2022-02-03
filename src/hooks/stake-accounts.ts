/*
 * This file is part of the Web3 Library developed by mFactory GmbH.
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

import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Authorized, LAMPORTS_PER_SOL, PublicKey, StakeProgram } from '@solana/web3.js';
import {
  sendTransaction,
  useConnectionStore,
  useStakeAccountStore,
  useStakePoolStore,
  useValidatorJstakingStore,
  useWalletStore,
} from '@/store';
import { useMonitorTransaction } from '@jpool/common/hooks/monitor';

export function useStakeAccounts() {
  const connectionStore = useConnectionStore();
  const { lamportsPerSignature } = storeToRefs(useStakePoolStore());
  const walletStore = useWalletStore();
  const { wallet, walletPubKey, connected } = storeToRefs(walletStore);
  const { monitorTransaction, sending } = useMonitorTransaction();
  const { notify } = useQuasar();
  const loading = ref(false);
  const seed = ref('0');
  const stakeAccountStore = useStakeAccountStore();
  const { voterKey } = storeToRefs(useValidatorJstakingStore());

  const findFirstAvailableSeed = async () => {
    let seedIndex = 0;
    if (!walletPubKey.value) return;
    const STAKE_PROGRAM_ID = new PublicKey('Stake11111111111111111111111111111111111111');
    while (1) {
      const newStakeAccountPubkey = await PublicKey.createWithSeed(
        walletPubKey.value,
        seedIndex.toString(),
        STAKE_PROGRAM_ID,
      );
      const matching = stakeAccountStore.data.find((meta) =>
        newStakeAccountPubkey.equals(meta.pubkey),
      );
      if (!matching) {
        break;
      }
      seedIndex++;
    }
    seed.value = seedIndex.toString();
  };

  const delegateAccount = async (stakePubkey) => {
    if (!walletPubKey.value) {
      return;
    }
    try {
      const transaction = StakeProgram.delegate({
        stakePubkey,
        authorizedPubkey: walletPubKey.value,
        votePubkey: new PublicKey(voterKey.value),
      });

      await monitorTransaction(
        sendTransaction(connectionStore.connection, wallet.value!, transaction.instructions, []),
        {
          onSuccess: async () => {
            await stakeAccountStore.load();
          },
          onError: () => {},
        },
      );
    } catch (e: any) {
      notify({ message: e.message, type: 'negative' });
      throw e;
    }
  };

  return {
    depositFee: computed(() => (connected.value ? lamportsPerSignature.value : 0)),
    creating: computed(() => loading.value || sending.value),
    createAccount: async (amount) => {
      if (!walletPubKey.value) {
        return;
      }
      try {
        loading.value = true;
        await findFirstAvailableSeed();
        const stakePubkey = await PublicKey.createWithSeed(
          walletPubKey.value,
          seed.value,
          StakeProgram.programId,
        );

        const transaction = StakeProgram.createAccountWithSeed({
          fromPubkey: walletPubKey.value,
          stakePubkey,
          basePubkey: walletPubKey.value,
          seed: seed.value,
          authorized: new Authorized(walletPubKey.value, walletPubKey.value),
          lamports: LAMPORTS_PER_SOL * amount,
        });

        const transactionDelegate = StakeProgram.delegate({
          stakePubkey,
          authorizedPubkey: walletPubKey.value,
          votePubkey: new PublicKey(voterKey.value),
        });

        await monitorTransaction(
          sendTransaction(
            connectionStore.connection,
            wallet.value!,
            [...transaction.instructions, ...transactionDelegate.instructions],
            [],
          ),
          {
            onSuccess: async () => {
              await stakeAccountStore.load();
            },
            onError: () => {},
          },
        );
      } catch (e: any) {
        notify({ message: e.message, type: 'negative' });
        throw e;
      } finally {
        loading.value = false;
      }
    },
    delegateAccount,
  };
}
