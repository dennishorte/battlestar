<template>
  <div class="cards-data">
    <div class="card-column" v-for="exp in expansions" :key="exp">
      <TyrantsCardSet :expansion="exp" />
    </div>
  </div>
</template>


<script>
import TyrantsCardSet from './TyrantsCardSet.vue'

export default {
  name: 'TyrantsCards',

  components: {
    TyrantsCardSet,
  },

  data() {
    return {
      expansions: ['demons', 'dragons', 'drow', 'elementals', 'illithid', 'undead']
    }
  },
}
</script>


<style scoped>
.cards-data {
  display: flex;
  flex-direction: row;
  padding: .5em;
}

.card-column {
  flex: 1 1 0px;
}

.card-column:not(:first-of-type) {
  margin-left: .25em;
}
</style>
