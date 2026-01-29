<template>
  <div class='admin'>
    <GameHeader />

    <div class="container">
      <ImpersonationStatus />

      <div class="row">
        <div class="col">
          <h2>Admin</h2>
        </div>
      </div>


      <div class="row">
        <div class="col-4">
          <CreateUser v-on:user-created="getAllUsers" />
        </div>

        <div class="col">
          <AdminActions :users="users" />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <UserList :users="users" v-on:users-updated="getAllUsers" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import GameHeader from '../../../../src/components/GameHeader'

import AdminActions from './AdminActions'
import CreateUser from './CreateUser'
import UserList from './UserList'
import ImpersonationStatus from './ImpersonationStatus'

export default {
  name: 'SiteAdmin',
  components: {
    GameHeader,

    AdminActions,
    CreateUser,
    UserList,
    ImpersonationStatus,
  },
  data() {
    return {
      lobbies: [],
      users: [],
    }
  },
  methods: {
    async getAllLobbies() {
      const { lobbies } = await this.$post('/api/lobby/all')
      this.lobbies = lobbies
    },

    async getAllUsers() {
      const { users } = await this.$post('/api/user/all')
      this.users = users.sort((a, b) => a.name.localeCompare(b.name))
    },
  },

  async mounted() {
    this.getAllLobbies()
    this.getAllUsers()

    // Check if we're currently impersonating someone
    try {
      await this.$store.dispatch('auth/checkImpersonationStatus')
    }
    catch (error) {
      console.error('Failed to check impersonation status:', error)
    }
  },
}
</script>
