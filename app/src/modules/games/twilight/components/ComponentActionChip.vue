<template>
  <div class="component-action-chip" @click.stop="showDetails">
    <span class="component-action-name">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'ComponentActionChip',

  props: {
    name: { type: String, required: true },
    factionId: { type: String, default: null },
    relicId: { type: String, default: null },
  },

  inject: ['ui'],

  methods: {
    showDetails() {
      if (this.relicId) {
        this.ui.modals.cardDetail.type = 'relic'
        this.ui.modals.cardDetail.id = this.relicId
        this.ui.modals.cardDetail.context = null
        this.$modal('twilight-card-detail').show()
      }
      else if (this.factionId) {
        this.ui.modals.cardDetail.type = 'faction'
        this.ui.modals.cardDetail.id = this.factionId
        this.ui.modals.cardDetail.context = null
        this.$modal('twilight-card-detail').show()
      }
    },
  },
}
</script>

<style scoped>
.component-action-chip {
  display: inline-flex;
  align-items: center;
  padding: .2em .5em;
  border-radius: .2em;
  border-left: 4px solid #6c757d;
  background: #e9ecef;
  font-size: .9em;
  cursor: pointer;
}

.component-action-chip:hover {
  background: #dee2e6;
}

.component-action-name {
  font-weight: 600;
  color: #212529;
}
</style>
