<template>
  <div class="phase-info">
    <div class="phase-header">
      <span class="phase-badge" :class="phaseClass">{{ phaseName }}</span>
      <span class="round-badge" v-if="round > 0">Round {{ round }}</span>
    </div>

    <div class="phase-details">
      <div class="detail-row" v-if="speaker">
        <span class="detail-label">Speaker:</span>
        <span class="player-name" :style="playerStyle(speaker)">{{ speaker }}</span>
      </div>

      <div class="detail-row" v-if="activePlayer">
        <span class="detail-label">Active:</span>
        <span class="player-name" :style="playerStyle(activePlayer)">{{ activePlayer }}</span>
      </div>
    </div>

    <div class="initiative-order" v-if="initiativeOrder.length > 0">
      <div class="detail-label">Initiative:</div>
      <div class="initiative-list">
        <span
          v-for="entry in initiativeOrder"
          :key="entry.player"
          class="initiative-entry"
          :class="{ passed: entry.passed, used: entry.used }"
          :style="playerStyle(entry.player)"
        >
          {{ entry.number }}. {{ entry.player }}
        </span>
      </div>
    </div>

    <div class="vp-standings" v-if="vpStandings.length > 0">
      <div class="detail-label">Victory Points:</div>
      <div class="vp-list">
        <div v-for="entry in vpStandings" :key="entry.player" class="vp-entry">
          <span class="vp-player" :style="playerStyle(entry.player)">{{ entry.player }}</span>
          <div class="vp-bar-wrapper">
            <div class="vp-bar" :style="{ width: (entry.vp / 10 * 100) + '%', backgroundColor: entry.color }"/>
          </div>
          <span class="vp-count">{{ entry.vp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'PhaseInfo',
  inject: ['game'],

  computed: {
    round() {
      return this.game.state.round
    },

    phase() {
      return this.game.state.phase
    },

    phaseName() {
      const names = {
        setup: 'Setup',
        strategy: 'Strategy Phase',
        action: 'Action Phase',
        status: 'Status Phase',
        agenda: 'Agenda Phase',
      }
      return names[this.phase] || this.phase
    },

    phaseClass() {
      return `phase-${this.phase}`
    },

    speaker() {
      return this.game.state.speaker
    },

    activePlayer() {
      const waiting = this.game.getWaitingState?.()
      if (waiting && waiting.players?.length === 1) {
        return waiting.players[0]
      }
      return null
    },

    initiativeOrder() {
      if (this.phase !== 'action' && this.phase !== 'strategy') {
        return []
      }

      return this.game.players.all()
        .filter(p => p.strategyCards.length > 0)
        .map(p => {
          const card = res.getStrategyCard(p.getStrategyCardId())
          return {
            player: p.name,
            number: card ? card.number : 99,
            passed: p.hasPassed(),
            used: p.hasUsedStrategyCard(),
          }
        })
        .sort((a, b) => a.number - b.number)
    },

    vpStandings() {
      return this.game.players.all()
        .map(p => ({
          player: p.name,
          vp: p.getVictoryPoints(),
          color: p.color || '#666',
        }))
        .sort((a, b) => b.vp - a.vp)
    },
  },

  methods: {
    playerStyle(playerName) {
      const player = this.game.players.byName(playerName)
      if (player?.color) {
        return { color: player.color, fontWeight: 600 }
      }
      return { fontWeight: 600 }
    },
  },
}
</script>

<style scoped>
.phase-info {
  padding: .5em;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: .5em;
  margin-bottom: .35em;
}

.phase-badge {
  padding: .15em .5em;
  border-radius: .25em;
  font-weight: 700;
  font-size: .85em;
  color: white;
}

.phase-setup { background: #6c757d; }
.phase-strategy { background: #0d6efd; }
.phase-action { background: #198754; }
.phase-status { background: #ffc107; color: #333; }
.phase-agenda { background: #6f42c1; }

.round-badge {
  font-size: .8em;
  color: #666;
  font-weight: 600;
}

.phase-details {
  display: flex;
  gap: 1em;
  font-size: .8em;
  margin-bottom: .25em;
}

.detail-row {
  display: flex;
  gap: .25em;
  align-items: center;
}

.detail-label {
  color: #888;
  font-size: .8em;
}

.initiative-order {
  margin-top: .35em;
}

.initiative-list {
  display: flex;
  flex-wrap: wrap;
  gap: .25em;
  margin-top: .15em;
}

.initiative-entry {
  font-size: .75em;
  padding: .1em .4em;
  border-radius: .2em;
  background: #e9ecef;
}

.initiative-entry.passed {
  opacity: .4;
  text-decoration: line-through;
}

.initiative-entry.used {
  opacity: .7;
}

.vp-standings {
  margin-top: .35em;
}

.vp-list {
  margin-top: .15em;
}

.vp-entry {
  display: flex;
  align-items: center;
  gap: .35em;
  font-size: .75em;
  margin-bottom: .1em;
}

.vp-player {
  min-width: 5em;
  text-align: right;
}

.vp-bar-wrapper {
  flex: 1;
  height: .5em;
  background: #e9ecef;
  border-radius: .15em;
  overflow: hidden;
}

.vp-bar {
  height: 100%;
  border-radius: .15em;
  transition: width .3s;
}

.vp-count {
  min-width: 1.5em;
  text-align: right;
  font-weight: 600;
}
</style>
