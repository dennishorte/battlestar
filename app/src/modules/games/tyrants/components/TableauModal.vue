<template>
  <ModalBase id="tableau-modal" scrollable>
    <template #header>{{ title }}</template>

    <div class="row" v-if="!!player">
      <div class="col">

        <div class="trophyHall">
          <div class="title">Trophy Hall</div>
          <div class="trophies" v-if="trophyHall.length > 0">
            <div
              v-for="token in trophyHall"
              :key="token.id"
              class="troop-space"
              :style="ui.fn.troopStyle(token)"
            />
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
          <div v-for="[key, value] in aspects" :key="key" class="score-line">
            <div class="score-key">{{ key }}</div>
            <div class="score-value">{{ value }}</div>
          </div>
        </div>
      </div>


      <div class="col-7">
        <div class="deck">
          <div class="title">Deck</div>
          <GameCard v-for="card in deckCards" :key="card.id" :card="card" />
        </div>

        <div class="hand">
          <div class="title">Hand/Played</div>
          <GameCard v-for="card in handCards" :key="card.id" :card="card" />
        </div>

        <div class="discard">
          <div class="title">Discard</div>
          <GameCard v-for="card in discardCards" :key="card.id" :card="card" />
        </div>

        <div class="inner-circle">
          <div class="title">Inner Circle</div>
          <GameCard v-for="card in innerCircleCards" :key="card.id" :card="card" />
        </div>
      </div>

    </div>
  </ModalBase>
</template>


<script>
import { util } from 'battlestar-common'

import GameCard from './GameCard'
import ModalBase from '@/components/ModalBase'


export default {
  name: 'TableauModal',

  components: {
    GameCard,
    ModalBase,
  },

  inject: ['actor', 'game', 'ui'],

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

    deckCards() {
      if (this.isOwner) {
        return this
          .game
          .getCardsByZone(this.player, 'deck')
          .sort((l, r) => l.name.localeCompare(r.name))
      }
      else {
        return [
          ...this.game.getCardsByZone(this.player, 'deck'),
          ...this.game.getCardsByZone(this.player, 'hand'),
        ].sort((l, r) => l.name.localeCompare(r.name))
      }
    },

    discardCards() {
      return this
        .game
        .getCardsByZone(this.player, 'discard')
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    handCards() {
      if (this.isOwner) {
        return [
          ...this.game.getCardsByZone(this.player, 'hand'),
          ...this.game.getCardsByZone(this.player, 'played'),
        ].sort((l, r) => l.name.localeCompare(r.name))
      }
      else {
        return this
          .game
          .getCardsByZone(this.player, 'played')
          .sort((l, r) => l.name.localeCompare(r.name))
      }
    },

    innerCircleCards() {
      return this
        .game
        .getCardsByZone(this.player, 'innerCircle')
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    isOwner() {
      return this.player.name === this.actor.name
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
