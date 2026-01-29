<template>
  <div class="my-lobbies">
    <div class="section-heading">
      My Lobbies
    </div>

    <table class="table table-light">
      <thead>
        <tr class="table-head">
          <th>game</th>
          <th>name</th>
          <th>age</th>
          <th>menu</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="lobby in lobbies" :key="lobby._id">
          <tr>
            <td> {{ lobbyGame(lobby) }}</td>
            <td>
              <router-link :to="lobbyLink(lobby._id)">
                {{ lobby.name }}
              </router-link>
            </td>
            <td>{{ lobbyAge(lobby.createdTimestamp) }}</td>
            <td>
              <DropdownMenu :notitle="true">
                <DropdownItem @click="kill(lobby._id)">kill</DropdownItem>
              </DropdownMenu>
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
  data() {
    return {
      fields: ['name', 'age'],
      lobbies: [],
    }
  },

  components: {
    DropdownMenu,
    DropdownItem,
  },

  methods: {
    async kill(lobbyId) {
      await this.$post('/api/lobby/kill', { lobbyId })
      this.$router.go()
    },

    lobbyAge(timestamp) {
      const millis = Date.now() - timestamp
      const years = Math.floor(millis / (365 * 24 * 60 * 60 * 1000))
      const days = Math.floor(millis /  (24 * 60 * 60 * 1000))
      if (years) {
        return `${years} years ${days} days`
      }
      if (days) {
        return `${days} days`
      }

      const hours = Math.floor(millis / (60 * 60 * 1000))
      if (hours) {
        return `${hours} hours`
      }

      const minutes = Math.floor(millis / (60 * 1000))
      return `${minutes} minutes`
    },

    lobbyGame(lobby) {
      return lobby.game || '— not selected —'
    },

    lobbyLink(lobbyId) {
      return `/lobby/${lobbyId}`
    },
  },

  async mounted() {
    const { lobbies } = await this.$post('/api/user/lobbies', {
      userId: this.$store.state.auth.user._id,
    })
    this.lobbies = lobbies
  }
}
</script>
