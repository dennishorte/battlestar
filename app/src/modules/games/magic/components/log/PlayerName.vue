<template>
  <div class="player-name" :class="classes">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'PlayerName',

  inject: ['game'],

  props: {
    name: String,
  },

  computed: {
    classes() {
      const classes = []
      return classes
    },

    player() {
      return this.game.getPlayerByName(this.name)
    },
  },
}
</script>


<style scoped>
.player-name {
  display: inline-block;
  padding: 0 .4em;
  border-radius: .1em;
}
</style>
