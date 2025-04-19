<template>
  <div class="cube-breakdown">
    <CubeBreakdownColumn
      v-for="column in columns"
      :cardlist="column.cards"
      :name="column.name"
      class="breakdown-column"
    />

  </div>
</template>


<script>
import { mag, util } from 'battlestar-common'

import CubeBreakdownColumn from './CubeBreakdownColumn'


export default {
  name: 'CubeBreakdown',

  components: {
    CubeBreakdownColumn,
  },

  props: {
    cardlist: Array,
  },

  data() {
    return {
      columnSort: [
        'white',
        'blue',
        'black',
        'red',
        'green',
        'multicolor',
        'colorless',
        'land',
      ],
    }
  },

  computed: {
    columns() {
      if (this.cardlist.length === 0 || !this.cardlist[0].data) {
        return []
      }

      const collected = util.array.collect(this.cardlist, card => {
        if (card.isLand()) {
          return 'land'
        }
        else if (card.isColorless()) {
          return 'colorless'
        }
        else if (card.isMulticolor()) {
          return 'multicolor'
        }
        else {
          return mag.util.card.colorSymbolToName(card.colorIdentity()[0])
        }
      })

      const columns = Object
        .entries(collected)
        .map(([name, cards]) => ({ name, cards }))
        .sort((l, r) => this.columnSort.indexOf(l.name) - this.columnSort.indexOf(r.name))

      return columns
    },
  },
}
</script>


<style scoped>
.cube-breakdown {
  display: flex;
  flex-direction: row;
  min-width: 1200px;
}

.breakdown-column:not(:first-of-type) {
  margin-left: .25em;
}
</style>
