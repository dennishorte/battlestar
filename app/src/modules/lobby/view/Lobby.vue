<template>
<div class='lobby'>
  <Header />

  <div class="container">
    <div class="row">
      <div class="col">
        <h2><span class="text-secondary">Lobby - </span>{{ this.lobby.name }}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col-6">
        <h3>Settings</h3>
      </div>

      <div class="col-6">
        <div>
          <div style="float: right;">
            <b-button
              size="sm"
              variant="outline-success"
              v-b-modal.add-players-modal>
              +
            </b-button>

            <b-modal
              id="add-players-modal"
              @show="fetchUsersForAddPlayers"
              @ok="addPlayers">

              <template #modal-title="">
                Add Players
              </template>

              <b-form>

                <b-form-select
                  id="add-players-input"
                  v-model="addPlayersForm.data.users"
                  :options="addPlayersForm.userOptions"
                  multiple
                  required>
                </b-form-select>

              </b-form>
            </b-modal>
          </div>
          <h3>Players</h3>
        </div>

        <b-table
          :items="players"
          :fields="playerFields"
          :small="true"
          head-variant="light">

          <template #cell(actions)="row">
            <div class="text-right">
              <b-dropdown size="sm" right>
                <b-dropdown-item-button @click="removePlayer(row.item._id)">
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

      addPlayersForm: {
        userOptions: [],
        data: {
          users: [],
        },
      },

      players: [],
      playerFields: [
        { key: 'name' },
        { key: 'actions', label: '' },
      ],

      lobby: {},
    }
  },
  methods: {
    async addPlayers() {
      const result = await axios.post('/api/lobby/player_add', {
        lobbyId: this.id,
        userIds: this.addPlayersForm.data.users,
      })
      if (result.data.status == 'success') {
        this.getLobbyInfo()
      }
      else {
        alert('Error adding players: ' + result.data.message)
      }
    },

    async fetchUsersForAddPlayers() {
      const userRequestResult = await axios.post('/api/user/all')
      const formattedUsers = userRequestResult.data.users.map(user => ({
        value: user._id,
        text: user.name
      }))
      formattedUsers.sort((left, right) => left.text.localeCompare(right.text))
      this.addPlayersForm.userOptions = formattedUsers
    },

    async getLobbyInfo() {
      const infoRequestResult = await axios.post('/api/lobby/info', {
        id: this.id,
      })

      if (infoRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = infoRequestResult.message
      }
      else {
        this.lobby = infoRequestResult.data.lobby

        await this.getPlayerInfo()
      }
    },

    async getPlayerInfo() {
      const playerRequestResult = await axios.post('/api/user/fetch_many', {
        userIds: this.lobby.userIds
      })

      if (playerRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = playerRequestResult.message
      }
      else {
        this.players = playerRequestResult.data.users
      }
    },

    async removePlayer(id) {
      const result = await axios.post('/api/lobby/player_remove', {
        lobbyId: this.id,
        userIds: [id],
      })
      if (result.data.status == 'success') {
        this.getLobbyInfo()
      }
      else {
        alert('Error adding players: ' + result.data.message)
      }
    }

  },

  mounted() {
    this.getLobbyInfo()
  },
}
</script>
