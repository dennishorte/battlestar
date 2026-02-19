<template>
  <div class="alert alert-info result-container" v-if="!!draft">
    <div>
      <button class="btn btn-link" @click="goToGame(draft)">{{ draft.settings.name }}</button>
    </div>

    <div>
      {{ resultString }}
    </div>
  </div>

  <div>
    <table class="table table-small align-middle">
      <thead>
        <tr class="table-secondary">
          <th>game name</th>
          <th>winner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game._id" :class="rowClass(game)">
          <td>
            <button class="btn btn-link" data-bs-dismiss="modal" @click="goToGame(game)">
              {{ game.settings.name }}
            </button>
          </td>
          <td>{{ gameWinner(game) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'MatchStatsModal',

  inject: ['actor', 'game'],

  data() {
    return {
      draft: null,
      games: [],
    }
  },

  computed: {
    resultString() {
      const wins = this
        .games
        .filter(g => g.gameOverData && g.gameOverData.player === this.actor.name)
        .length

      const losses = this
        .games
        .filter(g => g.gameOverData && g.gameOverData.player !== this.actor.name)
        .length

      return `${wins} - ${losses}`
    },
  },

  methods: {
    gameWinner(game) {
      if (game.gameOverData) {
        return game.gameOverData.player
      }
      else {
        return 'IN PROGRESS'
      }
    },

    goToGame(game) {
      this.$router.push('/game/' + game._id)
    },

    async loadData() {
      const draftId = this.game.settings.linkedDraftId

      if (draftId) {
        const { draft, games } = await this.$post('/api/magic/link/fetch_by_draft', {
          draftId,
        })

        const players = this.game.players.all().map(p => p.name).sort()

        this.draft = draft
        this.games = games
          .filter(other => {
            const otherPlayers = other.settings.players.map(p => p.name).sort()
            return util.array.elementsEqual(otherPlayers, players)
          })
          .sort((l, r) => l.settings.createdTimestamp - r.settings.createdTimestamp)

        this.patchCurrentGame()
      }
      else {
        console.log('no linked draft id')
      }
    },

    // The games array is fetched from the server, but the current game's result
    // may not be persisted yet (e.g., player concedes but hasn't clicked save).
    // The injected `game` object has the live client-side state including gameOver
    // and gameOverData, so we patch the server-fetched copy of the current game
    // to reflect the live state. This ensures the match stats update immediately
    // on concession or draw without waiting for a server round-trip.
    patchCurrentGame() {
      const current = this.games.find(g => g._id === this.game._id)
      if (current && this.game.gameOver) {
        current.gameOver = true
        current.gameOverData = this.game.gameOverData
      }
    },

    rowClass(game) {
      if (this.gameWinner(game) === this.actor.name) {
        return 'table-success'
      }
      else if (this.gameWinner(game) === 'IN PROGRESS') {
        return ''
      }
      else {
        return 'table-danger'
      }
    }
  },

  watch: {
    // Re-patch when the live game ends (e.g., concession happens while the
    // match stats modal is already open or the component is mounted).
    'game.gameOver'() {
      this.patchCurrentGame()
    },
  },

  mounted() {
    this.loadData()
  },
}
</script>


<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
