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
  <div class="validator-row__main-block column no-wrap justify-center relative-position">
    <div class="row justify-between relative-position">
      <div class="validator-row__logo column q-mr-md justify-center relative-position">
        <q-skeleton type="QAvatar" class="shadow-5" size="60px" />
      </div>
      <div class="validator-row__name column q-pt-xs justify-start">
        <q-skeleton width="100%" />
        <q-skeleton width="100%" height="28px" class="q-mt-sm" />
      </div>
      <div class="validator-row__apy column q-pl-md justify-start">
        <q-skeleton width="100%" height="16px" class="q-mt-xs" />
        <q-skeleton class="q-mt-sm" height="18px" width="100%" />
        <q-skeleton class="q-mt-sm" height="10px" width="100%" />
      </div>
      <div class="validator-row__apy-chart column q-pl-sm q-pr-md justify-start">
        <div class="q-px-sm q-mt-xs">
          <q-skeleton width="100%" height="60px" class="" />
        </div>
      </div>
    </div>
    <div
      class="validator-row__addresses q-pt-sm row justify-between q-pb-xs q-pr-md relative-position"
    >
      <q-skeleton width="288px" height="16px" style="max-width: 48%" class="q-mt-xs" />
      <q-skeleton width="296px" height="16px" style="max-width: 48%" class="q-mt-xs" />
    </div>
  </div>

  <div class="validator-row__btns no-wrap column q-pl-md justify-start">
    <div class="row q-mb-xs justify-between">
      <div class="validator-row__stake column justify-start">
        <q-skeleton width="100%" height="35px" class="q-mt-xs" />

        <q-skeleton width="100%" height="35px" class="q-mt-md" />
      </div>

      <q-skeleton class="q-mt-xs" width="106px" height="86px" />
    </div>
  </div>
</template>
