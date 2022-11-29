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

    <Modal id="cards-version-update-modal" @ok="updateCardDatabase">
      <template #header>Card database out of date</template>
      You card database is out of date. Click 'ok' to update it. Updating typically takes several to tens of seconds. You can cancel to skip this update for now, but this may cause errors when trying to load cards that have been modified or are not included in your database.
    </Modal>
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

    ...mapGetters('magic/cards', {
      versionMismatch: 'versionMismatch',
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
    showVersionMismatchModal() {
      this.$modal('cards-version-update-modal').show()
    },

    tryAfterLoaded() {
      if (!this.loading && !this.alsoLoading) {
        this.afterLoaded()
        this.afterLoadedComplete = true

        if (this.versionMismatch) {
          this.showVersionMismatchModal()
        }
      }
    },

    updateCardDatabase() {
      this.$store.dispatch('magic/cards/updateLocalCardDatabase')
    },
  },

  watch: {
    alsoLoading(newValue) {
      this.tryAfterLoaded()
    },

    loading(newValue) {
      this.tryAfterLoaded()
    },

    versionMismath(newValue) {
      if (newValue) {
        showVersionMismatchModal()
      }
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
}
</style>
