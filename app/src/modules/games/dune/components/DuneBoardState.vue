<template>
  <div class="board-state">
    <div class="section-header">
      Board
    </div>

    <div class="subsection">
      <div class="subsection-label">Control</div>
      <div class="control-markers">
        <span v-for="(owner, loc) in game.state.controlMarkers" :key="loc" class="control-marker">
          {{ formatName(loc) }}: {{ owner || 'none' }}
        </span>
      </div>
    </div>

    <div class="subsection" v-if="hasBonusSpice">
      <div class="subsection-label">Bonus Spice</div>
      <div class="bonus-spice">
        <span v-for="(count, space) in game.state.bonusSpice" :key="space" v-show="count > 0">
          {{ formatName(space) }}: +{{ count }}
        </span>
      </div>
    </div>

    <div class="subsection" v-if="occupiedSpaces.length > 0">
      <div class="subsection-label">Occupied Spaces</div>
      <div class="occupied">
        <span v-for="[space, player] in occupiedSpaces" :key="space" class="occupied-space">
          {{ formatName(space) }}: {{ player }}
        </span>
      </div>
    </div>

    <template v-if="useRiseOfIx">
      <div class="subsection">
        <div class="subsection-label">Tech</div>
        <div class="tech-stacks">
          <div v-for="stack in techStacks" :key="stack.index" class="tech-stack">
            <div class="tile-face" v-if="stack.top">{{ tileName(stack.top) }}</div>
            <div class="tile-face empty" v-else>empty</div>
            <div class="stack-count">{{ stack.hidden }} face down</div>
          </div>
        </div>
      </div>

      <div class="subsection">
        <div class="subsection-label">Negotiators</div>
        <div class="occupied">
          <span v-for="row in ixPlayers" :key="`neg-${row.name}`" class="occupied-space">
            {{ row.name }}: {{ row.negotiators }}
          </span>
        </div>
      </div>

      <div class="subsection">
        <div class="subsection-label">Freighters</div>
        <div class="occupied">
          <span v-for="row in ixPlayers" :key="`ship-${row.name}`" class="occupied-space">
            {{ row.name }}: {{ row.freighter }}
          </span>
        </div>
      </div>

      <div class="subsection" v-if="ownedTiles.length">
        <div class="subsection-label">Owned Tech</div>
        <div class="owned-tiles">
          <div v-for="tile in ownedTiles"
               :key="tile.id"
               class="owned-tile"
               :class="{ flipped: tile.flipped }">
            <span class="tile-owner">{{ tile.owner }}</span>
            <span v-if="tile.flipped">{{ tile.name }} (face down)</span>
            <span v-else>{{ tile.name }}<span v-if="tile.cost != null"> · {{ tile.cost }} spice</span></span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>


<script>
export default {
  name: 'DuneBoardState',

  inject: ['game'],

  computed: {
    useRiseOfIx() {
      return !!this.game.settings?.useRiseOfIx
    },

    hasBonusSpice() {
      return Object.values(this.game.state.bonusSpice || {}).some(v => v > 0)
    },

    occupiedSpaces() {
      return Object.entries(this.game.state.boardSpaces || {})
        .map(([space, raw]) => {
          const names = Array.isArray(raw) ? raw : (raw ? [raw] : [])
          return [space, names.join(', ')]
        })
        .filter(([, names]) => names)
    },

    techStacks() {
      return (this.game.state.techStacks || []).map((stack, index) => ({
        index,
        top: stack[0] || null,
        hidden: Math.max(0, (stack.length || 0) - (stack[0] ? 1 : 0)),
      }))
    },

    ixPlayers() {
      const names = ['Bottom', 'Middle', 'Top']
      return this.game.players.all().map(player => ({
        name: player.name,
        negotiators: player.negotiators || 0,
        freighter: names[player.freighterPosition] || names[0],
      }))
    },

    ownedTiles() {
      const flipped = this.game.state.flippedTech || {}
      const owned = this.game.state.ownedTech || {}
      const rows = []
      for (const player of this.game.players.all()) {
        for (const tile of owned[player.name] || []) {
          rows.push({
            id: tile.id,
            owner: player.name,
            name: this.tileName(tile),
            cost: tile.definition?.spiceCost,
            flipped: !!flipped[tile.id],
          })
        }
      }
      return rows
    },
  },

  methods: {
    formatName(id) {
      return id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    },

    tileName(tile) {
      return tile?.name || tile?.definition?.name || 'Tech'
    },
  },
}
</script>


<style scoped>
.board-state {
  margin: .5em 0;
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.subsection {
  margin-top: .3em;
}

.subsection-label {
  font-size: .75em;
  text-transform: uppercase;
  color: #8a7a68;
}

.control-markers, .bonus-spice, .occupied {
  display: flex;
  flex-wrap: wrap;
  gap: .5em;
  font-size: .85em;
}

.control-marker, .occupied-space {
  background-color: #f5f0e8;
  padding: .1em .4em;
  border-radius: .15em;
}

.tech-stacks {
  display: flex;
  gap: .4em;
}

.tech-stack {
  flex: 1;
  background-color: #f5f0e8;
  border-radius: .15em;
  padding: .25em .35em;
  font-size: .8em;
}

.tile-face {
  font-weight: 600;
  color: #4a3a20;
}

.tile-face.empty, .stack-count {
  color: #8a7a68;
  font-size: .85em;
}

.owned-tiles {
  display: flex;
  flex-direction: column;
  gap: .2em;
  font-size: .85em;
}

.owned-tile.flipped {
  color: #8a7a68;
}

.tile-owner {
  font-weight: 600;
  margin-right: .3em;
}
</style>
