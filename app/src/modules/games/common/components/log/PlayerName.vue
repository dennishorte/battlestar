<template>
  <div class="player-name" :class="classes" :style="styles">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'PlayerName',

  inject: ['game', 'funcs', 'ui'],

  props: {
    name: String,
  },

  computed: {
    classes() {
      if (this.funcs.playerClasses) {
        return this.funcs.playerClasses(this.player)
      }
    },

    styles() {
      if (this.funcs.playerStyles) {
        return this.funcs.playerStyles(this.player)
      }
    },

    player() {
      return this.game.getPlayerByName(this.name)
    },
  },
}
</script>


<style scoped>
</style>
