<template>
  <div class="main-prepare-for-jump description">
    <b-button
      :disabled="!activeCrisis['jump track?'] || crisisStep !== 'jump'"
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
    activeCrisis() {
      return this.$game.getCardActiveCrisis()
    },

    crisisStep() {
      return ''
    },

    jumpTrack() {
      return this.$game.getCounter('jumpTrack')
    },
  },

  methods: {
    advanceJump() {
      this.$game.mCounter('jumpTrack', 1)
    },

    autoJump() {
      console.log('auto jump')
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
