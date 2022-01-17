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
  <section :class="$style.footer">
    <div class="container">
      <div class="row q-col-gutter-lg">
        <div class="col justify-end d-flex column">
          <div class="text-caption">© Copyright 2021 jpool.finance. All rights reserved.</div>
        </div>
        <div class="col col-12 col-md-auto justify-between d-flex column">
          <div :class="$style.buttons" class="q-gutter-md">
            <q-btn
              :href="TELEGRAM_ANNOUNCEMENT_URL"
              color="white"
              round
              target="_blank"
              type="a"
              unelevated
            >
              <telegram-svg class="q-icon" />
            </q-btn>
            <q-btn :href="TWITTER_URL" color="white" round target="_blank" type="a" unelevated>
              <twitter-svg class="q-icon" />
            </q-btn>
          </div>
          <div :class="$style.nav" class="row text-caption footer-links q-pt-md">
            <a href="https://docs.jpool.one/" target="_blank">Docs</a>
            <span class="q-px-sm">|</span>
            <router-link to="/terms">Terms of Use</router-link>
            <span class="q-px-sm">|</span>
            <router-link to="/impressum">Legal</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { TELEGRAM_ANNOUNCEMENT_URL, TELEGRAM_URL, TWITTER_URL } from '@/config';
  import TelegramSvg from '@/components/icons/TelegramSvg.vue';
  import TwitterSvg from '@/components/icons/TwitterSvg.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { TelegramSvg, TwitterSvg },
    setup() {
      return {
        TWITTER_URL,
        TELEGRAM_URL,
        TELEGRAM_ANNOUNCEMENT_URL,
      };
    },
  });
</script>

<style lang="scss" module>
  .footer {
    background-color: $gray !important;
    color: #fff !important;
    padding: 2rem 0 2rem;
    @media (max-width: $breakpoint-sm) {
      text-align: center;
    }

    a {
      color: #fff;
      text-decoration: none;
    }
  }

  .nav {
    justify-content: center;
    text-align: center;

    a {
      margin: 0 0.5em;
    }
  }

  .buttons {
    text-align: right;

    a {
      color: $gray !important;
      font-size: 23px;
    }

    @media (max-width: $breakpoint-sm) {
      text-align: center;
    }
  }
  .telegramChannel {
    height: 69px;
    border-radius: 40px;

    b {
      line-height: 1;
      font-size: 13px;
      margin-right: 5px;
      text-align: left;
    }
  }
</style>

<style lang="scss" scoped>
  .contact-title {
    text-align: right;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    padding-right: 93px;
    margin-top: -15px;
    margin-bottom: -10px;

    @media (max-width: $breakpoint-sm) {
      text-align: center;
      margin-bottom: 5px;
      padding-right: 0;
    }
  }

  .footer-links {
    @media (max-width: $breakpoint-sm) {
      margin-top: 10px;
    }
  }
</style>
