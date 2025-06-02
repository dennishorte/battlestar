<template>
  <div class="player-name" :class="classes" :style="styles">
    {{ name }}
  </div>
</template>


<script>
export default {
  name: 'PlayerName',

  inject: ['game', 'funcs'],

  props: {
    name: {
      type: String,
      default: 'missing-name',
    },
  },

  computed: {
    classes() {
      return this.funcs.playerClasses ? this.funcs.playerClasses(this.player) : []
    },

    styles() {
      return this.funcs.playerStyles ? this.funcs.playerStyles(this.player) : []
    },

    player() {
      return this.game.players.byName(this.name)
    },
  },
}
</script>


<style scoped>
.player-name {
  display: inline-block;
}
</style>
