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
        v-for="(token, index) in templateSubstitute(entry.template, entry.args)"
        :key="index"
        :class="token.classes">
        {{ token.value }}
        </span>
    </div>

  </div>

</div>
</template>


<script>
export default {
  name: 'GameLog',

  data() {
    return {
      doLogNavigation: false,
    }
  },

  computed: {
    log() {
      return [...this.$store.state.bsg.game.log].reverse()
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

    templateSubstitute(template, args) {
      const tokens = this.templateTokenize(template)

      return tokens.map(({ substitute, token }) => {
        if (substitute) {
          const { value, kind, classes } = args[token]
          return {
            classes: classes.join(' '),
            value: token === 'card' ? kind : value
          }
        }
        else {
          return {
            classes: '',
            value: token,
          }
        }
      })
    },

    templateTokenize(template) {
      let prev = 0
      let state = 'out'
      const tokens = []

      const push = function(token, substitute) {
        tokens.push({
          substitute: substitute,
          token: token,
        })
      }

      for (let i = 0; i < template.length; i++) {
        if (template[i] == '{') {
          if (state === 'in') throw 'Nested curly braces'
          state = 'in'

          if (prev == i) continue

          push(template.substr(prev, i-prev), false)
          prev = i
        }
        else if (template[i] == '}') {
          if (state !== 'in') throw 'Unmatched closing curly brace'
          push(template.substr(prev+1, i-prev-1), true)
          state = 'out'
          prev = i + 1
        }
      }

      // Catch the last token, if any
      push(template.substr(prev, template.length - prev), false)

      return tokens
    },
  },
}
</script>


<style scoped>
.log-entry {
    font-size: .7em;
}

.round-start {
    font-size: .85em;
    font-weight: bold;
}

.name-player-1 {
    font-weight: bold;
}

</style>
