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

export interface Validator {
  title: string;
  symbol: string;
  icon: string;
  cap: number;
}

interface CoinStats {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: null;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  // max_supply: null,
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency: number;
  // roi: null,
  symbol: string;
  total_supply: number;
  total_volume: number;
}

export async function getTokensInfo(ids = 'solana', vs_currencies = 'usd') {
  return new Promise<Array<CoinStats>>((resolve, reject) => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currencies}&ids=${ids}&order=market_cap_desc&per_page=100&page=1`,
    )
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.length > 0) {
            resolve(res);
          } else {
            reject(Error('Promise rejected'));
          }
        },
        (error) => {
          console.error(error);
        },
      );
  });
}
