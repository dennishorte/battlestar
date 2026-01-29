<template>
  <GameLog id="gamelog" :funcs="propFuncs()" />
</template>

<script>
import GameLog from '@/modules/games/common/components/log/GameLog.vue'

import CardBiscuit from './CardBiscuit.vue'
import CardNameFull from './CardNameFull.vue'
import CardSquareDetails from './CardSquareDetails.vue'
import PlayerName from './PlayerName.vue'

const biscuitMatcher = /[{](.)[}]/g
const cardMatcher = /[*]([^-]+)-([0-9]+)[*]/g
const cardNameMatcher = /card[(]([^()]+)[)]/g
const playerMatcher = /player[(]([^()]+)[)]/g


export default {
  name: 'GameLogInnovation',

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
#gamelog :deep(.player-turn-start) {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
}
#gamelog :deep(.player-turn-start::before) {
  content: "—";
}
#gamelog :deep(.player-turn-start::after) {
  content: "—";
}

#gamelog :deep(.action-header) {
  font-weight: bold;
  margin-top: .5em;
}

#gamelog :deep(.faded-text) {
  font-weight: 200;
  color: lightgray;
}

#gamelog :deep(.card-effect) {
  background-color: lightgray;
  border-radius: .5em;
}
</style>
