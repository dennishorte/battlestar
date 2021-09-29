<template>
  <div class="main-prepare-for-jump description">
    <b-button
      :disabled="!commonCrisis['jump track?'] || crisisStep !== 'jump'"
      @click="advanceJump"
      block
      variant="primary">
      Advance the Jump Track
    </b-button>

    <b-button
      v-if="jumpTrack === 5"
      @click="autoJump"
      block
      variant="warning">
      Auto Jump
    </b-button>
  </div>
</template>


<script>
export default {
  name: 'MainPrepareForJump',

  computed: {
    commonCrisis() {
      return this.$store.getters['bsg/commonCrisis'] || {}
    },

    crisisStep() {
      return this.$store.getters['bsg/crisisStep']
    },

    jumpTrack() {
      return this.$store.getters['bsg/countersJumpTrack']
    },
  },

  methods: {
    advanceJump() {
      this.$store.commit('bsg/advanceJumpTrack')
    },

    autoJump() {
      this.$store.commit('bsg/jump')
    },
  },
}
</script>


<style scoped>
.description {
  color: #444;
  font-size: .7em;
}
</style
>
