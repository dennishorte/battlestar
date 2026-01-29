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

  inject: ['actor', 'game'],

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

    titleForPlayer(player) {
      if (this.hasActionWaiting(player)) {
        return `${player.name}*`
      }
      else {
        return player.name
      }
    },
  },
}
</script>


<style scoped>
.waiting-panel {
  background-color: white;
}

.nav-link.active {
  background-color: #eee!important;
  border-color: #ccc!important;
  border-bottom-color: #eee!important;
}

.tab-content .active {
  padding: .05rem .75rem;
  background-color: #eee;
  margin-left: -15px;
  margin-right: -15px;
}
</style>
