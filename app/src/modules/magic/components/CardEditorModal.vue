<template>
  <Modal id="card-editor-modal">
    <template #header>
      Card Editor
      <button
        class="btn btn-outline-secondary"
        v-if="!!originalCard"
        @click="goToCardLink"
        data-bs-dismiss="modal">
        card link
      </button>
    </template>

    <slot name="before-card"></slot>

    <CardEditor v-if="false" @card-updated="cardUpdated" />

    <template #footer>
      <slot name="footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
        <button class="btn btn-danger" @click="save" data-bs-dismiss="modal" :disabled="!updatedCard">save</button>
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

  inject: ['bus'],

  data() {
    return {
      originalCard: null,
      updated: false,
    }
  },

  methods: {
    editCard(card) {
      this.originalCard = card
      this.updated = false
      this.$modal('card-editor-modal').show()
    },

    goToCardLink() {
      this.$router.push('/magic/card/' + this.card._id)
    },

    save() {
      this.bus.emit('card-saved', {
        card: this.updatedCard,
        original: this.original.data,
      })
    },
  },

  mounted() {
    this.bus.on('edit-card-in-modal', this.editCard)
    this.bus.on('card-editor:updated', () => this.updated = true)
  },
}
</script>


<style scoped>
</style>
