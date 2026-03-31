<template>
  <div class="contract-market">
    <div class="section-header">CHOAM Contracts</div>
    <div class="cards">
      <div v-for="card in contracts" :key="card.id" class="contract-card">
        <span class="contract-name">{{ card.name }}</span>
      </div>
      <div v-if="contracts.length === 0" class="no-contracts">No contracts available</div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'DuneContractMarket',

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

.contract-card {
  display: inline-flex;
  padding: .15em .5em;
  border-radius: .2em;
  background-color: #2a2318;
  border: 1px solid #5a6020;
  font-size: .85em;
}

.contract-name {
  color: #c8d888;
}

.no-contracts {
  color: #6a5a48;
  font-style: italic;
  font-size: .85em;
}
</style>
