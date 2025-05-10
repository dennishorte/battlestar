<template>
  <Modal id="card-editor-modal">
    <template #header>
      Card Editor
    </template>

    <slot name="before-card"/>

    <CardEditor @card-updated="cardUpdated" />

    <slot name="after-card"/>

    <template #footer>
      <slot name="footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
        <button class="btn btn-danger"
                @click="save"
                data-bs-dismiss="modal"
                :disabled="!updatedCard">save</button>
      </slot>
    </template>
  </Modal>
</template>


<script>
import Card from './Card'
import CardEditor from './CardEditor'
import Modal from '@/components/Modal'

import { mag, util } from 'battlestar-common'


export default {
  name: 'CardEditorModal',

  components: {
    Card,
    CardEditor,
    Modal,
  },

  inject: ['actor', 'bus'],

  data() {
    return {
      updatedCard: null,
    }
  },

  methods: {
    cardUpdated(card) {
      console.log('card updated', card.name())
      this.updatedCard = card
    },

    editCard(card) {
      this.updateCard = null
      this.$modal('card-editor-modal').show()
      this.bus.emit('card-editor:begin', card)
    },

    async save() {
      if (this.updatedCard) {
        await this.$store.dispatch('magic/cards/update', {
          card: this.updatedCard,
          comment: 'Updated in the cube editor',
        })
      }
    },
  },

  mounted() {
    this.bus.on('edit-card-in-modal', this.editCard)
    this.bus.on('card-editor:updated', this.cardUpdated)
  },
}
</script>


<style scoped>
</style>
