<template>
  <div
    class="editor-location"
    :class="locationClasses"
    :style="locationStyle"
    @mousedown="startDrag"
    @click="handleClick"
  >
    <!-- Transparent overlay for interactions - visuals rendered by ViewerHexLocation underneath -->
    <div class="location-overlay" :class="visualClasses" />
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
    // Flat-top hex dimensions
    hexWidth() {
      return this.hexSize * 2
    },

    hexHeight() {
      return this.hexSize * Math.sqrt(3)
    },

    isSite() {
      return this.location.points > 0
    },

    isMajorSite() {
      return this.isSite && this.location.control && this.location.control.influence > 0
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
        width = 36
        height = 36
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

.editor-location.selected .location-overlay {
  box-shadow: 0 0 8px 4px #4a90d9;
}

.editor-location.path-start .location-overlay {
  box-shadow: 0 0 8px 4px #d94a4a;
}

.editor-location.dragging {
  opacity: 0.8;
}

.location-overlay {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-sizing: border-box;
}

.location-overlay.minor-site {
  border-radius: 4px;
}
</style>
