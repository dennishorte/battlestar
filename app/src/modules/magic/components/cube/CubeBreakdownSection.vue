<template>
  <div class="cube-breakdown-section">

    <div class="section-name">{{ name }} ({{ cardlist.length }})</div>

    <CardListItem v-for="card in cardlist" :card="card" />

  </div>
</template>


<script>
import CardListItem from '../CardListItem'


export default {
  name: 'CubeBreakdownSection',

  components: {
    CardListItem,
  },

  props: {
    cardlist: Array,
    name: String,
  },

  computed: {
  },
}
</script>


<style scoped>
.cube-breakdown-section {
  display: flex;
  flex-direction: column;
}
</style>
