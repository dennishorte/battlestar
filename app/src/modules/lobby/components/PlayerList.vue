<template>
<div class="lobby-player-list">
  <div>
    <div style="float: right;">
      <b-button
        size="sm"
        variant="outline-success"
        v-b-modal.add-players-modal>
        +
      </b-button>
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

  <b-modal
    id="add-players-modal"
    @show="fetchUsers"
    @ok="addPlayers">

    <template #modal-title="">
      Add Players
    </template>

    <b-form>

      <b-form-select
        id="add-players-input"
        v-model="selected"
        :options="userOptions"
        multiple
        required>
      </b-form-select>

    </b-form>
  </b-modal>

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
      userOptions: [],
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
      const formattedUsers = userRequestResult.data.users.map(user => ({
        value: user._id,
        text: user.name
      }))
      formattedUsers.sort((left, right) => left.text.localeCompare(right.text))
      this.userOptions = formattedUsers
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
