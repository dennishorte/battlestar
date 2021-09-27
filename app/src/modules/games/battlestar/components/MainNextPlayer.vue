<template>
  <div class="main-next-player">
    <b-button
      block
      :disabled="!commonCrisis"
      :variant="!!commonCrisis ? 'info' : ''"
      @click="cleanCrisis"
    >Clean Up Crisis Card</b-button>
    <b-button block variant="primary" @click="playerNext">Start Next Player's Turn</b-button>
  </div>
</template>


<script>
export default {
  name: 'MainNextPlayer',

  computed: {
    commonCrisis() {
      return this.$store.getters['bsg/commonCrisis']
    },
  },

  methods: {
    cleanCrisis() {
      this.$store.dispatch('bsg/cleanCommonCrisis')
    },

    playerNext() {
      this.$store.commit('bsg/playerAdvance')
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
