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
  <q-page>
    <app-header />
    <title-validators-section />
    <triangle-section :color="getColor('accent')" />
    <validators-section />
    <how-section />
    <triangle-section :color="getColor('primary')" />
    <warrant-section />
    <title-ensure-section />
    <triangle-section :color="getColor('warning')" />
    <ensure-section />
    <title-launch-section />
    <triangle-section :color="getColor('accent')" />
    <launch-section />
    <triangle-section :color="getColor('accent')" />
    <comunity-section />
    <team-section />
    <flower-section />
    <app-footer />
  </q-page>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import TitleValidatorsSection from '@/components/home/TitleValidatorsSection.vue';
  import ValidatorsSection from '@/components/home/ValidatorsSection.vue';
  import TriangleSection from '@/components/home/TriangleSection.vue';
  import HowSection from '@/components/home/HowSection.vue';
  import WarrantSection from '@/components/home/WarrantSection.vue';
  import TitleEnsureSection from '@/components/home/TitleEnsureSection.vue';
  import EnsureSection from '@/components/home/EnsureSection.vue';
  import TitleLaunchSection from '@/components/home/TitleLaunchSection.vue';
  import LaunchSection from '@/components/home/LaunchSection.vue';
  import ComunitySection from '@/components/home/ComunitySection.vue';
  import TeamSection from '@/components/home/TeamSection.vue';
  import FlowerSection from '@/components/home/FlowerSection.vue';
  import AppHeader from '@/components/home/AppHeader.vue';
  import AppFooter from '@/components/home/AppFooter.vue';
  import { getCssVar } from 'quasar';

  export default defineComponent({
    components: {
      TitleValidatorsSection,
      ValidatorsSection,
      TriangleSection,
      HowSection,
      WarrantSection,
      TitleEnsureSection,
      EnsureSection,
      TitleLaunchSection,
      LaunchSection,
      ComunitySection,
      TeamSection,
      FlowerSection,
      AppHeader,
      AppFooter,
    },
    setup() {
      return {
        getColor: (val: string) => getCssVar(val),
      };
    },
  });
</script>
