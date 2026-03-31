<template>
  <div class="imperium-row">
    <div class="section-header">Imperium Row</div>
    <div class="cards">
      <DuneCard v-for="card in rowCards" :key="card.id" :card="card" />
    </div>
    <div class="reserves">
      <span class="reserve">Prepare the Way ({{ prepareCount }})</span>
      <span class="reserve">The Spice Must Flow ({{ spiceMustFlowCount }})</span>
    </div>
  </div>
</template>


<script>
import DuneCard from './DuneCard.vue'

export default {
  name: 'DuneImperiumRow',

  components: { DuneCard },

  inject: ['game'],

  computed: {
    rowCards() {
      return this.game.zones.byId('common.imperiumRow').cardlist()
    },

    prepareCount() {
      return this.game.zones.byId('common.reserve.prepareTheWay').cardlist().length
    },

    spiceMustFlowCount() {
      return this.game.zones.byId('common.reserve.spiceMustFlow').cardlist().length
    },
  },
}
</script>


<style scoped>
.imperium-row {
  margin: .5em 0;
  padding: .5em;
  border: 1px solid #3d2e1a;
  border-radius: .3em;
}

.section-header {
  font-weight: 600;
  font-size: .9em;
  color: #e8a83e;
  margin-bottom: .3em;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.reserves {
  display: flex;
  gap: 1em;
  margin-top: .4em;
  font-size: .8em;
  color: #8a7a68;
}
</style>
