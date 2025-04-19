<template>
  <div class="magic-wrapper">
    <template v-if="allReady">
      <Card v-if="!isMobile && mouseoverCard" :card="mouseoverCard" :style="mouseoverPosition" />

      <slot></slot>
    </template>

    <div v-else class="alert alert-warning">
      <div v-for="line of log">
        {{ line }}
      </div>
    </div>

  </div>
</template>


<script>
import { mapState } from 'vuex'

import Card from './Card'
import Modal from '@/components/Modal'


export default {
  name: 'MagicWrapper',

  components: {
    Card,
    Modal,
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

  data() {
    return {
      allReady: false,
    }
  },

  computed: {
    ...mapState('magic', {
      mouseoverCard: 'mouseoverCard',
      mouseoverX: 'mouseoverX',
      mouseoverY: 'mouseoverY',
    }),

    ...mapState('magic/cards', {
      cardsReady: 'cardsReady',
      log: 'log',
    }),

    isMobile() {
      return window.innerWidth < window.innerHeight
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
        this.allReady = true
      }
    },
  },

  watch: {
    alsoLoading(newValue) {
      this.tryAfterLoaded()
    },

    cardsReady(newValue) {
      this.$emit('cards-ready')
      this.tryAfterLoaded()
    },
  },

  created() {
    window.addEventListener('click', () => {
      this.$store.commit('magic/clearMouseoverCard')
    })

    this.$store.dispatch('magic/cards/ensureLoaded')
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
