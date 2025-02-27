<template>
  <Modal id="cards-viewer-modal" scrollable>
    <template #header>{{ title }}</template>
    <div class="card-viewer-list">
      <CardFull
        v-for="card in cards"
        :key="card.id"
        :card="card"
        class="viewer-card"
      />
    </div>
  </Modal>
</template>


<script>
import CardFull from './CardFull'
import Modal from '@/components/Modal'

export default {
  name: 'CardsViewerModal',

  components: {
    CardFull,
    Modal,
  },

  inject: ['game'],

  computed: {
    cards() {
      return this.game.ui.modals.cardsViewer.cards
    },

    title() {
      return this.game.ui.modals.cardsViewer.title
    },
  },
}
</script>


<style scoped>
.cards-viewer-modal {

}

.card-viewer-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewer-card {
  margin-right: 1px;
  width: 250px;
}
</style>
