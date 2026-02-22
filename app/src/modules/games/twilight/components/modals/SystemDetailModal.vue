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
        <div class="info-row" v-if="tileData.anomaly">
          <span class="info-key">Anomaly:</span>
          <span>{{ tileData.anomaly }}</span>
        </div>
        <div class="info-row" v-if="tileData.wormholes?.length > 0">
          <span class="info-key">Wormhole:</span>
          <span>{{ tileData.wormholes.join(', ') }}</span>
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
          </div>
          <div class="planet-units" v-if="planetUnits(planet.id).length > 0">
            <div v-for="unit in planetUnits(planet.id)" :key="unit.type + unit.owner" class="unit-entry">
              <span :style="playerStyle(unit.owner)">{{ unit.owner }}</span>:
              {{ unit.count }}x {{ unit.type }}
            </div>
          </div>
        </div>
      </div>

      <!-- Space Units -->
      <div class="detail-section" v-if="spaceUnits.length > 0">
        <div class="section-label">Ships in Space</div>
        <div v-for="stack in spaceUnitStacks" :key="stack.owner" class="unit-stack-detail">
          <div class="stack-owner" :style="playerStyle(stack.owner)">{{ stack.owner }}</div>
          <div v-for="(count, type) in stack.types" :key="type" class="unit-entry">
            {{ count }}x {{ type }}
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
          byOwner[unit.owner] = { owner: unit.owner, types: {} }
        }
        byOwner[unit.owner].types[unit.type] = (byOwner[unit.owner].types[unit.type] || 0) + 1
      }
      return Object.values(byOwner)
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
          byKey[key] = { type: unit.type, owner: unit.owner, count: 0 }
        }
        byKey[key].count++
      }
      return Object.values(byKey)
    },

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

.planet-units, .unit-stack-detail {
  margin-top: .15em;
}

.unit-entry {
  font-size: .85em;
  padding: .05em 0;
  text-transform: capitalize;
}

.stack-owner {
  font-weight: 600;
  margin-bottom: .1em;
}

.token-entry {
  font-size: .85em;
  padding: .05em 0;
}
</style>
