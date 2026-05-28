<template>
  <div class="round-banner">
    <span class="round-text">Round {{ game.state.round }}/{{ totalRounds }}</span>
    <span class="phase-text">{{ phaseLabel }}</span>
  </div>
  <div class="conflict">
    <div class="section-header">
      Conflict
    </div>

    <div v-if="conflictCard" class="conflict-card">
      <div class="conflict-main">
        <span class="conflict-name">{{ conflictCard.name }}</span>
        <span class="battle-icon" v-if="conflictCard.battleIcon" :title="conflictCard.battleIcon">
          {{ battleIconLabel(conflictCard.battleIcon) }}
        </span>
        <span class="conflict-tier">Tier {{ conflictCard.tier }}</span>
      </div>
      <div class="rewards" v-if="conflictCard.rewards">
        <div class="reward-block">
          <div class="reward-label">1st:</div>
          <ul class="reward-items">
            <li v-for="(item, i) in splitRewards(conflictCard.rewards.first)" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="reward-block">
          <div class="reward-label">2nd:</div>
          <ul class="reward-items">
            <li v-for="(item, i) in splitRewards(conflictCard.rewards.second)" :key="i">{{ item }}</li>
          </ul>
        </div>
        <div class="reward-block" v-if="conflictCard.rewards.third" :class="{ 'reward-unavailable': !thirdPlaceAvailable }">
          <div class="reward-label">3rd:</div>
          <ul class="reward-items">
            <li v-for="(item, i) in splitRewards(conflictCard.rewards.third)" :key="i">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="no-conflict">No active conflict</div>

    <button type="button"
            class="shield-wall-banner"
            :class="{ 'sw-intact': game.state.shieldWall, 'sw-destroyed': !game.state.shieldWall, 'sw-protecting': protectingThisConflict }"
            @click="openShieldWall"
            :title="game.state.shieldWall ? 'Shield Wall is intact — click for details' : 'Shield Wall is destroyed — click for details'">
      <span class="sw-row">
        <span class="sw-icon">{{ game.state.shieldWall ? '\u{1F6E1}' : '\u{1F4A5}' }}</span>
        <span class="sw-label">Shield Wall: {{ game.state.shieldWall ? 'Intact' : 'Destroyed' }}</span>
      </span>
      <span class="sw-protect-note" v-if="protectingThisConflict">
        Protecting this conflict — sandworms cannot deploy
      </span>
    </button>

    <div class="stats-grid" :style="gridStyle">
      <div class="stat-label corner" />
      <div v-for="entry in combatants"
           :key="`hdr-${entry.name}`"
           class="player-header"
           :class="{ 'is-current': entry.isCurrent }"
           :style="{ borderTopColor: entry.color }">
        <span class="player-name" :title="entry.name">{{ entry.name }}</span>
      </div>

      <div class="stat-label" title="Available / total agents">Agt</div>
      <div v-for="entry in combatants"
           :key="`agt-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: entry.agentsAvailable === 0 }">
        {{ entry.agentsAvailable }}/{{ entry.agentsTotal }}
      </div>

      <div class="stat-label" title="Intrigue cards in hand">Int</div>
      <div v-for="entry in combatants"
           :key="`int-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.intrigueCount }">
        {{ entry.intrigueCount }}
      </div>

      <div class="stat-label" title="Maker Hook">Hook</div>
      <div v-for="entry in combatants"
           :key="`hook-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.hasMakerHook }"
           :title="entry.hasMakerHook ? 'Has Maker Hook' : 'No Maker Hook'">
        <span v-if="entry.hasMakerHook" class="maker-hook">⚓</span>
        <span v-else class="no-units">—</span>
      </div>

      <div class="stat-label" title="Troops in supply">Sup</div>
      <div v-for="entry in combatants"
           :key="`sup-${entry.name}`"
           class="stat-cell unit-cell"
           :class="{ 'is-current': entry.isCurrent }">
        <span class="unit-block" :class="{ dim: !entry.troopsInSupply }">
          <span class="unit-count">{{ entry.troopsInSupply }}</span><span class="unit-letter">T</span>
        </span>
      </div>

      <div class="stat-label" title="Troops in garrison">Gar</div>
      <div v-for="entry in combatants"
           :key="`gar-${entry.name}`"
           class="stat-cell unit-cell"
           :class="{ 'is-current': entry.isCurrent }">
        <span class="unit-block" :class="{ dim: !entry.garrisonTroops }">
          <span class="unit-count">{{ entry.garrisonTroops }}</span><span class="unit-letter">T</span>
        </span>
      </div>

      <div class="stat-label" title="Units in conflict">Con</div>
      <div v-for="entry in combatants"
           :key="`con-${entry.name}`"
           class="stat-cell unit-cell"
           :class="{ 'is-current': entry.isCurrent }">
        <template v-if="entry.troops || entry.sandworms">
          <span class="unit-block" v-if="entry.troops" title="troops in conflict">
            <span class="unit-count">{{ entry.troops }}</span><span class="unit-letter">T</span>
          </span>
          <span class="unit-block worm" v-if="entry.sandworms" title="sandworms in conflict">
            <span class="unit-count">{{ entry.sandworms }}</span><span class="unit-letter">W</span>
          </span>
        </template>
        <span v-else class="no-units">—</span>
      </div>

      <div class="stat-label" title="Combat strength">Str</div>
      <div v-for="entry in combatants"
           :key="`str-${entry.name}`"
           class="stat-cell stat-strength"
           :class="{
             'is-current': entry.isCurrent,
             'strength-pending': entry.pending,
             'strength-zero': !entry.hasUnits,
           }"
           :title="strengthTooltip(entry)">
        {{ entry.hasUnits ? entry.strength + (entry.pending ? '*' : '') : '0' }}
      </div>
    </div>

  </div>
</template>


<script>
import { dune } from 'battlestar-common'

const TROOP_STRENGTH = 2
const SANDWORM_STRENGTH = 3
const TOTAL_ROUNDS =
  dune.res.constants.CONFLICT_I_COUNT
  + dune.res.constants.CONFLICT_II_COUNT
  + dune.res.constants.CONFLICT_III_COUNT

export default {
  name: 'DuneConflict',

  inject: ['game'],

  computed: {
    totalRounds() {
      return TOTAL_ROUNDS
    },

    phaseLabel() {
      const labels = {
        'round-start': 'Round Start',
        'player-turns': 'Player Turns',
        combat: 'Combat',
        makers: 'Makers',
        recall: 'Recall',
      }
      return labels[this.game.state.phase] || this.game.state.phase || ''
    },

    gridStyle() {
      return {
        gridTemplateColumns: `auto repeat(${this.combatants.length}, minmax(0, 1fr))`,
      }
    },

    conflictCard() {
      const cards = this.game.zones.byId('common.conflictActive').cardlist()
      if (cards.length > 0) {
        return cards[0].data || cards[0]
      }
      return this.game.state.conflict.currentCard
    },

    thirdPlaceAvailable() {
      return this.game.players.all().length >= 4
    },

    protectingThisConflict() {
      return !!(this.game.state.shieldWall && this.conflictCard?.behindShieldWall)
    },

    combatants() {
      const troops = this.game.state.conflict.deployedTroops || {}
      const sandworms = this.game.state.conflict.deployedSandworms || {}
      const breakdown = this.game.state.conflict.strengthBreakdown || {}
      const makerHooks = this.game.state.makerHooks || {}

      const allPlayers = this.game.players.all()
      const firstIdx = this.game.state.firstPlayerIndex || 0
      const firstPlayer = allPlayers[firstIdx] || allPlayers[0]
      const ordered = allPlayers.length
        ? this.game.players.startingWith(firstPlayer)
        : []

      // "Current turn" is meaningful only during player-turns. The engine
      // writes currentTurnPlayer at the top of each inner-loop iteration.
      const activeName = this.game.state.phase === 'player-turns'
        ? this.game.state.currentTurnPlayer
        : null

      return ordered.map(player => {
        const t = troops[player.name] || 0
        const s = sandworms[player.name] || 0
        const preview = t * TROOP_STRENGTH + s * SANDWORM_STRENGTH
        const pending = player.strength === 0 && preview > 0
        const agentsTotal = player.getCounter('agents') + player.getCounter('hasSwordmaster')
        const intrigueCount = this.game.zones.byId(`${player.name}.intrigue`).cardlist().length
        return {
          name: player.name,
          color: player.color,
          isFirstPlayer: player.name === firstPlayer?.name,
          isCurrent: player.name === activeName,
          agentsAvailable: player.availableAgents,
          agentsTotal,
          intrigueCount,
          garrisonTroops: player.troopsInGarrison,
          troopsInSupply: player.troopsInSupply,
          hasMakerHook: (makerHooks[player.name] || 0) > 0,
          troops: t,
          sandworms: s,
          hasUnits: t + s > 0,
          strength: pending ? preview : player.strength,
          pending,
          breakdown: breakdown[player.name] || [],
        }
      })
    },

  },

  methods: {
    splitRewards(text) {
      if (!text) {
        return []
      }
      return text.split(/\s+and\s+/i).map(s => s.trim()).filter(Boolean)
    },

    battleIconLabel(icon) {
      const labels = {
        'desert-mouse': '🐭',
        crysknife: '🗡',
        ornithopter: '🦅',
        wild: '★',
      }
      return labels[icon] || icon
    },

    strengthTooltip(entry) {
      const lead = entry.pending
        ? 'Provisional strength (player has not revealed yet)'
        : 'Combat strength'
      if (!entry.breakdown || entry.breakdown.length === 0) {
        return lead
      }
      const lines = entry.breakdown.map(b => `  ${b.label}: +${b.amount}`)
      return `${lead}\n${lines.join('\n')}`
    },

    openShieldWall() {
      this.$modal('dune-shield-wall-modal').show()
    },
  },
}
</script>


<style scoped>
.round-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .35em .6em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  margin-bottom: .5em;
  background-color: white;
  font-size: .9em;
}

.round-text {
  font-weight: 600;
  color: #8b6914;
}

.phase-text {
  font-weight: 500;
  color: #4a3a20;
}

.conflict {
  padding: .5em;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  margin-bottom: .5em;
  background-color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: .9em;
  color: #8b6914;
  margin-bottom: .3em;
}

.conflict-card {
  background-color: #f5f0e8;
  padding: .4em .5em;
  border-radius: .2em;
  border: 1px solid #d4c8a8;
}

.conflict-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conflict-name {
  font-weight: bold;
  color: #2c2416;
}

.battle-icon {
  font-size: 1.1em;
}

.conflict-tier {
  font-size: .85em;
  color: #8a7a68;
}

.rewards {
  margin-top: .3em;
  padding-top: .3em;
  border-top: 1px solid #e0d8c8;
}

.reward-block {
  font-size: .85em;
  color: #4a3a20;
  padding: .15em 0;
}

.reward-label {
  font-weight: 600;
  color: #8b6914;
}

.reward-items {
  margin: 0;
  padding-left: 1.2em;
  list-style-type: disc;
}

.reward-items li {
  padding: .05em 0;
}

.reward-unavailable {
  opacity: .4;
  text-decoration: line-through;
}

.no-conflict {
  color: #8a7a68;
  font-style: italic;
}

.shield-wall-banner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .15em;
  margin-top: .4em;
  width: 100%;
  font-size: .8em;
  font-weight: 600;
  padding: .25em .5em;
  border-radius: .2em;
  border: 1px solid;
  cursor: pointer;
  line-height: 1.2;
  text-align: left;
}

.sw-row {
  display: inline-flex;
  align-items: center;
  gap: .3em;
}

.sw-protect-note {
  font-size: .9em;
  font-weight: 500;
  font-style: italic;
}

.shield-wall-banner.sw-protecting {
  border-color: #8b6914;
  background-color: #f8eecc;
  color: #5a4408;
}

.shield-wall-banner.sw-protecting:hover {
  background-color: #f3e6b8;
}

.shield-wall-banner.sw-intact {
  color: #3a6b1f;
  border-color: #b8d09a;
  background-color: #eef5e4;
}

.shield-wall-banner.sw-intact:hover {
  background-color: #e2eed3;
}

.shield-wall-banner.sw-destroyed {
  color: #8b2a2a;
  border-color: #d4a0a0;
  background-color: #f8e0e0;
}

.shield-wall-banner.sw-destroyed:hover {
  background-color: #f0d0d0;
}

.sw-icon {
  font-size: .95em;
}

.stats-grid {
  display: grid;
  margin-top: .5em;
  row-gap: 1px;
  column-gap: 1px;
  background-color: #e0d8c8;
  border: 1px solid #d4c8a8;
  border-radius: .2em;
  overflow: hidden;
}

.stat-label {
  background-color: #f5f0e8;
  font-size: .7em;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: #8a7a68;
  padding: .25em .4em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.stat-label.corner {
  background-color: #f5f0e8;
}

.player-header {
  background-color: #faf8f4;
  border-top: 3px solid #d4c8a8;
  padding: .25em .35em .3em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: .85em;
  color: #2c2416;
  min-width: 0;
}

.player-header.is-current {
  background-color: #f5edd6;
}

.player-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.first-player {
  background-color: #8b6914;
  color: white;
  padding: 0 .3em;
  border-radius: .2em;
  font-size: .7em;
  font-weight: 600;
}

.stat-cell {
  background-color: #faf8f4;
  padding: .2em .35em;
  font-size: .85em;
  color: #4a3a20;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  min-width: 0;
}

.stat-cell.is-current {
  background-color: #f5edd6;
}

.stat-cell.dim {
  color: #b0a088;
}

.unit-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .2em;
}

.unit-block {
  display: inline-flex;
  align-items: baseline;
  gap: .05em;
  padding: 0 .25em;
  border-radius: .15em;
  background-color: #ece4d0;
  font-variant-numeric: tabular-nums;
}

.unit-block.worm {
  background-color: #e0d4b8;
}

.unit-block.dim {
  background-color: transparent;
  color: #b0a088;
}

.unit-letter {
  font-size: .75em;
  color: #6a5a48;
  margin-left: .05em;
  text-transform: uppercase;
}

.maker-hook {
  font-size: .95em;
  color: #6a5010;
}

.no-units {
  color: #b0a088;
}

.stat-strength {
  font-weight: bold;
  color: #c04040;
  font-size: 1.05em;
}

.stat-strength.strength-pending {
  color: #8a7a68;
  font-style: italic;
}

.stat-strength.strength-zero {
  color: #b0a088;
  font-weight: 600;
}

</style>
