<template>
  <div class="my-games">
    <div class="section-heading">
      My Games
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
      </template>

      <template #cell(age)="row">
        {{ gameAge(row.item) }}
      </template>

    </b-table>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyLobbies',
  data() {
    return {
      fields: ['game', 'name', 'age'],
      games: [],
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
  },

  async mounted() {
    const fetchResult = await axios.post('/api/user/games', {
      userId: this.$store.state.auth.user._id,
    })

    this.games = fetchResult.data.games
  }
}
</script>
