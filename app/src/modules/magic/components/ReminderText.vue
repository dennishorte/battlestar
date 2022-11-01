<template>
  <span class="reminder-text">
    (<template v-for="part in parts">
      <span v-if="part.type === 'text'">{{ part.text }}</span>
      <Mana v-if="part.type === 'symbol'" :m="part.text" />
    </template>)
  </span>
</template>


<script>
import cardUtil from '../util/cardUtil.js'

import Mana from './Mana'

export default {
  name: 'OracleText',

  components: {
    Mana,
  },

  props: {
    text: String,
  },

  computed: {
    parts() {
      return cardUtil.parseOracleText(this.text)[0].parts
    },
  },
}
</script>


<style scoped>

</style>
