<template>
  <div class="oracle-text">
    <div v-for="(line, lineIndex) in lines" :key="lineIndex" class="rules-line">
      <template v-for="(part, partIndex) in line.parts" :key="partIndex">
        <span v-if="part.type === 'text'">{{ part.text }}</span>
        <ManaSymbol v-else-if="part.type === 'symbol'" :m="part.text" />
        <ReminderText v-else-if="part.type === 'reminder'" :text="part.text" />
        <span class="error-text" v-else>{{ part.text }}</span>
      </template>
    </div>
  </div>
</template>


<script>
import { mag } from 'battlestar-common'

import ManaSymbol from './ManaSymbol'
import ReminderText from './ReminderText'

export default {
  name: 'OracleText',

  components: {
    ManaSymbol,
    ReminderText,
  },

  props: {
    text: {
      type: String,
      required: true
    },
  },

  computed: {
    lines() {
      return mag.util.card.parseOracleText(this.text)
    },
  },
}
</script>


<style scoped>
.error-text {
  font-family: monospace;
}
</style>
