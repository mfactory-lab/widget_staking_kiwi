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
  <svg
    width="24"
    height="27"
    viewBox="0 0 24 27"
    fill="none"
    class="average-icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.003 24.3C9.86305 24.3 7.93305 23.84 6.21305 22.92C4.49305 21.98 3.14305 20.69 2.16305 19.05C1.18305 17.39 0.693047 15.54 0.693047 13.5C0.693047 11.46 1.18305 9.62 2.16305 7.98C3.14305 6.32 4.49305 5.03 6.21305 4.11C7.93305 3.17 9.86305 2.7 12.003 2.7C14.143 2.7 16.073 3.17 17.793 4.11C19.513 5.03 20.863 6.31 21.843 7.95C22.823 9.59 23.313 11.44 23.313 13.5C23.313 15.56 22.823 17.41 21.843 19.05C20.863 20.69 19.513 21.98 17.793 22.92C16.073 23.84 14.143 24.3 12.003 24.3ZM12.003 20.88C13.403 20.88 14.663 20.57 15.783 19.95C16.903 19.31 17.783 18.43 18.423 17.31C19.063 16.17 19.383 14.9 19.383 13.5C19.383 12.1 19.063 10.84 18.423 9.72C17.783 8.58 16.903 7.7 15.783 7.08C14.663 6.44 13.403 6.12 12.003 6.12C10.603 6.12 9.34305 6.44 8.22305 7.08C7.10305 7.7 6.22305 8.58 5.58305 9.72C4.94305 10.84 4.62305 12.1 4.62305 13.5C4.62305 14.9 4.94305 16.17 5.58305 17.31C6.22305 18.43 7.10305 19.31 8.22305 19.95C9.34305 20.57 10.603 20.88 12.003 20.88ZM19.623 0.899999H22.413L4.41305 26.1H1.62305L19.623 0.899999Z"
      :fill="fill"
    />
  </svg>
</template>

<script lang="ts">
  export default {
    props: {
      fill: {
        type: String,
        default: '#252B42',
      },
    },
  };
</script>
