<template>
  <div class="lobby-player-list">
    <div>
      <div class="float-end">
        <button
          class="btn btn-outline-success btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#add-players-modal"
        >
          +
        </button>
      </div>

      <div class="section-heading">
        Players
      </div>
    </div>

    <table class="table table-sm">
      <thead>
        <tr class="table-light">
          <th>name</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="player in players" :key="player._id">
          <td>{{ player.name }}</td>
          <td>
            <div class="dropdown d-flex justify-content-end">
              <button
                class="btn btn-secondary dropdown-toggle btn-sm"
                type="button"
                data-bs-toggle="dropdown">
              </button>

              <ul class="dropdown-menu">
                <li class="dropdown-item">
                  <button class="btn" @click="removePlayer(player._id)">remove</button>
                </li>
              </ul>

            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div id="add-players-modal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            Add Players
          </div>

          <div class="modal-body">

            <select
              id="add-players-input"
              v-model="selected"
              multiple
            >
              <option v-for="user in users" :value="user._id">{{ user.name }}</option>
            </select>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'LobbyPlayerList',
  props: {
    lobbyId: String,
    players: Array,
  },
  data() {
    return {
      playerFields: [
        { key: 'name' },
        { key: 'actions', label: '' },
      ],
      selected: [],
      users: [],
    }
  },
  methods: {
    async addPlayers() {
      const result = await axios.post('/api/lobby/player_add', {
        lobbyId: this.lobbyId,
        userIds: this.selected,
      })
      if (result.data.status == 'success') {
        this.$emit('users-updated')
      }
      else {
        alert('Error adding players: ' + result.data.message)
      }
    },

    async fetchUsers() {
      const userRequestResult = await axios.post('/api/user/all')
      this.users = userRequestResult
        .data
        .users
        .sort((left, right) => left.name.localeCompare(right.name))
    },

    async removePlayer(id) {
      const result = await axios.post('/api/lobby/player_remove', {
        lobbyId: this.lobbyId,
        userIds: [id],
      })
      if (result.data.status == 'success') {
        this.$emit('users-updated')
      }
      else {
        alert('Error adding players: ' + result.data.message)
      }
    },
  },
}
</script>
