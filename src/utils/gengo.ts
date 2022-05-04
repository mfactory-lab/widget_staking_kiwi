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

import { API_URL } from '@/config';
import axios from 'axios';
import { debounceAsync } from '@/utils/index';

const getCsrfToken = debounceAsync<() => Promise<string>, string>(
  async () =>
    axios(`${API_URL}/auth/csrf`, {
      withCredentials: true,
    }).then(({ data }) => data.token),
  250,
);

export const getGengoToken = debounceAsync(async () => {
  const token = await getCsrfToken();
  if (!token) {
    throw 'Invalid token';
  }
  const res = await axios(`${API_URL}/auth/genesysgo`, {
    withCredentials: true,
    headers: {
      'X-XSRF-TOKEN': token,
    },
  });
  return res.data.access_token;
}, 250) as () => Promise<string>;

// export async function getGengoToken() {
//   const token = await getCsrfToken();
//   if (!token) {
//     throw 'Invalid token';
//   }
//   const res = await axios(`${API_URL}/auth/genesysgo`, {
//     withCredentials: true,
//     headers: {
//       'X-XSRF-TOKEN': token,
//     },
//   });
//   return res.data.access_token;
// }
