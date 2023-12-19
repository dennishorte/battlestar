<template>
  <GameLog id="gamelog" :funcs="propFuncs()" />
</template>

<script>
import GameLog from '@/modules/games/common/components/log/GameLog'

import CardBiscuit from './CardBiscuit'
import CardNameFull from './CardNameFull'
import CardSquareDetails from './CardSquareDetails'
import PlayerName from './PlayerName'

const biscuitMatcher = /[{](.)[}]/g
const cardMatcher = /[*]([^-]+)-([0-9]+)[*]/g
const cardNameMatcher = /card[(]([^()]+)[)]/g
const playerMatcher = /player[(]([^()]+)[)]/g


export default {
  name: 'GameLogTyrants',

  components: {
    GameLog
  },

  methods: {
    propFuncs() {
      return {
        components: {
          CardBiscuit,
          CardNameFull,
          CardSquareDetails,
          PlayerName,
        },
        componentMatchers: this.componentMatchers,
        lineClasses: this.lineClasses,
      }
    },

    componentMatchers(text) {
      if (!text) {
        return ''
      }

      return text
        .replaceAll(biscuitMatcher, (match, biscuit) => {
          return `<CardBiscuit biscuit="${biscuit}" :inline="true" />`
        })
        .replaceAll(cardNameMatcher, (match, name) => {
          return `<CardNameFull name="${name}" />`
        })
        .replaceAll(cardMatcher, (match, expansion, age) => {
          return `<CardSquareDetails name="${age}" expansion="${expansion}" />`
        })
        .replaceAll(playerMatcher, (match, name) => {
          return `<PlayerName name="${name}" />`
        })
    },

    lineClasses(line) {
      if (
        line.text.includes(' chooses ')
        || line.text.startsWith('Demands will be made of')
        || line.text.startsWith('Effects will share with')
      ) {
        return 'faded-text'
      }
    },
  },
}
</script>

<style scoped>
#gamelog >>> .player-turn-start {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
}
#gamelog >>> .player-turn-start::before {
  content: "—";
}
#gamelog >>> .player-turn-start::after {
  content: "—";
}

#gamelog >>> .action-header {
  font-weight: bold;
  margin-top: .5em;
}

#gamelog >>> .faded-text {
  font-weight: 200;
  color: lightgray;
}

#gamelog >>> .card-effect {
  background-color: lightgray;
  border-radius: .5em;
}
</style>
