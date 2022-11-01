<template>
  <div class="oracle-text">
    <div v-for="line in lines" class="rules-line">
      <template v-for="part in line.parts">
        <span v-if="part.type === 'text'">{{ part.text }}</span>
        <Mana v-if="part.type === 'symbol'" :m="part.text" />
        <ReminderText v-if="part.type === 'reminder'" :text="part.text" />
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

</style>
