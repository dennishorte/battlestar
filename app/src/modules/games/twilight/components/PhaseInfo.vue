<template>
  <div class="phase-info">
    <div class="phase-header">
      <span class="phase-badge" :class="phaseClass">{{ phaseName }}</span>
      <span class="round-badge" v-if="round > 0">Round {{ round }}</span>
    </div>

    <!-- Tactical action step breadcrumb -->
    <div class="tactical-breadcrumb" v-if="tacticalStep">
      <span
        v-for="(s, i) in tacticalSteps"
        :key="s.id"
        class="tac-step"
        :class="s.status"
      >
        <span v-if="i > 0" class="tac-arrow">&rsaquo;</span>
        {{ s.label }}
      </span>
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

    <!-- Public Objectives -->
    <div class="public-objectives" v-if="publicObjectives.length > 0">
      <div class="detail-label">Public Objectives:</div>
      <div class="objective-list">
        <div
          v-for="obj in publicObjectives"
          :key="obj.id"
          class="pub-obj-entry"
          :class="obj.stageClass"
        >
          <span class="obj-points">{{ obj.points }}</span>
          <span class="obj-name">{{ obj.name }}</span>
          <span class="scorer-pips" v-if="obj.scorers.length > 0">
            <span
              v-for="scorer in obj.scorers"
              :key="scorer.player"
              class="scorer-pip"
              :style="{ backgroundColor: scorer.color }"
              :title="scorer.player"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- Active Laws -->
    <div class="active-laws" v-if="activeLaws.length > 0">
      <div class="detail-label">Active Laws:</div>
      <div class="law-list">
        <div
          v-for="law in activeLaws"
          :key="law.id"
          class="law-entry clickable"
          @click="openLawDetail(law.id)"
          :title="law.outcome"
        >
          {{ law.name }}
          <span v-if="law.outcome" class="law-outcome">({{ law.outcome }})</span>
        </div>
      </div>
    </div>

    <div class="vp-standings" v-if="vpStandings.length > 0">
      <div class="detail-label">Victory Points ({{ vpTarget }}):</div>
      <div class="vp-list">
        <div v-for="entry in vpStandings" :key="entry.player" class="vp-entry">
          <span class="vp-player" :style="playerStyle(entry.player)">{{ entry.player }}</span>
          <div class="vp-bar-wrapper">
            <div class="vp-bar" :style="{ width: Math.min(entry.vp / vpTarget * 100, 100) + '%', backgroundColor: entry.color }"/>
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
  inject: ['game', 'ui'],

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

    tacticalStep() {
      if (this.phase !== 'action') {
        return null
      }
      return this.game.state.currentTacticalAction?.step || null
    },

    tacticalSteps() {
      const steps = [
        { id: 'activate', label: 'Activate' },
        { id: 'move', label: 'Move' },
        { id: 'combat', label: 'Combat' },
        { id: 'invade', label: 'Invade' },
        { id: 'produce', label: 'Produce' },
      ]
      const currentIdx = steps.findIndex(s => s.id === this.tacticalStep)
      return steps.map((s, i) => ({
        ...s,
        status: i < currentIdx ? 'completed' : i === currentIdx ? 'active' : 'future',
      }))
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

    vpTarget() {
      return this.game.settings?.vpTarget || this.game.state.vpTarget || 10
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

    publicObjectives() {
      const revealed = this.game.state.revealedObjectives || []
      const scored = this.game.state.scoredObjectives || {}

      return revealed.map(id => {
        const obj = res.getObjective?.(id)
        const stage = obj?.stage || 1
        const scorers = []

        // Find all players who scored this objective
        for (const [playerName, objectives] of Object.entries(scored)) {
          if (objectives.includes(id)) {
            const player = this.game.players.byName(playerName)
            scorers.push({
              player: playerName,
              color: player?.color || '#666',
            })
          }
        }

        return {
          id,
          name: obj?.name || id,
          points: obj?.points || stage,
          stage,
          stageClass: stage === 2 ? 'stage-ii' : 'stage-i',
          scorers,
        }
      })
    },

    activeLaws() {
      const laws = this.game.state.activeLaws || []
      return laws.map(law => {
        const card = res.getAgendaCard?.(law.id) || law
        return {
          id: law.id,
          name: card.name || law.name || law.id,
          outcome: law.resolvedOutcome || null,
        }
      })
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

    openLawDetail(lawId) {
      if (this.ui?.modals?.cardDetail) {
        this.ui.modals.cardDetail.type = 'agenda-card'
        this.ui.modals.cardDetail.id = lawId
        this.ui.modals.cardDetail.context = null
        this.$modal('twilight-card-detail').show()
      }
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

.tactical-breadcrumb {
  display: flex;
  align-items: center;
  gap: .15em;
  padding: .2em .5em;
  background: #e8f5e9;
  border-radius: .2em;
  margin-bottom: .25em;
  font-size: .75em;
}

.tac-step {
  display: inline-flex;
  align-items: center;
  gap: .15em;
}

.tac-step.completed {
  color: #888;
}

.tac-step.active {
  color: #198754;
  font-weight: 700;
}

.tac-step.future {
  color: #bbb;
}

.tac-arrow {
  color: #aaa;
  font-size: 1.1em;
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

.public-objectives {
  margin-top: .35em;
}

.objective-list {
  margin-top: .15em;
}

.pub-obj-entry {
  display: flex;
  align-items: center;
  gap: .35em;
  font-size: .75em;
  padding: .1em .25em;
  border-left: 2px solid;
  margin-bottom: .1em;
}

.pub-obj-entry.stage-i {
  border-color: #198754;
}

.pub-obj-entry.stage-ii {
  border-color: #0d6efd;
}

.obj-points {
  font-weight: 700;
  min-width: 1em;
  text-align: center;
}

.obj-name {
  flex: 1;
}

.scorer-pips {
  display: flex;
  gap: 2px;
}

.scorer-pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,.2);
}

.active-laws {
  margin-top: .35em;
}

.law-list {
  margin-top: .15em;
}

.law-entry {
  font-size: .75em;
  padding: .1em .25em;
  border-left: 2px solid #6f42c1;
  margin-bottom: .1em;
}

.law-outcome {
  color: #888;
  font-style: italic;
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

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: rgba(0, 0, 0, .05);
}
</style>
