<template>
  <div>
    <b-button
      :variant="variant"
      @click="clickIfValid"
      :disabled="disabled"
      block
    >

      <slot></slot>

    </b-button>

    <ConfirmationModal
      :modalId="modalId"
      :callback="bubble">

      This button is meant for <strong>{{actor}}</strong>.
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

  inject: ['game'],

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: String,
      default: 'all',
    },

    variant: {
      type: String,
      default: 'primary',
    },
  },

  data() {
    return {
      modalId: 'confirmation-modal-' + Math.floor(Math.random() * 1000000)
    }
  },

  computed: {
    actor() {
      return this.game.getViewerName()
    },
  },

  methods: {
    bubble() {
      this.$emit('click')
    },

    clickIfValid() {
      if (this.game.testMode || this.owner === 'all' || this.owner === this.actor) {
        this.bubble()
      }
      else {
        this.$bvModal.show(this.modalId)
      }
    },
  },
}
</script>


<style scoped>
</style>
