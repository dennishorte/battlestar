<template>
  <div class="research-tech-action">
    <div class="action-header">{{ headerText }}</div>
    <div v-if="isEnigmatic" class="enigmatic-badge">No prerequisites required</div>

    <div v-for="group in techGroups" :key="group.color" class="tech-group">
      <div class="group-label">{{ group.label }}</div>
      <div
        v-for="tech in group.techs"
        :key="tech.id"
        class="tech-row"
        :style="{ borderLeftColor: techColors[tech.color] || '#999' }"
        @click="selectTech(tech.id)"
      >
        <span class="tech-name">{{ tech.name }}</span>
        <span v-if="tech.prerequisites.length" class="prereq-dots">
          <span
            v-for="(prereq, i) in tech.prerequisites"
            :key="i"
            class="prereq-dot"
            :style="{ backgroundColor: techColors[prereq] || '#999' }"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

const techColors = {
  blue: '#0d6efd',
  red: '#dc3545',
  yellow: '#ffc107',
  green: '#198754',
  'unit-upgrade': '#6c757d',
}

const colorLabels = {
  blue: 'Propulsion',
  red: 'Warfare',
  yellow: 'Cybernetic',
  green: 'Biotic',
  'unit-upgrade': 'Unit Upgrades',
  faction: 'Faction',
}

export default {
  name: 'ResearchTech',

  props: {
    request: {
      type: Object,
      default: null,
    },
  },

  inject: ['actor', 'bus'],

  data() {
    return {
      techColors,
    }
  },

  computed: {
    title() {
      return this.request?.title || ''
    },

    isEnigmatic() {
      return this.title.toLowerCase().includes('enigmatic device')
    },

    headerText() {
      return this.isEnigmatic ? 'Research Technology (Enigmatic Device)' : 'Research Technology'
    },

    choices() {
      return (this.request?.choices || []).map(c => typeof c === 'string' ? c : c.title)
    },

    techs() {
      return this.choices.map(id => {
        const tech = res.getTechnology(id)
        if (tech) {
          return tech
        }
        return { id, name: id, color: null, prerequisites: [], faction: null }
      })
    },

    techGroups() {
      const groups = {}
      const order = ['blue', 'red', 'yellow', 'green', 'unit-upgrade', 'faction']

      for (const tech of this.techs) {
        const key = tech.faction ? 'faction' : (tech.color || 'faction')
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(tech)
      }

      return order
        .filter(key => groups[key]?.length)
        .map(key => ({
          color: key,
          label: colorLabels[key] || key,
          techs: groups[key],
        }))
    },
  },

  methods: {
    selectTech(techId) {
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        selection: [techId],
      })
    },
  },
}
</script>

<style scoped>
.research-tech-action {
  padding: .5em;
  background: #e8eaf6;
  border-left: 3px solid #5c6bc0;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .25em;
}

.enigmatic-badge {
  font-size: .75em;
  color: #fff;
  background: #7e57c2;
  display: inline-block;
  padding: .1em .5em;
  border-radius: .2em;
  margin-bottom: .4em;
}

.tech-group {
  margin-bottom: .35em;
}

.group-label {
  font-size: .7em;
  font-weight: 600;
  text-transform: uppercase;
  color: #777;
  margin-bottom: .15em;
}

.tech-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .3em .5em;
  margin-bottom: .15em;
  background: #fff;
  border-left: 4px solid;
  border-radius: 3px;
  cursor: pointer;
  font-size: .85em;
}
.tech-row:hover {
  background: #e3e8f7;
}

.tech-name {
  font-weight: 600;
}

.prereq-dots {
  display: flex;
  gap: .2em;
}

.prereq-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
