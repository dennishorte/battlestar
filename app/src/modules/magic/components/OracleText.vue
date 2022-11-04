<template>
  <div class="oracle-text">
    <div v-for="line in lines" class="rules-line">
      <template v-for="part in line.parts">
        <span v-if="part.type === 'text'">{{ part.text }}</span>
        <Mana v-else-if="part.type === 'symbol'" :m="part.text" />
        <ReminderText v-else-if="part.type === 'reminder'" :text="part.text" />
        <span class="error-text" v-else>{{ part.text }}</span>
      </template>
    </div>
  </div>
</template>


<script>
import cardUtil from '../util/cardUtil.js'

import Mana from './Mana'
import ReminderText from './ReminderText'

export default {
  name: 'OracleText',

  components: {
    Mana,
    ReminderText,
  },

  props: {
    text: String,
  },

  computed: {
    lines() {
      return cardUtil.parseOracleText(this.text)
    },
  },
}
</script>


<style scoped>
.error-text {
  font-family: monospace;
}
</style>
