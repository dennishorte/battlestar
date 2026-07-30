<template>
  <div class="dune-log-shell">
    <SummaryToggle v-model="viewMode" @update:modelValue="setMode" />
    <GameLog id="gamelog" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import SummaryToggle from '@/modules/games/common/components/log/SummaryToggle.vue'
import CardName from '@/modules/games/common/components/log/CardName.vue'
import LocName from '@/modules/games/common/components/log/LocName.vue'
import PlayerName from '@/modules/games/common/components/log/PlayerName.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'
import { defaultMatchers } from '@/modules/games/common/composables/useLogTokenizer'
import { useSummaryLog } from '@/modules/games/common/composables/useSummaryLog'
import modalUtil from '@/util/modal.js'
import { dune } from 'battlestar-common'
import { cardType } from '../cardUtil.js'
import DuneLogChip from './DuneLogChip.vue'
import DuneFactionIcon from './DuneFactionIcon.vue'
import DuneResourceIcon from './DuneResourceIcon.vue'

const RESOURCE_ICONS = new Set(['spice', 'solari', 'water'])

const game = inject('game')
const ui = inject('ui')

const { viewMode, setMode, filterEntries } = useSummaryLog({
  storageKey: 'dune.logViewMode',
  keepPhases: ['End Game'],
  passthroughPhases: ['Combat'],
})

// Scan decks in priority order so common decks win name collisions
// (e.g. imperium "Desert Power" over conflict "Desert Power").
const cardsByName = {}
for (const deck of [
  dune.res.cards.imperiumCards,
  dune.res.cards.reserveCards,
  dune.res.cards.starterCards,
  dune.res.cards.contractCards,
  dune.res.cards.techCards,
  dune.res.cards.intrigueCards,
  dune.res.cards.conflictCards,
]) {
  for (const card of deck) {
    if (!(card.name in cardsByName)) {
      cardsByName[card.name] = card
    }
  }
}

const boardSpacesByName = Object.fromEntries(
  dune.res.boardSpaces.map(space => [space.name, space])
)

const resourceLabels = {
  troop: 'Troop',
  troops: 'Troops',
  persuasion: 'Persuasion',
  swords: 'Swords',
  vp: 'VP',
}

function cardClick(card, name) {
  const def = card?.definition || card?.data || cardsByName[name] || null
  if (def) {
    ui.modals.cardViewer = def
    modalUtil.getModal('dune-card-viewer-modal')?.show()
  }
}

function cardClasses(card, name) {
  const def = card?.definition || card?.data || cardsByName[name] || null
  if (!def) {
    return []
  }
  const type = cardType(def)
  return type ? [`card-type-${type}`] : []
}

function convertArg(arg, value) {
  if (arg === 'contract') {
    const cardRef = value.cardId ?? value.value
    return `card(${cardRef})`
  }
  if (arg === 'space' || arg === 'boardSpace') {
    return `loc(${value.value})`
  }
  if (arg === 'faction' || arg.startsWith('faction')) {
    return `dunefaction(${value.value})`
  }
  if (arg === 'leader' || arg.startsWith('leader')) {
    return `dunechip(leader-name|${value.value})`
  }
  if (arg === 'resource' || arg.startsWith('resource')) {
    const id = value.value
    if (RESOURCE_ICONS.has(id)) {
      return `duneresource(${id})`
    }
    const label = resourceLabels[id] || id
    return `dunechip(resource-name resource-${id}|${label})`
  }
}

function locClasses(_loc, name) {
  const space = boardSpacesByName[name]
  if (space?.icon) {
    return ['board-space-name', `chip-space-${space.icon}`]
  }
  return ['board-space-name']
}

function chatColors() {
  const output = {}
  if (!game.value?.players) {
    return output
  }
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
        return { 'border-left-color': player.color }
      }
    }
  }
}

function playerStyles(player) {
  return { 'border-left': `3px solid ${player.color}`, 'font-weight': 'bold' }
}

useGameLogProvider({
  cardClick,
  cardClasses,
  chatColors,
  convertArg,
  filterEntries,
  lineClasses,
  lineStyles,
  locClasses,
  playerStyles,
  tokenMatchers: [
    ...defaultMatchers,
    {
      pattern: /dunechip\(([^|]+)\|([^()]+)\)/,
      type: 'dunechip',
      props: m => ({ chipClass: m[1], label: m[2] }),
    },
    {
      pattern: /duneresource\(([^()]+)\)/,
      type: 'duneresource',
      props: m => ({ type: m[1] }),
    },
    {
      pattern: /dunefaction\(([^()]+)\)/,
      type: 'dunefaction',
      props: m => ({ faction: m[1] }),
    },
  ],
  tokenComponents: {
    card: CardName,
    player: PlayerName,
    loc: LocName,
    dunechip: DuneLogChip,
    duneresource: DuneResourceIcon,
    dunefaction: DuneFactionIcon,
  },
})
</script>

<style scoped>
.dune-log-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  --summary-toggle-bg: #f5f0e8;
  --summary-toggle-border-bottom: 1px solid #d4c8a8;
  --summary-toggle-btn-border: #c4b890;
  --summary-toggle-btn-bg: #fbf8f0;
  --summary-toggle-btn-color: #4a3a20;
  --summary-toggle-btn-hover-bg: #f0e8d0;
  --summary-toggle-btn-active-bg: #8b6914;
  --summary-toggle-btn-active-color: white;
  --summary-toggle-btn-active-border: #8b6914;
}

.dune-log-shell #gamelog {
  flex: 1;
  min-height: 0;
}

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
  font-size: 1em;
  font-weight: 600;
  padding: 4px 10px;
  border-left: 4px solid transparent;
  border-radius: 2px;
  margin-top: 6px;
  color: #2c2416;
  background-color: #f0e8d4;
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

/* Card names — inline chip style, colored by deck type */
#gamelog :deep(.card-name) {
  display: inline-block;
  color: #2c2416;
  font-weight: 600;
  cursor: pointer;
  background-color: #f5f0e8;
  border: 1px solid #d4c8a8;
  border-radius: .2em;
  padding: 0 .35em;
  font-size: .95em;
}

#gamelog :deep(.card-name:hover) {
  filter: brightness(0.96);
}

#gamelog :deep(.card-name.card-type-imperium) {
  border-color: #d4c8a8;
  background-color: #f5f0e8;
}

#gamelog :deep(.card-name.card-type-intrigue) {
  border-color: #8b6914;
  background-color: #fdf8ee;
  color: #6a5010;
}

#gamelog :deep(.card-name.card-type-contract) {
  border-color: #c07020;
  background-color: #fef5ee;
}

#gamelog :deep(.card-name.card-type-tech) {
  border-color: #3a7d7d;
  background-color: #eef7f7;
  color: #2a5a5a;
}

#gamelog :deep(.card-name.card-type-conflict) {
  border-color: #c08888;
  background-color: #f5eef0;
  color: #6a2030;
}

/* Resource names (non-icon resources: troops, persuasion, etc.) */
#gamelog :deep(.resource-name) {
  display: inline-block;
  font-weight: 600;
  padding: 0 .3em;
  border-radius: .15em;
  background-color: #f5f0e8;
  border: 1px solid #d4c8a8;
}

#gamelog :deep(.resource-icon),
#gamelog :deep(.faction-icon) {
  margin: 0 .1em;
  vertical-align: -.15em;
}

/* Board space names — bordered by space icon / faction */
#gamelog :deep(.board-space-name) {
  display: inline-block;
  background-color: #f5f0e8;
  border: 1px solid #a89878;
  border-radius: .15em;
  padding: 0 .3em;
  font-weight: 600;
}

#gamelog :deep(.chip-space-purple) {
  border-color: #6a3d8a;
  background-color: #f3eef8;
  color: #4a2868;
}

#gamelog :deep(.chip-space-yellow) {
  border-color: #b8860b;
  background-color: #fdf8ee;
  color: #6a5010;
}

#gamelog :deep(.chip-space-green) {
  border-color: #3a7d3a;
  background-color: #eef5ee;
  color: #2a5a2a;
}

#gamelog :deep(.chip-space-emperor) {
  border-color: #8b2020;
  background-color: #f8ecec;
  color: #6a1818;
}

#gamelog :deep(.chip-space-guild) {
  border-color: #c07020;
  background-color: #fef5ee;
  color: #8a5010;
}

#gamelog :deep(.chip-space-bene-gesserit) {
  border-color: #5b3a8a;
  background-color: #f3eef8;
  color: #4a2868;
}

#gamelog :deep(.chip-space-fremen) {
  border-color: #2a6090;
  background-color: #eef4f8;
  color: #1a4060;
}

/* Leader names */
#gamelog :deep(.leader-name) {
  display: inline-block;
  color: #6a3d8a;
  font-weight: 600;
  background-color: #f3eef8;
  border: 1px solid #6a3d8a;
  border-radius: .15em;
  padding: 0 .3em;
}

/* Player names */
#gamelog :deep(.player-name) {
  display: inline-block;
  padding: 0 .4em 0 .35em;
  border-radius: .15em;
  background-color: #ebe4d8;
}
</style>
