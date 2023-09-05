<template>
  <div class="match-results" v-if="!!game">
    <div class="heading">Match Results</div>
    <div>total games: {{ this.linkedGames.length }}</div>
    <div>
      <table class="table table-sm" :key="game._id">
        <thead>
          <tr>
            <td></td>
            <td v-for="player in game.settings.players">{{ player.name[0] }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.settings.players">
            <td>{{ player.name }}</td>
            <td v-for="player2 in game.settings.players">
              <template v-if="player === player2">x</template>
              <template v-else>
                {{ resultString(player, player2) }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  name: 'MatchResults',

  inject: ['game'],

  data() {
    return {
      linkedGames: [],
    }
  },

  methods: {
    async fetchLinkedGameResults() {
      const { games } = await this.$post('/api/magic/link/fetchByDraft', {
        draftId: this.game._id,
      })

      this.linkedGames = games
    },

    resultString(p1, p2) {
      const games = this
        .linkedGames
        .filter(game => {
          return (
            game.settings.players.some(p => p.name === p1.name)
            && game.settings.players.some(p => p.name === p2.name)
          )
        })

      const wins = (player) => {
        return games
          .filter(game => {
            return (
              game.gameOver
              && game.gameOverData
              && game.gameOverData.player === player.name
            )
          })
          .length
      }

      const p1wins = wins(p1)
      const p2wins = wins(p2)
      const other = games.length - p1wins - p2wins
      const otherString = other > 0 ? '*' : ''

      if (p1wins + p2wins + other > 0) {
        return `${p1wins}-${p2wins}${otherString}`
      }
      else {
        return ''
      }
    },
  },

  watch: {
    async game(newValue) {
      if (!newValue) {
        return
      }

      this.fetchLinkedGameResults()
    },
  },

  mounted() {
    this.fetchLinkedGameResults()
  },
}
</script>


<style scoped>
</style>
