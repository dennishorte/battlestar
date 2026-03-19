<template>
  <div class="objective-chip" :class="chipClass" @click.stop="showDetails">
    <span class="obj-name">{{ objective.name }}</span>
    <span class="obj-badge" :class="badgeClass">{{ badgeText }}</span>
    <span class="obj-points">{{ objective.points }}VP</span>
    <div class="obj-condition" v-if="objective.condition">{{ objective.condition }}</div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'ObjectiveChip',

  props: {
    objectiveId: { type: String, required: true },
  },

  inject: ['ui'],

  computed: {
    objective() {
      return res.getObjective(this.objectiveId) || { name: this.objectiveId, points: 0 }
    },

    chipClass() {
      if (this.objective.type === 'secret') {
        return 'chip-secret'
      }
      return `chip-stage-${this.objective.stage}`
    },

    badgeClass() {
      if (this.objective.type === 'secret') {
        return 'badge-secret'
      }
      return `badge-stage-${this.objective.stage}`
    },

    badgeText() {
      if (this.objective.type === 'secret') {
        return 'Secret'
      }
      return `Stage ${this.objective.stage}`
    },
  },

  methods: {
    showDetails() {
      this.ui.modals.cardDetail.type = 'objective'
      this.ui.modals.cardDetail.id = this.objectiveId
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>

<style scoped>
.objective-chip {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .35em;
  padding: .3em .5em;
  border-radius: .25em;
  cursor: pointer;
  border-left: 3px solid;
  font-size: .9em;
  line-height: 1.3;
}

.objective-chip:hover {
  filter: brightness(0.95);
}

.chip-stage-1 {
  background: #fff9c4;
  border-color: #f57f17;
}

.chip-stage-2 {
  background: #bbdefb;
  border-color: #0d6efd;
}

.chip-secret {
  background: #e1bee7;
  border-color: #7b1fa2;
}

.obj-name {
  font-weight: 600;
}

.obj-badge {
  font-size: .75em;
  padding: .1em .35em;
  border-radius: .15em;
  font-weight: 600;
}

.badge-stage-1 { background: #fff9c4; color: #f57f17; }
.badge-stage-2 { background: #bbdefb; color: #0d6efd; }
.badge-secret { background: #e1bee7; color: #7b1fa2; }

.obj-points {
  font-weight: 700;
  font-size: .8em;
  padding: .1em .3em;
  background: #e8f5e9;
  color: #198754;
  border-radius: .15em;
}

.obj-condition {
  width: 100%;
  font-size: .8em;
  color: #666;
  line-height: 1.3;
  margin-top: .1em;
}
</style>
