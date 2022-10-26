<template>
  <b-modal id="tableau-modal" scrollable :title="title">
    <div class="deck">
      <div class="title">All Cards in Deck</div>
      <GameCard v-for="card in allCards" :key="card.id" :card="card" />
    </div>
  </b-modal>
</template>


<script>
import GameCard from './GameCard'


export default {
  name: 'TableauModal',

  components: {
    GameCard,
  },

  inject: ['game', 'ui'],

  computed: {
    allCards() {
      return [
        ...this.game.getCardsByZone(this.player, 'deck'),
        ...this.game.getCardsByZone(this.player, 'hand'),
        ...this.game.getCardsByZone(this.player, 'played'),
        ...this.game.getCardsByZone(this.player, 'discard'),
      ].sort((l, r) => l.name.localeCompare(r.name))
    },

    player() {
      return this.ui.modals.tableau.player
    },

    title() {
      return `${this.player.name}'s tableau`
    },
  }
}
</script>


<style scoped>
</style>
