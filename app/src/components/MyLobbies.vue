<template>
<div class="my-lobbies">
  <div class="section-heading">
    My Lobbies
  </div>

    <b-table
      :items="lobbies"
      :fields="fields"
      :small="true"
      head-variant="light">

      <template #cell(name)="row">
        <router-link :to="lobbyLink(row.item._id)">
          {{ row.item.name }}
        </router-link>
      </template>

      <template #cell(age)="row">
        {{ lobbyAge(row.item.createdTimestamp) }}
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
      lobbies: [],
    }
  },

  methods: {
    lobbyAge(timestamp) {
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

    lobbyLink(lobbyId) {
      return `/lobby/${lobbyId}`
    },
  },

  async mounted() {
    const fetchResult = await axios.post('/api/user/lobbies', {
      userId: this.$store.state.auth.user._id,
    })

    this.lobbies = fetchResult.data.lobbies
  }
}
</script>
