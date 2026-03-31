<template>
  <GameLog id="gamelog" />
</template>

<script setup>
import { inject } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

const game = inject('game')

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
  else if (line.event === 'phase-start') {
    classes.push('phase-header')
  }
  else if (line.event === 'player-turn' || line.event === 'turn-start') {
    classes.push('player-turn')
  }
  else if (line.event === 'step') {
    classes.push('step-header')
  }
  else if (line.event === 'memo') {
    classes.push('memo')
  }

  return classes
}

function lineStyles(line) {
  if (line.event === 'player-turn' || line.event === 'turn-start') {
    const playerName = line.args?.player?.value
    if (playerName) {
      const player = game.value.players.byName(playerName)
      if (player) {
        return { 'background-color': player.color }
      }
    }
  }
}

function playerStyles(player) {
  return { 'border-bottom': `2px solid ${player.color}`, 'font-weight': 'bold' }
}

useGameLogProvider({
  chatColors,
  lineClasses,
  lineStyles,
  playerStyles,
})
</script>

<style scoped>
/* Round headers — most prominent */
#gamelog :deep(.round-header) {
  display: flex;
  width: 100%;
  font-size: 1.15em;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 4px;
  margin-top: 14px;
  background-color: #8b6914;
  color: white;
}

/* Phase headers */
#gamelog :deep(.phase-header) {
  display: flex;
  width: 100%;
  font-weight: 600;
  font-size: 0.9em;
  color: #4a3a20;
  background-color: #e8dcc0;
  padding: 4px 12px;
  border-radius: 4px;
  margin-top: 10px;
}

/* Player turn headers */
#gamelog :deep(.player-turn) {
  display: flex;
  width: 100%;
  font-size: 1.05em;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 4px;
  margin-top: 8px;
  color: white;
}

/* Step headers */
#gamelog :deep(.step-header) {
  font-weight: 600;
  font-size: 0.85em;
  color: #6a5a40;
  padding: 2px 10px;
  margin-top: 4px;
}

/* Memos — subtle system notes */
#gamelog :deep(.memo) {
  font-style: italic;
  opacity: 0.6;
  font-size: 0.85em;
}

/* Indentation */
#gamelog :deep(.indent-1) {
  margin-left: 0em;
}

#gamelog :deep(.indent-2) {
  margin-left: 1.5em;
}

#gamelog :deep(.indent-3) {
  margin-left: 3em;
}

/* Card names — amber */
#gamelog :deep(.card-name) {
  display: inline-block;
  color: #8b6914;
  font-weight: bold;
}

/* Faction names — colored by faction */
#gamelog :deep(.faction-name) {
  display: inline-block;
  font-weight: bold;
  padding: 0 .3em;
  border-radius: .15em;
}

/* Resource names */
#gamelog :deep(.resource-name) {
  display: inline-block;
  font-weight: 600;
}

/* Board space names */
#gamelog :deep(.board-space-name) {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: .15em;
  padding: 0 .3em;
}

/* Leader names */
#gamelog :deep(.leader-name) {
  display: inline-block;
  color: #6a3d8a;
  font-weight: bold;
}

/* Player names */
#gamelog :deep(.player-name) {
  display: inline-block;
  padding: 0 .4em;
  border-radius: .15em;
}
</style>
