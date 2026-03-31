<template>
  <div class="board-state">
    <div class="section-header">
      Board
      <span class="shield-wall" v-if="!game.state.shieldWall">Shield Wall Destroyed</span>
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
  </div>
</template>


<script>
export default {
  name: 'DuneBoardState',

  inject: ['game'],

  computed: {
    hasBonusSpice() {
      return Object.values(this.game.state.bonusSpice).some(v => v > 0)
    },

    occupiedSpaces() {
      return Object.entries(this.game.state.boardSpaces)
        .filter(([, player]) => player != null)
    },
  },

  methods: {
    formatName(id) {
      return id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    },
  },
}
</script>


<style scoped>
.board-state {
  margin: .5em 0;
  padding: .5em;
  border: 1px solid #3d2e1a;
  border-radius: .3em;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #e8a83e;
  margin-bottom: .3em;
}

.shield-wall {
  font-size: .8em;
  color: #c04040;
  font-weight: 400;
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
  background-color: rgba(255, 255, 255, 0.05);
  padding: .1em .4em;
  border-radius: .15em;
}
</style>
