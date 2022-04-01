<template>
  <b-dropdown :text="game.settings.name" class="game-menu" block>
    <b-dropdown-item @click="home">home</b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item @click="undo">undo</b-dropdown-item>
  </b-dropdown>
</template>


<script>
export default {
  name: 'GameMenu',

  inject: ['game'],

  methods: {
    home() {
      this.$router.push('/')
    },

    undo() {
      this.game.undo()
      this.game.run()
    }
  },
}
</script>


<style scoped>
.game-menu {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  position: sticky;
  top: 0;
  height: 3em;
  padding: 0 .25em;
  text-align: center;
}
</style>
