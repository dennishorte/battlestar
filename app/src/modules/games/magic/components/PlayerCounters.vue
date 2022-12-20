<template>
  <div class="player-counters">
    <PlayerCounter v-for="name in Object.keys(player.counters)" :player="player" :name="name" />
  </div>
</template>


<script>
import PlayerCounter from './PlayerCounter'


export default {
  name: 'PlayerCounters',

  components: {
    PlayerCounter,
  },

  props: {
    player: Object,
  },
}
</script>


<style scoped>
</style>
