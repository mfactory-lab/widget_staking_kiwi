<template>
  <q-icon
    class="up"
    :class="{ show: data.showButton }"
    :name="evaArrowCircleUpOutline"
    @click="top"
  >
    <q-tooltip anchor="top right" self="bottom middle">go top</q-tooltip>
  </q-icon>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue';
  import { evaArrowCircleUpOutline } from '@quasar/extras/eva-icons';
  import handleScroll from '@jpool/common/utils/scroller';

  interface Data {
    showButton: boolean;
  }

  export default defineComponent({
    setup() {
      const data = reactive<Data>({ showButton: false });

      onMounted(() => {
        window.addEventListener('scroll', () => {
          window.scrollY > 500 ? (data.showButton = true) : (data.showButton = false);
        });
      });
      return {
        evaArrowCircleUpOutline,
        top: () => handleScroll('app-header'),
        data,
      };
    },
  });
</script>

<style lang="scss">
  .up {
    position: fixed;
    z-index: 10000;
    bottom: 55px;
    right: 55px;
    cursor: pointer;
    display: none;

    svg {
      width: 50px;
      height: 50px;
      fill: #d7d7d76b;
      transition: 0.1s ease-in-out;
    }

    &:hover svg {
      transform: scale(1.2);
      fill: rgba(0, 0, 0, 0.753);
    }
  }
  .show {
    display: block;
  }
</style>
