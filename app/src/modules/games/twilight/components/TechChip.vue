<template>
  <div class="tech-chip" :style="chipStyle" @click.stop="showDetails">
    <span class="prereq-dots" v-if="tech.prerequisites.length">
      <span
        v-for="(prereq, i) in tech.prerequisites"
        :key="i"
        class="prereq-dot"
        :style="{ backgroundColor: colors[prereq] || '#999' }"
      />
    </span>
    <span class="tech-name">{{ tech.name }}</span>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

const colors = {
  blue: '#0d6efd',
  red: '#dc3545',
  yellow: '#ffc107',
  green: '#198754',
  'unit-upgrade': '#6c757d',
}

export default {
  name: 'TechChip',

  props: {
    techId: { type: String, required: true },
  },

  inject: ['ui'],

  data() {
    return { colors }
  },

  computed: {
    tech() {
      return res.getTechnology(this.techId) || { name: this.techId, color: null, prerequisites: [] }
    },

    chipStyle() {
      const color = colors[this.tech.color] || '#6c757d'
      return { borderLeftColor: color }
    },
  },

  methods: {
    showDetails() {
      this.ui.modals.cardDetail.type = 'technology'
      this.ui.modals.cardDetail.id = this.techId
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>

<style scoped>
.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  padding: .2em .5em;
  border-radius: .2em;
  border-left: 4px solid;
  background: #f0f2f5;
  font-size: .9em;
  cursor: pointer;
}

.tech-chip:hover {
  background: #e3e6ea;
}

.tech-name {
  font-weight: 600;
}

.prereq-dots {
  display: flex;
  gap: .15em;
}

.prereq-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
