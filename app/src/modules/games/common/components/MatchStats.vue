<template>
  <div class="alert alert-info result-container" v-if="!!root && isDraftRoot">
    <div>
      <button class="btn btn-link" @click="goToGame(root.gameId)">{{ root.name }}</button>
    </div>

    <div v-if="!isMultiplayer">
      {{ resultString }}
    </div>
  </div>

  <div class="alert alert-info result-container" v-else-if="games.length && !isMultiplayer">
    <div>{{ resultString }}</div>
  </div>

  <div v-if="isMultiplayer && playerStandings.length" class="standings mb-3">
    <table class="table table-small align-middle mb-0">
      <thead>
        <tr class="table-secondary">
          <th>player</th>
          <th class="text-end">W</th>
          <th class="text-end">L</th>
          <th class="text-end">D</th>
          <th class="text-end">win %</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in playerStandings"
          :key="row.name"
          :class="{ 'table-primary': row.name === actor.name }"
        >
          <td>{{ row.name }}</td>
          <td class="text-end">{{ row.wins }}</td>
          <td class="text-end">{{ row.losses }}</td>
          <td class="text-end">{{ row.draws }}</td>
          <td class="text-end">{{ row.winRate }}</td>
        </tr>
      </tbody>
    </table>
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
        <tr v-for="g in games" :key="g.gameId" :class="rowClass(g)">
          <td>
            <button class="btn btn-link" data-bs-dismiss="modal" @click="goToGame(g.gameId)">
              {{ g.name }}
            </button>
          </td>
          <td>{{ gameWinner(g) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'MatchStats',

  inject: ['actor', 'game'],

  data() {
    return {
      root: null,
      games: [],
    }
  },

  computed: {
    isDraftRoot() {
      const gameType = this.root?.gameType
      return gameType === 'Cube Draft' || gameType === 'Set Draft' || gameType === 'CubeDraft'
    },

    playerNames() {
      return this.game.players.all().map(p => p.name)
    },

    isMultiplayer() {
      return this.playerNames.length >= 3
    },

    finishedGames() {
      return this.games.filter(g => g.gameOver)
    },

    resultString() {
      let wins = 0
      let losses = 0
      let draws = 0

      for (const g of this.finishedGames) {
        const winners = g.winners || []
        if (winners.length === 0) {
          draws += 1
        }
        else if (winners.includes(this.actor.name)) {
          wins += 1
        }
        else {
          losses += 1
        }
      }

      return draws > 0 ? `${wins} - ${losses} - ${draws}` : `${wins} - ${losses}`
    },

    playerStandings() {
      const totals = this.playerNames.map(name => ({
        name,
        wins: 0,
        losses: 0,
        draws: 0,
      }))

      for (const g of this.finishedGames) {
        const winners = g.winners || []
        if (winners.length === 0) {
          for (const row of totals) {
            row.draws += 1
          }
          continue
        }

        for (const row of totals) {
          if (winners.includes(row.name)) {
            row.wins += 1
          }
          else {
            row.losses += 1
          }
        }
      }

      const played = this.finishedGames.length
      return totals
        .map(row => ({
          ...row,
          winRate: played === 0 ? '—' : `${Math.round((row.wins / played) * 100)}%`,
        }))
        .sort((a, b) => {
          if (b.wins !== a.wins) {
            return b.wins - a.wins
          }
          if (a.losses !== b.losses) {
            return a.losses - b.losses
          }
          return a.name.localeCompare(b.name)
        })
    },
  },

  methods: {
    gameWinner(game) {
      if (!game.gameOver) {
        return 'IN PROGRESS'
      }
      const winners = game.winners || []
      if (winners.length === 0) {
        return 'Draw'
      }
      if (winners.length === 1) {
        return winners[0]
      }
      return `${winners.join(' & ')} (tied)`
    },

    goToGame(gameId) {
      this.$router.push('/game/' + gameId)
    },

    async loadData() {
      const { root, games } = await this.$post('/api/game/series', {
        gameId: this.game._id,
      })

      const players = this.playerNames.slice().sort()

      this.root = root
      this.games = (games || [])
        .filter(other => {
          const otherPlayers = (other.players || []).map(p => p.name).sort()
          return util.array.elementsEqual(otherPlayers, players)
        })
        .sort((l, r) => {
          if (l.seriesIndex != null && r.seriesIndex != null && l.seriesIndex !== r.seriesIndex) {
            return l.seriesIndex - r.seriesIndex
          }
          return (l.createdTimestamp || 0) - (r.createdTimestamp || 0)
        })

      this.patchCurrentGame()
    },

    // Series results may lag the live client state (e.g. concede before save).
    patchCurrentGame() {
      const current = this.games.find(g => String(g.gameId) === String(this.game._id))
      if (current && this.game.gameOver) {
        current.gameOver = true
        const data = this.game.gameOverData
        if (Array.isArray(data?.winners)) {
          current.winners = data.winners
        }
        else if (data?.player && data.player !== 'nobody' && data.player !== 'everyone') {
          current.winners = [data.player]
        }
        else {
          current.winners = []
        }
      }
    },

    rowClass(game) {
      if (!game.gameOver) {
        return ''
      }
      const winners = game.winners || []
      if (winners.length === 0) {
        return 'table-warning'
      }
      if (winners.includes(this.actor.name)) {
        return 'table-success'
      }
      return 'table-danger'
    }
  },

  watch: {
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

.standings {
  max-width: 100%;
}
</style>
