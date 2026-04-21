<template>
  <div class="dune-card" :class="`card-${type}`">
    <div class="card-header-row">
      <span class="card-icons" v-if="allIcons.length">
        <template v-for="(icon, i) in allIcons" :key="i">
          <DuneFactionIcon v-if="icon.faction"
                           :faction="icon.type"
                           size=".95em" />
          <span v-else
                class="icon"
                :class="`icon-${icon.type} shape-${icon.shape}`" />
        </template>
      </span>
      <span class="card-name">{{ def.name }}</span>
      <span class="card-cost" v-if="costLabel">{{ costLabel }}</span>
    </div>
    <div class="card-effects" v-if="sections.length">
      <div v-for="(section, i) in sections"
           :key="i"
           class="effect"
           :class="{ 'effect-highlight': section.highlight }">
        <span class="effect-label">{{ section.label }}:</span>
        <div v-for="(line, li) in section.lines"
             :key="li"
             :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
      </div>
    </div>
  </div>
</template>


<script>
import DuneFactionIcon from './DuneFactionIcon.vue'
import { textLines, cardType, cardSections } from '../cardUtil.js'

const shapeMap = { green: 'pentagon', purple: 'circle', yellow: 'triangle' }

export default {
  name: 'DuneCard',

  components: {
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

    allIcons() {
      const icons = []
      for (const icon of this.def.agentIcons || []) {
        icons.push({ type: icon, shape: shapeMap[icon] || 'circle' })
      }
      for (const faction of this.def.factionAccess || []) {
        icons.push({ type: faction, faction: true })
      }
      return icons
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

.icon {
  display: inline-block;
}

/* Shapes */
.shape-circle {
  width: .8em;
  height: .8em;
  border-radius: 50%;
}

.shape-pentagon {
  width: .9em;
  height: .85em;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

.shape-triangle {
  width: .9em;
  height: .8em;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

/* Colors */
.icon-green { background-color: #3a7d3a; }
.icon-purple { background-color: #6a3d8a; }
.icon-yellow { background-color: #b8860b; }

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

.card-tech {
  background-color: #eef7f7;
  border-color: #88b8b8;
}
.card-tech .card-name { color: #2a5a5a; }
.card-tech .effect-label { color: #5a8a8a; }
</style>
