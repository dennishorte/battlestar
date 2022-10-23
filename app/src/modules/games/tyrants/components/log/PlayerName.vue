<template>
  <div class="player-name" :class="classes">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'PlayerName',

  inject: ['game', 'ui'],

  props: {
    name: String,
  },

  computed: {
    classes() {
      const classes = []

      const color = this.ui.fn.getPlayerColor(this.game, this.player)
      classes.push(`${color}-element`)

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
