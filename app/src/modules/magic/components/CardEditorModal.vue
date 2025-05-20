<template>
  <ModalBase id="card-editor-modal">
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
  </ModalBase>
</template>


<script>
import CardEditor from './CardEditor'
import ModalBase from '@/components/ModalBase'


export default {
  name: 'CardEditorModal',

  components: {
    CardEditor,
    ModalBase,
  },

  inject: ['actor', 'bus'],

  data() {
    return {
      updatedCard: null,
    }
  },

  methods: {
    cardUpdated({ updated }) {
      this.updatedCard = updated
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
