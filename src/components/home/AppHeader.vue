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
  <section class="app-header q-pt-xl">
    <div class="container">
      <!-- <div class="row justify-end q-py-md app-header__links">
        <router-link to="/terms" class="text-primary">contact</router-link>
        <span class="q-px-sm text-primary">|</span>
        <a href="https://docs.jpool.one/" class="text-primary" target="_blank">docs</a>
      </div> -->
      <div class="row">
        <div class="column col-12 col-md-9 col-lg-8">
          <div class="row">
            <div class="col-auto">
              <img src="@/assets/img/logo.svg" alt="" class="app-header__logo" />
            </div>
            <div class="col">
              <div class="column q-ml-md">
                <div class="app-header__joogh"
                  >formerly
                  <a class="app-header__joogh__link" href="https://joogh.io" target="_blank"
                    >joogh validator</a
                  ></div
                >
                <h1 class="app-header__title">STAKING</h1>
                <h3 class="app-header__subtitle"
                  >Dependable
                  <span class="text-weight-bolder">validators for PoS</span> Blockchain</h3
                >
              </div>
            </div>
          </div>
          <div class="row q-mt-md app-header__btns">
            <router-link to="/staking" custom v-slot="props">
              <q-btn
                v-bind="buttonProps(props)"
                rounded
                label="STAKE SOLANA NOW"
                color="secondary"
                text-color="text-white"
                size="14px"
                padding="6px 32px"
                class="q-mr-md q-mt-md"
              />
            </router-link>
            <q-btn
              type="a"
              href="https://explorer.near.org/accounts/jstaking.poolv1.near"
              target="_blank"
              rounded
              label="STAKE NEAR NOW"
              color="dark"
              text-color="text-white"
              size="14px"
              padding="6px 32px"
              class="q-mr-md q-mt-md"
            />
          </div>
        </div>
        <div class="col-3 col-lg-4 gt-sm">
          <div class="row justify-end relative-position">
            <img src="@/assets/img/s2.svg" class="app-header__flower" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      return {
        buttonProps({ href }) {
          const props = {
            to: href,
          };

          return props;
        },
      };
    },
  });
</script>

<style lang="scss" scoped>
  .app-header {
    color: $primary;
    &__logo {
      width: 85px;
    }
    &__joogh {
      color: $gray;
      font-size: 14px;
      &__link {
        color: $gray;
        text-decoration: underline;
      }
    }
    &__title {
      font-family: $font-secondary;
      font-size: 50px;
      line-height: 50px;
      font-weight: 900;
      margin: 0;
      @media (max-width: $breakpoint-xs) {
        margin: -8px 0 0;
        font-size: 36px;
        line-height: 44px;
      }
    }
    &__subtitle {
      font-family: $font-secondary;
      font-size: 25px;
      line-height: 28px;
      font-weight: 500;
      margin: 0;
      text-transform: uppercase;
      @media (max-width: $breakpoint-xs) {
        font-size: 16px;
        line-height: 20px;
      }
    }
    &__flower {
      position: absolute;
      height: 300px;
      top: 30px;
    }
    // &__links {
    //   font-size: 21px;
    // }
  }
</style>
