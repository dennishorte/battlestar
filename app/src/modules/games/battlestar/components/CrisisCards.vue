<template>
  <b-row class="skill-cards">
    <b-col cols="5">
      <div
        v-for="card in cardsAll"
        :key="card.id"
        @click="selectCard(card)"
        :class="cardClasses(card)"
        class="card-names"
      >
        {{ card.name }}
      </div>
    </b-col>

    <b-col cols="7">
      <CrisisCard v-if="!!selected" :card="selected" />
    </b-col>
  </b-row>
</template>


<script>
import CrisisCard from './CrisisCard'

export default {
  name: 'CrisisCards',

  components: {
    CrisisCard,
  },

  data() {
    return {
    }
  },

  computed: {
    cardsAll() {
      return []
        .concat(this.$game.data.filtered.crisisCards)
        .concat(this.$game.data.filtered.superCrisisCards)
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    selected() {
      const cardName = this.$game.ui.modal.crisisCards
      return this.cardsAll.find(c => c.name === cardName)
    },
  },

  methods: {
    cardClasses(card) {
      if (this.selected && this.selected.name === card.name) {
        return 'selected'
      }
      else {
        return ''
      }
    },

    selectCard(card) {
      this.$game.ui.modal.crisisCards = card.name
    },
  },
}
</script>


<style scoped>
.card-name {
  overflow: hidden;
  height: 1.5em;
}

.card-names {
  font-size: .8em;
  padding-left: .25em;
}

.selected {
  background-color: #ddd;
  border-radius: .25em;
}
</style>
