<template>
  <GameLog id="gamelog" />
</template>

<script setup>
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

import CardBiscuit from './CardBiscuit.vue'
import CardNameFull from './CardNameFull.vue'
import CardSquareDetails from './CardSquareDetails.vue'
import PlayerName from './PlayerName.vue'

function lineClasses(line) {
  if (line.classes?.includes('faded-text')) {
    return 'faded-text'
  }
  // Fallback: 'chooses' appears in many card files
  if (line.text.includes(' chooses ')) {
    return 'faded-text'
  }
}

useGameLogProvider({
  tokenMatchers: [
    {
      pattern: /\{(.)\}/,
      type: 'biscuit',
      props: (match) => ({ biscuit: match[1], inline: true }),
    },
    {
      pattern: /card\(([^()]+)\)/,
      type: 'card',
      props: (match) => ({ name: match[1] }),
    },
    {
      pattern: /\*([^-]+)-([0-9]+)\*/,
      type: 'cardSquare',
      props: (match) => ({ expansion: match[1], name: match[2] }),
    },
    {
      pattern: /player\(([^()]+)\)/,
      type: 'player',
      props: (match) => ({ name: match[1] }),
    },
  ],
  tokenComponents: {
    biscuit: CardBiscuit,
    card: CardNameFull,
    cardSquare: CardSquareDetails,
    player: PlayerName,
  },
  lineClasses,
})
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
