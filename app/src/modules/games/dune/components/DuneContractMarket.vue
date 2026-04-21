<template>
  <div class="contract-market">
    <div class="section-header">CHOAM Contracts</div>
    <div class="cards">
      <DuneCard v-for="card in contracts" :key="card.id" :card="card" />
      <div v-if="contracts.length === 0" class="no-contracts">No contracts available</div>
    </div>
  </div>
</template>


<script>
import DuneCard from './DuneCard.vue'

export default {
  name: 'DuneContractMarket',

  components: { DuneCard },

  inject: ['game'],

  computed: {
    contracts() {
      return this.game.zones.byId('common.contractMarket').cardlist()
    },
  },
}
</script>


<style scoped>
.contract-market {
  margin: .5em 0;
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

.no-contracts {
  color: #8a7a68;
  font-style: italic;
  font-size: .85em;
}
</style>
