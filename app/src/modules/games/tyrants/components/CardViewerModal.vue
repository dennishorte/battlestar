<template>
  <b-modal id="card-viewer-modal" scrollable title="Card Viewer">
    <GameCard v-if="card" :card="card" :show-cost="true" :expandedIn="true" />
    <template v-else>
      Card not found: {{ ui.modals.cardViewer.cardName }}
    </template>
  </b-modal>
</template>


<script>
import { tyr } from 'battlestar-common'

import GameCard from './GameCard'

export default {
  name: 'CardViewerModal',

  components: {
    GameCard,
  },

  inject: ['ui'],

  computed: {
    card() {
      const cardId = this.ui.modals.cardViewer.cardId
      return tyr.res.cards.byId[cardId]
    },
  }
}
</script>


<style scoped>
</style>
