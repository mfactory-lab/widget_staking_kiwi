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

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function withZero(n: number): string {
  return n > 9 ? `${n}` : `0${n}`;
}

export function isoTimeToReadable(isoTime: string): string {
  const date = new Date(isoTime);
  const m = months[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();

  const hh = date.getHours();
  const mm = date.getMinutes();
  const ss = date.getSeconds();

  return `${m} ${withZero(d)} ${y} ${withZero(hh)}:${withZero(mm)}:${withZero(ss)}`;
}

export function isoTimeDifference(isoTime: string): string {
  const date = new Date(isoTime);
  const diff = Date.now() - date.getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff - d * 86400000) / 3600000);
  const m = Math.floor((diff - d * 86400000 - h * 3600000) / 60000);
  const days = d ? `${d}d ` : '';
  const hh = h ? `${h}h ` : '';
  const mm = m ? `${m}m ` : '';

  return `${days}${hh}${mm}`;
}
