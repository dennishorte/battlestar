<template>
  <div class="player-cards">
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
import DuneResourceIcon from './DuneResourceIcon.vue'

const FACTION_LABELS = {
  emperor: 'Emperor',
  guild: 'Spacing Guild',
  'bene-gesserit': 'Bene Gesserit',
  fremen: 'Fremen',
}

export default {
  name: 'DunePlayerCards',

  components: { DuneAgentIcon, DuneCard, DuneResourceIcon },

  inject: ['actor', 'game'],

  computed: {
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
}
</script>


<style scoped>
.player-cards {
  display: flex;
  flex-direction: column;
  gap: .5em;
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
