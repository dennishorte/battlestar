<template>
  <div class="div-layer">
    <MajorSiteDiv v-for="loc in majorSites" :key="loc.id" :loc="loc" />
    <SiteDiv v-for="loc in minorSites" :key="loc.id" :loc="loc" />
    <PathDiv v-for="loc in paths" :key="loc.id" :loc="loc" />
  </div>
</template>


<script>
import MajorSiteDiv from './MajorSiteDiv'
import PathDiv from './PathDiv'
import SiteDiv from './SiteDiv'

export default {
  name: 'DivLayer',

  components: {
    MajorSiteDiv,
    PathDiv,
    SiteDiv,
  },

  props: {
    styledDivs: {
      type: Array,
      required: true
    },
  },

  inject: ['game'],

  computed: {
    locations() {
      console.log(this.styledDivs.map(d => d.name))
      return this
        .game
        .getLocationAll()
        .map(loc => {
          loc.ui = this.styledDivs.find(div => div.name === loc.name())
          return loc
        })
    },

    majorSites() {
      return this.sites.filter(loc => loc.checkIsMajorSite())
    },

    minorSites() {
      return this.sites.filter(loc => loc.checkIsMinorSite())
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
