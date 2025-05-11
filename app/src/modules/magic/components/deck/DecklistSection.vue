<template>
  <div class="deck-section">
    <SectionHeader>
      {{ name }} ({{ count }})
    </SectionHeader>

    <div v-for="group in groupedCards" :key="group.card._id" class="card-and-count">
      <div class="card-count">{{ group.count }}x </div>
      <CardListItem
        :card="group.card"
        :show-mana-cost="true"
        :separate-faces="true"
        @click="click(group.card)" />
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import CardListItem from '../CardListItem'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'DecklistSection',

  components: {
    CardListItem,
    SectionHeader,
  },

  emits: ['card-clicked'],

  props: {
    cards: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    count() {
      return this.cards.length
    },

    groupedCards() {
      return Object
        .entries(
          util
            .array
            .groupBy(this.cards, card => card._id)
        )
        .map(([, cards]) => ({
          count: cards.length,
          card: cards[0],
        }))
    },
  },

  methods: {
    click(card){
      this.$emit('card-clicked', { card, zone: this.name })
    },
  },
}
</script>


<style scoped>
.deck-section {
  min-width: 18em;
  max-width: 18em;
}

.deck-section-header {
  font-size: 1.2em;
  margin-top: 1em;
  margin-left: .25em;
}

.card-and-count {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: top;
}

.card-count {
  margin-right: .25em;
}
</style>
