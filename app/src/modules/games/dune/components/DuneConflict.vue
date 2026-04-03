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

    <div class="deployments" v-if="combatants.length">
      <div v-for="entry in combatants"
           :key="entry.name"
           class="combatant"
           @click="toggleExpand(entry.name)">
        <div class="combatant-header">
          <span class="combatant-name">{{ entry.name }}</span>
          <span class="combatant-strength">{{ entry.strength }}</span>
          <span class="expand-icon" v-if="entry.breakdown.length > 1">
            {{ expanded[entry.name] ? '▾' : '▸' }}
          </span>
        </div>
        <div class="breakdown" v-if="expanded[entry.name] && entry.breakdown.length > 1">
          <div v-for="(item, i) in entry.breakdown" :key="i" class="breakdown-row">
            <span class="breakdown-label">{{ item.label }}</span>
            <span class="breakdown-amount">+{{ item.amount }}</span>
          </div>
        </div>
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

  data() {
    return {
      expanded: {},
    }
  },

  computed: {
    conflictCard() {
      const cards = this.game.zones.byId('common.conflictActive').cardlist()
      if (cards.length > 0) {
        return cards[0].data || cards[0]
      }
      return this.game.state.conflict.currentCard
    },

    combatants() {
      const troops = this.game.state.conflict.deployedTroops || {}
      const sandworms = this.game.state.conflict.deployedSandworms || {}
      const breakdown = this.game.state.conflict.strengthBreakdown || {}
      const players = this.game.players.all()

      const result = []
      for (const player of players) {
        const t = troops[player.name] || 0
        const s = sandworms[player.name] || 0
        if (t + s === 0 && player.strength === 0) {
          continue
        }
        result.push({
          name: player.name,
          strength: player.strength,
          breakdown: breakdown[player.name] || [],
        })
      }

      result.sort((a, b) => b.strength - a.strength)
      return result
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

    toggleExpand(name) {
      this.expanded[name] = !this.expanded[name]
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

.combatant {
  border: 1px solid #e0d8c8;
  border-radius: .2em;
  margin-bottom: .2em;
  cursor: pointer;
}

.combatant:hover {
  background-color: #faf8f4;
}

.combatant-header {
  display: flex;
  align-items: center;
  gap: .5em;
  padding: .25em .4em;
  font-size: .85em;
}

.combatant-name {
  font-weight: 600;
  flex: 1;
}

.combatant-strength {
  font-weight: bold;
  color: #c04040;
  font-size: 1.1em;
}

.expand-icon {
  color: #8a7a68;
  font-size: .8em;
  width: 1em;
  text-align: center;
}

.breakdown {
  padding: 0 .4em .3em 1em;
  border-top: 1px solid #e8e0d4;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  font-size: .8em;
  color: #6a5a48;
  padding: .1em 0;
}

.breakdown-label {
  flex: 1;
}

.breakdown-amount {
  font-weight: 600;
  color: #8b6914;
}

.conflict-deck-info {
  margin-top: .3em;
  font-size: .8em;
  color: #8a7a68;
}
</style>
