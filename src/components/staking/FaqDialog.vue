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
  <q-dialog class="faq-dialog">
    <div class="faq-dialog__main">
      <div class="faq-dialog__header">
        <h1 class="faq-dialog__header__title">FAQ</h1>
        <q-btn
          padding="sm"
          color="transparent"
          unelevated
          :icon="evaClose"
          size="sm"
          @click="close"
        />
      </div>
      <div class="faq-dialog__body"> Coming Soon </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
  import { evaClose } from '@quasar/extras/eva-icons';
  import { useEmitter } from '@jpool/common/hooks';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const emitter = useEmitter();

      return {
        evaClose,
        close: () => emitter.emit('closeFaq'),
      };
    },
  });
</script>

<style lang="scss">
  .faq-dialog {
    &__main {
      width: 602px;
      max-width: 100% !important;
      background: $textWhite;
    }

    &__header {
      background: #455a64;
      opacity: 0.95;
      border-radius: 8px 8px 0px 0px;
      display: flex;
      justify-content: space-between;

      &__title {
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
        padding: 12px 24px;
        color: #ffffff;
        margin: 0;
      }
    }

    &__body {
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
    }
  }
</style>
