<template>
  <defs>
    <filter id="selected"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%">
      <feFlood id="outline-color" flood-color="#a34ff7" result="base" />
      <feMorphology result="bigger"
                    in="SourceGraphic"
                    operator="dilate"
                    radius="2"/>
      <feColorMatrix result="mask"
                     in="bigger"
                     type="matrix"
                     values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 1 0" />
      <feComposite result="drop"
                   in="base"
                   in2="mask"
                   operator="in" />
      <feGaussianBlur result="blur" in="drop" stdDeviation="5" />
      <feBlend in="SourceGraphic" in2="blur" mode="normal" />
    </filter>
  </defs>

  <Site
    v-for="site in sites"
    :key="site.name"
    :site="site"
    :highlight="selected && site.name === selected.name"
    @mousedown="mousedown($event, site)"
  />

  <Spot
    v-for="spot in spots"
    :key="spot.name"
    :spot="spot"
    :highlight="selected && spot.name === selected.name"
    @mousedown="mousedown($event, spot)"
  />
</template>


<script>
import Site from './Site'
import Spot from './Spot'


export default {
  name: 'SiteLayer',

  components: {
    Site,
    Spot,
  },

  inject: {
    bus: {
      default: null
    },
  },

  props: {
    selected: {
      type: Object,
      default: null,
    },
    tiles: Array,
  },

  data() {
    return {
      sites: [],
      spots: [],
    }
  },

  methods: {
    mousedown(event, site) {
      if (this.bus) {
        this.bus.emit('site-mousedown', { event, site })
      }
    },

    siteSelected(site) {
      this.selected = site
    },
  },

  watch: {
    tiles: {
      handler(newValue) {
        this.sites = this
          .tiles
          .flatMap(tile => tile.sitesAbsolute().filter(x => x.kind !== 'troop-spot'))
        this.spots = this
          .tiles
          .flatMap(tile => tile.sitesAbsolute().filter(x => x.kind === 'troop-spot'))
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
