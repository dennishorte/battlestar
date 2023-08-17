<template>
  <CubeBreakdown :cardlist="cards" />
</template>


<script>
import { mag } from 'battlestar-common'

import CubeBreakdown from './CubeBreakdown'

export default {
  name: 'CubeViewer',

  components: {
    CubeBreakdown,
  },

  props: {
    cube: Object,
  },

  computed: {
    cards() {
      const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(this.cube.cardlist, lookupFunc)

      for (const card of this.cube.cardlist) {
        if (!card.data) {
          console.log(card)
          throw new Error(`Unable to fetch data for some cards`)
        }
      }

      return this.cube.cardlist
    },
  },
}
</script>
