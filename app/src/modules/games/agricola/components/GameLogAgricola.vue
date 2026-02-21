<template>
  <GameLog id="gamelog" />
  <Teleport to="body">
    <div
      v-if="hoverCardId"
      class="gamelog-card-tooltip"
      :style="tooltipStyle"
    >
      <AgricolaCardChip :cardId="hoverCardId" :initialExpanded="true" />
    </div>
  </Teleport>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import AgricolaCardChip from './AgricolaCardChip.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

const game = inject('game')
const ui = inject('ui')

const hoverCardId = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const tooltipStyle = computed(() => {
  const style = {
    position: 'fixed',
    zIndex: 10000,
    pointerEvents: 'none',
  }

  const offset = 12

  // Horizontal: place on side with more space
  if (mouseX.value > window.innerWidth / 2) {
    style.right = `${window.innerWidth - mouseX.value + offset}px`
  }
  else {
    style.left = `${mouseX.value + offset}px`
  }

  // Vertical: place on side with more space
  if (mouseY.value > window.innerHeight / 2) {
    style.bottom = `${window.innerHeight - mouseY.value + offset}px`
  }
  else {
    style.top = `${mouseY.value + offset}px`
  }

  return style
})

function cardClick(card) {
  if (card && ui?.fn?.showCard) {
    ui.fn.showCard(card.id, card.type)
  }
}

function cardMouseover(card) {
  if (card) {
    hoverCardId.value = card.id
  }
}

function cardMouseleave() {
  hoverCardId.value = null
}

function cardMousemove(event) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
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
        }
      }
    }
  }
}

useGameLogProvider({
  cardClick,
  cardClasses,
  cardMouseover,
  cardMouseleave,
  cardMousemove,
  chatColors,
  lineClasses,
  lineStyles,
})
</script>

<style scoped>
/* Indentation: server nests 0-4 deep, flatten visually.
   Banners pin to margin 0; content indents from banners. */
#gamelog :deep(.indent-0),
#gamelog :deep(.indent-1),
#gamelog :deep(.indent-2) {
  margin-left: 0;
}

#gamelog :deep(.indent-3) {
  margin-left: 1em;
}

#gamelog :deep(.indent-4) {
  margin-left: 2em;
}

/* Round header banner */
#gamelog :deep(.round-header) {
  font-weight: bold;
  text-align: center;
  background-color: #8B4513;
  color: white;
  padding: .25em .5em;
  margin-top: 1em;
  border-radius: .25em;
  display: flex;
  justify-content: center;
}

#gamelog :deep(.round-header > div) {
  display: block;
}

/* Work phase banner */
#gamelog :deep(.work-phase) {
  font-weight: bold;
  text-align: center;
  background-color: #5d7a3a;
  color: white;
  padding: .15em .5em;
  border-radius: .15em;
}

#gamelog :deep(.work-phase > div) {
  display: block;
}

/* Player turn banner */
#gamelog :deep(.player-turn) {
  padding-top: .3em;
  padding-bottom: .3em;
  border-radius: .2em;
  margin-top: .5em;
  font-weight: 600;
}

/* Action line */
#gamelog :deep(.player-action) {
  background-color: #f5f5dc;
  border-radius: .15em;
  margin-left: 1em;
  padding: 0 .5em;
}

/* Harvest banner */
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

<style>
.gamelog-card-tooltip {
  max-width: 280px;
  background: white;
  border-radius: .3em;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
</style>
