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
      }
      else {
        console.log('no linked draft id')
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
