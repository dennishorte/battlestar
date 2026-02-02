<template>
  <div class="round-info" @click="ui.fn.showGameOverview()">
    <div class="round-stage">
      <span class="round-label">Round</span>
      <span class="round-number">{{ game.state.round }}</span>
      <span class="round-divider">/</span>
      <span class="round-total">14</span>
      <span class="stage-badge">Stage {{ game.state.stage }}</span>
    </div>

    <div class="harvest-indicator" v-if="isHarvestRound">
      Harvest Round
    </div>

    <div class="next-harvest" v-else>
      Next harvest: Round {{ nextHarvestRound }}
    </div>

    <div class="starting-player">
      Starting Player: <strong>{{ game.state.startingPlayer }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoundInfo',

  inject: ['game', 'ui'],

  data() {
    return {
      harvestRounds: [4, 7, 9, 11, 13, 14],
    }
  },

  computed: {
    isHarvestRound() {
      return this.harvestRounds.includes(this.game.state.round)
    },

    nextHarvestRound() {
      return this.harvestRounds.find(r => r > this.game.state.round) || 14
    },
  },
}
</script>

<style scoped>
.round-info {
  background-color: #f5f5dc;
  border: 2px solid #8B4513;
  border-radius: .5em;
  padding: .75em;
  margin-bottom: 1em;
  cursor: pointer;
}

.round-stage {
  display: flex;
  align-items: center;
  gap: .25em;
  font-size: 1.1em;
  margin-bottom: .5em;
}

.round-label {
  color: #555;
}

.round-number {
  font-weight: bold;
  font-size: 1.4em;
  color: #2a5a1a;
}

.round-divider {
  color: #888;
}

.round-total {
  color: #888;
}

.stage-badge {
  margin-left: auto;
  background-color: #8B4513;
  color: white;
  padding: .15em .5em;
  border-radius: .25em;
  font-size: .85em;
}

.harvest-indicator {
  background-color: #DAA520;
  color: white;
  text-align: center;
  padding: .25em;
  border-radius: .25em;
  font-weight: bold;
  margin-bottom: .5em;
}

.next-harvest {
  color: #666;
  font-size: .9em;
  margin-bottom: .5em;
}

.starting-player {
  font-size: .9em;
  color: #444;
}
</style>
