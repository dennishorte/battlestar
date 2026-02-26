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

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'actions' }" @click="activeTab = 'actions'">Actions</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Users</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'games' }" @click="activeTab = 'games'">Games</a>
        </li>
      </ul>

      <div v-if="activeTab === 'actions'">
        <div class="row">
          <div class="col-4">
            <CreateUser v-on:user-created="getAllUsers" />
          </div>

          <div class="col">
            <AdminActions :users="users" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'users'">
        <div class="row">
          <div class="col">
            <UserList :users="users" v-on:users-updated="getAllUsers" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'games'">
        <div class="row">
          <div class="col">
            <GameSummary />
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import GameHeader from '../../../../src/components/GameHeader.vue'

import AdminActions from './AdminActions.vue'
import CreateUser from './CreateUser.vue'
import GameSummary from './GameSummary.vue'
import UserList from './UserList.vue'
import ImpersonationStatus from './ImpersonationStatus.vue'

export default {
  name: 'SiteAdmin',
  components: {
    GameHeader,

    AdminActions,
    CreateUser,
    GameSummary,
    UserList,
    ImpersonationStatus,
  },
  data() {
    return {
      activeTab: 'actions',
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
