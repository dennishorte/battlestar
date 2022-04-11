<template>
  <span class="player-name">{{ name }}</span>
</template>


<script>
export default {
  name: 'PlayerName',

  props: {
    name: String
  },
}
</script>

<style scoped>
</style>
