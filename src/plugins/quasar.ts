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

import { Dark, LocalStorage, Notify, Quasar, QuasarPluginOptions } from 'quasar';
import iconSet from 'quasar/icon-set/eva-icons';
import { App } from 'vue';

// import lang from 'quasar/lang/en-US'
// import 'quasar/src/css/index.sass';
// import '@quasar/extras/eva-icons/eva-icons.css';
// import '@quasar/extras/roboto-font/roboto-font.css';

export const quasarConfig = {
  config: {
    // brand: {
    //   primary: '#1CE4B0',
    //   secondary: '#FFDF75',
    //   accent: '#609ECC',
    //   dark: '#1D1D1D',
    //   positive: '#1CE4B0',
    //   negative: '#F56C6C',
    //   info: '#609ECC',
    //   warning: '#FFDF75',
    // },
    // notify: {
    //   position: 'center',
    // },
    // dark: true,
    globalProperties: {},
  },
  iconSet: iconSet,
  // lang,
  plugins: {
    Dark,
    Notify,
    LocalStorage,
  },
} as QuasarPluginOptions;

export default {
  install: (app: App<Element>) => {
    app.use(Quasar, quasarConfig);
  },
};
