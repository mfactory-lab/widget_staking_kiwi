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

import { defineStore } from 'pinia';
import { getTokenPrice } from '@jpool/common/utils/coingecko';
import { SOL_USD_RELOAD_DURATION } from '@/config';

interface CoinRateState {
  solPrice: number;
  solVol24: number;
  solChange24: number;
  solChangePercentage24: number;
}

export const useCoinRateStore = defineStore({
  id: 'coin-rate',
  state: (): CoinRateState => ({
    solPrice: 200,
    solVol24: 0,
    solChange24: 0,
    solChangePercentage24: 0,
  }),
  actions: {
    init() {
      setInterval(() => this.load, SOL_USD_RELOAD_DURATION);
      this.load();
    },
    async load() {
      const resp = await getTokenPrice();

      console.log('[CoinRate]', resp);

      this.solPrice = resp.current_price;
      this.solVol24 = resp.total_volume;
      this.solChange24 = resp.price_change_24h;
      this.solChangePercentage24 = resp.price_change_percentage_24h_in_currency;
    },
  },
});
