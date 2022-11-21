<template>
  <div class="cube-breakdown">

    <CubeBreakdownColumn
      v-for="column in columns"
      :cardlist="column.cards"
      :name="column.name"
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

  computed: {
    columns() {
      const collected = util.array.collect(this.cardlist, card => {
        if (cardUtil.isLand(card)) {
          return 'land'
        }
        else if (cardUtil.colors(card).length === 0) {
          return 'colorless'
        }
        else if (cardUtil.colors(card).length > 1) {
          return 'multicolor'
        }
        else {
          return cardUtil.colorSymbolToName(cardUtil.identity(card)[0])
        }
      })

      return Object
        .entries(collected)
        .map(([name, cards]) => ({ name, cards }))
    },
  },
}
</script>


<style scoped>
</style>
