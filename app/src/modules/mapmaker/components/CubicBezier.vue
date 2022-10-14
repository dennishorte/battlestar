<template>
  <path
    :d="coords"
    :id="id"
    stroke="black"
    stroke-width="4"
    fill="none"
  />
</template>


<script>
export default {
  name: 'CubicBezier',

  props: {
    id: String,
    points: Object,
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
