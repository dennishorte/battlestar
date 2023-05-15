<template>
  <div class="card-selector">
    <div class="card-wrapper" v-for="card in visibleCards" :key="card.id">
      <Card :card="card" />
    </div>
  </div>
</template>



<script>
import Card from '@/modules/magic/components/Card'


export default {
  name: 'CardSelector',

  components: {
    Card
  },

  inject: ['game', 'actor'],

  computed: {
    pack() {
      return this.game.getNextPackForPlayer(this.player)
    },

    player() {
      return this.game.getPlayerByName(this.actor.name)
    },

    visibleCards() {
      return this
        .pack
        .getKnownCards(this.player)
        .map(c => this.game.cardLookupFunc(c))
    },
  },

  methods: {
    selectCard(cardId) {

    },
  },
}
</script>


<style scoped>
</style>
