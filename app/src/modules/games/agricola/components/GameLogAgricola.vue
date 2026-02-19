<template>
  <GameLog id="gamelog" />
</template>

<script setup>
import { inject } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

const game = inject('game')
const ui = inject('ui')

function cardClick(card) {
  if (card && ui?.fn?.showCard) {
    ui.fn.showCard(card.id, card.type)
  }
}

function cardClasses(card) {
  if (!card) {
    return []
  }
  return ['agricola-card', `card-type-${card.type || 'unknown'}`]
}

function chatColors() {
  const output = {}
  for (const player of game.value.players.all()) {
    output[player.name] = player.color
  }
  return output
}

function lineClasses(line) {
  const classes = [`indent-${line.indent}`]

  if (line.event === 'round-start') {
    classes.push('round-header')
  }
  else if (line.event === 'player-turn') {
    classes.push('player-turn')
  }
  else if (line.event === 'player-action') {
    classes.push('player-action')
  }
  else if (line.event === 'harvest') {
    classes.push('harvest-phase')
  }
  else if (line.event === 'work-phase') {
    classes.push('work-phase')
  }

  return classes
}

function getContrastColor(hexColor) {
  if (!hexColor) {
    return 'black'
  }
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? 'black' : 'white'
}

function lineStyles(line) {
  if (line.event === 'player-turn') {
    const playerName = line.args?.player?.value
    if (playerName) {
      const player = game.value.players.byName(playerName)
      if (player) {
        return {
          'background-color': player.color,
          'color': getContrastColor(player.color),
          'margin': '0 -.5em',
          'padding': '0 .5em',
          'border-radius': '.25em',
        }
      }
    }
  }
}

useGameLogProvider({
  cardClick,
  cardClasses,
  chatColors,
  lineClasses,
  lineStyles,
})
</script>

<style scoped>
#gamelog :deep(.indent-0) {
  font-weight: bold;
  width: 100%;
  text-align: center;
  border-radius: .5em;
  margin-top: 2em;
  line-height: 2em;
}

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

#gamelog :deep(.card-name) {
  display: inline-block;
  padding: 0 .4em;
  border-radius: .2em;
  cursor: pointer;
  border-left: 3px solid;
}

#gamelog :deep(.card-name.card-type-occupation) {
  background-color: #fff3e0;
  border-left-color: #ff9800;
}

#gamelog :deep(.card-name.card-type-minor) {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
}

#gamelog :deep(.card-name.card-type-major) {
  background-color: #fce4ec;
  border-left-color: #e91e63;
}

#gamelog :deep(.card-name:hover) {
  filter: brightness(0.92);
}

#gamelog :deep(.player-name) {
  display: inline;
}


#gamelog :deep(.cost-spent) {
  font-weight: 200;
  color: #999;
  font-size: 0.9em;
  margin-top: -0.1em;
  margin-bottom: -0.1em;
}
</style>
