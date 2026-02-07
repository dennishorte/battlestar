<template>
  <div v-if="!gameReady">
    Loading...
  </div>

  <template v-else>
    <!-- Error banner for development mode -->
    <div v-if="loadError && !errorDismissed" class="game-load-error">
      <div class="error-header">
        <strong>⚠️ Game Loading Error</strong>
        <span class="error-hint">(Game loaded up to error point)</span>
        <button class="error-dismiss" @click="errorDismissed = true" title="Dismiss">✕</button>
      </div>
      <div class="error-message">{{ loadError.message }}</div>
      <details class="error-stack">
        <summary>Stack trace</summary>
        <pre>{{ loadError.stack }}</pre>
      </details>
    </div>

    <AgricolaGame v-if="gameType === 'Agricola'" />
    <CubeDraft v-else-if="gameType === 'Cube Draft' || gameType === 'Set Draft'" />
    <MtgGame v-else-if="gameType === 'Magic'" />
    <UltimateGame v-else-if="gameType === 'Innovation: Ultimate'" />
    <TyrantsGame v-else-if="gameType === 'Tyrants of the Underdark'" />

    <div v-else>
      error, unknown game type: {{ gameType }}
    </div>
  </template>

  <SavingOverlay />
</template>

<script>
import { computed } from 'vue'
import { mapState } from 'vuex'
import mitt from 'mitt'

import AgricolaGame from '@/modules/games/agricola/components/AgricolaGame.vue'
import CubeDraft from '@/modules/games/cube_draft/components/CubeDraft.vue'
import UltimateGame from '@/modules/games/ultimate/components/UltimateGame.vue'
import MtgGame from '@/modules/games/magic/components/MtgGame.vue'
import TyrantsGame from '@/modules/games/tyrants/components/TyrantsGame.vue'

import SavingOverlay from '@/modules/games/common/components/SavingOverlay.vue'


export default {
  name: 'GameBase',

  components: {
    AgricolaGame,
    CubeDraft,
    MtgGame,
    TyrantsGame,
    UltimateGame,

    SavingOverlay,
  },

  data() {
    return {
      id: this.$route.params.id,
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
      errorDismissed: false,
    }
  },

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,
      game: computed(() => this.game),
    }
  },

  computed: {
    ...mapState('game', {
      game: 'game',
      gameReady: 'gameReady',
      loadError: 'loadError',
      saving: 'saving',
    }),

    gameType() {
      return this.game ? this.game.settings.game : null
    },
  },

  methods: {
    async loadGame() {
      this.errorDismissed = false
      if (this.id === 'next') {
        await this.nextGame()
      }
      else {
        await this.$store.dispatch('game/load', {
          gameId: this.id,
          actor: this.actor,
        })
      }
      window.game = this.game
    },

    async nextGame() {
      await this.$store.dispatch('game/next', { actor: this.actor })
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.loadGame()
    },
  },

  async mounted() {
    await this.loadGame()
  },
}
</script>

<style scoped>
.game-load-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #dc3545;
  color: white;
  padding: 0.75rem 1rem;
  font-family: system-ui, -apple-system, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.error-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.error-dismiss {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-dismiss:hover {
  background: rgba(255, 255, 255, 0.3);
}

.error-hint {
  font-size: 0.85rem;
  opacity: 0.9;
}

.error-message {
  font-family: monospace;
  font-size: 0.95rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-top: 0.5rem;
}

.error-stack {
  margin-top: 0.5rem;
}

.error-stack summary {
  cursor: pointer;
  font-size: 0.85rem;
  opacity: 0.9;
}

.error-stack pre {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.75rem;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
