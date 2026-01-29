<template>
  <g class="tile-site" :class="classes" :filter="filters">

    <polygon v-if="!site.major" class="site-rect" :points="points" />
    <circle v-if="site.major"
            class="site-rect"
            :cx="site.cx"
            :cy="site.cy"
            r="50" />

    <text :x="site.cx" :y="nameY" class="site-name">
      <tspan>{{ name1 }}</tspan>
      <tspan v-if="name2" :x="site.cx" dy="10">{{ name2 }}</tspan>
    </text>

    <SiteTroopSpaces :cx="site.cx" :cy="troopsY" :count="site.size" />

    <SitePoints :cx="topLeft.left" :cy="topLeft.top" :value="site.value" />
  </g>
</template>


<script>
import SitePoints from './SitePoints.vue'
import SiteTroopSpaces from './SiteTroopSpaces.vue'

export default {
  name: 'MapSite',

  components: {
    SitePoints,
    SiteTroopSpaces,
  },

  props: {
    site: {
      type: Object,
      required: true
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return this.site.start ? 'starting-site' : ''
    },

    filters() {
      return this.highlight ? 'url(#selected)' : ''
    },

    halfHeight() {
      switch (this.site.size) {
        case 1:
        case 2:
        case 3:
        case 4:
          return 28
        case 5:
        case 6:
        case 7:
        case 8:
          return 35
        case 9:
          return 42
        default:
          throw new Error('Unsupported size: ' + this.site.size)
      }
    },

    halfWidth() {
      switch (this.site.size) {
        case 1:
          return 28
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          return 38
        default:
          throw new Error('Unsupported size: ' + this.site.size)
      }
    },

    name1() {
      return this.site.name.split('|')[0]
    },
    name2() {
      return this.site.name.split('|')[1]
    },

    nameY() {
      return this.name2 ? this.site.cy - this.halfHeight + 13 : this.site.cy - this.halfHeight + 18
    },

    points() {
      const { cx, cy } = this.site
      return [
        [cx - this.halfWidth, cy - this.halfHeight],
        [cx + this.halfWidth, cy - this.halfHeight],
        [cx + this.halfWidth, cy + this.halfHeight],
        [cx - this.halfWidth, cy + this.halfHeight],
      ]
    },

    topLeft() {
      return {
        top: this.site.cy - this.halfHeight,
        left: this.site.cx - this.halfWidth,
      }
    },

    troopsY() {
      return this.name2 ? this.site.cy + 10 : this.site.cy + 8
    },
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

.starting-site polygon {
  fill: #999;
}
</style>
