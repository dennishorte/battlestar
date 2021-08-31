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

      <template #cell(name)="row">
        <router-link :to="gameLink(row.item._id)">
          {{ row.item.name }}
        </router-link>
      </template>

      <template #cell(age)="row">
        {{ gameAge(row.item.createdTimestamp) }}
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
      fields: ['name', 'age'],
      games: [],
    }
  },

  methods: {
    gameAge(timestamp) {
      const millis = Date.now() - timestamp
      const years = Math.floor(millis / (365 * 24 * 60 * 60 * 1000))
      const days = Math.floor(millis /  (24 * 60 * 60 * 1000))
      if (years) return `${years} years ${days} days`
      if (days) return `${days} days`

      const hours = Math.floor(millis / (60 * 60 * 1000))
      if (hours) return `${hours} hours`

      const minutes = Math.floor(millis / (60 * 1000))
      return `${minutes} minutes`
    },

    gameLink(gameId) {
      return `/game/${gameId}`
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
