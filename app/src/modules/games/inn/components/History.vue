<template>
  <div class="history">
    Log

    <div v-for="(line, index) in lines" :key="index">
      {{ line }}
    </div>
  </div>
</template>

<script>
import { log } from 'battlestar-common'

export default {
  name: 'History',

  inject: ['game'],

  props: {
    game: Object
  },

  computed: {
    lines() {
      const output = []
      for (const entry of this.game.getLog()) {
        if (entry === '__INDENT__' || entry === '__OUTDENT__') {
          continue
        }
        output.push(log.toString(entry))
      }
      return output
    }
  },
}
</script>
