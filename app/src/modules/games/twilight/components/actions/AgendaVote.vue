<template>
  <div class="agenda-vote-action">

    <!-- Mode 1: Outcome Selection -->
    <template v-if="mode === 'outcome'">
      <div class="action-header">{{ agendaName }}</div>
      <div class="influence-badge">{{ availableInfluence }} influence available</div>

      <div class="outcome-buttons">
        <button
          v-for="outcome in outcomes"
          :key="outcome"
          class="btn btn-sm btn-outcome"
          @click="selectOutcome(outcome)"
        >{{ outcome }}</button>
      </div>

      <div class="secondary-buttons">
        <button class="btn btn-sm btn-outline-secondary" @click="selectOutcome('Abstain')">Abstain</button>
        <button
          v-if="hasTransaction"
          class="btn btn-sm btn-outline-secondary"
          @click="selectOutcome('Transaction')"
        >Transaction</button>
      </div>
    </template>

    <!-- Mode 2: Planet Exhaustion -->
    <template v-if="mode === 'exhaust'">
      <div class="action-header">Exhaust Planets for Votes</div>

      <div class="planet-list">
        <label
          v-for="planet in planets"
          :key="planet.raw"
          class="planet-row"
          :class="{ selected: planet.selected }"
          @click="togglePlanet(planet)"
        >
          <input type="checkbox" :checked="planet.selected" />
          <span class="planet-name">{{ planet.name }}</span>
          <span class="planet-influence">{{ planet.influence }}</span>
        </label>
      </div>

      <div class="exhaust-footer">
        <span class="vote-total">{{ totalSelectedInfluence }} votes</span>
        <div class="exhaust-buttons">
          <button class="btn btn-sm btn-outline-secondary" @click="confirmExhaust([])">Exhaust none</button>
          <button class="btn btn-sm btn-primary" @click="confirmExhaust(selectedPlanetRaws)">
            Confirm ({{ totalSelectedInfluence }} votes)
          </button>
        </div>
      </div>
    </template>

    <!-- Mode 3: Trade Good Spending -->
    <template v-if="mode === 'trade-goods'">
      <div class="action-header">Spend Trade Goods for Votes</div>
      <div class="tg-info">{{ tgVoteRate }} votes per TG</div>

      <div class="tg-controls">
        <button class="btn btn-sm btn-outline-secondary" @click="tgCount--" :disabled="tgCount <= 0">-</button>
        <span class="tg-count">{{ tgCount }} TG</span>
        <button class="btn btn-sm btn-outline-secondary" @click="tgCount++" :disabled="tgCount >= maxTG">+</button>
      </div>

      <div class="tg-preview">+{{ tgCount * tgVoteRate }} extra votes</div>

      <div class="action-buttons">
        <button class="btn btn-sm btn-primary" @click="confirmTG">Confirm</button>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  name: 'AgendaVote',

  props: {
    request: {
      type: Object,
      default: null,
    },
    playerName: { type: String, default: null },
  },

  inject: ['actor', 'game', 'bus'],

  data() {
    return {
      planets: [],
      tgCount: 0,
    }
  },

  computed: {
    title() {
      return this.request?.title || ''
    },

    mode() {
      const t = this.title.toLowerCase()
      if (t.includes('exhaust planets for votes')) {
        return 'exhaust'
      }
      if (t.includes('spend trade goods for extra votes')) {
        return 'trade-goods'
      }
      return 'outcome'
    },

    // --- Outcome mode ---
    agendaName() {
      // "Vote on {name} ({N} influence available)"
      const match = this.title.match(/^Vote on (.+?) \(\d+/)
      return match ? match[1] : this.title
    },

    availableInfluence() {
      const match = this.title.match(/\((\d+) influence available\)/)
      return match ? match[1] : '?'
    },

    choices() {
      return (this.request?.choices || []).map(c => typeof c === 'string' ? c : c.title)
    },

    outcomes() {
      return this.choices.filter(c => c !== 'Abstain' && c !== 'Transaction')
    },

    hasTransaction() {
      return this.choices.includes('Transaction')
    },

    // --- Exhaust mode ---
    selectedPlanetRaws() {
      return this.planets.filter(p => p.selected).map(p => p.raw)
    },

    totalSelectedInfluence() {
      return this.planets.filter(p => p.selected).reduce((sum, p) => sum + p.influence, 0)
    },

    // --- Trade goods mode ---
    tgVoteRate() {
      // "Spend trade goods for extra votes? ({N} votes per TG)"
      const match = this.title.match(/\((\d+) votes? per TG\)/)
      return match ? parseInt(match[1]) : 1
    },

    maxTG() {
      // Choices: "Spend 0 TG (...)", "Spend 1 TG (...)", ..., "Spend N TG (...)"
      return Math.max(0, this.choices.length - 1)
    },
  },

  watch: {
    request: {
      immediate: true,
      handler() {
        if (this.mode === 'exhaust') {
          this.parsePlanets()
        }
        if (this.mode === 'trade-goods') {
          this.tgCount = 0
        }
      },
    },
  },

  methods: {
    // --- Outcome mode ---
    selectOutcome(choice) {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: [choice],
      })
    },

    // --- Exhaust mode ---
    parsePlanets() {
      // Choices: "planetId (N)"
      this.planets = this.choices.map(raw => {
        const match = raw.match(/^(.+?) \((\d+)\)$/)
        if (match) {
          return { raw, name: match[1], influence: parseInt(match[2]), selected: false }
        }
        return { raw, name: raw, influence: 0, selected: false }
      })
    },

    togglePlanet(planet) {
      planet.selected = !planet.selected
    },

    confirmExhaust(selected) {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: selected,
      })
    },

    // --- Trade goods mode ---
    confirmTG() {
      // Find the matching choice string
      const choice = this.choices[this.tgCount] || this.choices[0]
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: [choice],
      })
    },
  },
}
</script>

<style scoped>
.agenda-vote-action {
  padding: .5em;
  background: #e8eaf6;
  border-left: 3px solid #5c6bc0;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .15em;
}

.influence-badge {
  font-size: .8em;
  color: #5c6bc0;
  font-weight: 600;
  margin-bottom: .5em;
}

.outcome-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: .35em;
  margin-bottom: .35em;
}

.btn-outcome {
  flex: 1;
  min-width: 80px;
  background: #5c6bc0;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: .4em .75em;
}
.btn-outcome:hover {
  background: #3f51b5;
  color: #fff;
}

.secondary-buttons {
  display: flex;
  gap: .35em;
}

/* Planet exhaust mode */
.planet-list {
  display: flex;
  flex-direction: column;
  gap: .2em;
  margin: .35em 0;
  max-height: 200px;
  overflow-y: auto;
}

.planet-row {
  display: flex;
  align-items: center;
  gap: .4em;
  padding: .25em .4em;
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ddd;
  font-size: .85em;
}
.planet-row:hover {
  background: #e8eaf6;
}
.planet-row.selected {
  background: #c5cae9;
  border-color: #5c6bc0;
}

.planet-row input[type="checkbox"] {
  pointer-events: none;
}

.planet-name {
  flex: 1;
}

.planet-influence {
  font-weight: 700;
  color: #5c6bc0;
  min-width: 1.5em;
  text-align: right;
}

.exhaust-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: .35em;
}

.vote-total {
  font-weight: 700;
  font-size: .9em;
  color: #5c6bc0;
}

.exhaust-buttons {
  display: flex;
  gap: .35em;
}

/* Trade goods mode */
.tg-info {
  font-size: .8em;
  color: #555;
  margin-bottom: .35em;
}

.tg-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5em;
  margin: .35em 0;
}

.tg-count {
  font-weight: 700;
  font-size: 1.1em;
  min-width: 3em;
  text-align: center;
}

.tg-preview {
  text-align: center;
  font-size: .85em;
  color: #5c6bc0;
  font-weight: 600;
  margin-bottom: .35em;
}

.action-buttons {
  display: flex;
  justify-content: center;
}
</style>
