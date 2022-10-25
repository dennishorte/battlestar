<template>
  <div class="waiting-panel">

    <b-tabs
      v-model="tabIndex"
      active-nav-item-class="active-nav-item"
      active-tab-class="active-tab"
      @activate-tab="activateTabHandler">
      <b-tab
        v-for="player in playersOrdered"
        :key="player.name"
        :title="titleForPlayer(player)"
      >
        <WaitingChoice
          v-if="hasActionWaiting(player)"
          :actor="player"
        />
        <div v-else>
          No actions waiting for you right now.
        </div>
      </b-tab>
    </b-tabs>

    <b-modal
      id="view-player-options-modal"
      title="Really?"
      header-bg-variant="danger"
      header-text-variant="light"
      ok-variant="danger"
      ok-title="I'm Sure"
      @ok="viewRequestedPlayerOptions"
    >

      <p>Looking at another player's options is dangerous and can reveal secret information.</p>
      <p>Are you really sure you want to do that?</p>
    </b-modal>
  </div>
</template>


<script>
import WaitingChoice from './WaitingChoice'

export default {
  name: 'WaitingPanel',

  components: {
    WaitingChoice,
  },

  inject: ['game'],

  data() {
    return {
      tabIndex: 0,
      actorName: this.game.getViewerName(),

      // These two are used for the warning that shows when you try to view
      // another player's action options.
      allowViewingAnotherTab: false,
      requestedOptionsIndex: -1,
    }
  },

  computed: {
    playersOrdered() {
      if (this.game.state.initializationComplete) {
        return this.game.getPlayersStarting(this.game.getPlayerByName(this.actorName))
      }
      else {
        return []
      }
    }
  },

  methods: {
    activateTabHandler(next, prev, bvEvent) {
      if (
        this.playersOrdered[next].name !== this.actorName
        && !this.allowViewingAnotherTab
      ) {
        bvEvent.preventDefault()
        this.requestedOptionsIndex = next
        this.$bvModal.show('view-player-options-modal')
      }
      this.allowViewingAnotherTab = false
    },

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

    viewRequestedPlayerOptions() {
      this.allowViewingAnotherTab = true
      this.tabIndex = this.requestedOptionsIndex
      this.requestedOptionsIndex = -1
    },
  },
}
</script>


<style scoped>
.waiting-panel {
  background-color: white;
}

.waiting-panel >>> .active-nav-item {
  background-color: #eee;
  border-color: #ccc;
  border-bottom-color: #eee;
}

.active-tab {
  padding: .05rem .75rem;
  background-color: #eee;
  margin-left: -15px;
  margin-right: -15px;
}
</style>
