<template>
  <span class="reminder-text">
    (<template v-for="part in parts">
      <span v-if="part.type === 'text'">{{ part.text }}</span>
      <Mana v-if="part.type === 'symbol'" :m="part.text" />
    </template>)
  </span>
</template>


<script>
import { mag } from 'battlestar-common'

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
      return mag.util.card.parseOracleText(this.text)[0].parts
    },
  },
}
</script>


<style scoped>

</style>
