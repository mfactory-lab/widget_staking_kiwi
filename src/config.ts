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

import { Commitment, StakeProgram, clusterApiUrl } from '@solana/web3.js';
import { Endpoint } from '@/store';
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

export const GTAG_ID = isProd ? 'G-H60CS7J10W' : null;

export const JSOL_LOGO =
  'https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png';

// Social links
export const TELEGRAM_URL = 'https://t.me/jstaking';
export const TELEGRAM_ANNOUNCEMENT_URL = 'https://t.me/jstaking';

// Stake
export const STAKE_PROGRAM_ID = StakeProgram.programId;

// Connection
const MAIN_STAKE_POOL_ADDRESS = 'CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1';
const TEST_STAKE_POOL_ADDRESS = 'AeuEVJrnL5SwftWzchEfqMkKXPxLcZjrFtShdAZ7FwKy';
// const DEV_STAKE_POOL_ADDRESS = 'vU5rGXWuLTqFbxtz89TXEbJ59wYHJiLHNmtbXdSB7UF';

export const ENDPOINTS: Endpoint[] = [
  // {
  //   id: 'genesys-mainnet',
  //   name: 'Genesys RPC',
  //   cluster: 'mainnet-beta',
  //   url: 'https://jpoolone.genesysgo.net/',
  //   stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  // },
  {
    id: 'mainnet',
    name: 'Solana RPC',
    cluster: 'mainnet-beta',
    url: clusterApiUrl('mainnet-beta'),
    stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  },
  {
    id: 'serum-mainnet',
    name: 'Serum RPC',
    cluster: 'mainnet-beta',
    url: 'https://solana-api.projectserum.com/',
    stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  },
  {
    id: 'rpcpool-mainnet',
    name: 'RPCPool RPC',
    cluster: 'mainnet-beta',
    url: 'https://mainnet.rpcpool.com/',
    stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  },
  {
    id: 'testnet',
    name: 'TestNet',
    cluster: 'testnet',
    url: 'https://testnet.rpcpool.com/',
    stakePoolAddress: TEST_STAKE_POOL_ADDRESS,
  },
  // {
  //   id: 'devnet',
  //   name: 'DevNet',
  //   cluster: 'devnet',
  //   url: 'https://devnet.rpcpool.com/',
  //   stakePoolAddress: DEV_STAKE_POOL_ADDRESS,
  // },
];

if (isDev) {
  ENDPOINTS.push({
    id: 'localnet',
    name: 'localnet',
    cluster: 'localnet',
    url: 'http://127.0.0.1:8899',
    stakePoolAddress: 'HYgufSTxQ8Ma6qgzQ8n2vD5gPTB7YgP5JjurYCgQqFPR',
  });
}

export const API_URL = 'https://api.thevalidators.io/';

export const DEFAULT_VALIDATOR = {
  'mainnet-beta': {
    idPubkey: '8yjHdsCgx3bp2zEwGiWSMgwpFaCSzfYAHT1vk7KJBqhN',
    voterKey: 'DPmsofVJ1UMRZADgwYAHotJnazMwohHzRHSoomL6Qcao',
  },
  // is random validator for testnet
  testnet: {
    idPubkey: '75A6FVv8hAZn3n4KsTkURtQP7GDU4SDiZxcTzkTHZM3b',
    voterKey: 'BcX6qjy6fxYSHPyRmy5uJV6Z9MzK8v5ZS8UUiREoEYWW',
  },
};

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
