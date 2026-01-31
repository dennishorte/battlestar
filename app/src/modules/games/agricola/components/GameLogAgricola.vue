<template>
  <GameLog id="gamelog" :funcs="propFuncs()" />
</template>

<script>
import GameLog from '@/modules/games/common/components/log/GameLog.vue'

export default {
  name: 'GameLogAgricola',

  components: {
    GameLog
  },

  inject: ['game', 'ui'],

  methods: {
    propFuncs() {
      return {
        chatColors: this.chatColors,
        lineClasses: this.lineClasses,
        lineStyles: this.lineStyles,
      }
    },

    chatColors() {
      const output = {}

      for (const player of this.game.players.all()) {
        output[player.name] = player.color
      }

      return output
    },

    lineClasses(line) {
      const classes = [`indent-${line.indent}`]

      if (line.text.includes('=== Round') || line.text.includes('Initializing game')) {
        classes.push('round-header')
      }
      else if (line.text.includes("'s turn")) {
        classes.push('player-turn')
      }
      else if (line.text.includes('takes action')) {
        classes.push('player-action')
      }
      else if (line.text.includes('Harvest')) {
        classes.push('harvest-phase')
      }
      else if (line.text.includes('Work phase begins')) {
        classes.push('work-phase')
      }

      return classes
    },

    lineStyles(line) {
      if (line.text.includes("'s turn")) {
        const playerName = line.args?.player?.value
        if (playerName) {
          const player = this.game.players.byName(playerName)
          if (player) {
            return {
              'background-color': player.color,
              'color': this.getContrastColor(player.color),
              'margin': '0 -.5em',
              'padding': '0 .5em',
              'border-radius': '.25em',
            }
          }
        }
      }
    },

    // Helper to get contrasting text color
    getContrastColor(hexColor) {
      if (!hexColor) {
        return 'black'
      }
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? 'black' : 'white'
    },
  },
}
</script>

<style scoped>
#gamelog :deep(.round-header) {
  font-weight: bold;
  text-align: center;
  background-color: #8B4513;
  color: white;
  padding: .25em .5em;
  margin-top: 1em;
  /* margin-left: 0 !important; */
  border-radius: .25em;
  display: flex;
  justify-content: center;
}

#gamelog :deep(.round-header > div) {
  display: block;
}

#gamelog :deep(.work-phase) {
  font-weight: bold;
  text-align: center;
  background-color: #5d7a3a;
  color: white;
  padding: .15em .5em;
  margin-left: 0 !important;
  border-radius: .15em;
}

#gamelog :deep(.work-phase > div) {
  display: block;
}

#gamelog :deep(.player-turn) {
  padding: .15em .5em .15em 0;
  border-radius: .15em;
  margin-top: .25em;
}

#gamelog :deep(.player-action) {
  padding: .1em .5em .1em 0;
  background-color: #f5f5dc;
  border-radius: .15em;
  margin: 0 -.5em;
  padding: 0 .5em;
}

#gamelog :deep(.harvest-phase) {
  font-weight: bold;
  background-color: #DAA520;
  color: white;
  padding: .15em .5em;
  border-radius: .15em;
}

#gamelog :deep(.resource) {
  font-weight: bold;
  color: #8B4513;
}

#gamelog :deep(.action-space) {
  font-style: italic;
  color: #2a5a1a;
}

#gamelog :deep(.player-name) {
  display: inline;
}

/* Indentation levels */
#gamelog :deep(.indent-1) {
  margin-left: 1em;
}

#gamelog :deep(.indent-2) {
  margin-left: 2em;
}

#gamelog :deep(.indent-3) {
  margin-left: 3em;
}

#gamelog :deep(.indent-4) {
  margin-left: 4em;
}
</style>
