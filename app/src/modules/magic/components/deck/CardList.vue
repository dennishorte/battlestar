<template>
  <div class="card-list">
    Card List

    <div v-for="name in cardNames" :key="name" class="game-card">
      {{ name }}
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'


export default {
  name: 'CardList',

  props: {
    cards: Array,  // Each card will be an object as stored in MongoDB.
  },

  computed: {
    cardNames() {
      return util.array.distinct(this.cards.map(c => c.name)).sort()
    },
  },
}
</script>


<style scoped>
.card-list {
  font-size: .8em;
}
</style>
