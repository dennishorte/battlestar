<template>
  <div class="conflict">
    <div class="section-header">
      Conflict
      <span class="round-info">Round {{ game.state.round }} — {{ game.state.phase }}</span>
    </div>

    <div v-if="conflictCard" class="conflict-card">
      <div class="conflict-main">
        <span class="conflict-name">{{ conflictCard.name }}</span>
        <span class="battle-icon" v-if="conflictCard.battleIcon" :title="conflictCard.battleIcon">
          {{ battleIconLabel(conflictCard.battleIcon) }}
        </span>
        <span class="conflict-tier">Tier {{ conflictCard.tier }}</span>
      </div>
      <div class="rewards" v-if="conflictCard.rewards">
        <div class="reward-line"><span class="reward-label">1st:</span> {{ conflictCard.rewards.first }}</div>
        <div class="reward-line"><span class="reward-label">2nd:</span> {{ conflictCard.rewards.second }}</div>
        <div class="reward-line" v-if="conflictCard.rewards.third"><span class="reward-label">3rd:</span> {{ conflictCard.rewards.third }}</div>
      </div>
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

  methods: {
    battleIconLabel(icon) {
      const labels = {
        'desert-mouse': '🐭',
        crysknife: '🗡',
        ornithopter: '🦅',
        wild: '★',
      }
      return labels[icon] || icon
    },
  },
}
</script>


<style scoped>
.conflict {
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  margin-bottom: .5em;
  background-color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.round-info {
  font-weight: 400;
  font-size: .85em;
  color: #8a7a68;
}

.conflict-card {
  background-color: #f5f0e8;
  padding: .4em .5em;
  border-radius: .2em;
  border: 1px solid #d4c8a8;
}

.conflict-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conflict-name {
  font-weight: bold;
  color: #2c2416;
}

.battle-icon {
  font-size: 1.1em;
}

.conflict-tier {
  font-size: .85em;
  color: #8a7a68;
}

.rewards {
  margin-top: .3em;
  padding-top: .3em;
  border-top: 1px solid #e0d8c8;
}

.reward-line {
  font-size: .85em;
  color: #4a3a20;
  padding: .1em 0;
}

.reward-label {
  font-weight: 600;
  color: #8b6914;
}

.no-conflict {
  color: #8a7a68;
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
  color: #8a7a68;
}
</style>
