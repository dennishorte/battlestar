<template>
  <div class="my-games">
    <div class="section-heading">
      My Games
    </div>

    <div class="sub-heading">
      In Progress
    </div>

    <table class="table table-light">
      <thead>
        <tr class="table-head">
          <th>game</th>
          <th>name</th>
          <th>age</th>
          <th>waiting</th>
          <th>menu</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="game in games" :key="game._id">
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
            <td>{{ gameAge(game) }}</td>
            <td>{{ waitingForViewer(game) ? '\u231B' : '' }}</td>
            <td>
              <DropdownMenu :notitle="true">
                <DropdownItem @click="kill(game._id)">kill</DropdownItem>
              </DropdownMenu>
            </td>
          </tr>
        </template>
      </tbody>
    </table>


    <div class="sub-heading">
      Recently Finished
    </div>

    <table class="table table-light">
      <thead>
        <tr class="">
          <th>game</th>
          <th>name</th>
          <th>completed</th>
          <th>winner</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="game in finished" :key="game._id">
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
            <td>{{ gameFinishedAge(game) }}</td>
            <td>
              <span v-if="game.stats">{{ winnerName(game) }}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu.vue'
import DropdownItem from '@/components/DropdownItem.vue'


export default {
  name: 'MyLobbies',

  components: {
    DropdownMenu,
    DropdownItem,
  },

  data() {
    return {
      fields: ['game', 'name', 'age', 'waiting', 'menu'],
      games: [],

      finishedFields: ['game', 'name', 'winner'],
      finished: [],
    }
  },

  methods: {
    gameAge(data) {
      const timestamp = data.settings ? data.settings.createdTimestamp : data.createdTimestamp
      return this.timestampToString(timestamp)
    },

    gameFinishedAge(data) {
      return this.timestampToString(data.lastUpdated)
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

    async kill(gameId) {
      await this.$post('/api/game/kill', { gameId })
      this.$router.go()
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

    timestampToString(timestamp) {
      const millis = Date.now() - timestamp
      const years = Math.floor(millis / (365 * 24 * 60 * 60 * 1000))
      const days = Math.floor(millis /  (24 * 60 * 60 * 1000))
      if (years) {
        return `${years} y ${days} d`
      }
      if (days) {
        return `${days} d`
      }

      const hours = Math.floor(millis / (60 * 60 * 1000))
      if (hours) {
        return `${hours} h`
      }

      const minutes = Math.floor(millis / (60 * 1000))
      return `${minutes} m`
    },

    waitingForViewer(data) {
      return (data.waiting || []).includes(this.$store.state.auth.user.name)
    },

    winnerName(game) {
      if (game.stats.result) {
        return game.stats.result.player.name || game.stats.result.player
      }
      else {
        'result missing'
      }
    },

    async fetchActiveGames() {
      const { games } = await this.$post('/api/user/games', {
        userId: this.$store.state.auth.user._id,
      })
      this.games = games
    },

    async fetchRecentlyFinishedGames() {
      const { games } = await this.$post('/api/user/games_recently_finished', {
        userId: this.$store.state.auth.user._id,
      })

      this.finished = games
        .sort((l, r) => r.lastUpdated - l.lastUpdated)
    },
  },

  mounted() {
    this.fetchActiveGames()
    this.fetchRecentlyFinishedGames()
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
