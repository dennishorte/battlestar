<template>
  <div class="player-counters">
    <PlayerCounter v-for="name in Object.keys(player.counters)"
                   :key="name"
                   :player="player"
                   :name="name" />
  </div>
</template>


<script>
import PlayerCounter from './PlayerCounter.vue'


export default {
  name: 'PlayerCounters',

  components: {
    PlayerCounter,
  },

  props: {
    player: {
      type: Object,
      default: () => ({})
    },
  },
}
</script>


<style scoped>
</style>
