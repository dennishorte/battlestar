<template>
  <div class="combat-display" v-if="shouldShow">
    <div class="combat-header">
      <span class="combat-badge" :class="currentCombatType">
        {{ currentCombatType === 'space' ? 'Space Combat' : 'Ground Combat' }}
      </span>
      <span class="combat-location">{{ locationLabel }}</span>
      <button class="dismiss-btn" @click="dismissed = true">&times;</button>
    </div>

    <div class="combat-body">
      <div v-for="(group, gi) in combatGroups" :key="gi" class="combat-group">
        <div v-if="combatGroups.length > 1" class="group-header">
          {{ group.label }}
        </div>

        <!-- AFB -->
        <div v-for="(afb, ai) in group.afbEvents" :key="'afb-' + ai" class="afb-summary">
          <span class="event-label">AFB:</span>
          <span class="player-name" :style="playerStyle(afb.shooter)">{{ afb.shooter }}</span>
          scores {{ afb.hits }} hit{{ afb.hits !== 1 ? 's' : '' }}
          <span v-if="afb.fightersDestroyed > 0" class="destroy-note">
            ({{ afb.fightersDestroyed }} fighter{{ afb.fightersDestroyed !== 1 ? 's' : '' }} destroyed)
          </span>
        </div>

        <!-- Bombardment -->
        <div v-for="(bomb, bi) in group.bombardmentEvents" :key="'bomb-' + bi" class="bombardment-summary">
          <span class="event-label">Bombardment:</span>
          <span class="player-name" :style="playerStyle(bomb.attacker)">{{ bomb.attacker }}</span>
          scores {{ bomb.hits }} hit{{ bomb.hits !== 1 ? 's' : '' }}
        </div>

        <!-- Rounds -->
        <div v-for="round in group.rounds" :key="'r-' + round.round" class="combat-round">
          <div class="round-label">Round {{ round.round }}</div>

          <div v-for="side in ['attacker', 'defender']" :key="side" class="side-row">
            <div class="side-header">
              <span class="player-name" :style="playerStyle(round.sides[side].name)">
                {{ round.sides[side].name }}
              </span>
              <span class="hits-badge" :class="{ 'has-hits': round.sides[side].totalHits > 0 }">
                {{ round.sides[side].totalHits }} hit{{ round.sides[side].totalHits !== 1 ? 's' : '' }}
              </span>
            </div>

            <div class="unit-rolls">
              <div v-for="(roll, ri) in round.sides[side].rolls" :key="ri" class="unit-roll">
                <i :class="unitIcon(roll.unitType)" class="unit-icon"/>
                <span class="combat-value">({{ roll.effectiveCombat }}+)</span>
                <span
                  v-for="(die, di) in roll.dice"
                  :key="di"
                  class="die"
                  :class="{ hit: die.hit, miss: !die.hit }"
                >{{ die.roll }}</span>
              </div>
            </div>
          </div>

          <!-- Hit assignments for this round -->
          <div v-if="round.assignments.length > 0" class="assignments">
            <span
              v-for="(a, ai) in round.assignments"
              :key="ai"
              class="assignment-chip"
              :class="a.result"
            >
              <i :class="unitIcon(a.unitType)" class="chip-icon"/>
              {{ a.result === 'sustained' ? 'sustain' : 'destroyed' }}
            </span>
          </div>
        </div>

        <!-- Outcome -->
        <div v-if="group.outcome" class="combat-outcome" :class="group.outcome.type">
          <template v-if="group.outcome.type === 'winner'">
            <span class="player-name" :style="playerStyle(group.outcome.winner)">
              {{ group.outcome.winner }}
            </span>
            wins!
          </template>
          <template v-else-if="group.outcome.type === 'retreat'">
            <span class="player-name" :style="playerStyle(group.outcome.retreated)">
              {{ group.outcome.retreated }}
            </span>
            retreats
          </template>
          <template v-else>
            Mutual destruction
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
const UNIT_ICONS = {
  'war-sun':     'bi-sun-fill',
  'flagship':    'bi-flag-fill',
  'dreadnought': 'bi-diamond-fill',
  'carrier':     'bi-box-fill',
  'cruiser':     'bi-triangle-fill',
  'destroyer':   'bi-lightning-fill',
  'fighter':     'bi-circle-fill',
  'infantry':    'bi-person-fill',
  'mech':        'bi-gear-fill',
  'pds':         'bi-crosshair',
}

export default {
  name: 'CombatDisplay',

  inject: ['game'],

  data() {
    return {
      dismissed: false,
      lastLogLength: 0,
    }
  },

  computed: {
    combatLog() {
      return this.game.state._combatLog || []
    },

    hasCombatEvents() {
      return this.combatLog.some(e =>
        e.type === 'combat-round' || e.type === 'afb' || e.type === 'bombardment'
      )
    },

    shouldShow() {
      return this.hasCombatEvents && !this.dismissed
    },

    combatGroups() {
      const groups = []
      let current = null

      for (const event of this.combatLog) {
        if (event.type === 'space-combat-start' || event.type === 'ground-combat-start') {
          current = {
            type: event.type === 'space-combat-start' ? 'space' : 'ground',
            systemId: event.systemId,
            planetId: event.planetId || null,
            attacker: event.attacker,
            defender: event.defender,
            label: event.type === 'space-combat-start'
              ? `Space Combat`
              : `Ground: ${event.planetId}`,
            afbEvents: [],
            bombardmentEvents: [],
            rounds: [],
            outcome: null,
          }
          groups.push(current)
        }
        else if (event.type === 'afb' && current) {
          current.afbEvents.push(event)
        }
        else if (event.type === 'bombardment') {
          // Bombardment may come before ground-combat-start; attach to latest group or create stub
          if (current) {
            current.bombardmentEvents.push(event)
          }
        }
        else if (event.type === 'combat-round') {
          if (!current) {
            // Fallback: create implicit group
            current = {
              type: event.combatType,
              systemId: event.systemId,
              planetId: event.planetId || null,
              label: event.combatType === 'space' ? 'Space Combat' : `Ground: ${event.planetId}`,
              afbEvents: [],
              bombardmentEvents: [],
              rounds: [],
              outcome: null,
            }
            groups.push(current)
          }
          current.rounds.push({
            round: event.round,
            sides: event.sides,
            assignments: [],
          })
        }
        else if (event.type === 'hits-assigned' && current) {
          // Attach assignments to the most recent round in this group
          const lastRound = current.rounds[current.rounds.length - 1]
          if (lastRound) {
            lastRound.assignments.push(...event.assignments)
          }
        }
        else if (event.type === 'combat-end' && current) {
          if (event.retreated) {
            current.outcome = { type: 'retreat', retreated: event.retreated }
          }
          else if (event.winner) {
            current.outcome = { type: 'winner', winner: event.winner }
          }
          else {
            current.outcome = { type: 'draw' }
          }
          current = null  // reset for next combat
        }
      }

      return groups
    },

    currentCombatType() {
      const groups = this.combatGroups
      if (groups.length === 0) {
        return 'space'
      }
      return groups[groups.length - 1].type
    },

    locationLabel() {
      const groups = this.combatGroups
      if (groups.length === 0) {
        return ''
      }
      const last = groups[groups.length - 1]
      return last.systemId ? `System ${last.systemId}` : ''
    },
  },

  watch: {
    combatLog: {
      deep: true,
      handler(log) {
        if (log.length !== this.lastLogLength) {
          this.lastLogLength = log.length
          // Auto-show when new events arrive
          if (log.length > 0) {
            this.dismissed = false
          }
        }
      },
    },
  },

  methods: {
    unitIcon(unitType) {
      return UNIT_ICONS[unitType] || 'bi-circle'
    },

    playerStyle(playerName) {
      const player = this.game.players.byName(playerName)
      if (player?.color) {
        return { color: player.color, fontWeight: 600 }
      }
      return { fontWeight: 600 }
    },
  },
}
</script>


<style scoped>
.combat-display {
  background: #fff;
  border: 1px solid #dee2e6;
  border-left: 3px solid #dc3545;
  margin: 0;
  padding: .4em .5em;
  max-height: 300px;
  overflow-y: auto;
  font-size: .78rem;
}

.combat-header {
  display: flex;
  align-items: center;
  gap: .4em;
  margin-bottom: .3em;
}

.combat-badge {
  font-size: .7rem;
  font-weight: 600;
  padding: .1em .4em;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: .03em;
}
.combat-badge.space {
  background: #1a1a2e;
  color: #e0e0e0;
}
.combat-badge.ground {
  background: #5a3e1b;
  color: #f0dcc0;
}

.combat-location {
  color: #666;
  font-size: .72rem;
}

.dismiss-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1rem;
  line-height: 1;
  color: #999;
  cursor: pointer;
  padding: 0 .2em;
}
.dismiss-btn:hover {
  color: #333;
}

.combat-body {
  display: flex;
  flex-direction: column;
  gap: .4em;
}

.group-header {
  font-weight: 600;
  font-size: .72rem;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: .15em;
  margin-top: .2em;
}

.afb-summary, .bombardment-summary {
  font-size: .72rem;
  color: #555;
  padding: .1em 0;
}

.event-label {
  font-weight: 600;
  color: #888;
}

.destroy-note {
  color: #dc3545;
}

.combat-round {
  padding: .2em 0;
  border-top: 1px solid #f0f0f0;
}

.round-label {
  font-weight: 600;
  font-size: .7rem;
  color: #888;
  margin-bottom: .15em;
}

.side-row {
  margin-bottom: .15em;
}

.side-header {
  display: flex;
  align-items: center;
  gap: .3em;
  margin-bottom: .1em;
}

.player-name {
  font-weight: 600;
}

.hits-badge {
  font-size: .68rem;
  color: #999;
  padding: .05em .3em;
  border-radius: 2px;
  background: #f5f5f5;
}
.hits-badge.has-hits {
  background: #198754;
  color: #fff;
}

.unit-rolls {
  display: flex;
  flex-wrap: wrap;
  gap: .2em;
  padding-left: .3em;
}

.unit-roll {
  display: inline-flex;
  align-items: center;
  gap: .15em;
}

.unit-icon {
  font-size: .7rem;
  color: #555;
}

.combat-value {
  font-size: .65rem;
  color: #888;
}

.die {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4em;
  height: 1.4em;
  border-radius: 3px;
  font-size: .72rem;
  font-weight: 700;
  line-height: 1;
}
.die.hit {
  background: #198754;
  color: #fff;
}
.die.miss {
  background: #e9ecef;
  color: #888;
}

.assignments {
  display: flex;
  flex-wrap: wrap;
  gap: .2em;
  margin-top: .15em;
  padding-left: .3em;
}

.assignment-chip {
  display: inline-flex;
  align-items: center;
  gap: .15em;
  font-size: .65rem;
  padding: .1em .3em;
  border-radius: 3px;
  font-weight: 600;
}
.assignment-chip.sustained {
  background: #fff3cd;
  color: #856404;
}
.assignment-chip.destroyed {
  background: #f8d7da;
  color: #842029;
}

.chip-icon {
  font-size: .6rem;
}

.combat-outcome {
  padding: .25em .4em;
  margin-top: .2em;
  border-radius: 3px;
  font-size: .72rem;
  font-weight: 600;
  text-align: center;
}
.combat-outcome.winner {
  background: #d1e7dd;
  color: #0f5132;
}
.combat-outcome.retreat {
  background: #fff3cd;
  color: #856404;
}
.combat-outcome.draw {
  background: #f8d7da;
  color: #842029;
}
</style>
