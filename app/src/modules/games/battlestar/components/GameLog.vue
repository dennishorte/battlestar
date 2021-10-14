<template>
  <div class="game-log">

    <div>
      <div style="float: right;">
        <b-form-checkbox v-model="doLogNavigation" size="sm" switch>
          navigate
        </b-form-checkbox>
      </div>

      <span class="heading">
        Log
      </span>
    </div>

    <div class="log-entries">

      <div v-for="entry in log" :key="entry.id" :class="classes(entry.classes)">
        <span class="player">{{ entry.actor }}: </span>
        <span
          v-for="(token, index) in templateSubstitute(entry)"
          :key="index"
          :class="token.classes">
          {{ token.value }}
        </span>
      </div>

    </div>

  </div>
</template>


<script>
import { log } from 'battlestar-common'

export default {
  name: 'GameLog',

  data() {
    return {
      doLogNavigation: false,
    }
  },

  computed: {
    log() {
      return [...this.$game.getLog()].reverse()
    },
  },

  methods: {
    classes(classArray) {
      if (!classArray || classArray.length == 0) {
        return 'log-entry'
      }
      else {
        return classArray.join(' ') + ' log-entry'
      }
    },

    templateSubstitute(entry) {
      return log.apply(entry)
    },
  },
}
</script>


<style scoped>
.log-entry {
  font-size: .7em;
}

.pass-turn {
  font-size: .9em;
  margin-left: .5em;
  font-weight: 600;
  margin-bottom: .25em;
}

.phase-change > .player,
.pass-turn > .player {
  display: none;
}

.phase-change {
  font-weight: 600;
  font-size: .75em;
  margin-bottom: .25em;
}


.round-start {
  font-size: .85em;
  font-weight: bold;
}

.name-player-1 {
  font-weight: bold;
}

</style>
