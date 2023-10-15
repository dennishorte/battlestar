<template>
  <g :x="x" :y="y">
    <circle
      v-for="x in x1Points"
      :cx="x"
      :cy="cy1"
      r="8"
      class="site-troop-space" />
    <circle
      v-for="x in x2Points"
      :cx="x"
      :cy="cy2"
      r="8"
      class="site-troop-space" />
    <circle
      v-for="x in x3Points"
      :cx="x"
      :cy="cy3"
      r="8"
      class="site-troop-space" />
  </g>
</template>


<script>
export default {
  name: 'SiteTroopSpaces',

  props: {
    count: Number,
    cx: Number,
    cy: Number,
  },

  computed: {
    cy1() {
      if (this.x3Points.length) {
        return this.cy - 18
      }
      else if (this.x2Points.length) {
        return this.cy - 9
      }
      else {
        return this.cy
      }
    },

    cy2() {
      if (this.x3Points.length) {
        return this.cy
      }
      else {
        return this.cy + 9
      }
    },

    cy3() {
      return this.cy + 18
    },

    x1Points() {
      if (this.count === 5) {
        return this.xPoints(2)
      }
      else if (this.count === 6 || this.count === 7 || this.count === 9) {
        return this.xPoints(3)
      }
      else if (this.count === 8) {
        return this.xPoints(4)
      }
      else {
        return this.xPoints(this.count)
      }
    },

    x2Points() {
      if (this.count === 5 || this.count === 6 || this.count === 9) {
        return this.xPoints(3)
      }
      else if (this.count === 7 || this.count === 8) {
        return this.xPoints(4)
      }
      else {
        return []
      }
    },

    x3Points() {
      if (this.count === 9) {
        return this.xPoints(3)
      }
      else {
        return []
      }
    },

    x() { return this.cx },
    y() { return this.cy },
  },

  methods: {
    xPoints(count) {
      const cx = this.cx

      const radius = 8
      const spacing = 2

      const output = []

      if (count === 1 || count === 3 || count === 5) {
        output.push(cx)
      }

      if (count === 3 || count === 5) {
        output.push(cx - spacing - radius * 2)
        output.push(cx + spacing + radius * 2)
      }

      if (count === 5) {
        output.push(cx - spacing * 2 - radius * 4)
        output.push(cx + spacing * 2 + radius * 4)
      }

      if (count === 2 || count === 4 || count === 6) {
        output.push(cx - radius - spacing / 2)
        output.push(cx + radius + spacing / 2)
      }

      if (count === 4 || count == 6) {
        output.push(cx - radius * 3 - spacing * 1.5)
        output.push(cx + radius * 3 + spacing * 1.5)
      }

      if (count === 6) {
        output.push(cx - radius * 5 - spacing * 2.5)
        output.push(cx + radius * 5 + spacing * 2.5)
      }

      return output
    },
  },
}
</script>


<style scoped>
.site-troop-space {
  stroke: black;
  stroke-width: 1;
  fill: white;
}
</style>
