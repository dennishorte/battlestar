<template>
  <div class="magic-wrapper">
    <Card v-if="mouseoverCard" :card="mouseoverCard" :style="mouseoverPosition" />

    <slot></slot>
  </div>
</template>


<script>
import { mapState } from 'vuex'

import Card from './Card'


export default {
  name: 'MagicWrapper',

  components: {
    Card,
  },

  computed: {
    ...mapState('magic', {
      mouseoverCard: 'mouseoverCard',
      mouseoverX: 'mouseoverX',
      mouseoverY: 'mouseoverY',
    }),

    mouseoverPosition() {
      const top = this.mouseoverY + 10
      const left = this.mouseoverX + 10

      return {
        position: 'fixed',
        top: top + 'px',
        left: left + 'px',
        'z-index': 100,
      }
    },
  },

  created() {
    this.$store.dispatch('magic/cards/ensureLoaded')
    window.addEventListener('mousemove', this.mousemove)
  },
}
</script>


<style scoped>
.magic-wrapper {
  height: 100vh;
  width: 100vw;
}
</style>
