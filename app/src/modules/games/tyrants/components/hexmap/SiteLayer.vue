<template>
  <Site v-for="site in sitesOnly" v-bind="site" />
  <Spot v-for="spot in spotsOnly" v-bind="spot" />
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

  props: {
    tiles: Array,
  },

  computed: {
    sitesOnly() {
      return this.tiles.flatMap(tile => tile.sitesAbsolute().filter(x => x.kind !== 'troop-spot'))
    },

    spotsOnly() {
      return this.tiles.flatMap(tile => tile.sitesAbsolute().filter(x => x.kind === 'troop-spot'))
    },
  }
}
</script>
