<template>
  <div class="game-editor">
    <h1>Game Editor</h1>

    <div class="top">
      <router-link :to="'/game/' + this.id">{{ this.id }}</router-link>
      <button @click="save" class="btn btn-danger">save</button>
    </div>

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
      const gameJson = JSON.parse(this.gameData)

      const payload = {
        gameId: gameJson._id,
        responses: gameJson.responses,

        // Include these because Magic doesn't run on the backend when saving,
        // so can't calculate these values.
        waiting: gameJson.waiting,
        gameOver: gameJson.gameOver,
        gameOverData: gameJson.gameOverData,

        overwrite: true,
      }

      const response = await this.$post('/api/game/saveFull', payload)
      console.log(response)
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
