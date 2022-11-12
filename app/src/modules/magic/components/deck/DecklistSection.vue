<template>
  <div class="deck-section">
    <SectionHeader>
      {{ name }} ({{ count }})
    </SectionHeader>

    <div v-for="card in cards" class="card-and-count">
      <div class="card-count">{{ card.count }} </div>
      <DecklistCard :card="card.card" />
    </div>
  </div>
</template>


<script>
import DecklistCard from './DecklistCard'
import SectionHeader from '@/components/SectionHeader'

export default {
  name: 'DecklistSection',

  components: {
    DecklistCard,
    SectionHeader,
  },

  props: {
    cards: Array,
    name: String,
  },

  computed: {
    count() {
      return this.cards.reduce((acc, datum) => acc + datum.count, 0)
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
}

.card-count {
  margin-right: .25em;
}
</style>
