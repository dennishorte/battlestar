<template>
  <b-modal id="cards-viewer-modal" class="cards-viewer-modal" size="xl" scrollable>
    <div class="card-viewer-list">
      <CardFull
        v-for="card in cards"
        :key="card.id"
        :card="card"
        class="viewer-card"
      />
    </div>
  </b-modal>
</template>


<script>
import CardFull from './CardFull'

export default {
  name: 'CardsViewerModal',

  components: {
    CardFull
  },

  inject: ['game'],

  computed: {
    cards() {
      return this.game.ui.modals.cardsViewer.cards
    },
  },
}
</script>


<style scoped>
.cards-viewer-modal {

}

.card-viewer-list {
  display: flex;
  flex-direction: row;
}

.viewer-card {
  margin-right: 1px;
  width: 250px;
}
</style>
