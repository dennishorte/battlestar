<template>
  <div class="activate-system-action">
    <div class="action-header">Activate a System</div>
    <div class="action-info">
      <span class="token-info">Tactic tokens: {{ tacticTokens }}</span>
    </div>
    <div class="action-hint">Click a system on the map to activate it.</div>
  </div>
</template>

<script>
export default {
  name: 'ActivateSystem',

  inject: ['actor', 'game', 'bus', 'ui'],

  computed: {
    currentPlayer() {
      return this.game.players.byName(this.actor.name)
    },

    tacticTokens() {
      return this.currentPlayer?.getTacticTokens() ?? 0
    },
  },

  methods: {
    onSystemClick({ systemId }) {
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        selection: { action: 'activate-system', systemId },
      })
    },
  },

  mounted() {
    this.bus.on('system-click', this.onSystemClick)
  },

  beforeUnmount() {
    this.bus.off('system-click', this.onSystemClick)
  },
}
</script>

<style scoped>
.activate-system-action {
  padding: .5em;
  background: #e8f5e9;
  border-left: 3px solid #198754;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .25em;
}

.action-info {
  font-size: .8em;
  color: #555;
}

.action-hint {
  font-size: .75em;
  color: #888;
  margin-top: .25em;
  font-style: italic;
}
</style>
