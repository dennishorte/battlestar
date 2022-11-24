<template>
  <div class="mana-cost">
    <Mana v-for="mana in symbols" :m="mana" />
  </div>
</template>


<script>
import { mag } from 'battlestar-common'

import Mana from './Mana'


export default {
  name: 'ManaCost',

  components: {
    Mana,
  },

  props: {
    cost: String,
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
}
</style>
