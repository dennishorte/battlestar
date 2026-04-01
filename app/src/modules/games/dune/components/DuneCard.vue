<template>
  <div class="dune-card" :class="cardClasses">
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
      <span class="card-name">{{ card.name }}</span>
      <span class="card-cost" v-if="card.persuasionCost">{{ card.persuasionCost }}</span>
    </div>
    <div class="card-effects" v-if="hasEffects">
      <div v-if="def.agentAbility" class="effect agent-effect">
        <span class="effect-label">Agent:</span>
        <div v-for="(line, i) in textLines(def.agentAbility)"
             :key="'a'+i"
             :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
      </div>
      <div class="effect reveal-effect" v-if="revealText">
        <span class="effect-label">Reveal:</span>
        <div v-for="(line, i) in textLines(revealText)"
             :key="'r'+i"
             :class="line.startsWith('·') ? 'bullet' : ''">{{ line }}</div>
      </div>
    </div>
  </div>
</template>


<script>
import DuneFactionIcon from './DuneFactionIcon.vue'

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

    cardClasses() {
      const classes = []
      if (this.def.factionAffiliation) {
        classes.push(`faction-${this.def.factionAffiliation}`)
      }
      return classes
    },

    allIcons() {
      const icons = []
      const agentIcons = this.def.agentIcons || []
      const factionAccess = this.def.factionAccess || []

      for (const icon of agentIcons) {
        icons.push({ type: icon, shape: this.shapeFor(icon) })
      }
      for (const faction of factionAccess) {
        icons.push({ type: faction, faction: true })
      }
      return icons
    },

    hasEffects() {
      return this.def.agentAbility || this.revealText
    },

    revealText() {
      const parts = []
      const p = this.def.revealPersuasion || 0
      const s = this.def.revealSwords || 0
      if (p > 0) {
        parts.push(`+${p} persuasion`)
      }
      if (s > 0) {
        parts.push(`+${s} sword${s > 1 ? 's' : ''}`)
      }
      if (this.def.revealAbility) {
        parts.push(this.def.revealAbility)
      }
      return parts.join(', ') || null
    },
  },

  methods: {
    textLines(text) {
      if (!text) {
        return []
      }
      return text.split('\n').filter(l => l.trim())
    },

    shapeFor(icon) {
      if (icon === 'green') {
        return 'pentagon'
      }
      if (icon === 'purple') {
        return 'circle'
      }
      if (icon === 'yellow') {
        return 'triangle'
      }
      return 'circle'
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

.reveal-effect {
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

.faction-emperor { border-color: #8b2020; }
.faction-guild { border-color: #c07020; }
.faction-bene-gesserit { border-color: #5b3a8a; }
.faction-fremen { border-color: #2a6090; }
</style>
