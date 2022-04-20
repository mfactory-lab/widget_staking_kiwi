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

import { App } from 'vue';
import SolanaWallets from 'solana-wallets-vue';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletExtensionWalletAdapter } from '@solana/wallet-adapter-sollet';
import { BitKeepWalletAdapter } from '@solana/wallet-adapter-bitkeep';
import { BitpieWalletAdapter } from '@solana/wallet-adapter-bitpie';
import { CloverWalletAdapter } from '@solana/wallet-adapter-clover';
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98';
import { CoinhubWalletAdapter } from '@solana/wallet-adapter-coinhub';
import { MathWalletAdapter } from '@solana/wallet-adapter-mathwallet';
import { SafePalWalletAdapter } from '@solana/wallet-adapter-safepal';
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { TokenPocketWalletAdapter } from '@solana/wallet-adapter-tokenpocket';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';

// import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
// import { BloctoWalletAdapter } from '@solana/wallet-adapter-blocto';
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import { getWalletAdapters } from '@solana/wallet-adapter-wallets';

export const install = ({ app }: { app: App<Element> }) => {
  // const network = WalletAdapterNetwork.Mainnet;
  const walletOptions = {
    // wallets: getWalletAdapters(),
    wallets: [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolongWalletAdapter(),
      new CloverWalletAdapter(),
      new BitKeepWalletAdapter(),
      new BitpieWalletAdapter(),
      new Coin98WalletAdapter(),
      new CoinhubWalletAdapter(),
      new SafePalWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new GlowWalletAdapter(),
      new MathWalletAdapter(),
      new LedgerWalletAdapter(),
      // new BloctoWalletAdapter(),
    ],
    autoConnect: true,
  };

  // @ts-ignore
  app.use(SolanaWallets, walletOptions);
};
