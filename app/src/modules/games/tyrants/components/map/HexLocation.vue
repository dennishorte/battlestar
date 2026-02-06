<template>
  <div
    class="hex-location"
    :class="locationClasses"
    :style="locationStyle"
    @click="click"
  >
    <div class="loc-name" v-if="isSite">{{ displayName }}</div>

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

    <div class="points" v-if="loc.points > 0">{{ loc.points }}</div>

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
      const hexWidth = this.hexSize * Math.sqrt(3)
      const hexHeight = this.hexSize * 2

      const pos = this.loc.hexPosition || { x: 0.5, y: 0.5 }

      const left = pos.x * hexWidth
      const top = pos.y * hexHeight

      // Size based on whether it's a site or tunnel
      const size = this.isSite
        ? (this.loc.checkIsMajorSite() ? 80 : 60)
        : 30

      return {
        position: 'absolute',
        left: (left - size / 2) + 'px',
        top: (top - size / 2) + 'px',
        width: size + 'px',
        height: size + 'px',
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

.points {
  position: absolute;
  top: -8px;
  left: -8px;
  background-color: white;
  border-radius: 50%;
  border: 2px solid black;
  text-align: center;
  font-size: 0.65em;
  font-weight: 600;
  height: 1.6em;
  width: 1.6em;
  line-height: 1.4em;
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
