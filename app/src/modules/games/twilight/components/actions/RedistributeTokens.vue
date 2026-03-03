<template>
  <div class="redistribute-tokens-action">
    <div class="action-header">{{ headerText }}</div>

    <div v-if="newTokenCount > 0" class="unallocated-info">
      Unallocated: {{ unallocatedTokens }}
    </div>
    <div v-else class="token-total">Total: {{ totalTokens }}</div>

    <div class="token-pools">
      <div class="pool">
        <div class="pool-label">Tactic</div>
        <div class="pool-controls">
          <button class="btn btn-sm btn-outline-secondary" @click="tactics--" :disabled="tactics <= baseTactics">-</button>
          <span class="pool-count">{{ tactics }}</span>
          <button class="btn btn-sm btn-outline-secondary" @click="tactics++" :disabled="!canAdd">+</button>
        </div>
        <div v-if="newTokenCount > 0" class="pool-base">{{ baseTactics }}</div>
      </div>

      <div class="pool">
        <div class="pool-label">Strategy</div>
        <div class="pool-controls">
          <button class="btn btn-sm btn-outline-secondary" @click="strategy--" :disabled="strategy <= baseStrategy">-</button>
          <span class="pool-count">{{ strategy }}</span>
          <button class="btn btn-sm btn-outline-secondary" @click="strategy++" :disabled="!canAdd">+</button>
        </div>
        <div v-if="newTokenCount > 0" class="pool-base">{{ baseStrategy }}</div>
      </div>

      <div class="pool">
        <div class="pool-label">Fleet</div>
        <div class="pool-controls">
          <button class="btn btn-sm btn-outline-secondary" @click="fleet--" :disabled="fleet <= baseFleet">-</button>
          <span class="pool-count">{{ fleet }}</span>
          <button class="btn btn-sm btn-outline-secondary" @click="fleet++" :disabled="!canAdd">+</button>
        </div>
        <div v-if="newTokenCount > 0" class="pool-base">{{ baseFleet }}</div>
      </div>
    </div>

    <div class="assigned-info">Assigned: {{ assignedTokens }} / {{ totalTokens }}</div>

    <div class="action-buttons">
      <button class="btn btn-sm btn-primary" @click="confirm" :disabled="assignedTokens !== totalTokens">Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RedistributeTokens',

  props: {
    playerName: { type: String, default: null },
    request: { type: Object, default: null },
  },

  inject: ['actor', 'game', 'bus'],

  data() {
    return {
      tactics: 0,
      strategy: 0,
      fleet: 0,
    }
  },

  computed: {
    currentPlayer() {
      return this.game.players.byName(this.playerName || this.actor.name)
    },

    newTokenCount() {
      const match = this.request?.title?.match(/\+(\d+)/)
      return match ? parseInt(match[1]) : 0
    },

    headerText() {
      if (this.newTokenCount > 0) {
        return `Allocate Command Tokens (+${this.newTokenCount})`
      }
      return 'Redistribute Command Tokens'
    },

    baseTactics() {
      return this.currentPlayer?.commandTokens.tactics || 0
    },

    baseStrategy() {
      return this.currentPlayer?.commandTokens.strategy || 0
    },

    baseFleet() {
      return this.currentPlayer?.commandTokens.fleet || 0
    },

    totalTokens() {
      if (!this.currentPlayer) {
        return 0
      }
      const ct = this.currentPlayer.commandTokens
      return ct.tactics + ct.strategy + ct.fleet + this.newTokenCount
    },

    assignedTokens() {
      return this.tactics + this.strategy + this.fleet
    },

    unallocatedTokens() {
      return this.totalTokens - this.assignedTokens
    },

    canAdd() {
      return this.assignedTokens < this.totalTokens
    },
  },

  methods: {
    confirm() {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: {
          action: 'redistribute-tokens',
          tactics: this.tactics,
          strategy: this.strategy,
          fleet: this.fleet,
        },
      })
    },
  },

  created() {
    // Initialize with current distribution (new tokens start unallocated)
    if (this.currentPlayer) {
      const ct = this.currentPlayer.commandTokens
      this.tactics = ct.tactics
      this.strategy = ct.strategy
      this.fleet = ct.fleet
    }
  },
}
</script>

<style scoped>
.redistribute-tokens-action {
  padding: .5em;
  background: #e0f2f1;
  border-left: 3px solid #009688;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .15em;
}

.token-total {
  font-size: .8em;
  color: #555;
  margin-bottom: .35em;
}

.unallocated-info {
  font-size: .8em;
  font-weight: 600;
  color: #009688;
  margin-bottom: .35em;
}

.token-pools {
  display: flex;
  gap: .75em;
}

.pool {
  flex: 1;
  text-align: center;
}

.pool-label {
  font-size: .75em;
  font-weight: 600;
  color: #555;
  margin-bottom: .15em;
}

.pool-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .15em;
}

.pool-count {
  font-weight: 700;
  font-size: 1.1em;
  min-width: 1.5em;
  text-align: center;
}

.pool-base {
  font-size: .65em;
  color: #888;
  margin-top: .1em;
}

.assigned-info {
  text-align: center;
  font-size: .75em;
  color: #888;
  margin-top: .25em;
}

.action-buttons {
  display: flex;
  gap: .35em;
  margin-top: .35em;
  justify-content: center;
}
</style>
