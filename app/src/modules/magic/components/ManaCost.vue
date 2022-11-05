<template>
  <div class="mana-cost">
    <Mana v-for="mana in symbols" :m="mana" />
  </div>
</template>


<script>
import cardUtil from '../util/cardUtil.js'

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
      return this.cost ? cardUtil.manaSymbolsFromString(this.cost) : []
    },
  },
}
</script>
