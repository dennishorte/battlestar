<template>
  <div class="market">
    <div class="market-header">
      <div class="title">Market</div>
      <div class="cards-remaining">({{ cardsRemaining }})</div>
    </div>

    <div v-if="Boolean(guard)" class="card-with-count">
      <GameCard :card="guard" :show-cost="true" class="card-by-count" />
      <div class="card-count">{{ game.zones.byId('guard').cardlist().length }}</div>
    </div>

    <div v-if="Boolean(priestess)" class="card-with-count">
      <GameCard :card="priestess" :show-cost="true" class="card-by-count" />
      <div class="card-count">{{ game.zones.byId('priestess').cardlist().length }}</div>
    </div>

    <hr class="market-separator" />
    <GameCard v-for="card in cards"
              :key="card.id"
              :card="card"
              :show-cost="true" />
  </div>
</template>


<script>
import GameCard from './GameCard.vue'

export default {
  name: 'MarketZone',

  components: {
    GameCard,
  },

  inject: ['game'],

  computed: {
    cards() {
      return this
        .game
        .zones.byId('market')
        .cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
        .sort((l, r) => l.cost - r.cost)
    },

    cardsRemaining() {
      return this.game.zones.byId('marketDeck').cardlist().length
    },

    guard() {
      return this.game.zones.byId('guard').cardlist()[0]
    },

    priestess() {
      return this.game.zones.byId('priestess').cardlist()[0]
    },
  },
}
</script>


<style scoped>
.market {
  margin: 0 -15px;
  margin-bottom: 1em;
  padding: 5px 15px;
}

.card-with-count {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.card-by-count {
  flex-grow: 2;
  margin-right: .25em;
}

.card-count {
  color: #eee1f2;
  background-color: #78498c;
  padding: 4px;
  border: 1px solid #3b2345;
  border-radius: 3px;
}

.cards-remaining {
  margin-left: .5em;
}

.market-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.market-separator {
  margin: 3px;
}

.title {
  font-size: 1.4em;
  font-weight: bold;
}
</style>
