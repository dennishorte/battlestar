<template>
  <g>
    <polygon class="site-rect" :points="points" />
    <text :x="cx" :y="nameY" class="site-name">
      <tspan>{{ name1 }}</tspan>
      <tspan v-if="name2" :x="cx" dy="10">{{ name2 }}</tspan>
    </text>

    <SiteTroopSpaces :cx="cx" :cy="troopsY" :count="size" />

    <SitePoints :cx="topLeft.left" :cy="topLeft.top" :value="value" />
  </g>
</template>


<script>
import SitePoints from './SitePoints'
import SiteTroopSpaces from './SiteTroopSpaces'

export default {
  name: 'Site',

  components: {
    SitePoints,
    SiteTroopSpaces,
  },

  props: {
    name: String,
    cx: Number,
    cy: Number,
    size: Number,
    value: Number,
  },

  computed: {
    halfHeight() {
      switch (this.size) {
        case 1:
        case 2:
        case 3:
        case 4:
          return 28
        case 5:
        case 6:
          return 35
        default:
          throw new Error('Unsupported size: ' + this.size)
      }
    },

    halfWidth() {
      switch (this.size) {
        case 1:
          return 28
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          return 38
          /* return 48
           * return 57 */
        default:
          throw new Error('Unsupported size: ' + this.size)
      }
    },

    name1() { return this.name.split('|')[0] },
    name2() { return this.name.split('|')[1] },

    nameY() {
      return this.name2 ? this.cy - this.halfHeight + 13 : this.cy - this.halfHeight + 18
    },

    points() {
      return [
        [this.cx - this.halfWidth, this.cy - this.halfHeight],
        [this.cx + this.halfWidth, this.cy - this.halfHeight],
        [this.cx + this.halfWidth, this.cy + this.halfHeight],
        [this.cx - this.halfWidth, this.cy + this.halfHeight],
      ]
    },

    topLeft() {
      return {
        top: this.cy - this.halfHeight,
        left: this.cx - this.halfWidth,
      }
    },

    troopsY() {
      return this.name2 ? this.cy + 10 : this.cy + 8
    },
  },

  methods: {
  },
}
</script>


<style scoped>
.site-name {
  fill: black;
  font-size: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
  text-anchor: middle;
}

.site-rect {
  stroke: black;
  stroke-width: 2.3;
  fill: white;
}
</style>
