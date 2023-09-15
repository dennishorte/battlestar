<template>
  <Modal id="tableau-modal" scrollable>
    <template #header>{{ title }}</template>

    <div class="row" v-if="!!player">
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

        <div class="aspects">
          <div class="title">Aspects</div>
          <div v-for="[key, value] in aspects" class="score-line">
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

        <div class="inner-circle">
          <div class="title">Inner Circle</div>
          <GameCard v-for="card in innerCircleCards" :key="card.id" :card="card" />
        </div>

        <div class="discard">
          <div class="title">Discard</div>
          <GameCard v-for="card in discardCards" :key="card.id" :card="card" />
        </div>
      </div>

    </div>
  </Modal>
</template>


<script>
import { util } from 'battlestar-common'

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
      return [
        ...this.game.getCardsByZone(this.player, 'deck'),
        ...this.game.getCardsByZone(this.player, 'hand'),
        ...this.game.getCardsByZone(this.player, 'played'),
        ...this.game.getCardsByZone(this.player, 'discard'),
      ].sort((l, r) => l.name.localeCompare(r.name))
    },

    aspects() {
      const groups = util.array.groupBy(this.allCards, card => card.aspect)
      const counts = Object
        .entries(groups)
        .map(([aspect, cards]) => [aspect, cards.length])
        .sort((l, r) => l[0].localeCompare(r[0]))
      return counts
    },

    discardCards() {
      return this
        .game
        .getCardsByZone(this.player, 'discard')
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    innerCircleCards() {
      return this
        .game
        .getCardsByZone(this.player, 'innerCircle')
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    player() {
      return this.ui.modals.tableau.player
    },

    scoreBreakdown() {
      return Object.entries(this.game.getScoreBreakdown(this.player))
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
  margin-top: .5em;
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
