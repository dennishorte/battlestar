<template>
  <div class="history">
    <div v-for="(line, index) in lines" :key="index" :class="line.classes">
      <CardText :text="line.text" />
    </div>
  </div>
</template>

<script>
import CardText from './CardText'
import { log } from 'battlestar-common'

export default {
  name: 'History',

  components: {
    CardText,
  },

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
        output.push({
          text: log.toString(entry),
          classes: entry.classes,
        })
      }
      return output
    }
  },
}
</script>

<style scoped>
.history {
  font-size: .8rem;
}

.player-turn-start {
  font-weight: bold;
  margin-top: .7em;
  text-align: center;
}
.player-turn-start::before {
  content: "—";
}
.player-turn-start::after {
  content: "—";
}

.action-header {
  font-weight: bold;
}
</style>
