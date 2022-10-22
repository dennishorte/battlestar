<template>
  <div class="div-layer">
    <SiteDiv v-for="loc in sites" :key="loc.id" :loc="loc" />
    <div v-for="loc in paths" :key="loc.id" :style="loc.ui.renderStyle" />
  </div>
</template>


<script>
import SiteDiv from './SiteDiv'

export default {
  name: 'DivLayer',

  components: {
    SiteDiv,
  },

  props: {
    styledDivs: Array,
  },

  inject: ['game'],

  computed: {
    locations() {
      return this
        .game
        .getLocationAll()
        .map(loc => {
          loc.ui = this.styledDivs.find(div => div.name === loc.name)
          return loc
        })
    },

    paths() {
      return this.locations.filter(loc => !loc.checkIsSite())
    },

    sites() {
      return this.locations.filter(loc => loc.checkIsSite())
    },
  },
}
</script>


<style scoped>
.div-layer {
  position: relative;
}
</style>
