<template>
  <div class="card-pile">
    {{ zone.name.split('.').slice(-1)[0] }}
    <div class="card-pile-list">
      <CardSquare
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />
    </div>
  </div>
</template>

<script>
import CardSquare from './CardSquare'

export default {
  name: 'CardPile',

  components: {
    CardSquare,
  },

  props: {
    zone: Object
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
