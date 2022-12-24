<template>
  <div class="magic-wrapper">
    <div v-if="versionMismatch && !skipUpdate" class="alert alert-warning">
      You card database is out of date. Click 'ok' to update it. Updating typically takes several to tens of seconds. You can cancel to skip this update for now, but this may cause errors when trying to load cards that have been modified or are not included in your database.

      <button class="btn btn-danger" @click="skipUpdateDo">Skip Update</button>
      <button class="btn btn-primary" @click="updateCardDatabase">Update Card Database</button>
    </div>

    <div v-else-if="!remoteVersionLoaded" class="alert alert-warning">
      ...getting database version
    </div>

    <div v-else-if="loading" class="alert alert-warning">
      database version fetched<br>
      ...loading card data
    </div>

    <div v-else-if="alsoLoading" class="alert alert-warning">
      database version fetched<br>
      card data loaded<br>
      ...loading additional data
    </div>

    <div v-else-if="!afterLoadedComplete" class="alert alert-warning">
      database version fetched<br>
      card data loaded<br>
      additional data loaded<br>
      ...running post-loading scripts
    </div>

    <template v-else>
      <Card v-if="!isMobile && mouseoverCard" :card="mouseoverCard" :style="mouseoverPosition" />

      <slot></slot>
    </template>

  </div>
</template>


<script>
import { mapGetters, mapState } from 'vuex'

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
      afterLoadedComplete: false,
      skipUpdate: false,
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

    ...mapGetters('magic/cards', {
      remoteVersionLoaded: 'remoteVersionLoaded',
      versionMismatch: 'versionMismatch',
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
    showVersionMismatchModal() {
      this.$modal('cards-version-update-modal').show()
    },

    skipUpdateDo() {
      this.skipUpdate = true
    },

    tryAfterLoaded() {
      if (!this.loading && !this.alsoLoading && this.remoteVersionLoaded) {
        this.afterLoaded()
        this.afterLoadedComplete = true
      }
    },

    updateCardDatabase() {
      this.$store.dispatch('magic/cards/updateCards')
    },
  },

  watch: {
    alsoLoading(newValue) {
      this.tryAfterLoaded()
    },

    loading(newValue) {
      this.tryAfterLoaded()
    },
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

  overflow-x: scroll;
}
</style>
