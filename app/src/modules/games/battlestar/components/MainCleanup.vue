<template>
  <div class="main-next-player">
    <b-button
      block
      :disabled="!commonCrisis"
      :variant="!!commonCrisis ? 'info' : ''"
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
    commonCrisis() {
      return this.$store.getters['bsg/commonCrisis']
    },

    playersToDiscard() {
      const output = []
      for (const player of this.$store.getters['bsg/players']) {
        const hand = this.$store.getters['bsg/zone'](`players.${player.name}`).cards
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
      this.$store.commit('bsg/crisisCleanup')
    },

    async notify(player) {
      await this.$store.dispatch('bsg/notify', player._id)
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
