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
  <q-dialog>
    <q-card class="stake-success">
      <q-card-section class="stake-success__body">
        <q-btn
          padding="sm"
          color="transparent"
          unelevated
          class="absolute-top-right"
          :icon="evaClose"
          size="sm"
          @click="close"
        />
        <div class="stake-success__header">
          <img alt="" src="@/assets/img/stake-success.svg" />
        </div>
        <div class="stake-success__info">
          <div class="stake-success__info__title">SUCCESS!</div>
          <div class="stake-success__info__text">YOU HAVE STAKED YOUR SOL THROUGH JPOOL.</div>
        </div>
        <div class="stake-success__footer">
          <div class="stake-success__footer__text">SHARE YOU SUCCESS</div>
          <div class="stake-success__footer__links">
            <q-btn
              :href="TELEGRAM_URL"
              color="primary-gray"
              round
              target="_blank"
              type="a"
              unelevated
              class="stake-success__footer__icon"
            >
              <telegram-svg class="q-icon" fill="#fff" />
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { TELEGRAM_URL } from '@/config';
  import TelegramSvg from '@/components/icons/TelegramSvg.vue';
  import { evaClose } from '@quasar/extras/eva-icons';
  import { useEmitter } from '@jpool/common/hooks';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { TelegramSvg },
    setup() {
      const emitter = useEmitter();

      return {
        evaClose,
        TELEGRAM_URL,
        close: () => emitter.emit('closeStakeSuccessDialog'),
      };
    },
  });
</script>

<style lang="scss">
  .stake-success {
    text-align: center;
    color: $primary;
    background: $primary !important;
    &__body {
      padding: 20px 0 0 !important;
      position: relative;
    }
    &__header {
      margin-bottom: -20px;
      margin-top: 5px;
    }
    &__info {
      background: $secondary;
      padding: 20px;

      &__title {
        font-size: 36px;
        font-weight: bold;
        color: #009c74;
        text-shadow: -0 -2px 0 #ffffff, 0 -2px 0 #ffffff, -0 2px 0 #ffffff, 0 2px 0 #ffffff,
          -2px -0 0 #ffffff, 2px -0 0 #ffffff, -2px 0 0 #ffffff, 2px 0 0 #ffffff,
          -1px -2px 0 #ffffff, 1px -2px 0 #ffffff, -1px 2px 0 #ffffff, 1px 2px 0 #ffffff,
          -2px -1px 0 #ffffff, 2px -1px 0 #ffffff, -2px 1px 0 #ffffff, 2px 1px 0 #ffffff,
          -2px -2px 0 #ffffff, 2px -2px 0 #ffffff, -2px 2px 0 #ffffff, 2px 2px 0 #ffffff,
          -2px -2px 0 #ffffff, 2px -2px 0 #ffffff, -2px 2px 0 #ffffff, 2px 2px 0 #ffffff;
      }

      &__text {
        font-size: 17px;
      }
    }
    &__footer {
      padding: 10px;
      background: #fff;
      &__text {
        font-size: 21px;
        font-weight: bold;
      }
      &__links {
        padding: 5px 0 12px;
      }
      &__icon {
        font-size: 27px !important;
        margin-left: 20px !important;
        &:first-child {
          margin-left: 0 !important;
        }
      }
    }
  }
</style>
