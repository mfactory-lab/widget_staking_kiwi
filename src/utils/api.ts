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

import { API_URL } from '@/config';

export interface ValidatorStats {
  voteId: string;
  validatorId: string;
  fee: number;
  apy: number;
  apyEst: number;
  totalStake: number;
  network: string;
  name: string | undefined;
  details: string | undefined;
  website: string | undefined;
  keybaseUsername: string | undefined;
  inTop33: boolean;
  inJpool: boolean;
  isDelinquent: boolean;
  svName: string;
  apyComparedMax: Number;
}

export interface ApyStats {
  apy: number;
  epoch: number;
}

export async function getValidatorsStats(network) {
  return new Promise<Array<ValidatorStats>>((resolve, reject) => {
    // fetch(`http://localhost:3000/validators/list?network=${network}`)
    fetch(`${API_URL}validators/list?network=${network}`)
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.data?.length > 0) {
            resolve(res.data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
          console.error(error);
        },
      );
  });
}

export async function getApyHistory(voterKey) {
  return new Promise<Array<ApyStats>>((resolve, _reject) => {
    fetch(`${API_URL}apy/history?voter_id=${voterKey}`)
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.data?.length > 0) {
            resolve(res.data);
          } else {
            // resolve([]);
            // reject(Error('Promise rejected'));
          }
        },
        (error) => {
          console.error(error);
        },
      );
  });
}

export async function getAverageApy() {
  return new Promise<Array<ApyStats>>((resolve, _reject) => {
    fetch(`${API_URL}apy-average/history`)
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.data?.length > 0) {
            resolve(res.data);
          } else {
            // resolve([]);
            // reject(Error('Promise rejected'));
          }
        },
        (error) => {
          console.error(error);
        },
      );
  });
}
