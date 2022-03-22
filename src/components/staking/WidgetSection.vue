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
  <section id="widget-section" class="faq-section q-pb-lg">
    <div class="container">
      <q-card class="faq-section__block q-pa-md q-mb-md">
        <div class="faq-section__title">HOW TO EMBED THE STAKING.KIWI WIDGET ON YOUR PAGE</div>
        <div class="row">
          <div class="col-12 col-sm-7" :class="{ 'q-pr-md': $q.screen.gt.xs }">
            <div class="faq-section__text">
              <div class="faq-section__text__item"
                >Enter your validator's vote key in the field below</div
              >
              <div class="faq-section__text__item q-mt-xs">
                <q-input outlined v-model="voteKey" label="Vote key" stack-label :dense="dense" />
              </div>
            </div>
            <div class="faq-section__text">
              <div class="faq-section__text__item">light/dark theme</div>
              <div class="faq-section__text__item">
                <q-toggle
                  v-model="widgetTheme"
                  :checked-icon="evaMoon"
                  toggle-order="tf"
                  color="gray-secondary"
                  keep-color
                  label=""
                  :unchecked-icon="evaSun"
                />
              </div>
            </div>
            <div class="faq-section__text">
              <div class="faq-section__text__item"
                >Copy the code below and paste it into your page, between the tags</div
              >
              <div class="faq-section__text__item">{{ `<body>....</body>` }}</div>
            </div>
            <div class="faq-section__text q-mb-sm">
              <div class="faq-section__text__item">Done.</div>
              <div class="faq-section__text__item"
                >Delegators can now stake to your validator directly on your website.
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-5">
            <div class="">
              <div class="widget-section__preview">
                <img
                  v-show="widgetTheme"
                  src="@/assets/img/widget-dark-2x.png"
                  alt="widget preview"
                />
                <img
                  v-show="!widgetTheme"
                  src="@/assets/img/widget-light-2x.png"
                  alt="widget preview"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="widget-section__src q-mt-lg q-pa-md">
          {{ iframeSrc }}
        </div>
        <div class="row justify-end q-mt-md">
          <copy-to-clipboard-big
            :text="iframeSrc"
            btn-text="COPY CODE"
            btn-color="primary"
            text-color="text-white"
          />
        </div>
        <div class="row">
          <div class="col-12">
            <div class="faq-section__text">
              <div class="faq-section__text__item">and</div>
            </div>
          </div>
        </div>
        <div class="widget-section__src q-mt-lg q-pa-md">
          {{ scriptSrc }}
        </div>
        <div class="row justify-end q-mt-md">
          <copy-to-clipboard-big
            :text="scriptSrc"
            btn-text="COPY CODE"
            btn-color="primary"
            text-color="text-white"
          />
        </div>
      </q-card>
    </div>
  </section>
</template>

<script lang="ts">
  import { evaMoon, evaSun } from '@quasar/extras/eva-icons';
  import { computed, defineComponent, ref } from 'vue';
  import { useValidatorJstakingStore } from '@/store';
  import { storeToRefs } from 'pinia';
  import CopyToClipboardBig from '@/components/CopyToClipboardBig.vue';

  export default defineComponent({
    components: { CopyToClipboardBig },
    setup() {
      const { voterKey } = storeToRefs(useValidatorJstakingStore());
      const widgetTheme = ref(true);
      const voteKey = ref(voterKey.value);

      return {
        evaSun,
        evaMoon,
        voteKey,
        widgetTheme,
        scriptSrc: computed(
          () => `<script src="https://widget.staking.kiwi/js/widget.min.js"><\/script>`,
        ),
        iframeSrc: computed(
          () => `<iframe
          id="staking-kiwi-widget-0"
          scrolling="no"
          frameborder="0"
          allowtransparency="true"
          allowfullscreen="true"
          class=""
          style="position: static; visibility: visible; width: 472px; height: 302px"
          title="Staking Kiwi widget"
          src="https://widget.staking.kiwi/?validator=${voteKey.value}&theme=${
            widgetTheme.value ? 'dark' : 'light'
          }"
        ></iframe>`,
        ),
      };
    },
  });
</script>
