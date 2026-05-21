<template>
  <div class="match-results" v-if="!!game">
    <div class="heading">Match Results</div>
    <div>total games: {{ this.linkedGames.length }}</div>
    <div>
      <table class="table table-sm" :key="game._id">
        <thead>
          <tr>
            <td/>
            <td v-for="player in game.settings.players" :key="player.name">{{ player.name[0] }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.settings.players" :key="player.name">
            <td>{{ player.name }}</td>
            <td v-for="player2 in game.settings.players" :key="player2.name">
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
      const { games } = await this.$post('/api/magic/link/fetch_by_draft', {
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

      const winnersOf = (game) => {
        const data = game.gameOverData
        if (!data) {
          return []
        }
        if (Array.isArray(data.winners)) {
          return data.winners
        }
        if (!data.player || data.player === 'nobody' || data.player === 'everyone') {
          return []
        }
        return [data.player]
      }

      let p1wins = 0
      let p2wins = 0
      let draws = 0
      for (const game of games) {
        if (!game.gameOver) {
          continue
        }
        const winners = winnersOf(game)
        if (winners.length === 0) {
          draws += 1
        }
        else {
          if (winners.includes(p1.name)) {
            p1wins += 1
          }
          if (winners.includes(p2.name)) {
            p2wins += 1
          }
        }
      }
      const drawString = draws > 0 ? `-${draws}` : ''

      if (p1wins + p2wins + draws > 0) {
        return `${p1wins}-${p2wins}${drawString}`
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
