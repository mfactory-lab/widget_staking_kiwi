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
  <div class="validators-list__sorter column q-mb-sm items-start" :class="addClass">
    <div v-if="title" class="validators-list__dropdown-label q-mb-xs full-width">{{ title }}</div>
    <div class="row">
      <q-btn
        :padding="size"
        :class="`q-mr-${marginSize}`"
        :color="currentParam === param && currentType === 'desc' ? 'gray-dark-theme' : 'primary'"
        @click="() => sort('desc')"
        :icon="'img:' + sortUp"
      />
      <q-btn
        v-if="!onlyDesc"
        :padding="size"
        :class="`q-ml-${marginSize}`"
        :color="currentParam === param && currentType === 'asc' ? 'gray-dark-theme' : 'primary'"
        @click="() => sort('asc')"
        :icon="'img:' + sortDown"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import sortUp from '@/assets/img/sort-up.svg';
  import sortDown from '@/assets/img/sort-down.svg';

  export default defineComponent({
    props: {
      title: {
        type: String,
        default: '',
      },
      param: {
        type: String,
        default: '',
      },
      addClass: {
        type: String,
        default: '',
      },
      currentParam: {
        type: String,
        default: '',
      },
      currentType: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: 'sm',
      },
      marginSize: {
        type: String,
        default: 'sm',
      },
      onlyDesc: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['sort'],
    setup(props, { emit }) {
      return {
        sortUp,
        sortDown,
        sort: (type) => {
          emit('sort', props.param, type);
        },
      };
    },
  });
</script>

<style scoped lang="scss">
  .total-validators {
    &__logo {
      width: 47px;
      height: 37px;
      margin-top: 4px;
      margin-right: 12px;
    }
    &__text {
      font-size: 19px;
      line-height: 23px;
      &__total {
        font-weight: 500;
      }
    }
  }
</style>
