<template>
  <div class="player">
    <div class="header" :class="headerClasses(player)">
      {{ player.name }}
    </div>

    <div class="body">
      <div>
        <div>de/di: {{ deckCount }} / {{ discardCount }}</div>
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

    <div class="hand" v-if="player.name === actor.name">
      <GameCard v-for="card in hand" :key="card.id" :card="card" />
    </div>

    <div class="played">
      <GameCard v-for="card in playedCards" :key="card.id" :card="card" />
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

    discardCount() {
      return this.game.getCardsByZone(this.player, 'discard').length
    },

    hand() {
      return this.game.getCardsByZone(this.player, 'hand').sort((l, r) => l.name.localeCompare(r.name))
    },

    playedCards() {
      return this.game.getCardsByZone(this.player, 'played')
    },

    score() {
      return this.game.getScore(this.player)
    },

    spyCount() {
      return this.game.getCardsByZone(this.player, 'spies').length
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
