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

  computed: {
    actor() {
      if (this.owner === 'next-player') {
        return this.$game.getPlayerNext().name
      }
      else if (this.owner === 'current-player') {
        return this.$game.getPlayerCurrentTurn().name
      }
      else {
        return this.owner
      }
    },

    modalId() {
      return `confirmation-modal-${this.owner}`
    },
  },

  methods: {
    bubble() {
      this.$emit('click')
    },

    clickIfValid() {
      if (this.actor === 'all' || this.actor === this.$game.getActor().name) {
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
