<template>
  <div class="player-name">
    PlayerName: {{ name }}
  </div>
</template>


<script>
export default {
  name: 'PlayerName',

  props: {
    name: String,
  },
}
</script>


<style scoped>
.player-name {
  display: inline-block;
}
</style>
