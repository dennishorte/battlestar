<template>
  <b-modal id="tableau-modal" scrollable :title="title">
    <div class="trophyHall">
      <div class="title">Trophy Hall</div>
      <div class="trophies" v-if="trophyHall.length > 0">
        <div
          v-for="token in trophyHall"
          :key="token.id"
          :class="trophyClasses(token)"
        ></div>
      </div>

      <div v-else>
        — No Trophies —
      </div>
    </div>

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
      if (this.player) {
        return [
          ...this.game.getCardsByZone(this.player, 'deck'),
          ...this.game.getCardsByZone(this.player, 'hand'),
          ...this.game.getCardsByZone(this.player, 'played'),
          ...this.game.getCardsByZone(this.player, 'discard'),
        ].sort((l, r) => l.name.localeCompare(r.name))
      }
      else {
        return []
      }
    },

    player() {
      return this.ui.modals.tableau.player
    },

    title() {
      return `${this.player.name}'s tableau`
    },

    trophyHall() {
      return this.game.getCardsByZone(this.player, 'trophyHall')
    },
  },

  methods: {
    trophyClasses(troop) {
      const classes = ['trophy']

      if (troop.owner === undefined) {
        classes.push('neutral-element')
      }
      else {
        const color = this.ui.fn.getPlayerColor(this.game, troop.owner)
        classes.push(`${color}-element`)
      }

      return classes
    },
  },
}
</script>


<style scoped>
.title {
  font-size: 1.2em;
  font-weight: 500;
}

.trophies {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.trophy {
  height: 1.2em;
  width: 1.2em;
  min-width: 1.2em;
  border-radius: 50%;
  border: 1px solid black;
  margin: 1px;
}
</style>
