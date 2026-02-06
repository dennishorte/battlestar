<template>
  <div
    class="editor-location"
    :class="locationClasses"
    :style="locationStyle"
    @mousedown="startDrag"
    @click="handleClick"
  >
    <div class="location-visual" :class="visualClasses">
      <div class="loc-name" v-if="isSite">{{ displayName }}</div>
      <div class="troop-spaces">
        <div
          v-for="n in neutralCount"
          :key="'neutral-' + n"
          class="troop-space neutral"
        />
        <div
          v-for="count in emptySpaces"
          :key="'empty-' + count"
          class="troop-space"
        />
      </div>
      <div class="control-marker" v-if="isMajorSite">
        {{ location.control.influence }} / {{ location.control.points }}
      </div>
      <div class="points-badge" v-if="location.points > 0">{{ location.points }}</div>
    </div>
    <div class="drag-handle" v-if="tool === 'drag'" title="Drag to move">
      <span>&#9673;</span>
    </div>
  </div>
</template>


<script>
export default {
  name: 'EditorLocation',

  props: {
    location: {
      type: Object,
      required: true,
    },
    hexSize: {
      type: Number,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    isPathStart: {
      type: Boolean,
      default: false,
    },
    tool: {
      type: String,
      default: 'select',
    },
  },

  emits: ['select', 'updatePosition'],

  data() {
    return {
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      startPosX: 0,
      startPosY: 0,
    }
  },

  computed: {
    hexWidth() {
      return this.hexSize * Math.sqrt(3)
    },

    hexHeight() {
      return this.hexSize * 2
    },

    isSite() {
      return this.location.points > 0
    },

    isMajorSite() {
      return this.isSite && this.location.control && this.location.control.influence > 0
    },

    displayName() {
      return this.location.name || this.location.short
    },

    neutralCount() {
      return this.location.neutrals || 0
    },

    emptySpaces() {
      const total = this.location.size || 0
      const neutrals = this.location.neutrals || 0
      return Math.max(0, total - neutrals)
    },

    locationClasses() {
      return {
        selected: this.selected,
        'path-start': this.isPathStart,
        dragging: this.isDragging,
        'tool-drag': this.tool === 'drag',
        'tool-connect': this.tool === 'connect-path',
      }
    },

    visualClasses() {
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
      if (this.location.start) {
        classes.push('start-location')
      }
      return classes
    },

    locationStyle() {
      const pos = this.location.position || { x: 0.5, y: 0.5 }
      const left = pos.x * this.hexWidth
      const top = pos.y * this.hexHeight

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
        const spaces = this.location.size || 1
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
        pointerEvents: 'auto',
      }
    },
  },

  methods: {
    handleClick() {
      if (!this.isDragging) {
        this.$emit('select', this.location.short)
      }
    },

    startDrag(event) {
      if (this.tool !== 'drag') {
        return
      }

      event.preventDefault()
      this.isDragging = true
      this.dragStartX = event.clientX
      this.dragStartY = event.clientY

      const pos = this.location.position || { x: 0.5, y: 0.5 }
      this.startPosX = pos.x
      this.startPosY = pos.y

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },

    onDrag(event) {
      const deltaX = (event.clientX - this.dragStartX) / this.hexWidth
      const deltaY = (event.clientY - this.dragStartY) / this.hexHeight

      const newX = Math.max(0, Math.min(1, this.startPosX + deltaX))
      const newY = Math.max(0, Math.min(1, this.startPosY + deltaY))

      this.$emit('updatePosition', this.location.short, { x: newX, y: newY })
    },

    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
  },

  beforeUnmount() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  },
}
</script>


<style scoped>
.editor-location {
  cursor: pointer;
}

.editor-location.tool-drag {
  cursor: move;
}

.editor-location.tool-connect {
  cursor: crosshair;
}

.editor-location.selected .location-visual {
  box-shadow: 0 0 8px 4px #4a90d9;
}

.editor-location.path-start .location-visual {
  box-shadow: 0 0 8px 4px #d94a4a;
}

.editor-location.dragging {
  opacity: 0.8;
}

.location-visual {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-sizing: border-box;
}

.location-visual.site {
  background-color: #d4a574;
  border: 2px solid #8b4513;
}

.location-visual.major-site {
  background-color: #c49a6c;
  border: 3px solid #5c3317;
  border-radius: 50%;
}

.location-visual.minor-site {
  border-radius: 4px;
}

.location-visual.tunnel {
  background-color: #4a3a2a;
  border: 1px solid #6b5344;
  border-radius: 50%;
}

.location-visual.start-location {
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

.drag-handle {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 20px;
  height: 20px;
  background: #4a90d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
