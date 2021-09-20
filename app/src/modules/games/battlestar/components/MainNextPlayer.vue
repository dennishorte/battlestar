<template>
  <div class="main-next-player">
    <b-button block variant="primary" @click="playerNext">Start Next Player's Turn</b-button>
  </div>
</template>


<script>
export default {
  name: 'MainNextPlayer',

  methods: {
    playerNext() {
      this.$store.commit('bsg/playerNext')
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
