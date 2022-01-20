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
  <section class="team-section">
    <div class="container">
      <div class="section-title text-primary text-center">Team</div>

      <div class="team-section__members">
        <div class="row justify-sm-between justify-center wrap">
          <div class="team-member q-px-sm" v-for="(member, index) in members" :key="index">
            <div class="team-member__item">
              <div class="team-member__pic">
                <img :src="member.pic" :alt="member.name" />
              </div>
              <div class="team-member__name">
                {{ member.name }}
              </div>
              <div class="team-member__pos">
                <div v-for="(pos, idx) in member.position" :key="idx">{{ pos }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="team-section__b-block"></div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import rayIcon from '@/assets/img/team/ray.svg';
  import igorIcon from '@/assets/img/team/igor.svg';
  import vladIcon from '@/assets/img/team/vlad.svg';
  import leonidIcon from '@/assets/img/team/leonid.svg';
  // import romanIcon from '@/assets/img/team/roman.svg';
  import telegramIcon from '@/assets/img/telegram.svg';
  import discordIcon from '@/assets/img/discord.svg';

  export default defineComponent({
    data: () => {
      return {
        socialIcons: {
          telegram: telegramIcon,
          discord: discordIcon,
        },
        members: [
          {
            pic: igorIcon,
            name: 'Igor Volfson',
            position: ['Marketing,', 'Content management'],
          },
          {
            pic: rayIcon,
            name: 'Alexander Ray',
            position: ['CEO,', 'Business Development,', 'Technology/Architecture'],
          },
          {
            pic: leonidIcon,
            name: 'Leonid Krassovitski',
            position: ['Design/Advertising'],
          },
          {
            pic: vladIcon,
            name: 'Vladyslav Korniienko',
            position: ['Full-Stack Developer'],
          },
          // {
          //   pic: romanIcon,
          //   name: 'Roman Leukhin',
          //   position: ['Frontend Developer'],
          // },
        ],
      };
    },
  });
</script>
