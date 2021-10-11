<template>
  <div class="waiting-panel">
    <div v-for="action of waitingOptions" :key="action.name">
      {{ action.name }}
    </div>
  </div>
</template>


<script>
export default {
  name: 'WaitingPanel',

  components: {
  },

  data() {
    return {
    }
  },

  computed: {
    waitingOptions() {
      return this.$game.getWaiting().actions
    },
    waitingPlayer() {
      return this.$game.getPlayerWaitingFor()
    }
  },

  methods: {
  },

}
</script>


<style scoped>
</style>
