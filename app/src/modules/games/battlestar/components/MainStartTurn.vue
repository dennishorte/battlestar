<template>
  <div class="main-start-turn">
    <GameButton @click="advanceToNextPlayer" owner="next-player">
      Start {{ actor.name }}'s turn
    </GameButton>
  </div>
</template>


<script>
import GameButton from './GameButton'

export default {
  name: 'MainStartTurn',

  components: {
    GameButton,
  },

  computed: {
    actor() {
      return this.$store.getters['bsg/playerNext']
    },
  },

  methods: {
    advanceToNextPlayer() {
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
