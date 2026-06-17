<template>
  <div class="player-summary">
    <div class="stats-grid" :style="gridStyle">
      <div class="stat-label corner" />
      <div v-for="entry in entries"
           :key="`hdr-${entry.name}`"
           class="player-header clickable"
           :class="{ 'is-current': entry.isCurrent }"
           :style="{ borderTopColor: entry.color }"
           :title="`View ${entry.name}'s tableau`"
           @click="openTableau(entry.player)">
        <span class="player-name">{{ entry.name }}</span>
        <span class="first-player" v-if="entry.isFirstPlayer" title="First Player">1st</span>
      </div>

      <div class="stat-label">VP</div>
      <div v-for="entry in entries"
           :key="`vp-${entry.name}`"
           class="stat-cell vp-cell clickable"
           :class="{ 'is-current': entry.isCurrent }"
           title="View VP breakdown"
           @click="openVpBreakdown(entry.player)">
        {{ entry.vp }}
      </div>

      <div class="stat-label">Leadr</div>
      <div v-for="entry in entries"
           :key="`ldr-${entry.name}`"
           class="stat-cell leader-cell"
           :class="{ 'is-current': entry.isCurrent }">
        <DuneOptionChip v-if="entry.leader"
                        :name="entry.leader.name"
                        :leader="entry.leader"
                        :feyd-position="entry.feydPosition"
                        :jessica-flipped="entry.jessicaFlipped"
                        class="leader-chip" />
        <span v-else class="dim">—</span>
      </div>

      <div class="stat-label">Icons</div>
      <div v-for="entry in entries"
           :key="`icn-${entry.name}`"
           class="stat-cell icons-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.icons.length }">
        <template v-if="entry.icons.length">
          <span v-for="(icon, idx) in entry.icons"
                :key="idx"
                class="battle-icon"
                :class="{ 'objective-icon': icon.kind === 'objective' }"
                :title="icon.title">{{ icon.label }}</span>
        </template>
        <span v-else>—</span>
      </div>

      <div class="stat-label">Sol</div>
      <div v-for="entry in entries"
           :key="`sol-${entry.name}`"
           class="stat-cell resource-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.solari }">
        <DuneResourceIcon type="solari" />
        <span>{{ entry.solari }}</span>
      </div>

      <div class="stat-label">Spice</div>
      <div v-for="entry in entries"
           :key="`spi-${entry.name}`"
           class="stat-cell resource-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.spice }">
        <DuneResourceIcon type="spice" />
        <span>{{ entry.spice }}</span>
      </div>

      <div class="stat-label">Water</div>
      <div v-for="entry in entries"
           :key="`wat-${entry.name}`"
           class="stat-cell resource-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.water }">
        <DuneResourceIcon type="water" />
        <span>{{ entry.water }}</span>
      </div>

      <div class="stat-label">Agnts</div>
      <div v-for="entry in entries"
           :key="`agt-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.agentsAvailable }">
        {{ entry.agentsAvailable }}/{{ entry.agentsTotal }}
      </div>

      <div class="stat-label">Spies</div>
      <div v-for="entry in entries"
           :key="`spy-${entry.name}`"
           class="stat-cell resource-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.spiesInSupply }">
        <DuneAgentIcon type="spy" />
        <span>{{ entry.spiesInSupply }}</span>
      </div>

      <div class="stat-label">Intg</div>
      <div v-for="entry in entries"
           :key="`int-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.intrigueCount, clickable: entry.isViewer }"
           :title="entry.isViewer ? 'View intrigue cards' : ''"
           @click="entry.isViewer && openIntrigue(entry.player)">
        {{ entry.intrigueCount }}
      </div>

      <div class="stat-label">Cntrx</div>
      <div v-for="entry in entries"
           :key="`con-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.contractsCount, clickable: true }"
           title="View contracts"
           @click="openContracts(entry.player)">
        {{ entry.contractsCount }}
      </div>

      <div class="stat-label">HC</div>
      <div v-for="entry in entries"
           :key="`hc-${entry.name}`"
           class="stat-cell"
           :class="{ 'is-current': entry.isCurrent, dim: !entry.hasHighCouncil }"
           :title="entry.hasHighCouncil ? 'Has High Council seat' : 'No High Council seat'">
        {{ entry.hasHighCouncil ? '✓' : '—' }}
      </div>
    </div>

    <div class="reveal-preview" v-if="reveal">
      <div class="reveal-header">If you reveal now</div>
      <div class="reveal-totals">
        <span class="reveal-total" :title="reveal.persuasionTitle">
          <span class="reveal-label">Persuasion</span>
          <span class="reveal-value">{{ reveal.persuasionTotal }}</span>
        </span>
        <span class="reveal-total" v-if="reveal.swords" title="Swords contributed by revealed cards">
          <span class="reveal-label">Swords</span>
          <span class="reveal-value">{{ reveal.swords }}</span>
        </span>
        <span class="reveal-total" v-if="reveal.hasUnits" :title="reveal.strengthTitle">
          <span class="reveal-label">Strength</span>
          <span class="reveal-value">{{ reveal.strength }}</span>
        </span>
      </div>
      <div class="reveal-gains" v-if="reveal.gains.length">
        <span v-for="g in reveal.gains" :key="g.key" class="reveal-gain">
          <DuneResourceIcon v-if="g.icon === 'spice' || g.icon === 'solari' || g.icon === 'water'" :type="g.icon" />
          <DuneAgentIcon v-else-if="g.icon === 'spy'" type="spy" />
          {{ g.label }}
        </span>
      </div>
      <div class="reveal-pending" v-if="reveal.pending.length">
        <div class="reveal-sublabel">Decisions / unparsed</div>
        <div v-for="(ab, idx) in reveal.pending" :key="`p-${idx}`" class="reveal-ability">
          <span class="ability-card">{{ ab.source }}</span>
          <span class="ability-text">{{ ab.text }}</span>
        </div>
      </div>
    </div>

    <div class="viewer-cards" v-if="viewer">
      <div class="cards-section" v-if="viewerHand.length">
        <div class="section-label">Hand</div>
        <DuneCard v-for="card in viewerHand" :key="card.id" :card="card" />
      </div>
      <div class="cards-section" v-if="viewerPlayed.length">
        <div class="section-label">Played</div>
        <DuneCard v-for="card in viewerPlayed" :key="card.id" :card="card" />
      </div>
      <div class="cards-section" v-if="viewerRevealed.length">
        <div class="section-label">Revealed</div>
        <DuneCard v-for="card in viewerRevealed" :key="card.id" :card="card" />
      </div>
      <div class="cards-section" v-if="viewerReserved.length">
        <div class="section-label">
          Reserved <span class="reserved-badge">Manipulate &middot; -1 Persuasion</span>
        </div>
        <DuneCard v-for="card in viewerReserved" :key="card.id" :card="card" />
      </div>
    </div>
  </div>
</template>


<script>
import { dune } from 'battlestar-common'
import DuneAgentIcon from './DuneAgentIcon.vue'
import DuneCard from './DuneCard.vue'
import DuneOptionChip from './DuneOptionChip.vue'
import DuneResourceIcon from './DuneResourceIcon.vue'

const FACTION_LABELS = {
  emperor: 'Emperor',
  guild: 'Spacing Guild',
  'bene-gesserit': 'Bene Gesserit',
  fremen: 'Fremen',
}

const BATTLE_ICON_LABELS = {
  'desert-mouse': '\u{1F42D}',
  crysknife: '\u{1F5E1}',
  ornithopter: '\u{1F985}',
  wild: '★',
}

export default {
  name: 'DunePlayerSummary',

  components: { DuneAgentIcon, DuneCard, DuneOptionChip, DuneResourceIcon },

  inject: ['actor', 'game', 'ui'],

  computed: {
    orderedPlayers() {
      const allPlayers = this.game.players.all()
      if (!allPlayers.length) {
        return []
      }
      const firstIdx = this.game.state.firstPlayerIndex || 0
      const firstPlayer = allPlayers[firstIdx] || allPlayers[0]
      return this.game.players.startingWith(firstPlayer)
    },

    activeName() {
      return this.game.state.phase === 'player-turns'
        ? this.game.state.currentTurnPlayer
        : null
    },

    firstPlayerName() {
      const allPlayers = this.game.players.all()
      const firstIdx = this.game.state.firstPlayerIndex || 0
      return allPlayers[firstIdx]?.name || null
    },

    gridStyle() {
      return {
        gridTemplateColumns: `auto repeat(${this.orderedPlayers.length}, minmax(0, 1fr))`,
      }
    },

    entries() {
      return this.orderedPlayers.map(player => {
        const flipped = new Set(this.game.state.conflict?.flippedCardIds?.[player.name] || [])
        const objective = this.game.state.objectives?.[player.name] || null
        const wonCards = this.game.state.conflict?.wonCards?.[player.name] || []
        const icons = []
        if (objective && !flipped.has(objective.id)) {
          icons.push({
            kind: 'objective',
            label: BATTLE_ICON_LABELS[objective.battleIcon] || objective.battleIcon,
            title: `Objective: ${objective.name}`,
          })
        }
        for (const c of wonCards) {
          if (!flipped.has(c.id)) {
            icons.push({
              kind: 'won',
              label: BATTLE_ICON_LABELS[c.battleIcon] || c.battleIcon,
              title: `Won Conflict: ${c.name}`,
            })
          }
        }
        return {
          name: player.name,
          player,
          color: player.color,
          isViewer: player.name === this.actor.name,
          isCurrent: player.name === this.activeName,
          isFirstPlayer: player.name === this.firstPlayerName,
          vp: player.vp,
          solari: player.solari,
          spice: player.spice,
          water: player.water,
          agentsAvailable: player.availableAgents,
          agentsTotal: player.getCounter('agents') + player.getCounter('hasSwordmaster'),
          spiesInSupply: player.spiesInSupply,
          intrigueCount: this.zoneCount(player.name, 'intrigue'),
          contractsCount: this.zoneCount(player.name, 'contracts'),
          hasHighCouncil: !!player.hasHighCouncil,
          leader: this.game.state.leaders?.[player.name] || null,
          feydPosition: this.game.state.feydTrack?.[player.name] || null,
          jessicaFlipped: this.game.state.jessicaFlipped?.[player.name] || false,
          icons,
        }
      })
    },

    viewer() {
      return this.game.players.byName(this.actor.name) || null
    },

    reveal() {
      if (!this.viewer || this.viewerHand.length === 0) {
        return null
      }
      const preview = dune.previewReveal(this.game, this.viewer)
      const { totals, resolved, pending, strength, hasUnits, deployedTroops, deployedSandworms, carriedPersuasion } = preview

      const persuasionTotal = carriedPersuasion + totals.persuasion
      const persuasionParts = []
      if (carriedPersuasion) {
        persuasionParts.push(`${carriedPersuasion} carried`)
      }
      const persuasionContribs = resolved
        .filter(r => /Persuasion/.test(r.description))
        .map(r => `${r.description.replace(/^\+/, '')} (${r.source})`)
      persuasionParts.push(...persuasionContribs)
      const persuasionTitle = persuasionParts.length
        ? `Persuasion: ${persuasionParts.join(' + ')}`
        : 'Persuasion'

      const strengthParts = []
      if (totals.swords) {
        strengthParts.push(`${totals.swords} sword${totals.swords === 1 ? '' : 's'}`)
      }
      if (deployedTroops) {
        strengthParts.push(`${deployedTroops} troop${deployedTroops === 1 ? '' : 's'} (+${deployedTroops * 2})`)
      }
      if (deployedSandworms) {
        strengthParts.push(`${deployedSandworms} sandworm${deployedSandworms === 1 ? '' : 's'} (+${deployedSandworms * 3})`)
      }
      const strengthTitle = strengthParts.length
        ? `Strength: ${strengthParts.join(' + ')}`
        : 'Strength (no units deployed in conflict)'

      const gains = []
      const addGain = (key, label, icon = null) => {
        if (totals[key]) {
          gains.push({ key, label: `+${totals[key]} ${label}`, icon })
        }
      }
      addGain('spice', 'Spice', 'spice')
      addGain('solari', 'Solari', 'solari')
      addGain('water', 'Water', 'water')
      addGain('troops', totals.troops === 1 ? 'Troop' : 'Troops')
      addGain('intrigue', 'Intrigue')
      addGain('spy', totals.spy === 1 ? 'Spy' : 'Spies', 'spy')
      addGain('draw', 'Draw')
      addGain('vp', 'VP')
      for (const fid of Object.keys(totals.influence)) {
        const amt = totals.influence[fid]
        if (amt) {
          gains.push({ key: `inf-${fid}`, label: `+${amt} ${FACTION_LABELS[fid] || fid} Influence` })
        }
      }

      return {
        persuasionTotal,
        persuasionTitle,
        swords: totals.swords,
        hasUnits,
        strength,
        strengthTitle,
        gains,
        pending,
      }
    },

    viewerHand() {
      if (!this.viewer) {
        return []
      }
      return this.game.zones.byId(`${this.viewer.name}.hand`).cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
    },

    viewerPlayed() {
      if (!this.viewer) {
        return []
      }
      return this.game.zones.byId(`${this.viewer.name}.played`).cardlist()
    },

    viewerRevealed() {
      if (!this.viewer) {
        return []
      }
      return this.game.zones.byId(`${this.viewer.name}.revealed`).cardlist()
    },

    viewerReserved() {
      if (!this.viewer) {
        return []
      }
      const reservations = this.game.state.reservedCards || []
      const myCardIds = new Set(
        reservations
          .filter(r => r.player === this.viewer.name)
          .map(r => r.cardId)
      )
      if (myCardIds.size === 0) {
        return []
      }
      return this.game.zones.byId('common.reservedCards')
        .cardlist()
        .filter(c => myCardIds.has(c.id))
    },
  },

  methods: {
    zoneCount(playerName, zoneName) {
      return this.game.zones.byId(`${playerName}.${zoneName}`).cardlist().length
    },

    openTableau(player) {
      this.ui.modals.tableau = { player }
      this.$modal('dune-tableau-modal').show()
    },

    openVpBreakdown(player) {
      this.ui.modals.vpBreakdown = { player }
      this.$modal('dune-vp-breakdown-modal').show()
    },

    openIntrigue(player) {
      const cards = this.game.zones.byId(`${player.name}.intrigue`).cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
      this.ui.modals.cardList = {
        title: `${player.name} — Intrigue`,
        cards,
      }
      this.$modal('dune-card-list-modal').show()
    },

    openContracts(player) {
      const cards = this.game.zones.byId(`${player.name}.contracts`).cardlist()
        .sort((l, r) => l.name.localeCompare(r.name))
      this.ui.modals.cardList = {
        title: `${player.name} — Contracts`,
        cards,
      }
      this.$modal('dune-card-list-modal').show()
    },
  },
}
</script>


<style scoped>
.player-summary {
  display: flex;
  flex-direction: column;
  gap: .5em;
}

.stats-grid {
  display: grid;
  row-gap: 1px;
  column-gap: 1px;
  background-color: #e0d8c8;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  overflow: hidden;
  background-color: white;
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
  padding: .3em .35em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .15em;
  font-weight: 600;
  font-size: .85em;
  color: #2c2416;
  min-width: 0;
}

.player-header.clickable {
  cursor: pointer;
}

.player-header.clickable:hover {
  background-color: #f0e8d6;
}

.player-header.is-current {
  background-color: #f5edd6;
}

.player-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-cell.is-current {
  background-color: #f5edd6;
}

.stat-cell.dim {
  color: #b0a088;
}

.stat-cell.clickable {
  cursor: pointer;
}

.stat-cell.clickable:hover {
  background-color: #f0e8d6;
}

.vp-cell {
  font-weight: bold;
  color: #8b6914;
}

.resource-cell {
  gap: .25em;
}

.resource-cell.dim :deep(.resource-icon),
.resource-cell.dim :deep(.dune-agent-icon) {
  opacity: .35;
}

.leader-cell {
  padding: .15em .15em;
  min-width: 0;
  overflow: hidden;
}

.leader-cell :deep(.dune-chip) {
  padding: .1em .3em;
  font-size: .75em;
  border-radius: .2em;
  max-width: 100%;
}

.leader-cell :deep(.chip-name) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.icons-cell {
  gap: .15em;
  flex-wrap: wrap;
}

.battle-icon {
  font-size: 1em;
  line-height: 1;
}

.battle-icon.objective-icon {
  opacity: 1;
}

.reveal-preview {
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: #fbf6ec;
  padding: .4em .55em;
  display: flex;
  flex-direction: column;
  gap: .35em;
}

.reveal-header {
  font-size: .75em;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: #8b6914;
  font-weight: 700;
}

.reveal-totals {
  display: flex;
  flex-wrap: wrap;
  gap: .4em;
}

.reveal-total {
  display: inline-flex;
  align-items: baseline;
  gap: .3em;
  padding: .15em .5em;
  border-radius: .25em;
  background-color: white;
  border: 1px solid #e8dcc0;
  font-size: .85em;
}

.reveal-label {
  color: #6a5a48;
  font-weight: 600;
}

.reveal-value {
  color: #2c2416;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: 1.1em;
}

.reveal-gains {
  display: flex;
  flex-wrap: wrap;
  gap: .3em;
}

.reveal-gain {
  display: inline-flex;
  align-items: center;
  gap: .25em;
  padding: .1em .45em;
  border-radius: .25em;
  background-color: white;
  border: 1px solid #e8dcc0;
  font-size: .82em;
  color: #2c2416;
  font-variant-numeric: tabular-nums;
}

.reveal-sublabel {
  font-size: .7em;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: #8a7a68;
  font-weight: 600;
  margin-bottom: .15em;
}

.reveal-ability {
  font-size: .85em;
  color: #4a3a20;
  padding: .1em 0;
  line-height: 1.3;
}

.ability-card {
  font-weight: 600;
  color: #2c2416;
}

.ability-card::after {
  content: ': ';
  font-weight: 400;
  color: #8a7a68;
}

.ability-text {
  white-space: pre-line;
}

.viewer-cards {
  display: flex;
  flex-direction: column;
  gap: .4em;
}

.cards-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #d4c8a8;
  border-radius: .3em;
  background-color: white;
  padding: 0 .3em .3em;
}

.section-label {
  font-size: .75em;
  text-transform: uppercase;
  color: #8a7a68;
  padding: .25em .2em .1em;
  font-weight: 600;
}

.reserved-badge {
  display: inline-block;
  margin-left: .35em;
  padding: .05em .35em;
  border-radius: .2em;
  background-color: #6a3d8a;
  color: white;
  font-size: .9em;
  font-weight: 600;
  text-transform: none;
}
</style>
