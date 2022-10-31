<template>
  <div class="waiting-panel">

    <ul class="nav nab-tabs">
      <li v-for="player in playersOrdered">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          :data-bs-target="`#waiting-${player.name}`"
        >
          {{ titleForPlayer(player) }}
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <div
        v-for="player in playersOrdered"
        :key="player.name"
        :id="`waiting-${player.name}`"
      >
        <WaitingChoice v-if="hasActionWaiting(player)" :actor="player" />
        <div v-else>No actions waiting for you right now.</div>
      </div>
    </div>

  </div>
</template>


<script>
import WaitingChoice from './WaitingChoice'

export default {
  name: 'WaitingPanel',

  components: {
    WaitingChoice,
  },

  inject: ['actor', 'game'],

  computed: {
    playersOrdered() {
      if (this.game.state.initializationComplete) {
        return this.game.getPlayersStarting(this.game.getPlayerByName(this.actor.name))
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
/* .waiting-panel {
   background-color: white;
   }

   .waiting-panel ::v-deep(.active-nav-item) {
   background-color: #eee;
   border-color: #ccc;
   border-bottom-color: #eee;
   }

   .active-tab {
   padding: .05rem .75rem;
   background-color: #eee;
   margin-left: -15px;
   margin-right: -15px;
   } */
</style>
