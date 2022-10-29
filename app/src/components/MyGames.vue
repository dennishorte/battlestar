<template>
  <div class="my-games">
    <div class="section-heading">
      My Games
    </div>

    <div class="sub-heading">
      In Progress
    </div>
    <b-table
      :items="games"
      :fields="fields"
      :small="true"
      head-variant="light">

      <template #cell(game)="row">
        {{ gameKind(row.item) }}
      </template>

      <template #cell(name)="row">
        <router-link :to="gameLink(row.item._id)">
          {{ gameName(row.item) }}
        </router-link>
        <div class="opponent-names">
          vs. {{ opponentNames(row.item) }}
        </div>
      </template>

      <template #cell(age)="row">
        {{ gameAge(row.item) }}
      </template>

      <template #cell(waiting)="row">
        {{ waitingForViewer(row.item) ? '\u231B' : '' }}
      </template>

      <template #cell(menu)="row">
        <b-dropdown>
          <b-dropdown-item @click="kill(row.item._id)">kill</b-dropdown-item>
        </b-dropdown>
      </template>

    </b-table>

    <template v-if="this.finished.length > 0">
      <div class="sub-heading">
        Recently Finished
      </div>
      <b-table
        :items="finished"
        :fields="finishedFields"
        :small="true"
        head-variant="light">

        <template #cell(game)="row">
          {{ gameKind(row.item) }}
        </template>

        <template #cell(name)="row">
          <router-link :to="gameLink(row.item._id)">
            {{ gameName(row.item) }}
          </router-link>
          <div class="opponent-names">
            vs. {{ opponentNames(row.item) }}
          </div>
        </template>

        <template #cell(winner)="row">
          {{ row.item.stats.result.player.name || row.item.stats.result.player }}
        </template>

      </b-table>
    </template>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyLobbies',
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

      const millis = Date.now() - timestamp
      const years = Math.floor(millis / (365 * 24 * 60 * 60 * 1000))
      const days = Math.floor(millis /  (24 * 60 * 60 * 1000))
      if (years) return `${years} y ${days} d`
      if (days) return `${days} d`

      const hours = Math.floor(millis / (60 * 60 * 1000))
      if (hours) return `${hours} h`

      const minutes = Math.floor(millis / (60 * 1000))
      return `${minutes} m`
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
      await axios.post('/api/game/kill', { gameId })
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

    waitingForViewer(data) {
      return (data.waiting || []).includes(this.$store.state.auth.user.name)
    },

    async fetchActiveGames() {
      const fetchResult = await axios.post('/api/user/games', {
        userId: this.$store.state.auth.user._id,
      })

      this.games = fetchResult.data.games
    },

    async fetchRecentlyFinishedGames() {
      const fetchResult = await axios.post('/api/user/games_recently_finished', {
        userId: this.$store.state.auth.user._id,
      })

      console.log(fetchResult.data.games)
      this.finished = fetchResult.data.games
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
