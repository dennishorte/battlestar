<template>
  <g :id="id">
    <path
      class="curve-border"
      v-if="borderWidth > 0"
      :d="coords"
      :stroke="borderColor"
      :stroke-width="strokeWidth + borderWidth * 2"
      fill="none"
    />

    <path
      class="stroke-center"
      :d="coords"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      fill="none"
    />
  </g>
</template>


<script>
export default {
  name: 'MapConnector',

  props: {
    id: {
      type: String,
      required: true
    },
    points: {
      type: Object,
      required: true
    },

    borderColor: {
      type: String,
      default: 'black',
    },
    borderWidth: {
      type: Number,  // in pixels
      default: 0,
    },

    strokeColor: {
      type: String,
      default: 'black',
    },
    strokeWidth: {
      type: Number,
      default: 4,
    },
  },

  computed: {
    coords() {
      const s = this.points.source
      const t = this.points.target

      const sh = this.points.sourceHandle
      const th = this.points.targetHandle

      return `M ${s.x} ${s.y} C ${sh.x} ${sh.y} ${th.x} ${th.y} ${t.x} ${t.y}`
    },
  },
}
</script>
