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
      <!-- System type indicator -->
      <div class="tile-id">{{ displayId }}</div>

      <!-- Planets -->
      <div class="planet-indicators" v-if="tileData.planets?.length > 0">
        <div
          v-for="planet in planetDisplays"
          :key="planet.id"
          class="planet-dot"
          :class="planetClass(planet)"
          :title="`${planet.name} (${planet.resources}/${planet.influence})`"
        >
          <span class="planet-ri">{{ planet.resources }}/{{ planet.influence }}</span>
        </div>
      </div>

      <!-- Wormholes -->
      <div class="wormhole-badge" v-if="tileData.wormholes?.length > 0">
        <span v-for="w in tileData.wormholes" :key="w" class="wormhole-symbol">{{ wormholeSymbol(w) }}</span>
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
          class="unit-stack"
          :title="stack.summary"
        >
          <div class="unit-dot" :style="{ backgroundColor: stack.color }">
            {{ stack.count }}
          </div>
        </div>
      </div>

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
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

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
        // Short faction abbreviation
        return faction?.name?.substring(0, 3) || '?'
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
      }
    },

    planetDisplays() {
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
          controller: state?.controller || null,
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
            count: 0,
            types: {},
          }
        }
        byOwner[unit.owner].count++
        byOwner[unit.owner].types[unit.type] = (byOwner[unit.owner].types[unit.type] || 0) + 1
      }

      return Object.values(byOwner).map(stack => ({
        ...stack,
        summary: `${stack.owner}: ${Object.entries(stack.types).map(([t, c]) => `${c} ${t}`).join(', ')}`,
      }))
    },

    commandTokens() {
      return this.system.commandTokens || []
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

    tokenColor(playerName) {
      const player = this.game.players.byName(playerName)
      return player?.color || '#888'
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
.hex-hyperlane { fill: #333; }

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
}

.planet-indicators {
  display: flex;
  gap: 2px;
  margin-top: 1px;
}

.planet-dot {
  width: 22px;
  height: 12px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .7em;
  font-weight: 600;
  background: #556;
}

.planet-dot.trait-cultural { background: #2664a0; }
.planet-dot.trait-hazardous { background: #8b2020; }
.planet-dot.trait-industrial { background: #207830; }

.planet-ri {
  color: white;
  text-shadow: 0 0 2px rgba(0,0,0,.8);
}

.wormhole-badge {
  font-size: 1em;
  color: #aef;
  font-weight: 700;
}

.anomaly-badge {
  font-size: .75em;
  color: #fa8;
  font-weight: 600;
}

.unit-stacks {
  display: flex;
  gap: 2px;
  margin-top: 1px;
}

.unit-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .7em;
  font-weight: 700;
  color: white;
  border: 1px solid rgba(255,255,255,.4);
  text-shadow: 0 0 2px rgba(0,0,0,.8);
}

.command-tokens {
  display: flex;
  gap: 1px;
  position: absolute;
  bottom: 18px;
  right: 22px;
}

.cmd-token {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.3);
}
</style>
