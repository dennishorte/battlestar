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
import cardUtil from '../../util/cardUtil.js'
import { util } from 'battlestar-common'

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
      const collected = util.array.collect(this.cardlist, card => {
        if (cardUtil.isLand(card)) {
          return 'land'
        }
        else if (cardUtil.identity(card).length === 0) {
          return 'colorless'
        }
        else if (cardUtil.identity(card).length > 1) {
          return 'multicolor'
        }
        else {
          return cardUtil.colorSymbolToName(cardUtil.identity(card)[0])
        }
      })

      return Object
        .entries(collected)
        .map(([name, cards]) => ({ name, cards }))
        .sort((l, r) => this.columnSort.indexOf(l.name) - this.columnSort.indexOf(r.name))
    },
  },
}
</script>


<style scoped>
.cube-breakdown {
  display: flex;
  flex-direction: row;
}

.breakdown-column:not(:first-of-type) {
  margin-left: .25em;
}
</style>
