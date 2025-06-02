<template>
  <div class="mana-cost">
    <ManaSymbol v-for="(mana, index) in symbols" :key="mana + '-' + index" :m="mana" />
  </div>
</template>


<script>
import { mag } from 'battlestar-common'

import ManaSymbol from './ManaSymbol.vue'


export default {
  name: 'ManaCost',

  components: {
    ManaSymbol,
  },

  props: {
    cost: {
      type: String,
      default: ''
    },
  },

  computed: {
    symbols() {
      return this.cost ? mag.util.card.manaSymbolsFromString(this.cost) : []
    },
  },
}
</script>


<style scoped>
.mana-cost {
  overflow: hidden;
  max-height: 100%;
  display: flex;
  flex-wrap: nowrap;
}
</style>
