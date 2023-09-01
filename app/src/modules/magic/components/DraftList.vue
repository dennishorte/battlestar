<template>
  <div class="draft-list">
    <h3>Drafts</h3>

    <table class="table table-light">
      <thead>
        <tr class="table-head">
          <th>game</th>
          <th>name</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="game in drafts" :key="game._id">
          <tr>
            <td>{{ gameKind(game) }}</td>
            <td>
              <router-link :to="gameLink(game._id)">
                {{ gameName(game) }}
              </router-link>
              <div class="opponent-names">
                vs. {{ opponentNames(game) }}
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

  </div>
</template>


<script>
export default {
  name: 'DraftList',

  data() {
    return {
      drafts: [],
    }
  },

  methods: {
    async fetchDrafts() {
      const { games } = await this.$post('/api/user/games', {
        userId: this.$store.state.auth.user._id,
        kind: 'CubeDraft',
        state: 'all',
        killed: false,
      })

      this.drafts = games
    },

    gameKind(data) {
      return data.settings ? data.settings.game : data.game
    },

    gameLink(gameId) {
      return `/game/${gameId}`
    },

    gameName(data) {
      return data.settings ? data.settings.name : data.name
    },

    opponentNames(data) {
      if (!data.settings) {
        return ''
      }
      else {
        return data
          .settings
          .players
          .filter(user => user.name !== this.$store.state.auth.user.name)
          .map(user => user.name)
          .sort()
          .join(', ')
      }
    },
  },

  created() {
    this.fetchDrafts()
  },
}
</script>


<style scoped>
.opponent-names {
  color: gray;
  font-size: .7em;
  font-weight: 200;
  margin-left: 1em;
  line-height: .7em;
}
</style>
