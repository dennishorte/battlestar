<template>
  <GameLog id="gamelog-twilight" />
</template>

<script setup>
import { inject } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'
import { defaultMatchers } from '@/modules/games/common/composables/useLogTokenizer'
import CardName from '@/modules/games/common/components/log/CardName.vue'
import LocName from '@/modules/games/common/components/log/LocName.vue'
import PlayerName from '@/modules/games/common/components/log/PlayerName.vue'
import TiCardToken from './log/TiCardToken.vue'
import TiTechToken from './log/TiTechToken.vue'
import TiObjectiveToken from './log/TiObjectiveToken.vue'

const game = inject('game')

function chatColors() {
  const output = {}
  for (const player of game.value.players.all()) {
    output[player.name] = player.color
  }
  return output
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

function lineClasses(line) {
  const classes = [`indent-${line.indent}`]

  if (line.event === 'phase-start') {
    classes.push('phase-header')
    if (line.args?.phase) {
      classes.push(`phase-${line.args.phase.value}`)
    }
  }
  else if (line.event === 'round-start') {
    classes.push('round-header')
  }
  else if (line.event === 'player-turn' || line.event === 'player-action') {
    classes.push('player-action')
  }
  else if (line.event === 'combat') {
    classes.push('combat-entry')
  }

  return classes
}

function lineStyles(line) {
  if (line.event === 'player-turn') {
    const playerName = line.args?.player?.value
    if (playerName) {
      const player = game.value.players.byName(playerName)
      if (player?.color) {
        return {
          'background-color': player.color,
          'color': getContrastColor(player.color),
        }
      }
    }
  }
}

function convertArg(arg, value) {
  if (arg === 'card') {
    return `ticard(${value.value})`
  }
  if (arg === 'tech') {
    return `titech(${value.value})`
  }
  if (arg === 'objective') {
    return `tiobj(${value.value})`
  }
  return undefined
}

useGameLogProvider({
  chatColors,
  lineClasses,
  lineStyles,
  convertArg,
  tokenMatchers: [
    ...defaultMatchers,
    { pattern: /ticard\(([^()]+)\)/, type: 'ticard', props: m => ({ name: m[1] }) },
    { pattern: /titech\(([^()]+)\)/, type: 'titech', props: m => ({ name: m[1] }) },
    { pattern: /tiobj\(([^()]+)\)/, type: 'tiobj', props: m => ({ name: m[1] }) },
  ],
  tokenComponents: {
    card: CardName,
    player: PlayerName,
    loc: LocName,
    ticard: TiCardToken,
    titech: TiTechToken,
    tiobj: TiObjectiveToken,
  },
})
</script>

<style scoped>
#gamelog-twilight :deep(.indent-0),
#gamelog-twilight :deep(.indent-1),
#gamelog-twilight :deep(.indent-2) {
  margin-left: 0;
}

#gamelog-twilight :deep(.indent-3) {
  margin-left: 1em;
}

#gamelog-twilight :deep(.indent-4) {
  margin-left: 2em;
}

/* Round header */
#gamelog-twilight :deep(.round-header) {
  font-weight: bold;
  text-align: center;
  background-color: #1a1a2e;
  color: #e0d68a;
  padding: .25em .5em;
  margin-top: 1em;
  border-radius: .25em;
  display: flex;
  justify-content: center;
}

#gamelog-twilight :deep(.round-header > div) {
  display: block;
}

/* Phase headers */
#gamelog-twilight :deep(.phase-header) {
  font-weight: bold;
  text-align: center;
  padding: .2em .5em;
  border-radius: .2em;
  margin-top: .5em;
  color: white;
}

#gamelog-twilight :deep(.phase-header > div) {
  display: block;
}

#gamelog-twilight :deep(.phase-strategy) { background-color: #0d6efd; }
#gamelog-twilight :deep(.phase-action) { background-color: #198754; }
#gamelog-twilight :deep(.phase-status) { background-color: #b8860b; }
#gamelog-twilight :deep(.phase-agenda) { background-color: #6f42c1; }

/* Player action */
#gamelog-twilight :deep(.player-action) {
  padding: .1em .5em;
  border-radius: .15em;
  margin-top: .25em;
  font-weight: 600;
}

/* Combat */
#gamelog-twilight :deep(.combat-entry) {
  background-color: #fff0f0;
  border-left: 3px solid #dc3545;
  padding: .1em .5em;
  margin-left: 1em;
}

#gamelog-twilight :deep(.player-name) {
  display: inline;
}
</style>
