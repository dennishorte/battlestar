<template>
  <div class="magic-wrapper">
    <Card v-if="mouseoverCard" :card="mouseoverCard" :style="mouseoverPosition" />

    <div v-if="loading" class="alert alert-warning">
      ...loading card data
    </div>

    <div v-else-if="alsoLoading" class="alert alert-warning">
      card data loaded<br>
      ...loading additional data
    </div>

    <div v-else-if="!afterLoadedComplete" class="alert alert-warning">
      card data loaded<br>
      additional data loaded<br>
      ...running post-loading scripts
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

    afterLoaded: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      afterLoadedComplete: false
    }
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

    ready() {
      return afterLoadedComplete
    },
  },

  methods: {
    tryAfterLoaded() {
      if (!this.loading && !this.alsoLoading) {
        this.afterLoaded()
        this.afterLoadedComplete = true
      }
    }
  },

  watch: {
    loading(newValue) {
      this.tryAfterLoaded()
    },

    alsoLoading(newValue) {
      this.tryAfterLoaded()
    }
  },

  created() {
    this.$store.dispatch('magic/cards/ensureLoaded')
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
}
</style>
