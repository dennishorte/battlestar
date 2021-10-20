<template>
  <div class="waiting-panel">
    <div v-for="action of waitingOptions" :key="action.name">
      <WaitingChoice :action="action" :actor="$game.getWaiting().actor" />
    </div>
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
    waitingOptions() {
      return this.$game.getWaiting().actions
    },
  },
}
</script>


<style scoped>
</style>
