<template>
  <div class="conflict">
    <div class="section-header">
      Conflict
      <span class="round-info">Round {{ game.state.round }} — {{ game.state.phase }}</span>
    </div>

    <div v-if="conflictCard" class="conflict-card">
      <div class="conflict-name">{{ conflictCard.name }}</div>
      <div class="conflict-tier">Tier {{ conflictCard.tier }}</div>
    </div>
    <div v-else class="no-conflict">No active conflict</div>

    <div class="deployments" v-if="hasDeployments">
      <div v-for="(count, playerName) in game.state.conflict.deployedTroops"
           :key="'troop-' + playerName"
           class="deployment">
        <span class="deploy-player">{{ playerName }}</span>
        <span>{{ count }} troops</span>
        <span v-if="sandworms[playerName]">+ {{ sandworms[playerName] }} sandworms</span>
      </div>
    </div>

    <div class="conflict-deck-info">
      {{ conflictDeckCount }} conflicts remaining
    </div>
  </div>
</template>


<script>
export default {
  name: 'DuneConflict',

  inject: ['game'],

  computed: {
    conflictCard() {
      const cards = this.game.zones.byId('common.conflictActive').cardlist()
      if (cards.length > 0) {
        return cards[0].data || cards[0]
      }
      return this.game.state.conflict.currentCard
    },

    sandworms() {
      return this.game.state.conflict.deployedSandworms || {}
    },

    hasDeployments() {
      const troops = this.game.state.conflict.deployedTroops || {}
      return Object.values(troops).some(v => v > 0)
    },

    conflictDeckCount() {
      return this.game.zones.byId('common.conflictDeck').cardlist().length
    },
  },
}
</script>


<style scoped>
.conflict {
  padding: .5em;
  border: 1px solid #3d2e1a;
  border-radius: .3em;
  margin-bottom: .5em;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #e8a83e;
  margin-bottom: .3em;
}

.round-info {
  font-weight: 400;
  font-size: .85em;
  color: #8a7a68;
}

.conflict-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a2318;
  padding: .3em .5em;
  border-radius: .2em;
  border: 1px solid #5a4020;
}

.conflict-name {
  font-weight: bold;
  color: #f0d8a0;
}

.conflict-tier {
  font-size: .85em;
  color: #b8a888;
}

.no-conflict {
  color: #6a5a48;
  font-style: italic;
}

.deployments {
  margin-top: .4em;
}

.deployment {
  display: flex;
  gap: .5em;
  font-size: .85em;
  padding: .1em 0;
}

.deploy-player {
  font-weight: 600;
}

.conflict-deck-info {
  margin-top: .3em;
  font-size: .8em;
  color: #6a5a48;
}
</style>
