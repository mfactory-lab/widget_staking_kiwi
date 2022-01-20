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
  <svg viewBox="0 0 210 167.4" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m199.4 15.1-30.3 142.2c-2.2 10-8.1 12.5-16.6 7.8l-45.9-33.4-22.2 21.2c-2.5 2.5-4.4 4.4-9.4 4.4l3.4-46.9 85.3-76.9c3.8-3.4-.9-5-5.6-1.9l-105.5 66.4-45.4-14.1c-10-3.1-10-10 2.2-14.7l177.2-68.4c8.5-2.8 15.6 1.9 12.8 14.3z"
      :fill="fill"
    />
  </svg>
</template>

<script lang="ts">
  export default {
    name: 'TelegramSvg',
    props: {
      fill: {
        type: String,
        default: '#455A64',
      },
    },
  };
</script>
