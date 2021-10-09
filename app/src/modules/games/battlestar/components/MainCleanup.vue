<template>
  <div class="main-next-player">
    <b-button
      block
      :disabled="!activeCrisis"
      :variant="!!activeCrisis ? 'info' : ''"
      @click="cleanCrisis"
    >Clean Up Crisis Card</b-button>

    <div v-if="playersToDiscard.length > 0" class="description">
      These players need to discard down to 10 skill cards.
      <div v-for="player in playersToDiscard" :key="player.name">
        <b-button
          block
          variant="warning"
          @click="notify(player)"
        >
          Notify {{ player.name }} to discard
        </b-button>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  name: 'MainCleanup',

  computed: {
    activeCrisis() {
      return this.$game.getCardActiveCrisis()
    },

    playersToDiscard() {
      const output = []
      for (const player of this.$game.getPlayerAll()) {
        const hand = this.$game.getZoneByPlayer(player).cards
        const skillCards = hand.filter(c => c.kind === 'skill')
        if (skillCards.length > 10) {
          output.push(player)
        }
      }
      return output
    },
  },

  methods: {
    cleanCrisis() {
      console.log('cleanup crisis')
    },

    async notify(player) {
      console.log('notify player', player)
    },
  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style>
