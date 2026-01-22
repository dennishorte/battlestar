<template>
  <ModalBase id="card-viewer-modal" scrollable>
    <template #header>Card Viewer</template>

    <GameCard v-if="card"
              :card="card"
              :show-cost="true"
              :expandedIn="true" />
    <template v-else>
      Card not found: {{ ui.modals.cardViewer.cardId }}
    </template>
  </ModalBase>
</template>


<script>
import GameCard from './GameCard'
import ModalBase from '@/components/ModalBase'

export default {
  name: 'CardViewerModal',

  components: {
    GameCard,
    ModalBase,
  },

  inject: ['game', 'ui'],

  computed: {
    card() {
      const cardId = this.ui.modals.cardViewer.cardId
      return this.game.cards.byId(cardId)
    },
  }
}
</script>


<style scoped>
</style>
