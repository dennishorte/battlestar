<template>
  <div v-if="card" class="deck-list-card" @click="highlightCard">
    {{ card.name }}
  </div>

  <div v-else class="deck-list-card unknown-card">
    unknown card: `{{ cardId }}`
  </div>
</template>


<script>
export default {
  name: 'DeckListCard',

  inject: ['bus', 'cardLookup'],

  props: {
    cardId: String,
  },

  computed: {
    card() {
      if (!this.cardId) {
        return undefined
      }

      const tokens = this.cardId.toLowerCase().split(' ')

      const setId = this.getSetId(tokens)
      const collectorNumber = this.getCollectorNumber(tokens)

      const cardName = setId ? tokens.slice(0, -2) : this.cardId
      const matchingCards = this.cardLookup[cardName] || []

      return matchingCards[0]
    },
  },

  methods: {
    getSetId(tokens) {
      const token = tokens.slice(-2, -1)[0]
      if (token) {
        return undefined
      }
      else {
        return undefined
      }
    },

    getCollectorNumber(tokens) {
      return tokens.slice(-1)[0]
    },

    highlightCard() {
      this.bus.emit('highlight-card', this.card)
    },
  },
}
</script>


<style scoped>
</style>
