<template>
  <Modal id="card-editor-modal">
    <template #header>
      Card Editor
      <button
        class="btn btn-outline-secondary"
        v-if="!!data"
        @click="goToCardLink"
        data-bs-dismiss="modal">
        card link
      </button>
    </template>

    <slot name="before-card"></slot>

    <CardEditor :original="data" @card-updated="cardUpdated" />

    <template #footer>
      <slot name="footer" :original="original" :updated="updatedCard">
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

    goToCardLink() {
      this.$router.push('/magic/card/' + this.data._id)
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
