<template>
  <div class="devoured" @click="toggle">
    <span class="title">Devoured</span> ({{ count }})

    <div v-if="show">
      <GameCard v-for="card in cards" :key="card.id" :card="card" :show-cost="true" />
    </div>
  </div>
</template>


<script>
import GameCard from './GameCard'


export default {
  name: 'Devoured',

  components: {
    GameCard,
  },

  inject: ['game'],

  data() {
    return {
      show: false,
    }
  },

  computed: {
    cards() {
      return this.game.getZoneById('devoured').cards()
    },

    count() {
      return this.game.getZoneById('devoured').cards().length
    },
  },

  methods: {
    toggle() {
      this.show = !this.show
    },
  },
}
</script>


<style scoped>
.title {
  font-size: 1.4em;
  font-weight: bold;
}
</style>
