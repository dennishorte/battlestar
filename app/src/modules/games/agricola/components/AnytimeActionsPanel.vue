<template>
  <div v-if="anytimeActions.length > 0" class="anytime-actions-panel mb-2">
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between py-1 px-2"
        role="button"
        @click="expanded = !expanded"
      >
        <small class="fw-bold">Anytime Actions</small>
        <span class="badge bg-secondary">{{ anytimeActions.length }}</span>
      </div>
      <div v-if="expanded" class="card-body p-2">
        <button
          v-for="(action, index) in anytimeActions"
          :key="index"
          class="btn btn-sm btn-outline-warning d-block w-100 mb-1 text-start"
          @click="executeAction(action)"
        >
          {{ action.description }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['actor', 'bus', 'game'],

  data() {
    return {
      expanded: true,
    }
  },

  computed: {
    currentPlayer() {
      return this.game.players.byName(this.actor.name)
    },

    waitingRequest() {
      if (!this.currentPlayer) {
        return null
      }
      return this.game.getWaiting(this.currentPlayer)
    },

    anytimeActions() {
      if (!this.waitingRequest || !this.waitingRequest.anytimeActions) {
        return []
      }
      return this.waitingRequest.anytimeActions
    },
  },

  methods: {
    executeAction(action) {
      if (!this.waitingRequest) {
        return
      }

      const response = {
        actor: this.actor.name,
        title: this.waitingRequest.title,
        selection: {
          action: 'anytime-action',
          anytimeAction: action,
        },
      }

      this.$store.dispatch('game/submitAction', response)
    },
  },
}
</script>

<style scoped>
.anytime-actions-panel .card {
  border-color: #ffc107;
}
.anytime-actions-panel .card-header {
  background-color: rgba(255, 193, 7, 0.15);
  border-bottom-color: #ffc107;
}
</style>
