<template>
  <b-row>
    <b-col cols="5" class="card-names">
      <div v-for="card in cardNames" :key="card" @click="selectCard(card)">
        {{ card }}
      </div>
    </b-col>

    <b-col>
      <div v-if="!!card">
        <p><strong>{{ card.name }}</strong></p>
        <p>{{ card.text }}</p>
      </div>
    </b-col>
  </b-row>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'QuorumCardViewer',

  computed: {
    cards() {
      return this.$game.data.filtered.quorumCards
    },

    card() {
      return this.cards.find(c => c.name === this.cardName)
    },

    cardName() {
      return this.$game.ui.modal.quorumCard
    },

    cardNames() {
      return util.array.distinct(this.cards.map(c => c.name))
    },
  },

  methods: {
    selectCard(cardName) {
      this.$game.ui.modal.quorumCard = cardName
    }
  },
}
</script>


<style scoped>
.card-names {
  font-size: .8rem;
}
</style>
