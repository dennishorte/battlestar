<template>
  <div
    class="hex-location"
    :class="locationClasses"
    :style="locationStyle"
  >
    <div class="loc-name" v-if="isSite">{{ displayName }}</div>

    <div class="troop-spaces">
      <div
        v-for="count in emptySpaces"
        :key="'empty-' + count"
        class="troop-space"
      />
    </div>

    <div class="points" v-if="loc.points > 0">{{ loc.points }}</div>
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

    isTunnel() {
      return !this.loc.checkIsSite()
    },

    displayName() {
      return this.loc.displayName || this.loc.short || this.loc.name()
    },

    emptySpaces() {
      return this.loc.size || 0
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

      return classes
    },

    locationStyle() {
      const hexWidth = this.hexSize * Math.sqrt(3)
      const hexHeight = this.hexSize * 2

      const pos = this.loc.hexPosition || { x: 0.5, y: 0.5 }

      const left = pos.x * hexWidth
      const top = pos.y * hexHeight

      let width, height

      if (!this.isSite) {
        width = 26
        height = 26
      }
      else if (this.loc.checkIsMajorSite()) {
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
</style>
