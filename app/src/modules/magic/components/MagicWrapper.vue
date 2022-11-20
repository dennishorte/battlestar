<template>
  <div class="magic-wrapper">
    <Card v-if="mouseoverCard" :card="mouseoverCard" :style="mouseoverPosition" />

    <div v-if="loading" class="alert alert-warning">
      ...loading card data
    </div>

    <div v-else-if="alsoLoading" class="alert alert-warning">
      card data loaded
      <br>
      ...loading additional data
    </div>

    <template v-else>
      <slot></slot>
    </template>
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

  props: {
    alsoLoading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState('magic', {
      mouseoverCard: 'mouseoverCard',
      mouseoverX: 'mouseoverX',
      mouseoverY: 'mouseoverY',
    }),

    ...mapState('magic/cards', {
      loading: 'loading',
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
  },
}
</script>


<style scoped>
.magic-wrapper {
  height: 100vh;
  width: 100vw;
}
</style>
