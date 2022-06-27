<template>
  <b-dropdown :text="game.settings.name" class="game-menu" block>
    <b-dropdown-item @click="home">home</b-dropdown-item>
    <b-dropdown-item @click="next">next</b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item @click="undo">undo</b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item @click="debug">debug</b-dropdown-item>
  </b-dropdown>
</template>


<script>
import axios from 'axios'

export default {
  name: 'GameMenu',

  inject: ['game', 'actor'],

  methods: {
    debug() {
      this.$bvModal.show('debug-modal')
    },

    home() {
      this.$router.push('/')
    },

    async next() {
      const result = await axios.post('/api/user/next', {
        userId: this.actor._id,
        gameId: this.game._id,
      })

      if (result.data.status === 'success') {
        const gameId = result.data.gameId
        if (gameId) {
          this.$router.push(`/game/${gameId}`)
        }
        else {
          this.$router.push('/')
        }
      }

      else {
        console.log(result)
        this.$bvToast.toast('error: see console', {
          autoHideDelay: 999999,
          noCloseButton: false,
          solid: true,
          variant: 'danger',
        })
      }
    },

    undo() {
      this.game.undo()
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
