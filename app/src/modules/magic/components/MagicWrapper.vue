<template>
  <div class="magic-wrapper">
    <template v-if="allReady">
      <MagicCard v-if="!isTouchscreen && mouseoverCard" :card="mouseoverCard" :style="mouseoverPosition" />

      <slot/>
    </template>

    <div v-else class="alert alert-warning">
      <div v-for="(line, index) of log" :key="index">
        {{ line }}
      </div>
    </div>

  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex'

import MagicCard from './card/MagicCard.vue'


export default {
  name: 'MagicWrapper',

  components: {
    MagicCard,
  },

  props: {
    alsoLoading: {
      type: Boolean,
      default: false,
    },

    afterLoaded: {
      type: Function,
      default: () => {},
    },
  },

  computed: {
    ...mapState('magic', {
      mouseoverCard: 'mouseoverCard',
      mouseoverX: 'mouseoverX',
      mouseoverY: 'mouseoverY',
    }),

    ...mapGetters('magic', {
      allReady: 'ready',
    }),

    ...mapState('magic/cards', {
      cardsReady: 'cardsReady',
      log: 'log',
    }),

    isTouchscreen() {
      return this.$device.isTouchScreen()
    },

    mouseoverPosition() {
      const leftPixelSpace = this.mouseoverX
      const rightPixelSpace = window.innerWidth - leftPixelSpace
      const topPixelSpace = this.mouseoverY
      const bottomPixelSpace = window.innerHeight - topPixelSpace

      const x_offset = this.mouseoverX + window.pageXOffset
      const y_offset = this.mouseoverY + window.pageYOffset

      const style = {
        position: 'fixed',
        'z-index': 100,
        top: null,
        bottom: null,
        left: null,
        right: null,
      }

      if (rightPixelSpace > leftPixelSpace) {
        // display on right
        style.left = Math.max(window.pageXOffset, 5 + x_offset) + 'px'
      }
      else {
        // display on left
        style.right = Math.max(window.innerWidth + 5 - x_offset, 0) + 'px'
      }

      if (bottomPixelSpace > topPixelSpace) {
        // display on bottom
        style.top = 5 + y_offset + 'px'
      }
      else {
        // display on top
        style.bottom = window.innerHeight + 5 - y_offset + 'px'
      }

      return style
    },
  },

  methods: {
    skipUpdateDo() {
      this.$store.commit('magic/cards/skipUpdate')
    },

    tryAfterLoaded() {
      if (!this.alsoLoading && this.cardsReady) {
        this.afterLoaded()
      }
    },
  },

  watch: {
    alsoLoading() {
      this.tryAfterLoaded()
    },

    cardsReady() {
      this.tryAfterLoaded()
    },
  },

  created() {
    window.addEventListener('click', () => {
      this.$store.commit('magic/clearMouseoverCard')
    })

    this.$store.dispatch('magic/loadCards')
    this.$store.dispatch('magic/loadUsers')
  },

  mounted() {
    this.tryAfterLoaded()
  },
}
</script>


<style scoped>
.magic-wrapper {
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;

  overflow-x: scroll;
}
</style>
