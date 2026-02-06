<template>
  <div
    class="hex-location"
    :class="locationClasses"
    :style="locationStyle"
  >
    <div class="loc-name" v-if="isSite">{{ displayName }}</div>

    <div class="troop-spaces">
      <!-- Neutral troops (grey circles) -->
      <div
        v-for="n in neutralCount"
        :key="'neutral-' + n"
        class="troop-space neutral"
      />
      <!-- Empty spaces -->
      <div
        v-for="count in emptySpaces"
        :key="'empty-' + count"
        class="troop-space"
      />
    </div>

    <!-- Control marker for major sites -->
    <div class="control-marker" v-if="isMajorSite">
      {{ loc.control.influence }} / {{ loc.control.points }}
    </div>

    <div class="points-badge" v-if="loc.points > 0">{{ loc.points }}</div>
  </div>
</template>


<script>
export default {
  name: 'ViewerHexLocation',

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

    isMajorSite() {
      return this.loc.checkIsMajorSite()
    },

    isTunnel() {
      return !this.loc.checkIsSite()
    },

    displayName() {
      return this.loc.displayName || this.loc.short || this.loc.name()
    },

    neutralCount() {
      return this.loc.neutrals || 0
    },

    emptySpaces() {
      const total = this.loc.size || 0
      const neutrals = this.loc.neutrals || 0
      return Math.max(0, total - neutrals)
    },

    locationClasses() {
      const classes = []

      if (this.isSite) {
        classes.push('site')
        if (this.isMajorSite) {
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

      return classes
    },

    locationStyle() {
      // Flat-top hex dimensions
      const hexWidth = this.hexSize * 2
      const hexHeight = this.hexSize * Math.sqrt(3)

      const pos = this.loc.hexPosition || { x: 0.5, y: 0.5 }

      const left = pos.x * hexWidth
      const top = pos.y * hexHeight

      let width, height

      if (!this.isSite) {
        width = 26
        height = 26
      }
      else if (this.isMajorSite) {
        width = 90
        height = 90
      }
      else {
        const spaces = this.loc.size || 1
        const spacesPerRow = Math.min(spaces, 4)
        const rows = Math.ceil(spaces / 4)

        width = 25 + (spacesPerRow * 16)
        height = 32 + (rows * 14)
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
  background-color: transparent;
}

.troop-space.neutral {
  background-color: #555;
}

.control-marker {
  font-size: 0.55em;
  text-align: center;
  color: #333;
  font-weight: 500;
  margin-top: 2px;
}

.points-badge {
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
</style>
