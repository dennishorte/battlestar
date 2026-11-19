<template>
  <div class="dune-card" :class="cardClasses">
    <div class="card-body">
      <div class="card-header-row">
        <span class="card-icons" v-if="allIcons.length">
          <template v-for="(icon, i) in allIcons" :key="i">
            <DuneFactionIcon v-if="icon.faction"
                             :faction="icon.type"
                             size=".95em" />
            <DuneAgentIcon v-else :type="icon.type" />
          </template>
        </span>
        <span class="card-name">{{ def.name }}</span>
        <span class="card-cost" v-if="costLabel">{{ costLabel }}</span>
      </div>
      <div class="card-affiliation"
           v-for="aff in affiliations"
           :key="aff.id"
           :class="`affiliation-${aff.id}`">
        <DuneFactionIcon :faction="aff.id" size=".9em" />
        {{ aff.label }}
      </div>
    </div>
    <div class="card-effects" v-if="sections.length">
      <div v-for="(section, i) in sections"
           :key="i"
           class="effect"
           :class="sectionClass(section)">
        <span class="effect-label">{{ section.label }}:</span>
        <div v-for="(line, li) in section.lines"
             :key="li"
             :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
      </div>
    </div>
  </div>
</template>


<script>
import DuneAgentIcon from './DuneAgentIcon.vue'
import DuneFactionIcon from './DuneFactionIcon.vue'
import { textLines, cardType, cardSections } from '../cardUtil.js'

const factionLabels = {
  emperor: 'Emperor',
  guild: 'Spacing Guild',
  'bene-gesserit': 'Bene Gesserit',
  fremen: 'Fremen',
}

export default {
  name: 'DuneCard',

  components: {
    DuneAgentIcon,
    DuneFactionIcon,
  },

  props: {
    card: {
      type: Object,
      required: true,
    },
  },

  computed: {
    def() {
      return this.card.definition || this.card.data || this.card
    },

    type() {
      return cardType(this.def)
    },

    cardClasses() {
      const classes = []
      if (this.type) {
        classes.push(`card-${this.type}`)
      }
      if (this.type === 'intrigue') {
        const kinds = this.sections.map(section => section.kind).filter(Boolean)
        for (const kind of kinds) {
          classes.push(`intrigue-${kind}`)
        }
        if (kinds.length > 1) {
          classes.push('intrigue-mixed')
        }
      }
      return classes
    },

    allIcons() {
      const icons = []
      for (const icon of this.def.agentIcons || []) {
        icons.push({ type: icon })
      }
      for (const faction of this.def.factionAccess || []) {
        icons.push({ type: faction, faction: true })
      }
      if (this.def.spyAccess) {
        icons.push({ type: 'spy' })
      }
      return icons
    },

    affiliations() {
      const raw = this.def.factionAffiliation
      if (!raw) {
        return []
      }
      const ids = Array.isArray(raw) ? raw : [raw]
      return ids.map(id => ({ id, label: factionLabels[id] || id }))
    },

    costLabel() {
      if (this.def.tier) {
        return `Tier ${this.def.tier}`
      }
      if (this.def.persuasionCost) {
        return `${this.def.persuasionCost}`
      }
      if (this.def.spiceCost != null) {
        return `${this.def.spiceCost} spice`
      }
      return null
    },

    sections() {
      return cardSections(this.def).map(s => ({
        ...s,
        lines: textLines(s.text),
      }))
    },
  },

  methods: {
    sectionClass(section) {
      return {
        'effect-highlight': section.highlight,
        'effect-plot': section.kind === 'plot',
        'effect-combat': section.kind === 'combat',
        'effect-endgame': section.kind === 'endgame',
      }
    },
  },
}
</script>


<style scoped>
.dune-card {
  display: flex;
  flex-direction: column;
  padding: .25em .5em;
  border-radius: .2em;
  background-color: #f5f0e8;
  border: 1px solid #d4c8a8;
  font-size: .85em;
  margin: 1px;
  overflow: hidden;
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: .3em;
}

.card-name {
  color: #2c2416;
  font-weight: 600;
}

.card-cost {
  color: #8b6914;
  font-weight: bold;
  font-size: .85em;
  margin-left: auto;
}

.card-icons {
  display: inline-flex;
  gap: 2px;
}

.card-affiliation {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 3px;
  margin-top: .15em;
  padding: 0 .4em;
  border-radius: .6em;
  font-size: .75em;
  font-weight: 500;
  line-height: 1.5;
  color: white;
}

.affiliation-emperor { background-color: #d03030; }
.affiliation-guild { background-color: #e08828; }
.affiliation-bene-gesserit { background-color: #8855cc; }
.affiliation-fremen { background-color: #3088cc; }

.card-affiliation .faction-icon {
  color: white;
}

.card-effects {
  margin-top: .15em;
  padding-top: .15em;
  border-top: 1px solid #e8e0d0;
}

.effect {
  font-size: .9em;
  color: #4a3a20;
  line-height: 1.3;
  padding: .1em .3em;
}

.effect-highlight {
  background-color: #ede7da;
  border-radius: .15em;
  margin-top: .1em;
}

.effect-label {
  font-weight: 600;
  font-size: .85em;
  color: #8a7a68;
}

.bullet {
  padding-left: .8em;
}

/* Card type colors */
.card-conflict {
  background-color: #f5eef0;
  border-color: #c08888;
}
.card-conflict .card-name { color: #6a2030; }
.card-conflict .effect-label { color: #8b4050; }

.card-contract {
  background-color: #f0f5e8;
  border-color: #b8c888;
}
.card-contract .card-name { color: #4a5a20; }
.card-contract .effect-label { color: #6a7a48; }

.card-intrigue {
  background-color: #fdf8ee;
  border-color: #d4b868;
}
.card-intrigue .card-name { color: #6a5010; }
.card-intrigue .effect-label { color: #8b7a40; }

/* Combat intrigue: clay red, warmer than the rose used for conflict cards. */
.card-intrigue.intrigue-combat:not(.intrigue-mixed) {
  background-color: #f6d4c8;
  border-color: #c25648;
}
.card-intrigue.intrigue-combat:not(.intrigue-mixed) .card-name { color: #6b2a1e; }
.card-intrigue.intrigue-combat:not(.intrigue-mixed) .effect-label { color: #8d4336; }
.card-intrigue.intrigue-combat:not(.intrigue-mixed) .card-effects { border-top-color: #e4c2b6; }

/* Endgame intrigue: sky blue, kept apart from the teal tech cards. */
.card-intrigue.intrigue-endgame:not(.intrigue-mixed) {
  background-color: #dce7f4;
  border-color: #5d86b4;
}
.card-intrigue.intrigue-endgame:not(.intrigue-mixed) .card-name { color: #1a3d5e; }
.card-intrigue.intrigue-endgame:not(.intrigue-mixed) .effect-label { color: #3a6286; }
.card-intrigue.intrigue-endgame:not(.intrigue-mixed) .card-effects { border-top-color: #c5d6ea; }

/* Two timings share one card. The title keeps the earlier timing; each option is its own color. */
.card-intrigue.intrigue-mixed {
  padding: 0;
}
.card-intrigue.intrigue-mixed.intrigue-combat:not(.intrigue-plot) {
  background-color: #f6d4c8;
  border-color: #c25648;
}
.card-intrigue.intrigue-mixed.intrigue-combat:not(.intrigue-plot) .card-name { color: #6b2a1e; }
.card-intrigue.intrigue-mixed .card-body {
  padding: .25em .5em .15em;
  border-bottom: 1px solid #e8e0d0;
}
.card-intrigue.intrigue-mixed.intrigue-combat:not(.intrigue-plot) .card-body {
  border-bottom-color: #e4c2b6;
}
.card-intrigue.intrigue-mixed .card-effects {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border-top: none;
}
.card-intrigue.intrigue-mixed .effect {
  padding: .28em .5em .32em;
}
.card-intrigue.intrigue-mixed .effect-plot {
  background-color: #fdf8ee;
}
.card-intrigue.intrigue-mixed .effect-plot .effect-label { color: #8b7a40; }
.card-intrigue.intrigue-mixed .effect-combat {
  background-color: #f6d4c8;
}
.card-intrigue.intrigue-mixed .effect-combat .effect-label { color: #8d4336; }
.card-intrigue.intrigue-mixed .effect-endgame {
  background-color: #dce7f4;
}
.card-intrigue.intrigue-mixed .effect-endgame .effect-label { color: #3a6286; }

.card-tech {
  background-color: #e5f4f4;
  border-color: #7eb8b8;
  border-left: 4px solid #1f6f78;
}
.card-tech .card-name { color: #134e56; }
.card-tech .effect-label { color: #1f6f78; }
.card-tech .card-cost { color: #1f6f78; }
</style>
