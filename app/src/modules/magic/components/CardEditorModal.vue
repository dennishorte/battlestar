<template>
  <Modal id="card-editor-modal">
    <template #header>Card Editor</template>

    <CardEditor :original="data" @card-updated="cardUpdated" />

    <template #footer>
      <button class="btn btn-secondary" @click="cancel" data-bs-dismiss="modal">cancel</button>
      <button class="btn btn-danger" @click="save" data-bs-dismiss="modal" :disabled="!updatedCard">save</button>
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

  props: {
    original: Object,
  },

  inject: ['bus'],

  data() {
    return {
      updatedCard: null,
    }
  },

  computed: {
    data() {
      return this.original ? this.original.data : null
    },
  },

  methods: {
    cardUpdated(card) {
      this.updatedCard = card
    },

    save() {
      this.bus.emit('card-saved', {
        card: this.updatedCard,
        original: this.original.data,
      })
    },
  },

  mounted() {
    this.bus.on('card-updated', this.cardUpdated)
  },

  watch: {
    original() {
      this.updatedCard = null
    }
  },
}
</script>


<style scoped>
</style>
