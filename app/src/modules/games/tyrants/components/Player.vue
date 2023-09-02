<template>
  <div class="player">
    <div class="details" @click="showTableauModal">
      <div class="header" :class="headerClasses(player)">
        {{ player.name }}
      </div>

      <div class="body">
        <div>
          <div>deck: {{ deckCount }} / {{ totalCardCount }}</div>
          <div>score: {{ score }}</div>
        </div>

        <div>
          <div>inf: {{ player.influence }}</div>
          <div>pow: {{ player.power }}</div>
        </div>

        <div>
          <div>t: {{ troopCount }}</div>
          <div>s: {{ spyCount }}</div>
        </div>
      </div>
    </div>

    <div class="hand" v-if="player.name === actor.name">
      <div class="header">hand</div>
      <GameCard v-for="card in hand" :key="card.id" :card="card" :expanded-in="true" />
    </div>

    <div class="played" v-if="playedCards.length > 0">
      <div class="header">played</div>
      <GameCard v-for="card in playedCards" :key="card.id" :card="card" :expanded-in="true" />
    </div>
  </div>
</template>


<script>
import GameCard from './GameCard'

export default {
  name: 'Player',

  components: {
    GameCard,
  },

  inject: ['actor', 'game', 'ui'],

  props: {
    player: Object,
  },

  computed: {
    deckCount() {
      return this.game.getCardsByZone(this.player, 'deck').length
    },

    hand() {
      return this
        .game
        .getCardsByZone(this.player, 'hand')
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    playedCards() {
      return this
        .game
        .getCardsByZone(this.player, 'played')
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    score() {
      return this.game.getScore(this.player)
    },

    spyCount() {
      return this.game.getCardsByZone(this.player, 'spies').length
    },

    totalCardCount() {
      return (
        + this.game.getCardsByZone(this.player, 'deck').length
        + this.game.getCardsByZone(this.player, 'hand').length
        + this.game.getCardsByZone(this.player, 'played').length
        + this.game.getCardsByZone(this.player, 'discard').length
      )
    },

    troopCount() {
      return this.game.getCardsByZone(this.player, 'troops').length
    },
  },

  methods: {
    headerClasses(player) {
      const classes = []

      const color = this.ui.fn.getPlayerColor(this.game, player)
      classes.push(`${color}-element`)

      return classes
    },

    showTableauModal() {
      this.ui.modals.tableau.player = this.player
      this.$modal('tableau-modal').show()
    },
  },
}
</script>


<style scoped>
.header {
  border-color: #2f1f36;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  margin: 0 1em;
  margin-bottom: 1px;
}

.body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
