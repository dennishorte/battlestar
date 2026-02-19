<template>
  <div
    class="hex-location"
    :class="locationClasses"
    :style="locationStyle"
    @click="click"
  >
    <div class="loc-name" v-if="isSite">{{ displayName }}</div>
    <div class="tunnel-name" v-if="isTunnel">{{ loc.short }}</div>

    <div class="troop-spaces">
      <div
        v-for="troop in loc.getTroops()"
        :key="troop.id"
        class="troop-space"
        :class="{ 'unit-selected': ui.fn.isUnitSelectable(troop, loc) }"
        :style="ui.fn.troopStyle(troop)"
        @click="ui.fn.clickTroop(troop, loc, $event)"
      />

      <div
        v-for="count in loc.getEmptySpaces()"
        :key="'empty-' + count"
        class="troop-space"
      />
    </div>

    <div class="spy-zone" v-if="hasSpies">
      <div
        v-for="spy in loc.getSpies()"
        :key="spy.id"
        class="spy troop-space"
        :class="{ 'unit-selected': ui.fn.isUnitSelectable(spy, loc) }"
        :style="ui.fn.troopStyle(spy)"
        @click="ui.fn.clickSpy(spy, loc, $event)"
      />
    </div>

    <div class="control-marker" v-if="loc.checkIsMajorSite()">
      {{ loc.totalControl.influence }} / {{ loc.totalControl.points }}
    </div>

    <div
      class="points"
      :class="{ 'minor-site-points': isSite && !loc.checkIsMajorSite() }"
      v-if="loc.points > 0"
    >{{ loc.points }}</div>

    <div class="gemstone" v-if="hasGemstone" title="Gemstone">
      <span class="gem-icon">💎</span>
    </div>
  </div>
</template>


<script>
export default {
  name: 'HexLocation',

  inject: ['game', 'ui'],

  props: {
    loc: {
      type: Object,
      required: true,
    },
    hexSize: {
      type: Number,
      required: true,
    },
    positionOverride: {
      type: Object,
      default: null,
    },
  },

  computed: {
    isSite() {
      return this.loc.checkIsSite()
    },

    isTunnel() {
      return !this.loc.checkIsSite()
    },

    displayName() {
      // Use displayName if available, otherwise use the short name
      return this.loc.displayName || this.loc.short || this.loc.name()
    },

    hasSpies() {
      return this.loc.getSpies().length > 0
    },

    hasGemstone() {
      return this.game.state.gemstones && this.game.state.gemstones[this.loc.name()]
    },

    locationClasses() {
      const classes = []

      if (this.isSite) {
        classes.push('site')
        if (this.loc.checkIsMajorSite()) {
          classes.push('major-site')
        }
        else {
          classes.push('minor-site')
        }
      }
      else {
        classes.push('tunnel')
      }

      if (this.loc.start) {
        classes.push('start-location')
      }

      if (this.ui.selectable.includes(this.loc.name())) {
        classes.push('selected')
      }

      return classes
    },

    locationStyle() {
      // Position based on hexPosition (0-1 relative coordinates within hex)
      // Flat-top hex: width = 2 * size, height = sqrt(3) * size
      const hexWidth = this.hexSize * 2
      const hexHeight = this.hexSize * Math.sqrt(3)

      const pos = this.positionOverride || this.loc.hexPosition || { x: 0.5, y: 0.5 }

      const left = pos.x * hexWidth
      const top = pos.y * hexHeight

      let width, height

      if (!this.isSite) {
        // Tunnels: circles sized to fit name
        width = 36
        height = 36
      }
      else if (this.loc.checkIsMajorSite()) {
        // Major sites: large circles
        width = 90
        height = 90
      }
      else {
        // Minor sites: rectangles sized by number of spaces
        // Width scales with spaces (up to 4 per row), height adds rows as needed
        const spaces = this.loc.size || 1
        const spacesPerRow = Math.min(spaces, 4)
        const rows = Math.ceil(spaces / 4)

        width = 25 + (spacesPerRow * 16)  // ~41, 57, 73, 89 for 1-4 spaces
        height = 32 + (rows * 14)  // ~46 for 1 row, ~60 for 2 rows
      }

      return {
        position: 'absolute',
        left: (left - width / 2) + 'px',
        top: (top - height / 2) + 'px',
        width: width + 'px',
        height: height + 'px',
      }
    },
  },

  methods: {
    click() {
      this.ui.fn.clickLocation(this.loc)
    },
  },
}
</script>


<style scoped>
.hex-location {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  box-sizing: border-box;
}

.site {
  background-color: #d4a574;
  border: 2px solid #8b4513;
}

.major-site {
  background-color: #c49a6c;
  border: 3px solid #5c3317;
  border-radius: 50%;
}

.minor-site {
  border-radius: 4px;
}

.tunnel {
  background-color: #4a3a2a;
  border: 1px solid #6b5344;
  border-radius: 50%;
}

.tunnel-name {
  font-size: 0.4em;
  text-align: center;
  line-height: 1;
  color: #aaa;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.start-location {
  border-color: gold;
  border-width: 3px;
}

.selected {
  box-shadow: 0 0 6px 6px #cc99ff;
}

.loc-name {
  font-size: 0.5em;
  text-align: center;
  line-height: 1.1em;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
  font-weight: 500;
}

.troop-spaces {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1px;
}

.troop-space {
  height: 0.9em;
  width: 0.9em;
  border-radius: 50%;
  border: 1px solid black;
}

.unit-selected {
  box-shadow: 0 0 3px 3px #cc99ff;
  cursor: pointer;
}

.spy-zone {
  position: absolute;
  top: -4px;
  right: -4px;
}

.control-marker {
  font-size: 0.5em;
  text-align: center;
  color: #333;
  font-weight: 600;
}

.points {
  position: absolute;
  top: 0.2em;
  left: 0.2em;
  background-color: #d4a574;
  border-radius: 50% 25%;
  border: 1px solid #5c3317;
  text-align: center;
  font-size: 0.6em;
  font-weight: 600;
  height: 1.5em;
  width: 1.5em;
  line-height: 1.4em;
  color: #333;
}

.points.minor-site-points {
  top: -0.5em;
  left: -0.5em;
}

.gemstone {
  position: absolute;
  bottom: -6px;
  right: -6px;
  font-size: 0.8em;
}

.gem-icon {
  filter: drop-shadow(0 0 2px #fff);
}
</style>
