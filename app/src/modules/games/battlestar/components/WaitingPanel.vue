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
        <WaitingChoice v-if="!!$game.getWaiting(player.name)" :actor="player.name" />
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

  data() {
    return {
      allowViewingAnotherTab: false,
      requestedOptionsIndex: -1,
      tabIndex: 0,
    }
  },

  computed: {
    playersOrdered() {
      const players = [...this.$game.getPlayerAll()]
      while (players[0].name !== this.$game.getActor().name) {
        players.push(players.shift())
      }
      return players
    }
  },

  methods: {
    activateTabHandler(next, prev, bvEvent) {
      if (
        this.playersOrdered[next].name !== this.$game.getActor().name
        && !this.allowViewingAnotherTab
      ) {
        bvEvent.preventDefault()
        this.requestedOptionsIndex = next
        this.$bvModal.show('view-player-options-modal')
      }
      this.allowViewingAnotherTab = false
    },

    hasActionWaiting(player) {
      const skillCheckDiscussSpecialCase = (
        this.$game.getWaiting(player)
        && this.$game.getWaiting(player).actions[0].name === 'Skill Check - Discuss'
        && this.$game.getSkillCheck().flags[player.name].submitted.discussion
      )

      return (
        !!this.$game.getWaiting(player)
        && !skillCheckDiscussSpecialCase
      )
    },

    playerIsViewer(player) {
      return this.$game.getActor().name === player.name
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
