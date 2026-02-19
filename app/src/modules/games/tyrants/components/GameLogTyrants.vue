<template>
  <GameLog id="gamelog" />
</template>

<script setup>
import { getCurrentInstance, inject } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

const game = inject('game')
const ui = inject('ui')
const { proxy } = getCurrentInstance()

function cardClick(card) {
  ui.modals.cardViewer.cardId = card.id
  proxy.$modal('card-viewer-modal').show()
}

function cardOwner(card) {
  if (card) {
    const nameBits = card.name.split('-')
    if (nameBits.length > 1 && (nameBits[0] === 'troop' || nameBits[0] === 'spy')) {
      return game.value.players.byName(nameBits[1])
    }
  }
}

function cardStyles(card) {
  const output = {}
  if (cardOwner(card)) {
    output['background-color'] = cardOwner(card).color
  }
  return output
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

  if (line.classes && line.classes.includes('player-turn')) {
    classes.push('player-turn')
  }
  else if (line.event === 'play-card') {
    classes.push('player-action')
    classes.push('play-a-card')
  }
  else if (line.event === 'recruit') {
    classes.push('player-action')
    classes.push('recruit-action')
  }
  else if (line.event === 'use-power') {
    classes.push('player-action')
    classes.push('power-action')
  }
  else if (line.event === 'pass') {
    classes.push('player-action')
    classes.push('pass-action')
  }
  else if (line.indent === 0) {
    classes.push('phase-header')
  }

  return classes
}

function lineStyles(line) {
  if (line.classes && line.classes.includes('player-turn')) {
    const playerName = line.args.player.value
    const player = game.value.players.byName(playerName)
    return {
      'background-color': player.color,
    }
  }
}

function playerStyles(player) {
  const output = {}
  output['background-color'] = player.color
  return output
}

useGameLogProvider({
  cardClick,
  cardStyles,
  chatColors,
  lineClasses,
  lineStyles,
  playerStyles,
})
</script>

<style scoped>
/* Turn headers — most prominent, full-width banners */
#gamelog :deep(.player-turn) {
  display: flex;
  width: 100%;
  font-size: 1.15em;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 4px;
  margin-top: 14px;
}

/* Section headers — banners */
#gamelog :deep(.phase-header) {
  display: flex;
  width: 100%;
  font-weight: 600;
  font-size: 0.9em;
  color: #eee;
  background-color: #4a2060;
  padding: 4px 12px;
  border-radius: 4px;
  margin-top: 10px;
}

/* Player actions */
#gamelog :deep(.player-action) {
  padding: 3px 10px;
  border-radius: 3px;
}

#gamelog :deep(.player-action.recruit-action) {
  background-color: #e8b687;
}

#gamelog :deep(.player-action.play-a-card) {
  background-color: #e8d987;
}

#gamelog :deep(.player-action.power-action) {
  background-color: #e8c887;
}

#gamelog :deep(.player-action.pass-action) {
  background-color: #c96d2c;
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

/* Inline entities */
#gamelog :deep(.card-name) {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
}

#gamelog :deep(.loc-name) {
  display: inline-block;
  background-color: var(--tyr-location-background);
  border-radius: .1em;
  padding: 0 .4em;
}

#gamelog :deep(.player-name) {
  display: inline-block;
  padding: 0 .4em;
  border-radius: .1em;
}
</style>
