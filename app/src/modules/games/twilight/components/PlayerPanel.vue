<template>
  <div class="player-panel" :class="{ 'is-viewer': isViewer }" :style="borderStyle">
    <div class="panel-header" :style="headerStyle">
      <div class="faction-name clickable" @click="openFactionDetail">{{ factionName }}</div>
      <div class="player-name-line">{{ player.name }}</div>
      <div class="vp-badge">{{ player.getVictoryPoints() }} VP</div>
    </div>

    <!-- Command Tokens -->
    <div class="panel-section clickable" @click="openCommandTokensHelp">
      <div class="section-label">
        Command Tokens
        <span class="help-icon">?</span>
      </div>
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

    <!-- Neighbors -->
    <div class="panel-section" v-if="isViewer && neighbors.length > 0">
      <div class="section-label">Neighbors</div>
      <div class="neighbor-list">
        <span
          v-for="n in neighbors"
          :key="n.name"
          class="neighbor-chip"
          :style="{ borderLeftColor: n.color }"
        >{{ n.name }}</span>
      </div>
    </div>

    <!-- Unit Supply -->
    <div class="panel-section">
      <div class="section-label clickable" @click="supplyExpanded = !supplyExpanded">
        Supply {{ supplyExpanded ? '&#9662;' : '&#9656;' }}
      </div>
      <div class="supply-grid" v-if="supplyExpanded">
        <span
          v-for="entry in unitSupply"
          :key="entry.type"
          class="supply-entry"
          :class="entry.colorClass"
          :title="`${entry.name}: ${entry.remaining} of ${entry.limit} remaining`"
        >{{ entry.short }} {{ entry.remaining }}/{{ entry.limit }}</span>
      </div>
    </div>

    <!-- Relic Fragments -->
    <div class="panel-section" v-if="totalFragments > 0">
      <div class="section-label">Relic Fragments</div>
      <div class="fragment-row">
        <span v-if="fragmentCounts.cultural"
              class="fragment-count frag-cultural"
              title="Cultural">C:{{ fragmentCounts.cultural }}</span>
        <span v-if="fragmentCounts.hazardous"
              class="fragment-count frag-hazardous"
              title="Hazardous">H:{{ fragmentCounts.hazardous }}</span>
        <span v-if="fragmentCounts.industrial"
              class="fragment-count frag-industrial"
              title="Industrial">I:{{ fragmentCounts.industrial }}</span>
        <span v-if="fragmentCounts.unknown"
              class="fragment-count frag-unknown"
              title="Unknown">?:{{ fragmentCounts.unknown }}</span>
      </div>
    </div>

    <!-- Relics -->
    <div class="panel-section" v-if="relics.length > 0">
      <div class="section-label clickable" @click="openCardZone('relic', relics)">Relics ({{ relics.length }})</div>
      <div class="relic-list">
        <span v-for="relic in relics"
              :key="relic.id"
              class="relic-chip clickable"
              :class="{ exhausted: relic.isExhausted }"
              :title="relic.effect"
              @click="openCardDetail('relic', relic.id)">
          {{ relic.name }}
        </span>
      </div>
    </div>

    <!-- Captured Units (Vuil'raith Cabal mechanic) -->
    <div class="panel-section" v-if="capturedUnits.length > 0">
      <div class="section-label">Captured Units ({{ capturedUnitsTotal }})</div>
      <div class="captured-list">
        <span v-for="entry in capturedUnits"
              :key="entry.type"
              class="captured-chip"
              :title="`${entry.count} captured ${entry.type}`"
        >{{ entry.type }} &times;{{ entry.count }}</span>
      </div>
    </div>

    <!-- Units Captured by Others -->
    <div class="panel-section" v-if="capturedByOthers.length > 0">
      <div class="section-label">Units Captured by Others</div>
      <div class="captured-list">
        <span v-for="entry in capturedByOthers"
              :key="entry.holder + entry.type"
              class="captured-by-chip"
              :title="`${entry.holder} holds ${entry.count} ${entry.type}`"
        >{{ entry.holder }}: {{ entry.type }} &times;{{ entry.count }}</span>
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
      <div class="section-label clickable" @click="openCardZone('technology', technologies)">Technologies ({{ technologies.length }})</div>
      <div class="tech-list">
        <span
          v-for="tech in technologies"
          :key="tech.id"
          class="tech-chip clickable"
          :class="[`tech-${tech.color}`, { exhausted: tech.isExhausted }]"
          :title="tech.name"
          @click="openCardDetail('technology', tech.id)"
        >
          {{ tech.name }}
        </span>
      </div>
    </div>

    <!-- Planets -->
    <div class="panel-section" v-if="planets.length > 0">
      <div class="section-label clickable" @click="openCardZone('planet', planets)">
        Planets ({{ readyResources }}/{{ totalResources }}R / {{ readyInfluence }}/{{ totalInfluence }}I)
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
          <span v-if="p.hasAttachments" class="attachment-indicator" title="Has attachments">+</span>
          <span class="planet-stats">{{ p.resources }}/{{ p.influence }}</span>
          <span v-if="p.techSpecialty" class="planet-tech" :class="`tech-${p.techSpecialty}`">{{ p.techSpecialty[0].toUpperCase() }}</span>
          <span v-for="spec in p.attachmentTechSpecialties"
                :key="spec"
                class="planet-tech"
                :class="`tech-${spec}`">{{ spec[0].toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Scored Objectives -->
    <div class="panel-section" v-if="scoredObjectives.length > 0">
      <div class="section-label clickable" @click="openCardZone('scored-objective', scoredObjectives)">Scored Objectives</div>
      <div class="objective-list">
        <div v-for="obj in scoredObjectives"
             :key="obj.id"
             class="objective-entry clickable"
             @click="openCardDetail('objective', obj.id)">{{ obj.name }}</div>
      </div>
    </div>

    <!-- Secret Objectives (viewer only sees names, opponents see count) -->
    <div class="panel-section" v-if="isViewer && secretObjectives.length > 0">
      <div class="section-label clickable" @click="openCardZone('secret-objective', secretObjectives)">Secret Objectives ({{ secretObjectives.length }})</div>
      <div class="secret-list">
        <div v-for="obj in secretObjectives"
             :key="obj.id"
             class="secret-entry clickable"
             @click="openCardDetail('objective', obj.id)">{{ obj.name }}</div>
      </div>
    </div>
    <div class="panel-section" v-else-if="!isViewer && secretObjectiveCount > 0">
      <div class="section-label">Secret Objectives: {{ secretObjectiveCount }}</div>
    </div>

    <!-- Action Cards (chips for viewer, count for opponents) -->
    <div class="panel-section" v-if="isViewer && actionCards.length > 0">
      <div class="section-label clickable" @click="openCardZone('action-card', actionCards)">Action Cards ({{ actionCards.length }})</div>
      <div class="action-card-list">
        <span
          v-for="(ac, i) in actionCards"
          :key="ac.id + '-' + i"
          class="action-card-chip clickable"
          :title="ac.effect"
          @click="openCardDetail('action-card', ac.id)"
        >
          {{ ac.name }}
        </span>
      </div>
    </div>
    <div class="panel-section" v-else-if="!isViewer">
      <div class="section-label">Action Cards: {{ actionCardCount }}</div>
    </div>

    <!-- Promissory Notes -->
    <div class="panel-section" v-if="promissoryNotes.length > 0">
      <div class="section-label clickable" @click="openCardZone('promissory-note', promissoryNotes)">Promissory Notes</div>
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

  data() {
    return {
      supplyExpanded: false,
    }
  },

  computed: {
    isViewer() {
      return this.player.name === this.actor.name
    },

    neighbors() {
      if (this.game.state.phase !== 'action' || !this.isViewer) {
        return []
      }
      return this.game.players.all()
        .filter(p => p.name !== this.player.name)
        .filter(p => this.game.areNeighbors(this.player.name, p.name))
        .map(p => ({ name: p.name, color: p.color || '#666' }))
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
      const exhaustedTechs = this.player.exhaustedTechs || []
      return techIds.map(id => {
        const tech = res.getTechnology(id)
        return {
          ...(tech || { id, name: id, color: 'unknown' }),
          isExhausted: exhaustedTechs.includes(id),
        }
      })
    },

    planets() {
      const controlled = this.player.getControlledPlanets()
      return controlled.map(planetId => {
        const planet = res.getPlanet(planetId)
        const state = this.game.state.planets[planetId]
        const attachments = state?.attachments || []
        const bonuses = attachments.length > 0
          ? this.game._getPlanetAttachmentBonuses(planetId)
          : { resources: 0, influence: 0, techSpecialties: [] }
        return {
          id: planetId,
          name: planet?.name || planetId,
          resources: (planet?.resources || 0) + bonuses.resources,
          influence: (planet?.influence || 0) + bonuses.influence,
          techSpecialty: planet?.techSpecialty || null,
          attachmentTechSpecialties: bonuses.techSpecialties,
          hasAttachments: attachments.length > 0,
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

    readyResources() {
      return this.planets.filter(p => !p.exhausted).reduce((sum, p) => sum + p.resources, 0)
    },

    readyInfluence() {
      return this.planets.filter(p => !p.exhausted).reduce((sum, p) => sum + p.influence, 0)
    },

    unitSupply() {
      const supplyTypes = [
        { type: 'war-sun', short: 'WS', name: 'War Sun' },
        { type: 'flagship', short: 'FS', name: 'Flagship' },
        { type: 'dreadnought', short: 'DN', name: 'Dreadnought' },
        { type: 'carrier', short: 'CV', name: 'Carrier' },
        { type: 'cruiser', short: 'CR', name: 'Cruiser' },
        { type: 'destroyer', short: 'DD', name: 'Destroyer' },
        { type: 'mech', short: 'MH', name: 'Mech' },
        { type: 'pds', short: 'PDS', name: 'PDS' },
        { type: 'space-dock', short: 'SD', name: 'Space Dock' },
      ]
      const playerName = this.player.name
      const allUnits = this.game.state.units || {}

      // Count units on the board for this player
      const onBoard = {}
      for (const systemUnits of Object.values(allUnits)) {
        for (const u of (systemUnits.space || [])) {
          if (u.owner === playerName) {
            onBoard[u.type] = (onBoard[u.type] || 0) + 1
          }
        }
        for (const planetUnits of Object.values(systemUnits.planets || {})) {
          for (const u of planetUnits) {
            if (u.owner === playerName) {
              onBoard[u.type] = (onBoard[u.type] || 0) + 1
            }
          }
        }
      }

      // Also count captured units held by other players
      const captured = this.game.state.capturedUnits || {}
      for (const [holder, units] of Object.entries(captured)) {
        if (holder !== playerName) {
          for (const u of units) {
            if (u.originalOwner === playerName) {
              onBoard[u.type] = (onBoard[u.type] || 0) + 1
            }
          }
        }
      }

      return supplyTypes.map(({ type, short, name }) => {
        const unitDef = res.getUnit(type)
        const limit = unitDef?.limit || 0
        if (limit <= 0) {
          return null
        }
        const used = onBoard[type] || 0
        const remaining = Math.max(0, limit - used)
        const colorClass = remaining === 0 ? 'supply-red' : remaining <= 2 ? 'supply-orange' : 'supply-green'
        return { type, short, name, limit, remaining, colorClass }
      }).filter(Boolean)
    },

    scoredObjectives() {
      const scored = this.game.state.scoredObjectives?.[this.player.name] || []
      return scored.map(id => {
        const obj = res.getObjective?.(id)
        return { id, name: obj?.name || id }
      })
    },

    secretObjectives() {
      const secrets = this.player.secretObjectives || []
      const scored = this.game.state.scoredObjectives?.[this.player.name] || []
      return secrets
        .filter(id => !scored.includes(id))
        .map(id => {
          const obj = res.getObjective?.(id)
          return { id, name: obj?.name || id }
        })
    },

    secretObjectiveCount() {
      const secrets = this.player.secretObjectives || []
      const scored = this.game.state.scoredObjectives?.[this.player.name] || []
      return secrets.filter(id => !scored.includes(id)).length
    },

    actionCards() {
      const cards = this.player.actionCards || []
      return cards.map(c => {
        const def = res.getActionCard(c.id)
        return def || { id: c.id, name: c.name || c.id, timing: '', effect: '' }
      })
    },

    actionCardCount() {
      return this.player.actionCards?.length || 0
    },

    fragmentCounts() {
      const frags = this.player.relicFragments || []
      const counts = {}
      for (const f of frags) {
        counts[f] = (counts[f] || 0) + 1
      }
      return counts
    },

    totalFragments() {
      return (this.player.relicFragments || []).length
    },

    relics() {
      const relicIds = this.game.state.relicsGained?.[this.player.name] || []
      const exhaustedRelics = this.game.state.exhaustedRelics?.[this.player.name] || []
      return relicIds.map(id => {
        const relic = res.getRelic(id)
        return {
          ...(relic || { id, name: id, effect: '' }),
          isExhausted: exhaustedRelics.includes(id),
        }
      })
    },

    promissoryNotes() {
      return this.player.promissoryNotes || []
    },

    capturedUnits() {
      const units = (this.game.state.capturedUnits || {})[this.player.name] || []
      const counts = {}
      for (const u of units) {
        counts[u.type] = (counts[u.type] || 0) + 1
      }
      return Object.entries(counts).map(([type, count]) => ({ type, count }))
    },

    capturedUnitsTotal() {
      return this.capturedUnits.reduce((sum, e) => sum + e.count, 0)
    },

    capturedByOthers() {
      const captured = this.game.state.capturedUnits || {}
      const results = []
      for (const [holder, units] of Object.entries(captured)) {
        if (holder === this.player.name) {
          continue
        }
        const counts = {}
        for (const u of units) {
          if (u.originalOwner === this.player.name) {
            counts[u.type] = (counts[u.type] || 0) + 1
          }
        }
        for (const [type, count] of Object.entries(counts)) {
          results.push({ holder, type, count })
        }
      }
      return results
    },
  },

  methods: {
    openCardDetail(type, id, context) {
      this.ui.modals.cardDetail.type = type
      this.ui.modals.cardDetail.id = id
      this.ui.modals.cardDetail.context = context || null
      this.$modal('twilight-card-detail').show()
    },

    openCardZone(zoneType, items) {
      this.ui.modals.cardDetail.type = 'card-zone'
      this.ui.modals.cardDetail.id = null
      this.ui.modals.cardDetail.context = { zoneType, items }
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

    openCommandTokensHelp() {
      this.$modal('twilight-command-tokens').show()
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

.tech-chip.exhausted {
  opacity: .45;
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

.secret-list {
  display: flex;
  flex-direction: column;
  gap: .1em;
}

.secret-entry {
  font-size: .75em;
  padding: .1em 0;
  border-left: 2px solid #6f42c1;
  padding-left: .35em;
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

.action-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: .15em;
}

.action-card-chip {
  font-size: .7em;
  padding: .1em .3em;
  border-radius: .15em;
  border-left: 2px solid #6c757d;
  background: #f0f0f0;
  color: #333;
}

.action-card-chip:hover {
  background: #e0e0e0;
}

.fragment-row { display: flex; gap: .5em; }
.fragment-count { font-weight: 600; font-family: monospace; font-size: .85em; }
.frag-cultural { color: #1565c0; }
.frag-hazardous { color: #c62828; }
.frag-industrial { color: #2e7d32; }
.frag-unknown { color: #888; }

.relic-list { display: flex; flex-wrap: wrap; gap: .15em; }
.relic-chip {
  font-size: .7em; padding: .1em .3em; border-radius: .15em;
  border-left: 2px solid #e65100; background: #fff3e0; color: #333;
}
.relic-chip:hover { background: #ffe0b2; }
.relic-chip.exhausted { opacity: .45; }

.attachment-indicator {
  font-size: .7em; font-weight: 700; color: #e65100;
}

.captured-list { display: flex; flex-wrap: wrap; gap: .15em; }
.captured-chip {
  font-size: .7em; padding: .1em .3em; border-radius: .15em;
  border-left: 2px solid #c62828; background: #ffebee; color: #b71c1c;
  text-transform: capitalize;
}
.captured-by-chip {
  font-size: .7em; padding: .1em .3em; border-radius: .15em;
  border-left: 2px solid #e57373; background: #fce4ec; color: #c62828;
  text-transform: capitalize;
}

.supply-grid {
  display: flex;
  flex-wrap: wrap;
  gap: .2em;
}

.supply-entry {
  font-size: .7em;
  font-family: monospace;
  font-weight: 600;
  padding: .1em .25em;
  border-radius: .15em;
  background: #f8f9fa;
}

.neighbor-list { display: flex; flex-wrap: wrap; gap: .15em; }
.neighbor-chip {
  font-size: .7em; padding: .1em .3em; border-radius: .15em;
  border-left: 3px solid #666; background: #f0f0f0; font-weight: 500;
}

.supply-green { color: #198754; }
.supply-orange { color: #e67700; }
.supply-red { color: #dc3545; font-weight: 700; }

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1em;
  height: 1.1em;
  border: 1px solid #bbb;
  border-radius: 50%;
  font-size: .9em;
  font-weight: 600;
  color: #888;
  vertical-align: middle;
  margin-left: .25em;
}

.help-icon:hover {
  color: #555;
  border-color: #888;
  background: rgba(0, 0, 0, .08);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: rgba(0, 0, 0, .05);
}
</style>
