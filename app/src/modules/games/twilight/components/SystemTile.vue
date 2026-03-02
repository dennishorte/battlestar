<template>
  <div
    class="system-tile"
    :class="tileClasses"
    :style="tileStyle"
    @click="handleClick"
  >
    <svg :viewBox="svgViewBox" class="hex-svg">
      <polygon :points="hexPoints" class="hex-shape" :class="hexClass" />
    </svg>

    <div class="tile-content">
      <!-- Command tokens -->
      <div class="command-tokens" v-if="commandTokens.length > 0">
        <div
          v-for="token in commandTokens"
          :key="token"
          class="cmd-token"
          :style="{ backgroundColor: tokenColor(token) }"
          :title="`${token}'s command token`"
        />
      </div>

      <!-- System type indicator -->
      <div class="tile-id">{{ displayId }}</div>

      <!-- Frontier token -->
      <div class="frontier-badge" v-if="hasFrontierToken" title="Frontier token">F</div>

      <!-- Custodians token on Mecatol Rex -->
      <div class="custodians-badge" v-if="hasCustodiansToken" title="Custodians token">C</div>

      <!-- Planets with ground units -->
      <div class="planet-indicators" v-if="tileData.planets?.length > 0">
        <div
          v-for="planet in planetDisplays"
          :key="planet.id"
          class="planet-with-units"
        >
          <div
            class="planet-dot"
            :class="planetClass(planet)"
            :style="planetStyle(planet)"
            :title="`${planet.name} (${planet.resources}/${planet.influence})`"
          >
            <span class="planet-ri">{{ planet.resources }}/{{ planet.influence }}</span>
            <span v-if="planet.hasAttachments" class="planet-attach-dot" />
          </div>
          <!-- Ground units below planet dot -->
          <div class="ground-units" v-if="planet.groundStacks.length > 0">
            <span
              v-for="gs in planet.groundStacks"
              :key="gs.type + gs.owner"
              class="ground-entry"
              :style="{ color: gs.color }"
              :title="`${gs.owner}: ${gs.count} ${gs.type}`"
            >
              <i :class="'bi ' + gs.icon" class="ground-icon" />
              <span v-if="gs.count > 1" class="ground-count">{{ gs.count }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Wormholes (native + gamma tokens + ion storm) -->
      <div class="wormhole-badge" v-if="allWormholes.length > 0 || isWormholeNexus">
        <span v-for="w in allWormholes" :key="w" class="wormhole-symbol">{{ wormholeSymbol(w) }}</span>
        <template v-if="isWormholeNexus && !nexusActive">
          <span class="wormhole-symbol wormhole-inactive">&alpha;</span>
          <span class="wormhole-symbol wormhole-inactive">&beta;</span>
        </template>
      </div>

      <!-- Nexus badge -->
      <div v-if="isWormholeNexus" class="nexus-badge" :class="{ 'nexus-active': nexusActive }">
        NEXUS
      </div>

      <!-- Ion storm indicator -->
      <div class="ion-storm-badge" v-if="ionStormInfo" title="Ion Storm">
        <i class="bi bi-cloud-lightning-fill" />
      </div>

      <!-- Anomaly indicator -->
      <div class="anomaly-badge" v-if="tileData.anomaly">
        {{ anomalySymbol }}
      </div>

      <!-- Units in space -->
      <div class="unit-stacks" v-if="spaceUnits.length > 0">
        <div
          v-for="stack in unitStacks"
          :key="stack.owner"
          class="fleet-row"
          :title="stack.summary"
          :style="{ color: stack.color }"
        >
          <span
            v-for="entry in stack.units"
            :key="entry.type"
            class="unit-entry"
          >
            <i :class="'bi ' + entry.icon" class="unit-icon" />
            <span v-if="entry.count > 1" class="unit-count">{{ entry.count }}</span>
            <span v-if="entry.damagedCount > 0" class="damage-pip">*</span>
          </span>
          <!-- Fleet pool limit warning -->
          <span
            v-if="fleetWarningFor(stack.owner)"
            class="fleet-warning"
            :style="{ borderColor: stack.color }"
            :title="`Fleet limit: ${fleetWarningFor(stack.owner).count}/${fleetWarningFor(stack.owner).limit}`"
          >!</span>
        </div>
      </div>

      <!-- Blockade indicator -->
      <div v-if="blockadedDocks.length > 0" class="blockade-badges">
        <span
          v-for="bd in blockadedDocks"
          :key="bd.planetId"
          class="blockade-badge"
          :title="`${bd.owner}'s space dock is blockaded`"
        >B</span>
      </div>
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

const UNIT_ICONS = {
  'war-sun':     'bi-sun-fill',
  'flagship':    'bi-flag-fill',
  'dreadnought': 'bi-diamond-fill',
  'carrier':     'bi-box-fill',
  'cruiser':     'bi-triangle-fill',
  'destroyer':   'bi-lightning-fill',
  'fighter':     'bi-circle-fill',
}
const UNIT_ORDER = ['war-sun', 'flagship', 'dreadnought', 'carrier', 'cruiser', 'destroyer', 'fighter']

const GROUND_ICONS = {
  'infantry':    'bi-person-fill',
  'mech':        'bi-gear-fill',
  'pds':         'bi-crosshair',
  'space-dock':  'bi-building',
}

// Regular hexagon points (pointy-top)
function hexCorner(cx, cy, size, i) {
  const angleDeg = 60 * i - 30
  const angleRad = (Math.PI / 180) * angleDeg
  return {
    x: cx + size * Math.cos(angleRad),
    y: cy + size * Math.sin(angleRad),
  }
}

export default {
  name: 'SystemTile',

  props: {
    systemId: { type: [String, Number], required: true },
    system: { type: Object, required: true },
    hexSize: { type: Number, default: 50 },
    highlighted: { type: Boolean, default: false },
    interactive: { type: Boolean, default: false },
  },

  emits: ['click'],

  inject: ['game'],

  computed: {
    tileData() {
      return res.getSystemTile(this.system.tileId) || {}
    },

    displayId() {
      if (this.tileData.type === 'mecatol') {
        return 'MR'
      }
      if (this.tileData.type === 'home') {
        const faction = res.getFaction(this.tileData.faction)
        if (!faction?.name) {
          return '?'
        }
        return faction.name.replace(/^The /, '')
      }
      if (this.tileData.type === 'hyperlane') {
        return ''
      }
      return this.system.tileId
    },

    tileStyle() {
      const q = this.system.position.q
      const r = this.system.position.r
      const size = this.hexSize
      const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
      const y = size * (3 / 2 * r)
      const dim = size * 2
      return {
        width: dim + 'px',
        height: dim + 'px',
        marginLeft: -size + 'px',
        marginTop: -size + 'px',
        transform: `translate(${x}px, ${y}px)`,
        fontSize: (size * 0.012) + 'rem',
      }
    },

    svgViewBox() {
      const s = this.hexSize
      return `${-s} ${-s} ${s * 2} ${s * 2}`
    },

    hexPoints() {
      const points = []
      for (let i = 0; i < 6; i++) {
        const corner = hexCorner(0, 0, this.hexSize - 1, i)
        points.push(`${corner.x},${corner.y}`)
      }
      return points.join(' ')
    },

    hexClass() {
      const classes = []
      const type = this.tileData.type || 'blue'
      classes.push(`hex-${type}`)
      if (this.tileData.anomaly) {
        classes.push(`hex-anomaly-${this.tileData.anomaly}`)
      }
      if (this.highlighted) {
        classes.push('hex-highlighted')
      }
      return classes
    },

    tileClasses() {
      return {
        interactive: this.interactive,
        highlighted: this.highlighted,
        home: this.tileData.type === 'home',
      }
    },

    hasFrontierToken() {
      const planets = this.tileData.planets || []
      if (planets.length > 0) {
        return false
      }
      if (this.tileData.type === 'hyperlane') {
        return false
      }
      return !this.game.state.exploredPlanets?.[this.systemId]
    },

    hasCustodiansToken() {
      return this.tileData.type === 'mecatol' && !this.game.state.custodiansRemoved
    },

    ionStormInfo() {
      const token = this.game.state.ionStormToken
      if (!token || String(token.systemId) !== String(this.systemId)) {
        return null
      }
      return token
    },

    isWormholeNexus() {
      return this.tileData.id === 82
    },

    nexusActive() {
      return this.isWormholeNexus && !!this.game.state.wormholeNexusActive
    },

    allWormholes() {
      let native = this.tileData.wormholes || []
      // Wormhole Nexus: when inactive, only gamma is active
      if (this.isWormholeNexus && !this.nexusActive) {
        native = ['gamma']
      }
      const wormholes = [...native]

      // Gamma wormhole tokens from exploration
      const gammaTokens = this.game.state.gammaWormholeTokens || []
      if (gammaTokens.includes(String(this.systemId)) || gammaTokens.includes(Number(this.systemId))) {
        if (!wormholes.includes('gamma')) {
          wormholes.push('gamma')
        }
      }

      // Ion storm token adds its active wormhole side
      if (this.ionStormInfo) {
        const side = this.ionStormInfo.side
        if (!wormholes.includes(side)) {
          wormholes.push(side)
        }
      }

      return wormholes
    },

    planetDisplays() {
      return (this.tileData.planets || []).map(planetId => {
        const planet = res.getPlanet(planetId)
        const state = this.game.state.planets[planetId]
        const groundStacks = this._getGroundStacks(planetId)
        return {
          id: planetId,
          name: planet?.name || planetId,
          resources: planet?.resources || 0,
          influence: planet?.influence || 0,
          trait: planet?.trait || null,
          techSpecialty: planet?.techSpecialty || null,
          controller: state?.controller || null,
          hasAttachments: (state?.attachments || []).length > 0,
          groundStacks,
        }
      })
    },

    anomalySymbol() {
      const symbols = {
        'asteroid-field': 'ast',
        'nebula': 'neb',
        'supernova': 'sup',
        'gravity-rift': 'rift',
      }
      return symbols[this.tileData.anomaly] || '?'
    },

    spaceUnits() {
      const units = this.game.state.units[this.systemId]
      return units?.space || []
    },

    unitStacks() {
      const byOwner = {}
      for (const unit of this.spaceUnits) {
        if (!byOwner[unit.owner]) {
          const player = this.game.players.byName(unit.owner)
          byOwner[unit.owner] = {
            owner: unit.owner,
            color: player?.color || '#666',
            types: {},
            damaged: {},
          }
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
            icon: UNIT_ICONS[type] || 'bi-circle',
            count: stack.types[type],
            damagedCount: stack.damaged[type] || 0,
          }))
        const summary = `${stack.owner}: ${units.map(u => {
          let s = `${u.count} ${u.type}`
          if (u.damagedCount > 0) {
            s += ` (${u.damagedCount} damaged)`
          }
          return s
        }).join(', ')}`
        return { owner: stack.owner, color: stack.color, units, summary }
      })
    },

    commandTokens() {
      return this.system.commandTokens || []
    },

    fleetWarnings() {
      const NON_FIGHTER_TYPES = ['war-sun', 'flagship', 'dreadnought', 'carrier', 'cruiser', 'destroyer']
      const warnings = {}
      for (const stack of this.unitStacks) {
        let count = 0
        for (const entry of stack.units) {
          if (NON_FIGHTER_TYPES.includes(entry.type)) {
            count += entry.count
          }
        }
        const player = this.game.players.byName(stack.owner)
        const limit = player?.commandTokens?.fleet || 0
        if (count >= limit) {
          warnings[stack.owner] = { count, limit }
        }
      }
      return warnings
    },

    blockadedDocks() {
      const results = []
      const unitData = this.game.state.units[this.systemId]
      if (!unitData) {
        return results
      }

      const spaceOwners = new Set()
      for (const u of (unitData.space || [])) {
        spaceOwners.add(u.owner)
      }

      for (const [planetId, planetUnits] of Object.entries(unitData.planets || {})) {
        for (const u of planetUnits) {
          if (u.type === 'space-dock') {
            const dockOwner = u.owner
            const hasEnemyShips = [...spaceOwners].some(o => o !== dockOwner)
            const hasFriendlyShips = spaceOwners.has(dockOwner)
            if (hasEnemyShips && !hasFriendlyShips) {
              results.push({ planetId, owner: dockOwner })
            }
            break
          }
        }
      }
      return results
    },
  },

  methods: {
    handleClick() {
      this.$emit('click', this.systemId)
    },

    wormholeSymbol(type) {
      const symbols = { alpha: '\u03B1', beta: '\u03B2', gamma: '\u03B3', delta: '\u03B4' }
      return symbols[type] || type
    },

    planetClass(planet) {
      const classes = []
      if (planet.trait) {
        classes.push(`trait-${planet.trait}`)
      }
      if (planet.controller) {
        const player = this.game.players.byName(planet.controller)
        if (player?.color) {
          classes.push('has-controller')
        }
      }
      return classes
    },

    planetStyle(planet) {
      if (planet.controller) {
        const player = this.game.players.byName(planet.controller)
        if (player?.color) {
          return { borderColor: player.color }
        }
      }
      return {}
    },

    tokenColor(playerName) {
      const player = this.game.players.byName(playerName)
      return player?.color || '#888'
    },

    fleetWarningFor(owner) {
      return this.fleetWarnings[owner] || null
    },

    _getGroundStacks(planetId) {
      const unitData = this.game.state.units[this.systemId]?.planets?.[planetId] || []
      const byKey = {}
      for (const unit of unitData) {
        const key = `${unit.owner}-${unit.type}`
        if (!byKey[key]) {
          const player = this.game.players.byName(unit.owner)
          byKey[key] = {
            type: unit.type,
            owner: unit.owner,
            count: 0,
            icon: GROUND_ICONS[unit.type] || 'bi-circle',
            color: player?.color || '#666',
          }
        }
        byKey[key].count++
      }
      return Object.values(byKey)
    },
  },
}
</script>

<style scoped>
.system-tile {
  position: absolute;
  cursor: default;
}

.system-tile.interactive {
  cursor: pointer;
}

.system-tile.interactive:hover .hex-shape {
  filter: brightness(1.2);
}

.hex-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hex-shape {
  stroke: #334;
  stroke-width: 1;
  transition: filter .15s;
}

.hex-mecatol { fill: #c8a415; }
.hex-home { fill: #4a6fa5; }
.hex-blue { fill: #2a3a5c; }
.hex-red { fill: #5c2a2a; }
.hex-hyperlane { fill: transparent; stroke: transparent; }

.hex-anomaly-asteroid-field { fill: #6b5a3a; }
.hex-anomaly-nebula { fill: #5a3a6b; }
.hex-anomaly-supernova { fill: #8b5a00; }
.hex-anomaly-gravity-rift { fill: #3a2a5c; }

.hex-highlighted {
  stroke: #0f0;
  stroke-width: 3;
  filter: brightness(1.3);
  animation: pulse-glow 1.5s infinite;
}

@keyframes pulse-glow {
  0%, 100% { filter: brightness(1.3); }
  50% { filter: brightness(1.5); }
}

.tile-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #ddd;
}

.tile-id {
  font-weight: 700;
  font-size: 1.1em;
  opacity: .7;
  max-width: 90%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home .tile-id {
  font-size: .65em;
  white-space: normal;
  line-height: 1.1;
}

.planet-indicators {
  display: flex;
  gap: 2px;
  margin-top: 1px;
}

.planet-with-units {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.planet-dot {
  position: relative;
  width: 22px;
  height: 12px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .7em;
  font-weight: 600;
  background: #556;
  border: 2px solid transparent;
}

.planet-dot.trait-cultural { background: #2664a0; }
.planet-dot.trait-hazardous { background: #8b2020; }
.planet-dot.trait-industrial { background: #207830; }

.planet-ri {
  color: white;
  text-shadow: 0 0 2px rgba(0,0,0,.8);
}

.frontier-badge {
  font-size: .85em;
  font-weight: 700;
  color: #adf;
  opacity: .7;
}

.custodians-badge {
  font-size: .85em;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 3px rgba(0,0,0,.9);
}

.planet-attach-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e65100;
  border: 1px solid rgba(0,0,0,.3);
}

.ground-units {
  display: flex;
  gap: 1px;
  margin-top: 0;
}

.ground-entry {
  display: inline-flex;
  align-items: baseline;
  text-shadow: 0 0 3px rgba(0,0,0,.9), 0 0 1px rgba(0,0,0,.7);
}

.ground-icon {
  font-size: .55em;
}

.ground-count {
  font-size: .45em;
  font-weight: 700;
  margin-left: -1px;
}

.wormhole-badge {
  font-size: 1em;
  color: #aef;
  font-weight: 700;
}

.wormhole-inactive {
  opacity: .35;
}

.nexus-badge {
  font-size: .5em;
  font-weight: 700;
  padding: .05em .25em;
  border-radius: .15em;
  background: rgba(128, 128, 128, .6);
  color: #aaa;
  letter-spacing: .05em;
}

.nexus-badge.nexus-active {
  background: rgba(0, 180, 80, .6);
  color: #cfc;
}

.ion-storm-badge {
  font-size: .85em;
  color: #ffeb3b;
  text-shadow: 0 0 3px rgba(0,0,0,.9);
}

.anomaly-badge {
  font-size: .75em;
  color: #fa8;
  font-weight: 600;
}

.unit-stacks {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-top: 1px;
}

.fleet-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
  text-shadow: 0 0 3px rgba(0,0,0,.9), 0 0 1px rgba(0,0,0,.7);
  line-height: 1;
}

.unit-entry {
  display: inline-flex;
  align-items: baseline;
}

.unit-icon {
  font-size: .8em;
}

.unit-count {
  font-size: .6em;
  font-weight: 700;
  margin-left: -1px;
}

.damage-pip {
  color: #ff4444;
  font-weight: 700;
  font-size: .7em;
  text-shadow: 0 0 3px rgba(0,0,0,.9);
}

.command-tokens {
  display: flex;
  gap: 2px;
}

.cmd-token {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.6);
  box-shadow: 0 0 2px rgba(0,0,0,.5);
}

.fleet-warning {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: .9em;
  height: .9em;
  border-radius: 50%;
  background: rgba(220, 53, 69, .85);
  color: white;
  font-size: .6em;
  font-weight: 700;
  border: 1.5px solid;
  margin-left: 1px;
  line-height: 1;
}

.blockade-badges {
  display: flex;
  gap: 2px;
}

.blockade-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: .9em;
  height: .9em;
  border-radius: .15em;
  background: rgba(220, 53, 69, .85);
  color: white;
  font-size: .55em;
  font-weight: 700;
  line-height: 1;
}
</style>
