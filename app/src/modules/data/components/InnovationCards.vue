<template>
  <div class="cards-data">
    <div class="card-column" v-for="exp in expansions" :key="exp">
      <InnovationCardSet :expansion="exp" />
    </div>
  </div>
</template>


<script>
import InnovationCardSet from './InnovationCardSet'

export default {
  name: 'InnovationData',

  components: {
    InnovationCardSet,
  },

  data() {
    return {
      expansions: ['base', 'city', 'usee'],
    }
  },
}
</script>


<style scoped>
.cards-data {
  display: flex;
  flex-direction: row;
}

.card-column:not(:first-of-type) {
  margin-left: .25em;
}
</style>
