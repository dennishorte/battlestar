<template>
  <g>
    <path
      :d="coords"
      stroke="black"
      stroke-width="3"
      fill="none"
      @click="clickHandler"
    />

    <template v-if="showHandles">
      <circle
        v-for="(handle, index) in handles"
        :key="index"
        :cx="handle.x"
        :cy="handle.y"
        :name="handle.name"
        r="10"
        @mousemove="drag"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      />
    </template>
  </g>
</template>


<script>
import { util } from 'battlestar-common'


export default {
  name: 'CubicBezier',

  props: {
    value: Object,
  },

  data() {
    return {
      showHandles: false,

      dragData: {
        dragging: false,
        target: null,
        lastPoint: null,
      },
    }
  },

  inject: ['bus'],

  computed: {
    coords() {
      const s = this.value.points.source
      const t = this.value.points.target

      const sh = this.value.points.sourceHandle
      const th = this.value.points.targetHandle

      return `M ${s.x} ${s.y} C ${sh.x} ${sh.y} ${th.x} ${th.y} ${t.x} ${t.y}`
    },

    handles() {
      return Object
        .entries(this.value.points)
        .map(([name, point]) => {
          point.name = name
          return point
        })
        .filter(pt => pt.moveable)
    },
  },

  methods: {
    clickHandler() {
      this.showHandles = true
    },

    clearSelection() {
      this.stopDrag()
      this.showHandles = false
    },

    drag(event) {
      if (this.dragData.dragging) {
        const name = event.target.getAttribute('name')

        const newPoint = util.event.offsetPoint(event)
        const offset = util.point.sub(newPoint, this.dragData.lastPoint)

        const newData = util.deepcopy(this.value)
        newData.points[name].x += offset.x
        newData.points[name].y += offset.y

        this.dragData.lastPoint = newPoint

        this.$emit('input', newData)
      }
    },

    startDrag(event) {
      this.dragData.dragging = true
      this.dragData.target = event.target
      this.dragData.lastPoint = util.event.offsetPoint(event)
    },

    stopDrag() {
      this.dragData.dragging = false
      this.dragData.target = null
      this.dragData.lastPoint = null
    },
  },

  created() {
    this.bus.$on('clear-selection', this.clearSelection)
  },
}
</script>
