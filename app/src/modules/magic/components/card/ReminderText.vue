<template>
  <span class="reminder-text">
    (<template v-for="(part, index) in parts" :key="part.text + '-' + index">
      <span v-if="part.type === 'text'">{{ part.text }}</span>
      <ManaSymbol v-if="part.type === 'symbol'" :m="part.text" />
    </template>)
  </span>
</template>


<script>
import { mag } from 'battlestar-common'

import ManaSymbol from './ManaSymbol.vue'

export default {
  name: 'ReminderText',

  components: {
    ManaSymbol,
  },

  props: {
    text: {
      type: String,
      required: true
    },
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
