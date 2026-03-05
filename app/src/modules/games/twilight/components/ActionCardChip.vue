<template>
  <div class="action-card-chip" @click.stop="showDetails">
    <span class="action-card-name">{{ card.name }}</span>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'ActionCardChip',

  props: {
    cardId: { type: String, required: true },
  },

  inject: ['ui'],

  computed: {
    card() {
      return res.getActionCard(this.cardId) || { name: this.cardId }
    },
  },

  methods: {
    showDetails() {
      this.ui.modals.cardDetail.type = 'action-card'
      this.ui.modals.cardDetail.id = this.cardId
      this.ui.modals.cardDetail.context = null
      this.$modal('twilight-card-detail').show()
    },
  },
}
</script>

<style scoped>
.action-card-chip {
  display: inline-flex;
  align-items: center;
  padding: .2em .5em;
  border-radius: .2em;
  border-left: 4px solid #495057;
  background: #dee2e6;
  font-size: .9em;
  cursor: pointer;
}

.action-card-chip:hover {
  background: #ced4da;
}

.action-card-name {
  font-weight: 600;
  color: #212529;
}
</style>
