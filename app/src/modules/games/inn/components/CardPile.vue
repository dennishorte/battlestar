<template>
  <div class="card-pile">
    {{ zone.name.split('.').slice(-1)[0] }}

    <div v-if="expanded">
      <CardFull
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />
    </div>

    <div v-else class="card-pile-list">
      <CardSquare
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />
    </div>
  </div>
</template>

<script>
import CardFull from './CardFull'
import CardSquare from './CardSquare'

export default {
  name: 'CardPile',

  components: {
    CardFull,
    CardSquare,
  },

  props: {
    expanded: {
      type: Boolean,
      default: false,
    },

    zone: Object,
  },

  data() {
    return {
      showDetails: this.expanded,
    }
  },

  computed: {
    cards() {
      return this.zone.cards()
    },
  },
}
</script>

<style scoped>
.card-pile-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
