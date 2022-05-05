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
import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
import { Authorized, LAMPORTS_PER_SOL, PublicKey, StakeProgram } from '@solana/web3.js';
import {
  ProgramAccount,
  useConnectionStore,
  useStakeAccountStore,
  useStakePoolStore,
  useValidatorJstakingStore,
} from '@/store';
import { useMonitorTransaction } from '@/hooks';
import { sendTransaction } from '@/utils';

const findFirstAvailableSeed = async (
  publicKey: PublicKey,
  stakeAccounts: ProgramAccount[],
): Promise<string> => {
  let seedIndex = 0;
  if (!publicKey) return '';
  while (1) {
    const newStakeAccountPubkey = await PublicKey.createWithSeed(
      publicKey,
      seedIndex.toString(),
      StakeProgram.programId,
    );
    const matching = stakeAccounts.find((meta) => newStakeAccountPubkey.equals(meta.pubkey));
    if (!matching) {
      break;
    }
    seedIndex++;
  }
  return seedIndex.toString();
};

export function useStakeAccounts() {
  const connectionStore = useConnectionStore();
  const stakeAccountStore = useStakeAccountStore();
  const validatorJstakingStore = useValidatorJstakingStore();
  const stakePoolStore = useStakePoolStore();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { monitorTransaction, sending } = useMonitorTransaction();
  const { notify } = useQuasar();

  const loading = ref(false);
  const seed = ref('0');
  const stakeSuccessDialog = ref(false);

  const lamportsPerSignature = computed(() => stakePoolStore.lamportsPerSignature);
  const voterKey = computed(() => validatorJstakingStore.voterKey);

  const delegateAccount = async (stakePubkey) => {
    if (!publicKey.value) {
      return;
    }
    try {
      const transaction = StakeProgram.delegate({
        stakePubkey,
        authorizedPubkey: publicKey.value,
        votePubkey: new PublicKey(voterKey.value),
      });

      await monitorTransaction(
        sendTransaction(
          connectionStore.connection,
          anchorWallet.value!,
          transaction.instructions,
          [],
        ),
        {
          commitment: 'finalized',
          onSuccess: async () => {
            await stakeAccountStore.load({
              // delay: 3000,
            });
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
    stakeSuccessDialog,
    depositFee: computed(() => lamportsPerSignature.value),
    creating: computed(() => loading.value || sending.value),
    createAccount: async (amount) => {
      if (!publicKey.value) {
        return;
      }
      try {
        loading.value = true;
        seed.value = await findFirstAvailableSeed(publicKey.value, stakeAccountStore.data);
        const stakePubkey = await PublicKey.createWithSeed(
          publicKey.value,
          seed.value,
          StakeProgram.programId,
        );

        const transaction = StakeProgram.createAccountWithSeed({
          fromPubkey: publicKey.value,
          stakePubkey,
          basePubkey: publicKey.value,
          seed: seed.value,
          authorized: new Authorized(publicKey.value, publicKey.value),
          lamports: LAMPORTS_PER_SOL * amount,
        });

        const transactionDelegate = StakeProgram.delegate({
          stakePubkey,
          authorizedPubkey: publicKey.value,
          votePubkey: new PublicKey(voterKey.value),
        });

        await monitorTransaction(
          sendTransaction(
            connectionStore.connection,
            anchorWallet.value!,
            [...transaction.instructions, ...transactionDelegate.instructions],
            [],
          ),
          {
            commitment: 'finalized',
            onSuccess: async () => {
              stakeSuccessDialog.value = true;
              await stakeAccountStore.load({
                // delay: 3000,
              });
            },
            onError: async () => {},
          },
        );
      } catch (e: any) {
        notify({ message: e.message, type: 'negative' });
        throw e;
      } finally {
        await stakeAccountStore.load();
        loading.value = false;
      }
    },
    delegateAccount,
  };
}
