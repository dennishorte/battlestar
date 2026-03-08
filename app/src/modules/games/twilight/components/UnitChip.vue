<template>
  <div class="unit-chip" @click.stop="showDetails">
    <span class="unit-name">{{ unit.name }}</span>
    <span class="unit-summary">{{ abilitySummary }}</span>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'UnitChip',

  props: {
    unitType: { type: String, required: true },
  },

  inject: ['ui'],

  computed: {
    unit() {
      return res.getUnit(this.unitType) || { name: this.unitType, abilities: [] }
    },

    abilitySummary() {
      if (!this.unit.abilities || this.unit.abilities.length === 0) {
        return ''
      }
      return this.unit.abilities.map(a => {
        return a
          .replace(/-(\d)/g, ' $1')
          .replace(/x(\d)/g, '\u00D7$1')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
      }).join(', ')
    },
  },

  methods: {
    showDetails() {
      this.ui.modals.cardDetail.type = 'unit'
      this.ui.modals.cardDetail.id = this.unitType
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>

<style scoped>
.unit-chip {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  padding: .2em .5em;
  border-radius: .2em;
  border-left: 4px solid #6c757d;
  background: #dee2e6;
  font-size: .9em;
  cursor: pointer;
}

.unit-chip:hover {
  background: #ced4da;
}

.unit-name {
  font-weight: 600;
}

.unit-summary {
  font-size: .85em;
  opacity: .7;
}
</style>
