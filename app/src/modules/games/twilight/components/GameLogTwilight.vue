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
import TiPlayerToken from './log/TiPlayerToken.vue'
import TiCardToken from './log/TiCardToken.vue'
import TiTechToken from './log/TiTechToken.vue'
import TiObjectiveToken from './log/TiObjectiveToken.vue'
import TiRelicToken from './log/TiRelicToken.vue'
import TiPlanetToken from './log/TiPlanetToken.vue'
import TiTransactionLog from './log/TiTransactionLog.vue'

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
  else if (line.event === 'player-turn') {
    classes.push('player-turn')
  }
  else if (line.event === 'player-action') {
    classes.push('player-action')
  }
  else if (line.event === 'combat') {
    classes.push('combat-header')
  }
  else if (line.event === 'scoring') {
    classes.push('scoring-entry')
  }
  else if (line.event === 'agenda') {
    classes.push('agenda-entry')
  }
  else if (line.event === 'agenda-outcome') {
    classes.push('agenda-outcome')
  }
  else if (line.event === 'activate-system') {
    classes.push('activate-system')
  }
  else if (line.event === 'turn-start') {
    classes.push('turn-start')
  }
  else if (line.event === 'step') {
    classes.push('step-context')
  }
  else if (line.indent >= 2) {
    classes.push('indented-detail')
  }

  return classes
}

function lineStyles(line) {
  if (line.event === 'turn-start') {
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
  if (line.event === 'player-turn') {
    const playerName = line.args?.player?.value
    if (playerName) {
      const player = game.value.players.byName(playerName)
      if (player?.color) {
        return { 'border-left-color': player.color }
      }
    }
  }
}

function convertArg(arg, value) {
  if (arg.startsWith('player')) {
    return `player(${value.value})`
  }
  if (arg === 'card') {
    return `ticard(${value.value})`
  }
  if (arg === 'cards') {
    // Comma-separated card names (e.g. from draw events) → individual chips
    return value.value.split(', ').map(name => `ticard(${name})`).join(', ')
  }
  if (arg === 'tech') {
    return `titech(${value.value})`
  }
  if (arg === 'objective') {
    return `tiobj(${value.value})`
  }
  if (arg === 'planet') {
    return `tiplanet(${value.value})`
  }
  if (arg === 'relic') {
    return `tirelic(${value.value})`
  }
  return undefined
}

function lineComponent(line) {
  if (line.event === 'transaction-offer' || line.event === 'transaction-counter') {
    return TiTransactionLog
  }
  return null
}

useGameLogProvider({
  chatColors,
  lineClasses,
  lineStyles,
  lineComponent,
  convertArg,
  tokenMatchers: [
    ...defaultMatchers,
    { pattern: /ticard\(([^()]+)\)/, type: 'ticard', props: m => ({ name: m[1] }) },
    { pattern: /titech\(([^()]+)\)/, type: 'titech', props: m => ({ name: m[1] }) },
    { pattern: /tiobj\(([^()]+)\)/, type: 'tiobj', props: m => ({ name: m[1] }) },
    { pattern: /tirelic\(([^()]+)\)/, type: 'tirelic', props: m => ({ name: m[1] }) },
    { pattern: /tiplanet\(([^()]+)\)/, type: 'tiplanet', props: m => ({ name: m[1] }) },
  ],
  tokenComponents: {
    card: CardName,
    player: TiPlayerToken,
    loc: LocName,
    ticard: TiCardToken,
    titech: TiTechToken,
    tiobj: TiObjectiveToken,
    tirelic: TiRelicToken,
    tiplanet: TiPlanetToken,
  },
})
</script>

<style scoped>
/* ── Indentation ── */
#gamelog-twilight :deep(.indent-0),
#gamelog-twilight :deep(.indent-1) {
  margin-left: 0;
  padding-left: .5em;
}

#gamelog-twilight :deep(.indent-2) {
  margin-left: .75em;
  padding-left: .5em;
}

#gamelog-twilight :deep(.indent-3) {
  margin-left: 1.5em;
  padding-left: .5em;
}

#gamelog-twilight :deep(.indent-4) {
  margin-left: 2.25em;
  padding-left: .5em;
}

#gamelog-twilight :deep(.indent-5) {
  margin-left: 3em;
  padding-left: .5em;
}

/* ── Indented detail lines (visual grouping) ── */
#gamelog-twilight :deep(.indented-detail) {
  border-left: 2px solid #dee2e6;
  color: #495057;
  font-size: 0.92em;
}

/* ── Round header ── */
#gamelog-twilight :deep(.round-header) {
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #f0e68c;
  padding: .4em .75em;
  margin-top: 1.25em;
  border-radius: .3em;
  display: flex;
  justify-content: center;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 1.05em;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

#gamelog-twilight :deep(.round-header > div) {
  display: block;
}

/* ── Phase headers ── */
#gamelog-twilight :deep(.phase-header) {
  font-weight: 700;
  text-align: center;
  padding: .25em .5em;
  border-radius: .2em;
  margin-top: .5em;
  color: white;
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: 0.85em;
}

#gamelog-twilight :deep(.phase-header > div) {
  display: block;
}

#gamelog-twilight :deep(.phase-strategy) {
  background: linear-gradient(135deg, #0d6efd, #3d8bfd);
}

#gamelog-twilight :deep(.phase-action) {
  background: linear-gradient(135deg, #146c43, #198754);
}

#gamelog-twilight :deep(.phase-status) {
  background: linear-gradient(135deg, #996515, #b8860b);
}

#gamelog-twilight :deep(.phase-agenda) {
  background: linear-gradient(135deg, #59359a, #6f42c1);
}

/* ── Player turn (action label, e.g. "Tactical Action") ── */
#gamelog-twilight :deep(.player-turn) {
  border-left: 3px solid #6c757d;
  padding: .15em .6em;
  margin-top: .15em;
  font-weight: 600;
  font-size: 0.9em;
}

/* ── Player action (secondary: pass, pick card, etc.) ── */
#gamelog-twilight :deep(.player-action) {
  padding: .1em .5em;
  margin-top: .15em;
  font-weight: 500;
  opacity: 0.85;
}

/* ── Combat header ── */
#gamelog-twilight :deep(.combat-header) {
  background-color: #fff0f0;
  color: #842029;
  border-left: 3px solid #dc3545;
  padding: .2em .6em;
  margin-top: .3em;
  font-weight: 700;
  font-size: 0.92em;
  border-radius: 0 .2em .2em 0;
}

/* ── Scoring ── */
#gamelog-twilight :deep(.scoring-entry) {
  background-color: #d1e7dd;
  color: #0a3622;
  border-left: 3px solid #198754;
  padding: .15em .6em;
  margin-top: .15em;
  font-weight: 700;
  border-radius: 0 .2em .2em 0;
}

/* ── Agenda card ── */
#gamelog-twilight :deep(.agenda-entry) {
  background-color: #e8dff5;
  color: #3b1f6e;
  border-left: 3px solid #6f42c1;
  padding: .15em .6em;
  margin-top: .3em;
  font-weight: 600;
  border-radius: 0 .2em .2em 0;
}

/* ── Agenda outcome ── */
#gamelog-twilight :deep(.agenda-outcome) {
  background-color: #f0e8fa;
  color: #4a2683;
  border-left: 3px solid #a370d8;
  padding: .15em .6em;
  font-weight: 700;
  border-radius: 0 .2em .2em 0;
}

/* ── System activation ── */
#gamelog-twilight :deep(.activate-system) {
  border-left: 2px solid #6c757d;
  padding: .1em .5em;
  margin-top: .15em;
  color: #adb5bd;
  font-size: 0.9em;
}

/* ── Turn start (primary turn header) ── */
#gamelog-twilight :deep(.turn-start) {
  padding: .15em .6em;
  border-radius: .2em;
  margin-top: .5em;
  font-weight: 700;
  font-size: 0.95em;
}

/* ── Step context (sub-step indicator) ── */
#gamelog-twilight :deep(.step-context) {
  color: #6c757d;
  font-style: italic;
  font-size: 0.85em;
  border-left: 2px solid #495057;
  padding: .1em .5em;
  margin-top: .15em;
}

#gamelog-twilight :deep(.player-name) {
  display: inline;
}
</style>
