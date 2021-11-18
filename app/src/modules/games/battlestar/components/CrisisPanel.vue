<template>
  <div class="main-crisis">
    <div class="description">

      <b-row>
        <b-col>
          <CrisisCard v-if="card.name" :card="card" />
        </b-col>
      </b-row>
    </div>


  </div>
</template>


<script>
import CrisisCard from './CrisisCard'

export default {
  name: 'CrisisPanel',

  components: {
    CrisisCard,
  },

  computed: {
    card() {
      return this.$game.getCrisis() || {}
    },
  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style>
