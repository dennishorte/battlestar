<template>
  <Modal id="tableau-modal" scrollable>
    <template #header>{{ title }}</template>

    <div class="row">
      <div class="col">

        <div class="trophyHall">
          <div class="title">Trophy Hall</div>
          <div class="trophies" v-if="trophyHall.length > 0">
            <div
              v-for="token in trophyHall"
              :key="token.id"
              :class="trophyClasses(token)"
            ></div>
          </div>

          <div class="no-trophies" v-else>
            — No Trophies —
          </div>
        </div>


        <div class="score">
          <div class="title">Score</div>
          <div v-for="[key, value] in scoreBreakdown" :key="key" class="score-line">
            <div class="score-key">{{ key }}</div>
            <div class="score-value">{{ value }}</div>
          </div>
        </div>

      </div>


      <div class="col-7">
        <div class="deck">
          <div class="title">All Cards in Deck</div>
          <GameCard v-for="card in allCards" :key="card.id" :card="card" />
        </div>
      </div>

    </div>
  </Modal>
</template>


<script>
import GameCard from './GameCard'
import Modal from '@/components/Modal'


export default {
  name: 'TableauModal',

  components: {
    GameCard,
    Modal,
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

    scoreBreakdown() {
      return this.player ? Object.entries(this.game.getScoreBreakdown(this.player)) : []
    },

    title() {
      return `${this.player.name}'s tableau`
    },

    trophyHall() {
      if (this.player) {
        return this.game.getCardsByZone(this.player, 'trophyHall')
      }
      else {
        return []
      }
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

.no-trophies {
  font-size: .8em;
}

.score-line {
  display: flex;
  flex-direction: row;
}

.score-key {
  min-width: 8em;
}
</style>
