<template>
  <div v-if="card" class="deck-list-card" @click="click">
    <div class="name">
      {{ displayName }}
    </div>
    <ManaCost class="mana-cost" :cost="manaCost" />
  </div>

  <div v-else class="deck-list-card unknown-card">
    unknown card: `{{ cardId }}`
  </div>
</template>


<script>
import ManaCost from '../ManaCost'

export default {
  name: 'DeckListCard',

  components: {
    ManaCost,
  },

  inject: ['cardLookup'],

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

    displayName() {
      if (this.card.card_faces) {
        return this.card.card_faces[0].name
      }
      else {
        return this.card.name
      }
    },

    manaCost() {
      if (this.card.card_faces) {
        return this.card.card_faces[0].mana_cost
      }
      else {
        return this.card.mana_cost
      }
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

    click() {
      this.$store.dispatch('magic/dm/manageCard', this.card)
    },
  },
}
</script>


<style scoped>
.deck-list-card {
  position: relative;
  margin-right: .5em;

  width: 100%;
  max-width: 18em;
  max-height: 1.4em;
  overflow: hidden;
}

.name {
  overflow: hidden;
  max-height: 1.4em;
}

.mana-cost {
  position: absolute;
  top: 0;
  right: 0;
  font-size: .8em;
  padding-top: 1px;
  padding-left: 5px;
  background-color: white;
  height: 100%;
}
</style>
