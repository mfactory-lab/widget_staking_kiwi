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
import ethIcon from '@/assets/img/eth.svg';
import dotIcon from '@/assets/img/dot.svg';
import atomIcon from '@/assets/img/atom.svg';
import terraIcon from '@/assets/img/terra.svg';
import avalancheIcon from '@/assets/img/avalanche.svg';
import minaIcon from '@/assets/img/mina.svg';

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
export const TELEGRAM_URL = 'https://t.me/jstaking';
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

export const DEFAULT_VALIDATOR = '8yjHdsCgx3bp2zEwGiWSMgwpFaCSzfYAHT1vk7KJBqhN';
export const DEFAULT_VOTER = 'DPmsofVJ1UMRZADgwYAHotJnazMwohHzRHSoomL6Qcao';
// export const DEFAULT_VOTER = '';

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
export const DEFI = [];

export const LAUNCH_VALIDATORS = [
  {
    title: 'Etherium 2.0',
    id: 'ethereum',
    icon: ethIcon,
  },
  {
    title: 'Polkadot',
    id: 'polkadot',
    icon: dotIcon,
  },
  {
    title: 'Cosmos',
    id: 'cosmos',
    icon: atomIcon,
  },
  {
    title: 'Terra',
    id: 'terracoin',
    icon: terraIcon,
  },
  {
    title: 'Avalanche',
    id: 'avalanche-2',
    icon: avalancheIcon,
  },
  {
    title: 'Mina',
    id: 'mina-protocol',
    icon: minaIcon,
  },
];

// charts
export const CHARTS_PAIRS = [
  {
    title: 'SOL / USD & JSOL / USD',
    pairs: [
      {
        id: 5426,
        convertTo: 2781, // usd
        chartName: 'SOL',
      },
    ],
  },
];
