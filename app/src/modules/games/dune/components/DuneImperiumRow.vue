<template>
  <div class="imperium-row">
    <div class="section-header">Imperium Row</div>
    <div class="cards">
      <DuneCard v-for="card in rowCards" :key="card.id" :card="card" />
    </div>
    <div class="reserves">
      <DuneOptionChip v-if="firstPrepareCard"
                      name="Prepare the Way"
                      :card="firstPrepareCard"
                      :subtitle="`×${prepareCount} remaining`" />
      <span v-else class="reserve reserve-empty">Prepare the Way (0)</span>
      <DuneOptionChip v-if="firstSpiceCard"
                      name="The Spice Must Flow"
                      :card="firstSpiceCard"
                      :subtitle="`×${spiceMustFlowCount} remaining`" />
      <span v-else class="reserve reserve-empty">The Spice Must Flow (0)</span>
    </div>
  </div>
</template>


<script>
import DuneCard from './DuneCard.vue'
import DuneOptionChip from './DuneOptionChip.vue'

export default {
  name: 'DuneImperiumRow',

  components: { DuneCard, DuneOptionChip },

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

    firstPrepareCard() {
      return this.game.zones.byId('common.reserve.prepareTheWay').cardlist()[0] || null
    },

    firstSpiceCard() {
      return this.game.zones.byId('common.reserve.spiceMustFlow').cardlist()[0] || null
    },
  },
}
</script>


<style scoped>
.imperium-row {
  margin-bottom: .5em;
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: white;
}

.section-header {
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.reserves {
  display: flex;
  gap: .4em;
  margin-top: .4em;
  font-size: .8em;
  flex-wrap: wrap;
}

.reserve-empty {
  color: #aaa;
  font-style: italic;
  padding: .15em .5em;
}
</style>
