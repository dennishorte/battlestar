<template>
  <span class="dune-chip" :class="chipClass" @click.stop="showModal = true">
    <span class="chip-main">
      <span class="chip-header">
        <DuneFactionIcon v-if="spaceIcon && isFaction(spaceIcon)"
                         :faction="spaceIcon"
                         size=".85em" />
        <span v-else-if="spaceIcon" class="space-icon" :class="`icon-${spaceIcon}`" />
        <span class="chip-name">{{ name }}</span>
        <span class="chip-detail" v-if="detail">{{ detail }}</span>
      </span>
      <span class="chip-subtitle" v-if="subtitleLines.length">
        <span v-for="(line, i) in subtitleLines"
              :key="i"
              :class="line.startsWith('·') ? 'sub-bullet' : 'sub-line'">{{ line }}</span>
      </span>
    </span>
  </span>

  <teleport to="body">
    <div v-if="showModal" class="dune-modal-backdrop" @click="showModal = false">
      <div class="dune-modal" @click.stop>
        <div class="modal-header" v-if="!card">
          <strong>{{ name }}</strong>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <template v-if="leader">
            <div v-for="(section, i) in leaderSections" :key="i" class="field">
              <span class="label">{{ section.label }}:</span>
              <div v-for="(line, li) in section.lines"
                   :key="li"
                   :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
            </div>
          </template>
          <template v-else-if="boardSpace">
            <div class="field" v-if="boardSpace.cost">
              <span class="label">Cost:</span> {{ formatCost(boardSpace.cost) }}
            </div>
            <div class="field" v-if="boardSpace.influenceRequirement">
              <span class="label">Requires:</span>
              {{ boardSpace.influenceRequirement.faction }} {{ boardSpace.influenceRequirement.amount }}+
            </div>
            <div class="field" v-if="boardSpace.isCombatSpace">
              <span class="label">Combat space</span>
            </div>
            <div class="field" v-if="spaceEffectLines.length">
              <span class="label">Effects:</span>
              <div v-for="(line, i) in spaceEffectLines" :key="i" class="bullet">{{ line }}</div>
            </div>
          </template>
          <template v-else-if="card">
            <DuneCard :card="card" class="modal-card" />
          </template>
        </div>
      </div>
    </div>
  </teleport>
</template>


<script>
import DuneCard from './DuneCard.vue'
import DuneFactionIcon from './DuneFactionIcon.vue'
import { textLines, cardDetail, cardChipClass } from '../cardUtil.js'

const factionIds = new Set(['emperor', 'guild', 'bene-gesserit', 'fremen'])

export default {
  name: 'DuneOptionChip',

  inheritAttrs: false,

  components: { DuneCard, DuneFactionIcon },

  props: {
    name: { type: String, required: true },
    card: { type: Object, default: null },
    leader: { type: Object, default: null },
    boardSpace: { type: Object, default: null },
    subtitle: { type: String, default: null },
  },

  data() {
    return { showModal: false }
  },

  methods: {
    isFaction(icon) {
      return factionIds.has(icon)
    },

    formatCost(cost) {
      return Object.entries(cost).map(([r, a]) => `${a} ${r}`).join(', ')
    },

    describeEffect(effect) {
      const labels = {
        'troop': (e) => `+${e.amount} troop${e.amount > 1 ? 's' : ''}`,
        'draw': (e) => `draw ${e.amount} card${e.amount > 1 ? 's' : ''}`,
        'intrigue': (e) => `+${e.amount} intrigue`,
        'gain': (e) => `+${e.amount} ${e.resource}`,
        'spy': () => '+1 spy',
        'contract': () => '+1 contract',
        'spice-harvest': (e) => e.amount > 0 ? `harvest ${e.amount} spice` : null,
        'sandworm': (e) => `+${e.amount} sandworm${e.amount > 1 ? 's' : ''}`,
        'maker-hook': () => '+1 maker hook',
        'trash-card': () => 'trash a card',
        'steal-intrigue': () => 'steal intrigue (4+ cards)',
        'high-council': () => 'gain High Council seat',
        'sword-master': () => 'gain Swordmaster (3rd agent)',
        'recall-agent': () => 'recall an agent',
        'intrigue-trash-draw': () => 'trash intrigue → draw intrigue',
        'break-shield-wall': () => 'destroy Shield Wall',
        'influence-choice': (e) => `+${e.amount} influence (any faction)`,
      }
      const fn = labels[effect.type]
      return fn ? fn(effect) : effect.type
    },
  },

  computed: {
    subtitleLines() {
      if (!this.subtitle) {
        return []
      }
      return this.subtitle.split('\n').map(l => l.trim()).filter(Boolean)
    },

    spaceIcon() {
      return this.boardSpace?.icon || null
    },

    leaderSections() {
      if (!this.leader) {
        return []
      }
      const sections = []
      sections.push({ label: 'House', lines: [this.leader.house || 'None'] })
      if (this.leader.startingEffect) {
        sections.push({ label: 'Starting', lines: textLines(this.leader.startingEffect) })
      }
      if (this.leader.leaderAbility) {
        sections.push({ label: 'Ability', lines: textLines(this.leader.leaderAbility) })
      }
      if (this.leader.signetRingAbility) {
        sections.push({ label: 'Signet Ring', lines: textLines(this.leader.signetRingAbility) })
      }
      return sections
    },

    spaceEffectLines() {
      if (!this.boardSpace?.effects) {
        return []
      }
      const lines = []
      for (const effect of this.boardSpace.effects) {
        if (effect.type === 'choice') {
          effect.choices.forEach((choice, ci) => {
            const parts = choice.effects.map(e => this.describeEffect(e)).filter(Boolean)
            let line = parts.join(', ')
            if (choice.cost) {
              line = `pay ${this.formatCost(choice.cost)} → ${line}`
            }
            if (choice.requires) {
              line = `with ${choice.requires}: ${line}`
            }
            if (ci > 0) {
              lines.push('  OR')
            }
            lines.push(`· ${line}`)
          })
        }
        else {
          const desc = this.describeEffect(effect)
          if (desc) {
            lines.push(`· ${desc}`)
          }
        }
      }
      if (this.boardSpace.isMakerSpace) {
        lines.push('· + bonus spice')
      }
      return lines
    },

    chipClass() {
      if (this.leader) {
        return 'chip-leader'
      }
      if (this.boardSpace) {
        return `chip-space-${this.boardSpace.icon}`
      }
      return cardChipClass(this.card)
    },

    detail() {
      if (this.leader) {
        return ''
      }
      if (this.boardSpace) {
        const parts = []
        if (this.boardSpace.dynamicCost === 'sword-master') {
          parts.push('8/6 solari')
        }
        else if (this.boardSpace.cost) {
          parts.push(this.formatCost(this.boardSpace.cost))
        }
        if (this.boardSpace.influenceRequirement) {
          const req = this.boardSpace.influenceRequirement
          const labels = { emperor: 'Emp', guild: 'Guild', 'bene-gesserit': 'BG', fremen: 'Fremen' }
          parts.push(`${labels[req.faction] || req.faction} ${req.amount}+`)
        }
        return parts.join(' · ')
      }
      return cardDetail(this.card)
    },
  },
}
</script>


<style scoped>
.dune-chip {
  display: inline-flex;
  align-items: center;
  gap: .4em;
  padding: .15em .5em;
  border-radius: .25em;
  cursor: pointer;
  border: 1px solid #d4c8a8;
  background-color: #f5f0e8;
  transition: background-color .1s;
}

.dune-chip:hover {
  background-color: #e8dcc0;
}

.chip-main {
  display: flex;
  flex-direction: column;
}

.chip-header {
  display: flex;
  align-items: center;
  gap: .4em;
}

.chip-name {
  font-weight: 600;
  color: #2c2416;
}

.chip-detail {
  font-size: .85em;
  color: #8a7a68;
}

.chip-subtitle {
  display: flex;
  flex-direction: column;
  font-size: .8em;
  color: #6a5a48;
  line-height: 1.3;
}

.sub-bullet {
  padding-left: .6em;
}

.sub-line {
}

.chip-leader {
  border-color: #6a3d8a;
  background-color: #f3eef8;
}
.chip-leader:hover { background-color: #e8ddf0; }

.chip-intrigue { border-color: #8b6914; background-color: #fdf8ee; }
.chip-intrigue:hover { background-color: #f5ecd8; }
.chip-contract { border-color: #c07020; background-color: #fef5ee; }
.chip-contract:hover { background-color: #f8e8d4; }
.chip-tech { border-color: #3a7d7d; background-color: #eef7f7; }
.chip-tech:hover { background-color: #dceeed; }

.chip-space-purple { border-color: #6a3d8a; }
.chip-space-yellow { border-color: #b8860b; }
.chip-space-green { border-color: #3a7d3a; }
.chip-space-emperor { border-color: #8b2020; }
.chip-space-guild { border-color: #c07020; }
.chip-space-bene-gesserit { border-color: #5b3a8a; }
.chip-space-fremen { border-color: #2a6090; }

.space-icon {
  display: inline-block;
  width: .7em;
  height: .7em;
}
.icon-purple { background-color: #6a3d8a; border-radius: 50%; }
.icon-yellow { background-color: #b8860b; clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }
.icon-green { background-color: #3a7d3a; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }

.dune-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dune-modal {
  background: white;
  border-radius: .5em;
  min-width: 300px;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6em .8em;
  border-bottom: 1px solid #e8e0d0;
  font-size: 1.1em;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  color: #8a7a68;
  line-height: 1;
}

.modal-body {
  padding: .6em .8em;
}

.modal-card {
  margin: 0;
  border: none;
  font-size: 1em;
}

.field {
  margin-bottom: .4em;
  line-height: 1.4;
}

.bullet {
  padding-left: 1em;
}

.label {
  font-weight: 600;
  color: #8b6914;
  margin-right: .3em;
}
</style>
