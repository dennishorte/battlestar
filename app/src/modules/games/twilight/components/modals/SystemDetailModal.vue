<template>
  <ModalBase id="twilight-system-detail">
    <template #header>
      System {{ systemId }} — {{ systemName }}
    </template>

    <div class="system-detail" v-if="systemId">
      <!-- System Info -->
      <div class="detail-section">
        <div class="section-label">System Info</div>
        <div class="info-row" v-if="tileData.type">
          <span class="info-key">Type:</span>
          <span>{{ tileData.type }}</span>
        </div>
        <div v-if="tileData.anomaly" class="anomaly-block">
          <div class="info-row">
            <span class="info-key">Anomaly:</span>
            <span>{{ anomalyLabel }}</span>
          </div>
          <div class="anomaly-effects">
            <div v-for="(effect, i) in anomalyEffects" :key="i" class="anomaly-effect">{{ effect }}</div>
          </div>
        </div>
        <div class="info-row" v-if="tileData.wormholes?.length > 0">
          <span class="info-key">Wormhole:</span>
          <span>{{ tileData.wormholes.join(', ') }}</span>
        </div>
        <div class="info-row" v-if="hasFrontierToken">
          <span class="info-key">Frontier:</span>
          <span class="frontier-tag">token available</span>
        </div>
        <div class="info-row" v-else-if="isFrontierSystem && !hasFrontierToken">
          <span class="info-key">Frontier:</span>
          <span class="frontier-explored">explored</span>
        </div>
      </div>

      <!-- Planets -->
      <div class="detail-section" v-if="planets.length > 0">
        <div class="section-label">Planets</div>
        <div v-for="planet in planets" :key="planet.id" class="planet-detail">
          <div class="planet-header">
            <span class="planet-name">{{ planet.name }}</span>
            <span class="planet-stats">{{ planet.resources }}R / {{ planet.influence }}I</span>
          </div>
          <div class="planet-meta">
            <span v-if="planet.trait" class="planet-trait" :class="`trait-${planet.trait}`">{{ planet.trait }}</span>
            <span v-if="planet.techSpecialty" class="planet-tech" :class="`tech-${planet.techSpecialty}`">{{ planet.techSpecialty }} tech</span>
            <span v-if="planet.legendary" class="planet-legendary">legendary</span>
          </div>
          <div class="planet-control" v-if="planet.controller">
            Controlled by: <strong :style="playerStyle(planet.controller)">{{ planet.controller }}</strong>
            <span v-if="planet.exhausted" class="exhausted-badge">exhausted</span>
            <span v-if="isBlockaded(planet.id)" class="blockaded-badge">BLOCKADED</span>
          </div>
          <div class="planet-attachments" v-if="planetAttachments(planet.id).length > 0">
            <span v-for="att in planetAttachments(planet.id)"
                  :key="att.id"
                  class="attachment-tag">{{ att.name }}</span>
          </div>
          <div class="planet-units" v-if="planetUnits(planet.id).length > 0">
            <div v-for="unit in planetUnits(planet.id)" :key="unit.type + unit.owner" class="unit-entry">
              <span :style="playerStyle(unit.owner)">{{ unit.owner }}</span>:
              {{ unit.count }}x {{ unit.type }}
              <span v-if="unit.damagedCount > 0" class="damaged-badge">({{ unit.damagedCount }} damaged)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Space Units -->
      <div class="detail-section" v-if="spaceUnits.length > 0">
        <div class="section-label">Ships in Space</div>
        <div v-for="stack in spaceUnitStacks" :key="stack.owner" class="unit-stack-detail">
          <div class="stack-owner" :style="playerStyle(stack.owner)">{{ stack.owner }}</div>
          <div v-for="entry in stack.units" :key="entry.type" class="unit-entry">
            <i v-if="shipIcon(entry.type)"
               :class="'bi ' + shipIcon(entry.type)"
               class="unit-type-icon"
               :style="playerStyle(stack.owner)" />
            {{ entry.count }}x {{ entry.type }}
            <span v-if="entry.damaged > 0" class="damaged-badge">({{ entry.damaged }} damaged)</span>
          </div>
          <div v-if="fleetWarning(stack.owner)" class="fleet-warning-row">
            <span class="fleet-warning-icon">!</span>
            Fleet limit reached: {{ fleetWarning(stack.owner).count }}/{{ fleetWarning(stack.owner).limit }} non-fighter ships
          </div>
        </div>
      </div>

      <!-- Command Tokens -->
      <div class="detail-section" v-if="commandTokens.length > 0">
        <div class="section-label">Command Tokens</div>
        <div v-for="token in commandTokens" :key="token" class="token-entry">
          <span :style="playerStyle(token)">{{ token }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>

<script>
import ModalBase from '@/components/ModalBase.vue'
import { twilight } from 'battlestar-common'
const res = twilight.res

const SHIP_ICONS = {
  'war-sun':     'bi-sun-fill',
  'flagship':    'bi-flag-fill',
  'dreadnought': 'bi-diamond-fill',
  'carrier':     'bi-box-fill',
  'cruiser':     'bi-triangle-fill',
  'destroyer':   'bi-lightning-fill',
  'fighter':     'bi-circle-fill',
}

const UNIT_ORDER = ['war-sun', 'flagship', 'dreadnought', 'carrier', 'cruiser', 'destroyer', 'fighter']
const NON_FIGHTER_TYPES = ['war-sun', 'flagship', 'dreadnought', 'carrier', 'cruiser', 'destroyer']

export default {
  name: 'SystemDetailModal',

  components: { ModalBase },

  inject: ['game', 'ui'],

  computed: {
    systemId() {
      return this.ui?.modals?.systemDetail?.systemId || null
    },

    system() {
      return this.systemId ? this.game.state.systems[this.systemId] : null
    },

    tileData() {
      if (!this.system) {
        return {}
      }
      return res.getSystemTile(this.system.tileId) || {}
    },

    systemName() {
      if (this.tileData.type === 'mecatol') {
        return 'Mecatol Rex'
      }
      if (this.tileData.faction) {
        const faction = res.getFaction(this.tileData.faction)
        return faction?.name || this.tileData.faction
      }
      return `Tile ${this.system?.tileId || '?'}`
    },

    planets() {
      return (this.tileData.planets || []).map(planetId => {
        const planet = res.getPlanet(planetId)
        const state = this.game.state.planets[planetId]
        return {
          id: planetId,
          name: planet?.name || planetId,
          resources: planet?.resources || 0,
          influence: planet?.influence || 0,
          trait: planet?.trait || null,
          techSpecialty: planet?.techSpecialty || null,
          legendary: planet?.legendary || false,
          controller: state?.controller || null,
          exhausted: state?.exhausted || false,
        }
      })
    },

    spaceUnits() {
      if (!this.systemId) {
        return []
      }
      return this.game.state.units[this.systemId]?.space || []
    },

    spaceUnitStacks() {
      const byOwner = {}
      for (const unit of this.spaceUnits) {
        if (!byOwner[unit.owner]) {
          byOwner[unit.owner] = { owner: unit.owner, types: {}, damaged: {} }
        }
        byOwner[unit.owner].types[unit.type] = (byOwner[unit.owner].types[unit.type] || 0) + 1
        if (unit.damaged) {
          byOwner[unit.owner].damaged[unit.type] = (byOwner[unit.owner].damaged[unit.type] || 0) + 1
        }
      }
      return Object.values(byOwner).map(stack => {
        const units = UNIT_ORDER
          .filter(type => stack.types[type])
          .map(type => ({
            type,
            count: stack.types[type],
            damaged: stack.damaged[type] || 0,
          }))
        return { owner: stack.owner, units }
      })
    },

    anomalyLabel() {
      const labels = {
        'asteroid-field': 'Asteroid Field',
        'nebula': 'Nebula',
        'supernova': 'Supernova',
        'gravity-rift': 'Gravity Rift',
      }
      return labels[this.tileData.anomaly] || this.tileData.anomaly
    },

    anomalyEffects() {
      const effects = {
        'asteroid-field': [
          'Ships cannot move through or into this system.',
        ],
        'supernova': [
          'Ships cannot move through or into this system.',
        ],
        'nebula': [
          'Ships can only move here if it is the active system (no moving through).',
          'Ships starting here have their move value treated as 1.',
          'Defender gets +1 to each combat roll in space combat.',
        ],
        'gravity-rift': [
          'Ships moving out of or through this system get +1 move value.',
          'Each ship exiting rolls a die: on 1–3, that ship is destroyed.',
        ],
      }
      return effects[this.tileData.anomaly] || ['No special effects.']
    },

    isFrontierSystem() {
      const planets = this.tileData.planets || []
      return planets.length === 0 && this.tileData.type !== 'hyperlane'
    },

    hasFrontierToken() {
      return this.isFrontierSystem && !this.game.state.exploredPlanets?.[this.systemId]
    },

    commandTokens() {
      return this.system?.commandTokens || []
    },
  },

  methods: {
    planetUnits(planetId) {
      if (!this.systemId) {
        return []
      }
      const unitData = this.game.state.units[this.systemId]?.planets?.[planetId] || []
      const byKey = {}
      for (const unit of unitData) {
        const key = `${unit.owner}-${unit.type}`
        if (!byKey[key]) {
          byKey[key] = { type: unit.type, owner: unit.owner, count: 0, damagedCount: 0 }
        }
        byKey[key].count++
        if (unit.damaged) {
          byKey[key].damagedCount++
        }
      }
      return Object.values(byKey)
    },

    planetAttachments(planetId) {
      const state = this.game.state.planets[planetId]
      const attachments = state?.attachments || []
      return attachments.map(cardId => {
        const card = res.getExplorationCard(cardId)
        return { id: cardId, name: card?.name || cardId }
      })
    },

    playerStyle(playerName) {
      const player = this.game.players.byName(playerName)
      if (player?.color) {
        return { color: player.color, fontWeight: 600 }
      }
      return { fontWeight: 600 }
    },

    isBlockaded(planetId) {
      if (!this.systemId) {
        return false
      }
      const unitData = this.game.state.units[this.systemId]
      if (!unitData) {
        return false
      }

      // Find space dock owner on this planet
      const planetUnits = unitData.planets?.[planetId] || []
      let dockOwner = null
      for (const u of planetUnits) {
        if (u.type === 'space-dock') {
          dockOwner = u.owner
          break
        }
      }
      if (!dockOwner) {
        return false
      }

      const spaceUnits = unitData.space || []
      const hasEnemyShips = spaceUnits.some(u => u.owner !== dockOwner)
      const hasFriendlyShips = spaceUnits.some(u => u.owner === dockOwner)
      return hasEnemyShips && !hasFriendlyShips
    },

    shipIcon(type) {
      return SHIP_ICONS[type] || null
    },

    fleetWarning(owner) {
      const stack = this.spaceUnitStacks.find(s => s.owner === owner)
      if (!stack) {
        return null
      }
      let count = 0
      for (const entry of stack.units) {
        if (NON_FIGHTER_TYPES.includes(entry.type)) {
          count += entry.count
        }
      }
      const player = this.game.players.byName(owner)
      const limit = player?.commandTokens?.fleet || 0
      if (count >= limit) {
        return { count, limit }
      }
      return null
    },
  },
}
</script>

<style scoped>
.system-detail {
  font-size: .85em;
}

.detail-section {
  margin-bottom: .75em;
}

.section-label {
  font-weight: 700;
  font-size: .85em;
  color: #555;
  text-transform: uppercase;
  letter-spacing: .05em;
  border-bottom: 1px solid #eee;
  padding-bottom: .15em;
  margin-bottom: .25em;
}

.info-row {
  display: flex;
  gap: .5em;
  padding: .1em 0;
}

.info-key {
  color: #888;
  min-width: 5em;
}

.planet-detail {
  padding: .35em;
  background: #f8f9fa;
  border-radius: .25em;
  margin-bottom: .25em;
}

.planet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.planet-name {
  font-weight: 600;
}

.planet-stats {
  font-family: monospace;
  color: #555;
}

.planet-meta {
  display: flex;
  gap: .35em;
  margin-top: .15em;
}

.planet-trait, .planet-tech, .planet-legendary {
  font-size: .75em;
  padding: .1em .3em;
  border-radius: .15em;
}

.trait-cultural { background: #bbdefb; color: #1565c0; }
.trait-hazardous { background: #ffcdd2; color: #c62828; }
.trait-industrial { background: #c8e6c9; color: #2e7d32; }

.tech-blue { background: #e3f2fd; color: #0d6efd; }
.tech-red { background: #fce4ec; color: #dc3545; }
.tech-yellow { background: #fff9c4; color: #f57f17; }
.tech-green { background: #e8f5e9; color: #198754; }

.planet-legendary { background: #fff3e0; color: #e65100; font-weight: 600; }

.planet-control {
  font-size: .85em;
  margin-top: .15em;
}

.exhausted-badge {
  font-size: .75em;
  color: #999;
  font-style: italic;
}

.damaged-badge {
  font-size: .85em;
  color: #dc3545;
  font-style: italic;
}

.planet-units, .unit-stack-detail {
  margin-top: .15em;
}

.unit-entry {
  font-size: .85em;
  padding: .05em 0;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: .35em;
}

.unit-type-icon {
  font-size: .9em;
  width: 1.1em;
  text-align: center;
}

.stack-owner {
  font-weight: 600;
  margin-bottom: .1em;
}

.token-entry {
  font-size: .85em;
  padding: .05em 0;
}

.anomaly-block {
  margin-bottom: .25em;
}

.anomaly-effects {
  margin-top: .2em;
  padding-left: .5em;
  border-left: 2px solid #dc3545;
}

.anomaly-effect {
  font-size: .8em;
  color: #666;
  padding: .1em 0;
}

.frontier-tag {
  font-size: .85em; font-weight: 600; color: #0288d1;
}
.frontier-explored {
  font-size: .85em; color: #999; font-style: italic;
}

.blockaded-badge {
  font-size: .75em; font-weight: 700; color: #c62828;
  background: #ffcdd2; padding: .1em .35em; border-radius: .15em;
  margin-left: .35em;
}

.planet-attachments { display: flex; flex-wrap: wrap; gap: .2em; margin-top: .15em; }
.attachment-tag {
  font-size: .75em; padding: .1em .3em; border-radius: .15em;
  background: #fff3e0; color: #e65100; font-weight: 500;
}

.fleet-warning-row {
  display: flex;
  align-items: center;
  gap: .35em;
  font-size: .8em;
  color: #dc3545;
  font-weight: 600;
  margin-top: .25em;
}

.fleet-warning-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1em;
  height: 1.1em;
  border-radius: 50%;
  background: rgba(220, 53, 69, .85);
  color: white;
  font-size: .75em;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
