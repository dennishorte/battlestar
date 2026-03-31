<template>
  <div class="contract-market">
    <div class="section-header">CHOAM Contracts</div>
    <div class="cards">
      <div v-for="card in contracts" :key="card.id" class="contract-card">
        <div class="contract-name">{{ card.name }}</div>
        <div class="contract-reward" v-if="reward(card)">{{ reward(card) }}</div>
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

  methods: {
    reward(card) {
      const def = card.definition || card.data || card
      return def.reward || null
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

.contract-card {
  display: flex;
  flex-direction: column;
  padding: .25em .5em;
  border-radius: .2em;
  background-color: #f0f5e8;
  border: 1px solid #b8c888;
  font-size: .85em;
}

.contract-name {
  color: #4a5a20;
  font-weight: 600;
}

.contract-reward {
  font-size: .9em;
  color: #6a7a48;
}

.no-contracts {
  color: #8a7a68;
  font-style: italic;
  font-size: .85em;
}
</style>
