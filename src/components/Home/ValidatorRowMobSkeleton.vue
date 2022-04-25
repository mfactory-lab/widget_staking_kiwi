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
  <div class="validator-row-mob__logo column q-mr-sm justify-center relative-position">
    <q-skeleton type="QAvatar" class="shadow-5" size="34px" />
  </div>
  <div class="validator-row-mob__name column justify-start">
    <q-skeleton width="100%" class="q-mt-xs" height="16px" />
  </div>
  <div class="validator-row-mob column no-wrap relative-position">
    <div class="row justify-between relative-position q-pb-xs">
      <div class="validator-row-mob__apy column q-pl-sm justify-start">
        <q-skeleton class="q-mt-xs" height="16px" width="100%" />
      </div>
      <div class="validator-row-mob__stake no-wrap column q-pl-sm q-mr-sm justify-start">
        <div class="row justify-between">
          <div class="validator-row-mob__stake column justify-start">
            <q-skeleton width="100%" height="16px" class="q-mt-xs" />
          </div>
        </div>
      </div>
    </div>
    <q-skeleton width="140px" height="16px" class="q-ml-sm q-mt-xs" />
  </div>
</template>
