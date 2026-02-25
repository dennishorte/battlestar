<template>
  <div class="player-panel" :class="{ 'is-viewer': isViewer }" :style="borderStyle">
    <div class="panel-header" :style="headerStyle">
      <div class="faction-name clickable" @click="openFactionDetail">{{ factionName }}</div>
      <div class="player-name-line">{{ player.name }}</div>
      <div class="vp-badge">{{ player.getVictoryPoints() }} VP</div>
    </div>

    <!-- Command Tokens -->
    <div class="panel-section">
      <div class="section-label">Command Tokens</div>
      <div class="token-pools">
        <span class="token-pool" title="Tactics">T:{{ player.commandTokens.tactics }}</span>
        <span class="token-pool" title="Strategy">S:{{ player.commandTokens.strategy }}</span>
        <span class="token-pool" title="Fleet">F:{{ player.commandTokens.fleet }}</span>
      </div>
    </div>

    <!-- Resources -->
    <div class="panel-section">
      <div class="resource-row">
        <span class="resource" title="Trade Goods">TG: {{ player.tradeGoods }}</span>
        <span class="resource" title="Commodities">C: {{ player.commodities }}/{{ player.maxCommodities }}</span>
      </div>
    </div>

    <!-- Strategy Cards -->
    <div class="panel-section" v-if="player.strategyCards.length > 0">
      <div class="section-label">Strategy</div>
      <div v-for="sc in strategyCardsDisplay"
           :key="sc.id"
           class="strategy-card clickable"
           :class="{ used: sc.used }"
           @click="openCardDetail('strategy-card', sc.id)">
        <span class="sc-number">{{ sc.number }}</span> {{ sc.name }}
        <span v-if="sc.used" class="sc-used-badge">used</span>
      </div>
    </div>

    <!-- Leaders -->
    <div class="panel-section clickable" @click="openLeadersDetail">
      <div class="section-label">Leaders</div>
      <div class="leaders-row">
        <span class="leader" :class="agentClass" title="Agent">A</span>
        <span class="leader" :class="commanderClass" title="Commander">C</span>
        <span class="leader" :class="heroClass" title="Hero">H</span>
      </div>
    </div>

    <!-- Technologies -->
    <div class="panel-section" v-if="technologies.length > 0">
      <div class="section-label">Technologies ({{ technologies.length }})</div>
      <div class="tech-list">
        <span
          v-for="tech in technologies"
          :key="tech.id"
          class="tech-chip clickable"
          :class="`tech-${tech.color}`"
          :title="tech.name"
          @click="openCardDetail('technology', tech.id)"
        >
          {{ tech.name }}
        </span>
      </div>
    </div>

    <!-- Planets -->
    <div class="panel-section" v-if="planets.length > 0">
      <div class="section-label">
        Planets ({{ totalResources }}R / {{ totalInfluence }}I)
      </div>
      <div class="planet-list">
        <div
          v-for="p in planets"
          :key="p.id"
          class="planet-entry clickable"
          :class="{ exhausted: p.exhausted }"
          @click="openCardDetail('planet', p.id)"
        >
          <span class="planet-name">{{ p.name }}</span>
          <span class="planet-stats">{{ p.resources }}/{{ p.influence }}</span>
          <span v-if="p.techSpecialty" class="planet-tech" :class="`tech-${p.techSpecialty}`">{{ p.techSpecialty[0].toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Scored Objectives -->
    <div class="panel-section" v-if="scoredObjectives.length > 0">
      <div class="section-label">Scored Objectives</div>
      <div class="objective-list">
        <div v-for="obj in scoredObjectives"
             :key="obj.id"
             class="objective-entry clickable"
             @click="openCardDetail('objective', obj.id)">{{ obj.name }}</div>
      </div>
    </div>

    <!-- Action Cards (count for opponents, hidden) -->
    <div class="panel-section" v-if="!isViewer">
      <div class="section-label">Action Cards: {{ actionCardCount }}</div>
    </div>

    <!-- Promissory Notes -->
    <div class="panel-section" v-if="promissoryNotes.length > 0">
      <div class="section-label">Promissory Notes</div>
      <div class="prom-list">
        <div v-for="note in promissoryNotes"
             :key="note.id + note.owner"
             class="prom-entry clickable"
             @click="openPromissoryDetail(note)">
          {{ note.id }} <span class="prom-from">({{ note.owner }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'PlayerPanel',

  props: {
    player: { type: Object, required: true },
  },

  inject: ['actor', 'game', 'ui'],

  computed: {
    isViewer() {
      return this.player.name === this.actor.name
    },

    factionName() {
      return this.player.faction?.name || this.player.factionId || '?'
    },

    borderStyle() {
      const color = this.player.color || '#666'
      return { borderTopColor: color }
    },

    headerStyle() {
      const color = this.player.color || '#666'
      return { backgroundColor: color, color: this.getContrastColor(color) }
    },

    strategyCardsDisplay() {
      return this.player.strategyCards.map(sc => {
        const card = res.getStrategyCard(sc.id)
        return {
          id: sc.id,
          name: card?.name || sc.id,
          number: card?.number || '?',
          used: sc.used,
        }
      })
    },

    agentClass() {
      const status = this.player.leaders?.agent
      if (status === 'ready') {
        return 'leader-ready'
      }
      if (status === 'exhausted') {
        return 'leader-exhausted'
      }
      return 'leader-locked'
    },

    commanderClass() {
      const status = this.player.leaders?.commander
      if (status === 'unlocked') {
        return 'leader-ready'
      }
      return 'leader-locked'
    },

    heroClass() {
      const status = this.player.leaders?.hero
      if (status === 'unlocked') {
        return 'leader-ready'
      }
      if (status === 'purged') {
        return 'leader-purged'
      }
      return 'leader-locked'
    },

    technologies() {
      const techIds = this.player.getTechIds()
      return techIds.map(id => {
        const tech = res.getTechnology(id)
        return tech || { id, name: id, color: 'unknown' }
      })
    },

    planets() {
      const controlled = this.player.getControlledPlanets()
      return controlled.map(planetId => {
        const planet = res.getPlanet(planetId)
        const state = this.game.state.planets[planetId]
        return {
          id: planetId,
          name: planet?.name || planetId,
          resources: planet?.resources || 0,
          influence: planet?.influence || 0,
          techSpecialty: planet?.techSpecialty || null,
          exhausted: state?.exhausted || false,
        }
      })
    },

    totalResources() {
      return this.planets.reduce((sum, p) => sum + p.resources, 0)
    },

    totalInfluence() {
      return this.planets.reduce((sum, p) => sum + p.influence, 0)
    },

    scoredObjectives() {
      const scored = this.game.state.scoredObjectives?.[this.player.name] || []
      return scored.map(id => {
        const obj = res.getObjective?.(id)
        return { id, name: obj?.name || id }
      })
    },

    actionCardCount() {
      const zone = this.game.zones?.byId(`players.${this.player.name}.action-cards`)
      return zone ? zone.cardlist().length : 0
    },

    promissoryNotes() {
      return this.player.promissoryNotes || []
    },
  },

  methods: {
    openCardDetail(type, id, context) {
      this.ui.modals.cardDetail.type = type
      this.ui.modals.cardDetail.id = id
      this.ui.modals.cardDetail.context = context || null
      this.$modal('twilight-card-detail').show()
    },

    openFactionDetail() {
      const factionId = this.player.factionId
      this.openCardDetail('faction', factionId)
    },

    openPromissoryDetail(note) {
      const ownerPlayer = this.game.players.byName(note.owner)
      const factionId = ownerPlayer?.factionId || null
      this.openCardDetail('promissory-note', note.id, { owner: note.owner, factionId })
    },

    openLeadersDetail() {
      const factionId = this.player.factionId
      const leaders = this.player.leaders || {}
      this.openCardDetail('leaders', factionId, { leaders, player: this.player.name })
    },

    getContrastColor(hexColor) {
      if (!hexColor) {
        return 'black'
      }
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? 'black' : 'white'
    },
  },
}
</script>

<style scoped>
.player-panel {
  border-top: 4px solid #666;
  background: white;
  margin-bottom: .75em;
  font-size: .8rem;
}

.player-panel.is-viewer {
  box-shadow: 0 0 0 2px rgba(13, 110, 253, .25);
}

.panel-header {
  padding: .35em .5em;
  display: flex;
  align-items: center;
  gap: .5em;
}

.faction-name {
  font-weight: 700;
  font-size: .85em;
  flex: 1;
}

.faction-name.clickable:hover {
  text-decoration: underline;
  background: transparent;
}

.player-name-line {
  font-size: .75em;
  opacity: .8;
}

.vp-badge {
  font-weight: 700;
  font-size: .9em;
  padding: .1em .35em;
  background: rgba(255,255,255,.25);
  border-radius: .2em;
}

.panel-section {
  padding: .25em .5em;
  border-top: 1px solid #eee;
}

.section-label {
  font-size: .7em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: .15em;
}

.token-pools {
  display: flex;
  gap: .5em;
}

.token-pool {
  font-weight: 600;
  font-family: monospace;
  font-size: .85em;
}

.resource-row {
  display: flex;
  gap: .75em;
}

.resource {
  font-weight: 500;
}

.strategy-card {
  display: flex;
  align-items: center;
  gap: .25em;
  padding: .1em 0;
}

.strategy-card.used {
  opacity: .5;
  text-decoration: line-through;
}

.sc-number {
  font-weight: 700;
  min-width: 1em;
  text-align: center;
}

.sc-used-badge {
  font-size: .7em;
  color: #999;
  margin-left: auto;
}

.leaders-row {
  display: flex;
  gap: .25em;
}

.leader {
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: .7em;
  border: 1px solid #ccc;
}

.leader-ready { background: #d4edda; color: #155724; border-color: #28a745; }
.leader-exhausted { background: #fff3cd; color: #856404; border-color: #ffc107; }
.leader-locked { background: #e9ecef; color: #aaa; }
.leader-purged { background: #f8d7da; color: #721c24; border-color: #dc3545; }

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: .15em;
}

.tech-chip {
  font-size: .7em;
  padding: .1em .3em;
  border-radius: .15em;
  border-left: 2px solid;
  background: #f8f9fa;
}

.tech-blue { border-color: #0d6efd; }
.tech-red { border-color: #dc3545; }
.tech-yellow { border-color: #ffc107; }
.tech-green { border-color: #198754; }
.tech-unit-upgrade { border-color: #6c757d; }
.tech-unknown { border-color: #aaa; }

.planet-list {
  display: flex;
  flex-direction: column;
  gap: .1em;
}

.planet-entry {
  display: flex;
  align-items: center;
  gap: .25em;
  font-size: .8em;
}

.planet-entry.exhausted {
  opacity: .45;
}

.planet-name {
  flex: 1;
}

.planet-stats {
  font-family: monospace;
  font-weight: 500;
  color: #555;
}

.planet-tech {
  font-size: .7em;
  font-weight: 700;
  width: 1.2em;
  height: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
}

.planet-tech.tech-blue { background: #0d6efd; }
.planet-tech.tech-red { background: #dc3545; }
.planet-tech.tech-yellow { background: #ffc107; color: #333; }
.planet-tech.tech-green { background: #198754; }

.objective-list {
  display: flex;
  flex-direction: column;
  gap: .1em;
}

.objective-entry {
  font-size: .75em;
  padding: .1em 0;
}

.prom-list {
  font-size: .75em;
}

.prom-entry {
  padding: .05em 0;
}

.prom-from {
  color: #888;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: rgba(0, 0, 0, .05);
}
</style>
