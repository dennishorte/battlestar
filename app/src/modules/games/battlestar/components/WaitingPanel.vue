<template>
  <div class="waiting-panel">

    <b-tabs content-class="mt-3">
      <b-tab
        v-for="player in $game.getPlayerAll()"
        :key="player.name"
        :title="player.name"
        :disabled="!$game.getWaiting(player.name)"
      >
        <WaitingChoice v-if="!!$game.getWaiting(player.name)" :actor="player.name" />
      </b-tab>
    </b-tabs>
  </div>
</template>


<script>
import WaitingChoice from './WaitingChoice'

export default {
  name: 'WaitingPanel',

  components: {
    WaitingChoice,
  },

  computed: {
  },
}
</script>


<style scoped>
</style>
