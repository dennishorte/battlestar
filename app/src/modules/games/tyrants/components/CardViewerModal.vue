<template>
  <ModalBase id="card-viewer-modal" scrollable>
    <template #header>Card Viewer</template>

    <GameCard v-if="card"
              :card="card"
              :show-cost="true"
              :expandedIn="true" />
    <template v-else>
      Card not found: {{ ui.modals.cardViewer.cardName }}
    </template>
  </ModalBase>
</template>


<script>
import { tyr } from 'battlestar-common'

import GameCard from './GameCard'
import ModalBase from '@/components/ModalBase'

export default {
  name: 'CardViewerModal',

  components: {
    GameCard,
    ModalBase,
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
