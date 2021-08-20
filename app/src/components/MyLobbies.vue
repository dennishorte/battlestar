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

    </b-table>

</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyLobbies',
  data() {
    return {
      fields: ['name'],
      lobbies: [],
    }
  },

  methods: {
    lobbyLink(lobbyId) {
      return `/lobby/${lobbyId}`
    }
  },

  async mounted() {
    const fetchResult = await axios.post('/api/user/lobbies', {
      userId: this.$store.state.auth.user._id,
    })

    this.lobbies = fetchResult.data.lobbies
  }
}
</script>
