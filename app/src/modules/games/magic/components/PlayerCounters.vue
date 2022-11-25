<template>
  <div class="player-counters">
    <div v-for="[name, count] in Object.entries(player.counters)">
      {{ name }}: {{ count }}
    </div>
  </div>
</template>


<script>
export default {
  name: 'TableauZone',

  props: {
    player: Object,
  },
}
</script>


<style scoped>
</style>
