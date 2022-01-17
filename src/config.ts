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

import { Commitment, StakeProgram } from '@solana/web3.js';
import { Endpoint } from '@jpool/common/store';

const mode = import.meta.env.MODE;
const isProd = mode == 'production';
const isDev = mode == 'development';

export const PASSWORD_PROTECT = '';
export const DEFAULT_APY = 0.07;
export const APY_VALIDATOR_ID = '8BYmtxKY1LuvjesaMi1nkXcj6ghuq48iiGKq2jNpnrNY';
export const VALIDATORS_LIMIT = 60;
export const EPOCH_RELOAD_DURATION = 60000;
export const WITHDRAW_SOL_ACTIVE = true;
export const SOL_USD_RELOAD_DURATION = 300000;
export const DEFI_RELOAD_DURATION = 30000;
export const POOL_CONNECTION_DELAY = 30000;

// export const GTAG_ID = isProd ? 'G-FXXRMT54JE' : null;
export const GTAG_ID = isProd ? null : null;

// Social links
export const TWITTER_URL = 'https://twitter.com/JPoolSolana';
export const TELEGRAM_URL = 'https://t.me/jpool_solana';
export const TELEGRAM_ANNOUNCEMENT_URL = 'https://t.me/jpoolsolana';

// Stake
export const STAKE_PROGRAM_ID = StakeProgram.programId;

// Connection
export const ENDPOINTS: Endpoint[] = [
  {
    name: 'mainnet-beta',
    url: 'https://mainnet.rpcpool.com/', // clusterApiUrl('mainnet-beta'),
    stakePoolAddress: 'CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1',
    stakeLimit: 1500000,
  },
  {
    name: 'testnet',
    url: 'https://testnet.rpcpool.com/', // clusterApiUrl('testnet'),
    stakePoolAddress: 'AeuEVJrnL5SwftWzchEfqMkKXPxLcZjrFtShdAZ7FwKy',
    stakeLimit: 100000,
  },
  // {
  //   name: 'devnet',
  //   url: 'https://devnet.rpcpool.com/', // clusterApiUrl('devnet'),
  //   stakePoolAddress: 'tppks4WDGssiMr14fmAoi1K8hS7YPxEiXVGdbAThyPB',
  //   stakeLimit: 100000,
  // },
];

if (isDev) {
  ENDPOINTS.push({
    name: 'localnet',
    url: 'http://127.0.0.1:8899',
    stakePoolAddress: 'HYgufSTxQ8Ma6qgzQ8n2vD5gPTB7YgP5JjurYCgQqFPR',
  });
}

export const DEFAULT_ENDPOINT = ENDPOINTS[0] as Endpoint;

/**
 * The level of commitment desired when querying state
 * <pre>
 *   'processed': Query the most recent block which has reached 1 confirmation by the connected node
 *   'confirmed': Query the most recent block which has reached 1 confirmation by the cluster
 *   'finalized': Query the most recent block which has been finalized by the cluster
 * </pre>
 */
export const DEFAULT_COMMITMENT: Commitment = 'confirmed';

// DEFI
export const DEFI = [
  {
    id: '0_JSOL-SOL',
    leftTitle: 'RAYDIUM LIQUIDITY POOL',
    rightTitle: 'JSOL/SOL',
    pairName: 'JSOL-SOL',
    iconHeader: '/img/defi/sol-defi-head.svg',
    liquidityLink:
      'https://raydium.io/liquidity/?ammId=D8pasgJWjP9wy39fzeD8BUjQMvYCZxABzPcnuoDSLHBB',
    swapLink:
      'https://raydium.io/swap/?from=7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn&to=11111111111111111111111111111111',
    icon: '/img/defi/sol-defi.svg',
    textBottom:
      'Please note: In case of high-volume swaps compared to the liquidity pool volume, the exchange rate may be affected by the transaction.',
    mainText: [
      'You can add liquidity to the JSOL-SOL pair on Raydium, our partner AMM, to earn additional yields from the trading going on in that pool.',
      'The liquidity pool can be used to instantly swap JSOL for SOL and vice versa.',
    ],
    iconValidator: '/img/defi/raydium.svg',
    type: 'raydium',
    hasValues: true,
  },
  {
    id: '1_JSOL-USDC',
    leftTitle: 'RAYDIUM LIQUIDITY POOL',
    rightTitle: 'JSOL/USDC',
    pairName: 'JSOL-USDC',
    iconHeader: '/img/defi/usd-defi-head.svg',
    liquidityLink:
      'https://raydium.io/liquidity/?ammId=7e8GrkwsRm5sS5UaKobLJUNu9esmrzg37dqX6aQyuver',
    swapLink:
      'https://raydium.io/swap/?from=7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    icon: '/img/defi/usd-defi.svg',
    textBottom:
      'Please note: In case of high-volume swaps compared to the liquidity pool volume, the exchange rate may be affected by the transaction.',
    mainText: [
      'You can add liquidity to the JSOL-USDC pair on Raydium, our partner AMM, to earn additional yields from the trading going on in that pool.',
      'The liquidity pool can be used to instantly swap JSOL for USDC and vice versa.',
    ],
    iconValidator: '/img/defi/raydium.svg',
    type: 'raydium',
    hasValues: true,
  },
  {
    id: '2_JSOL-SOL',
    leftTitle: 'SABER LIQUIDITY POOL',
    rightTitle: 'JSOL/SOL',
    pairName: 'JSOL-SOL',
    iconHeader: '/img/defi/saber-head.svg',
    liquidityLink: 'https://app.saber.so/#/pools/jsol/deposit',
    swapLink:
      'https://app.saber.so/#/swap?from=7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn&to=So11111111111111111111111111111111111111112',
    icon: '/img/defi/sol-defi.svg',
    textBottom:
      'Please note: In case of high-volume swaps compared to the liquidity pool volume, the exchange rate may be affected by the transaction.',
    mainText: [
      'You can add liquidity to the JSOL-SOL pair on Saber, our partner AMM, to earn additional yields from the trading going on in that pool.',
      'The liquidity pool can be used to instantly swap JSOL for SOL and vice versa.',
    ],
    iconValidator: '/img/defi/saber.svg',
    type: 'saber',
    hasValues: false,
  },
  {
    id: '3_JSOL-USDC',
    leftTitle: 'ORCA LIQUIDITY POOL',
    rightTitle: 'JSOL/USDC',
    pairName: 'JSOL-USDC',
    iconHeader: '/img/defi/orca-head-usd.svg',
    liquidityLink: 'https://www.orca.so/pools?pool=jsol/usdc',
    swapLink: 'https://www.orca.so/?input=USDC&output=JSOL',
    icon: '/img/defi/usd-defi.svg',
    textBottom:
      'Please note: In case of high-volume swaps compared to the liquidity pool volume, the exchange rate may be affected by the transaction.',
    mainText: [
      'You can add liquidity to the JSOL-USDC pair on Orca, our partner AMM, to earn additional yields from the trading going on in that pool.',
      'The liquidity pool can be used to instantly swap JSOL for USDC and vice versa.',
    ],
    iconValidator: '/img/defi/orca.svg',
    type: 'orca',
    hasValues: true,
  },
];
