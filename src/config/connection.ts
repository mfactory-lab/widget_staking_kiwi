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

import { Endpoint } from '@/store';
import { Commitment } from '@solana/web3.js';

const mode = import.meta.env.MODE;
const isDev = mode == 'development';

const MAIN_STAKE_POOL_ADDRESS = 'CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1';
const MAIN_STAKE_LIMIT = 1500000;

const TEST_STAKE_POOL_ADDRESS = 'AeuEVJrnL5SwftWzchEfqMkKXPxLcZjrFtShdAZ7FwKy';
const TEST_STAKE_LIMIT = 1500000;

// const DEV_STAKE_POOL_ADDRESS = 'vU5rGXWuLTqFbxtz89TXEbJ59wYHJiLHNmtbXdSB7UF';

export const ENDPOINTS: Endpoint[] = [
  {
    id: 'jpool-mainnet',
    name: 'Jpool RPC',
    cluster: 'mainnet-beta',
    url: 'https://marketa-1sh8m6-fast-mainnet.helius-rpc.com/',
    stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
    stakeLimit: MAIN_STAKE_LIMIT,
  },
  // {
  //   id: 'serum-mainnet',
  //   name: 'Serum RPC',
  //   cluster: 'mainnet-beta',
  //   url: 'https://solana-api.projectserum.com/',
  //   stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  //   stakeLimit: MAIN_STAKE_LIMIT,
  // },
  // {
  //   id: 'rpcpool-mainnet',
  //   name: 'RPCPool RPC',
  //   cluster: 'mainnet-beta',
  //   url: 'https://mainnet.rpcpool.com/',
  //   stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  //   stakeLimit: MAIN_STAKE_LIMIT,
  // },
  // {
  //   id: 'mainnet',
  //   name: 'Solana RPC',
  //   cluster: 'mainnet-beta',
  //   url: clusterApiUrl('mainnet-beta'),
  //   stakePoolAddress: MAIN_STAKE_POOL_ADDRESS,
  //   stakeLimit: MAIN_STAKE_LIMIT,
  // },
  {
    id: 'testnet',
    name: 'TestNet',
    cluster: 'testnet',
    url: 'https://testnet.rpcpool.com/',
    stakePoolAddress: TEST_STAKE_POOL_ADDRESS,
    stakeLimit: TEST_STAKE_LIMIT,
  },
  // {
  //   id: 'devnet',
  //   name: 'DevNet',
  //   cluster: 'devnet',
  //   url: 'https://devnet.rpcpool.com/',
  //   stakePoolAddress: DEV_STAKE_POOL_ADDRESS,
  //   stakeLimit: 100000,
  // },
];

if (isDev) {
  ENDPOINTS.push({
    id: 'localnet',
    name: 'LocalNet',
    cluster: 'localnet',
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

export const DEFAULT_MONITOR_COMMITMENT: Commitment = 'processed';

export const DEFAULT_SEND_TIMEOUT = 15000;

/**
 * Time to allow for the server to initially process a transaction (in milliseconds)
 */
export const DEFAULT_CONFIRM_TIMEOUT = 120000;
