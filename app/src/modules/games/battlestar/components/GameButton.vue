<template>
  <div>
    <b-button
      :variant="variant"
      @click="clickIfValid"
      block
    >

      <slot></slot>

    </b-button>

    <ConfirmationModal
      :callback="bubble">

      This button is meant for {{actor.name}}.
    </ConfirmationModal>

  </div>
</template>


<script>
import ConfirmationModal from './ConfirmationModal'

export default {
  name: 'GameButton',

  components: {
    ConfirmationModal,
  },

  props: {
    owner: {
      type: String,
      default: 'all',
    },

    variant: {
      type: String,
      default: 'primary',
    },
  },

  computed: {
    actor() {
      if (this.owner === 'next-player') {
        return this.$store.getters['bsg/playerNext']
      }
      else if (this.owner === 'current-player') {
        return this.$store.getters['bsg/playerActive']
      }
      else {
        return 'all'
      }
    },
  },

  methods: {
    bubble() {
      this.$emit('click')
    },

    clickIfValid() {
      if (this.actor === 'all' || this.actor.name === this.$store.getters['bsg/uiViewer'].name) {
        this.bubble()
      }
      else {
        this.$bvModal.show('confirmation-modal')
      }
    },
  },
}
</script>


<style scoped>
</style>
