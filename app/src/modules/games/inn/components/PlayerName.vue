<template>
  <span class="player-name">{{ name }}</span>
</template>


<script>
export default {
  name: 'PlayerName',

  props: {
    name: {
      type: String,
      default: 'missing-name',
    }
  },
}
</script>

<style scoped>
</style>
