<template>
<div class='lobby'>
  <Header />

  <div class="container">
    <div class="row">
      <div class="col">
        <h2>Lobby - {{ this.name }}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col-6">
        <h3>Settings</h3>
      </div>

      <div class="col-6">
        <h3>Players</h3>
        <b-table
          :items="users"
          :fields="userFields"
          :small="true"
          head-variant="light">

          <template #cell(actions)="row">
            <div class="text-right">
              <b-dropdown size="sm" right>
                <b-dropdown-item-button @click="removeUser(row.item._id)">
                  remove
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
          </template>

        </b-table>
      </div>
    </div>

  </div>

</div>
</template>

<script>
import axios from 'axios'

import Header from '../../../../src/components/Header'

export default {
  name: 'Lobby',
  components: {
    Header,

  },
  data() {
    return {
      id: this.$route.params.id,
      error: false,
      errorMessage: '',
      name: '',
      settings: {},

      users: [],
      userFields: [
        { key: 'name' },
        { key: 'actions', label: '' },
      ],

      lobby: {},
    }
  },
  methods: {
    async getLobbyInfo() {
      const infoRequestResult = await axios.post('/api/lobby/info', {
        id: this.id,
      })

      console.log('getLobbyInfo: ', infoRequestResult)

      if (infoRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = infoRequestResult.message
      }
      else {
        this.lobby = infoRequestResult.data.lobby

        this.name = this.lobby.name
        this.settings = this.lobby.settings

        await this.getUserInfo()
      }
    },

    async getUserInfo() {
      const userRequestResult = await axios.post('/api/user/fetch_many', {
        userIds: this.lobby.userIds
      })

      console.log('getUserInfo: ', userRequestResult)

      if (userRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = userRequestResult.message
      }
      else {
        this.users = userRequestResult.data.users
      }
    },

    async removeUser(id) {
      alert('not implemented', id)
    }

  },

  mounted() {
    this.getLobbyInfo()
  },
}
</script>
