<template>
  <div class="game-summary">
    <h3>Active Games by Version</h3>

    <table class="table table-sm" v-if="byVersion.length">
      <thead>
        <tr>
          <th>Game</th>
          <th>Version</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in byVersion" :key="index">
          <td>{{ row._id.game }}</td>
          <td>{{ row._id.version ?? '—' }}</td>
          <td>{{ row.count }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>Total</strong></td>
          <td><strong>{{ totalCount }}</strong></td>
        </tr>
      </tfoot>
    </table>

    <h3>Stale Games (no activity in 30+ days)</h3>

    <div v-if="!staleGames.length">None</div>

    <table class="table table-sm" v-if="staleGames.length">
      <thead>
        <tr>
          <th>Game</th>
          <th>Players</th>
          <th>Last Activity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in staleGames" :key="game._id">
          <td><router-link :to="`/game/${game._id}`">{{ game.settings.game }}</router-link></td>
          <td>{{ playerNames(game) }}</td>
          <td>{{ relativeTime(game.lastUpdated) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
export default {
  name: 'GameSummary',

  data() {
    return {
      byVersion: [],
      staleGames: [],
    }
  },

  computed: {
    totalCount() {
      return this.byVersion.reduce((sum, row) => sum + row.count, 0)
    },
  },

  methods: {
    playerNames(game) {
      return (game.settings.players || []).map(p => p.name).join(', ')
    },

    relativeTime(timestamp) {
      if (!timestamp) {
        return '—'
      }
      const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
      if (days === 0) {
        return 'today'
      }
      if (days === 1) {
        return '1 day ago'
      }
      return `${days} days ago`
    },
  },

  async mounted() {
    try {
      const result = await this.$post('/api/admin/game-summary', {})
      this.byVersion = result.byVersion
      this.staleGames = result.staleGames
    }
    catch (error) {
      console.error('Failed to load game summary:', error)
    }
  },
}
</script>
