<template>
  <div class="waiting-panel">

    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" v-for="player in playersOrdered" :key="player.name">
        <button
          class="nav-link"
          :class="isActive(player)"
          id="home-tab"
          data-bs-toggle="tab"
          :data-bs-target="`#waiting-${player.name}`"
          type="button"
        >
          {{ titleForPlayer(player) }}
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <div
        v-for="player in playersOrdered"
        :key="player.name"
        class="tab-pane fade"
        :class="isActive(player)"
        :id="`waiting-${player.name}`"
      >
        <WaitingChoice v-if="hasActionWaiting(player)" :owner="player" />
        <div v-else>No actions waiting for you right now.</div>
      </div>
    </div>

  </div>
</template>


<script>
import WaitingChoice from './WaitingChoice.vue'

export default {
  name: 'WaitingPanel',

  components: {
    WaitingChoice,
  },

  inject: ['actor', 'bus', 'game'],

  data() {
    return {
      selectedPlayer: null,
    }
  },

  computed: {
    playersOrdered() {
      if (this.game.state.initializationComplete) {
        return this.game.players.startingWith(this.game.players.byName(this.actor.name))
      }
      else {
        return []
      }
    }
  },

  methods: {
    hasActionWaiting(player) {
      return this.game.checkPlayerHasActionWaiting(player)
    },

    isActive(player) {
      return player.name === this.actor.name ? ['active', 'show'] : ''
    },

    onTabShown(event) {
      const target = event.target.getAttribute('data-bs-target')
      const name = target?.replace('#waiting-', '')
      if (name) {
        this.selectedPlayer = this.game.players.byName(name)
        this.bus.emit('waiting-player-selected', name)
      }
    },

    titleForPlayer(player) {
      if (this.hasActionWaiting(player)) {
        return `${player.name}*`
      }
      else {
        return player.name
      }
    },
  },

  mounted() {
    this.$el.addEventListener('shown.bs.tab', this.onTabShown)
  },

  beforeUnmount() {
    this.$el.removeEventListener('shown.bs.tab', this.onTabShown)
  },
}
</script>


<style scoped>
.waiting-panel {
  background-color: var(--waiting-bg, white);
  color: var(--waiting-color, inherit);
}

.nav-link {
  color: var(--waiting-tab-color, inherit);
}

.nav-link.active {
  background-color: var(--waiting-active-bg, #eee)!important;
  border-color: var(--waiting-border-color, #ccc)!important;
  border-bottom-color: var(--waiting-active-bg, #eee)!important;
  color: var(--waiting-tab-active-color, inherit)!important;
}

.tab-content .active {
  padding: .05rem .75rem;
  background-color: var(--waiting-active-bg, #eee);
  margin-left: -15px;
  margin-right: -15px;
}
</style>
