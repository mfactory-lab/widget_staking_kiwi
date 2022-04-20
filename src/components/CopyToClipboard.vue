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
  <q-btn flat round padding="7px" dense>
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      @click="copy"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6691 2.39209H1.60036C0.716507 2.39209 0 3.03467 0 3.82732V11.9603C0 12.753 0.716507 13.3955 1.60036 13.3955H10.6691C11.5529 13.3955 12.2694 12.753 12.2694 11.9603V3.82732C12.2694 3.03467 11.5529 2.39209 10.6691 2.39209Z"
        :fill="fill"
      />
      <path
        d="M13.3365 -6.10342e-05H3.73431C2.85523 -8.90661e-05 2.14069 0.635815 2.13394 1.42416C2.13394 1.428 2.13394 1.43133 2.13394 1.43517H10.6692C12.1416 1.43674 13.3347 2.50678 13.3365 3.82722V11.4818C13.3408 11.4818 13.3445 11.4818 13.3488 11.4818C14.2279 11.4758 14.9369 10.8349 14.9369 10.0466V1.43517C14.9369 0.642514 14.2204 -6.10342e-05 13.3365 -6.10342e-05Z"
        :fill="fill"
      />
    </svg>
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
      Copy to clipboard
    </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
  import { copyToClipboard, useQuasar } from 'quasar';
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      text: {
        type: String,
        required: true,
      },
      fill: {
        type: String,
        default: '#FFCD29',
      },
    },
    setup(props) {
      const { notify } = useQuasar();
      return {
        copy() {
          copyToClipboard(props.text);
          notify({
            // type: 'positive',
            message: 'Copied to clipboard',
          });
        },
      };
    },
  });
</script>
