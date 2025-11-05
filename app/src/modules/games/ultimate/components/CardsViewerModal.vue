<template>
  <ModalBase id="cards-viewer-modal" scrollable>
    <template #header>{{ title }}</template>
    <div class="card-viewer-list">
      <CardFull
        v-for="card in cards"
        :key="card.id"
        :card="card"
        class="viewer-card"
      />
    </div>
  </ModalBase>
</template>


<script>
import CardFull from './CardFull'
import ModalBase from '@/components/ModalBase'

export default {
  name: 'CardsViewerModal',

  components: {
    CardFull,
    ModalBase,
  },

  inject: ['game'],

  computed: {
    cards() {
      return this.game.ui.modals.cardsViewer.cards.filter(card => !card.isMuseum)
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
