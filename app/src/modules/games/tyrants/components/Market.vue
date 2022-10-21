<template>
  <div class="market">
    <div class="title">Market</div>
    <GameCard v-if="Boolean(guard)" :card="guard" :show-cost="true" />
    <GameCard v-if="Boolean(priestess)" :card="priestess" :show-cost="true" />
    <hr class="market-separator" />
    <GameCard v-for="card in cards" :key="card.id" :card="card" :show-cost="true" />
  </div>
</template>


<script>
import GameCard from './GameCard.vue'

export default {
  name: 'Market',

  components: {
    GameCard,
  },

  inject: ['game'],

  computed: {
    cards() {
      return this.game.getZoneById('market').cards()
    },

    guard() {
      return this.game.getZoneById('guard').cards()[0]
    },

    priestess() {
      return this.game.getZoneById('priestess').cards()[0]
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

.market-separator {
  margin: 3px;
}

.title {
  font-size: 1.4em;
  font-weight: bold;
}
</style>
