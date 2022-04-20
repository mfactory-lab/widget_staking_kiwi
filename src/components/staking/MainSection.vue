<!--
  - This file is part of the Web3 Library developed by mFactory GmbH.
  -
  - Copyright © 2021, mFactory GmbH
  -
  - Solana Reference Stake Pool is free software: you can redistribute it
  - and/or modify it under the terms of the GNU Affero General Public License
  - as published by the Free Software Foundation, either version 3
  - of the License, or (at your option) any later version.
  -
  - Solana Reference Stake Pool is distributed in the hope that it
  - will be useful, but WITHOUT ANY WARRANTY; without even the implied
  - warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  - See the GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program.
  - If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
  -
  - You can be released from the requirements of the Affero GNU General Public License
  - by purchasing a commercial license. The purchase of such a license is
  - mandatory as soon as you develop commercial activities using the
  - Solana Reference Stake Pool code without disclosing the source code of
  - your own applications.
  -
  - The developer of this program can be contacted at <info@mfactory.ch>.
  -->

<template>
  <section class="main-section">
    <div class="container">
      <div class="row">
        <validator-item />
      </div>
      <div class="row">
        <div class="col-12 col-md-6 row">
          <stake-box />
        </div>
        <div
          class="col-12 col-md-6 column"
          :class="{ 'q-pl-lg': $q.screen.gt.sm, 'q-mt-md': $q.screen.lt.md }"
        >
          <div class="row full-width">
            <div
              class="col main-section__block q-mb-md"
              :class="{ 'col-12': $q.screen.lt.xs, 'q-mr-md': $q.screen.gt.xs }"
              ><epoch
            /></div>
            <a
              href="https://jpool.one"
              target="_blank"
              class="main-section__block main-section__rect-btn main-section__rect-btn--logo"
            >
              stake on
              <img src="@/assets/img/jpool-logo.svg" alt="" />
            </a>
          </div>
          <div class="row full-width">
            <div
              class="col q-mb-md main-section__block q-mr-md"
              :class="{ 'col-12': $q.screen.lt.sm }"
              ><charts
            /></div>
            <div class="col q-mb-md main-section__block" :class="{ 'col-12': $q.screen.lt.sm }"
              ><price-stats
            /></div>
          </div>
          <div class="row">
            <wallet-balance />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
