<template>
<div class="game-log">

  <div class="heading">
    <div style="float: right;">
      <b-form-checkbox v-model="doLogNavigation" size="sm" switch>
        navigate
      </b-form-checkbox>
    </div>

    Log
  </div>

  <div class="log-entries">

    <div v-for="entry in log" :key="entry.id" :class="classes(entry.classes)">
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
      log: [
        {
          id: 1,
          template: "Character selection",
          classes: ['character-selection', 'round-start'],
        },

        {
          id: 2,
          template: "{player} chooses {character}",
          classes: ['character-selection', 'player-action'],
          args: {
            player: {
              value: 'Dennis',
              classes: ['name-player-1'],
            },
            character: {
              value: 'Adama',
              classes: ['character-name'],
            },
          },
        },
      ],
    }
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
          const { value, classes } = args[token]
          return {
            classes: classes.join(' '),
            value,
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

      for (let i = 0; i < template.length; i++) {
        if (template[i] == '{') {
          if (state === 'in') throw 'Nested curly braces'
          state = 'in'

          if (prev == i) continue
          tokens.push({
            substitute: false,
            token: template.substr(prev, i-prev),
          })
          prev = i
        }
        else if (template[i] == '}') {
          if (state !== 'in') throw 'Unmatched closing curly brace'
          tokens.push({
            substitute: true,
            token: template.substr(prev+1, i-prev-1),
          })
          state = 'out'
          prev = i + 1
        }
      }

      if (prev != template.length) {
        tokens.push({
          substitute: false,
          token: template.substr(prev, template.length - prev),
        })
      }

      return tokens
    },
  },
}
</script>


<style>
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

.character-name {
    color: red;
}

</style>
