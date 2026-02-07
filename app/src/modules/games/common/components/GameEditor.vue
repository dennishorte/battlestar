<template>
  <div class="game-editor">
    <h1>Game Editor</h1>

    <div class="top">
      <router-link :to="'/game/' + this.id">{{ this.id }}</router-link>
      <button @click="save" class="btn btn-danger">save</button>
    </div>

    <div v-if="status === 'success'" class="alert alert-success">{{ message }}</div>
    <div v-if="status === 'error'" class="alert alert-danger">{{ message }}</div>

    <textarea class="form-control" v-model="gameData" />

  </div>
</template>


<script>
export default {
  name: 'GameEditor',

  data() {
    return {
      id: this.$route.params.id,
      gameData: '',
      status: '',
      message: '',
    }
  },

  computed: {
  },

  methods: {
    async loadGame() {
      this.game = ''

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.gameData = JSON.stringify(game, null, 2)
    },

    async save() {
      this.status = ''
      this.message = ''

      try {
        const gameJson = JSON.parse(this.gameData)

        const payload = {
          gameId: gameJson._id,
          responses: gameJson.responses,
          chat: gameJson.chat,

          // Include these because Magic doesn't run on the backend when saving,
          // so can't calculate these values.
          waiting: gameJson.waiting,
          gameOver: gameJson.gameOver,
          gameOverData: gameJson.gameOverData,

          overwrite: true,
        }

        await this.$post('/api/game/save_full', payload)
        this.status = 'success'
        this.message = 'Game saved successfully'
      }
      catch (e) {
        this.status = 'error'
        this.message = e.response?.data?.message || e.message || 'Failed to save game'
        console.error(e)
      }
    },
  },

  mounted() {
    this.loadGame()
  },
}
</script>


<style scoped>
textarea {
  font-family: monospace;
  height: 700px;
}

.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
