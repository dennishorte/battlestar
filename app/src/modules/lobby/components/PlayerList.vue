<template>
  <div class="lobby-player-list">
    <div>
      <div class="float-end">
        <BButton
          variant="outline-secondary"
          size="sm"
          v-b-modal.add-players-modal
        >
          +
        </BButton>
      </div>

      <div class="section-heading">
        Players
      </div>
    </div>

    <table class="table table-sm">
      <thead>
        <tr class="table-light">
          <th>name</th>
          <th/>
        </tr>
      </thead>

      <tbody>
        <tr v-for="player in lobby.users" :key="player._id">
          <td>{{ player.name }}</td>
          <td>
            <BDropdown size="sm" text="" class="float-end">
              <BDropdownItemButton @click="removePlayer(player._id)">remove</BDropdownItemButton>
            </BDropdown>
          </td>
        </tr>
      </tbody>
    </table>

    <BModal
      id="add-players-modal"
      title="Add Players"
      v-model="addPlayersModalState"
      @ok="addPlayers">

      <select
        id="add-players-input"
        class="form-select"
        size="15"
        v-model="selected"
        multiple
      >
        <option v-for="user in users" :key="user._id" :value="user._id">{{ user.name }}</option>
      </select>
    </BModal>

  </div>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'PlayerList',

  inject: ['lobby', 'save'],

  data() {
    return {
      selected: [],  // Users currently selected in the "add users" dialog
      users: [],  // All users, for the "add users" dialog
      addPlayersModalState: false,
    }
  },

  methods: {
    // Get a list of all users to populate the "add users" dialog.
    async fetchUsers() {
      const { users } = await this.$post('/api/user/all')
      this.users = users
        .sort((left, right) => left.name.localeCompare(right.name))
    },

    // Add all selected players in the "add users" dialog to the lobby.
    async addPlayers() {
      let userAdded = false

      for (const userId of Object.values(this.selected)) {
        const inLobby = this.lobby.users.find(u => u._id === userId)
        if (!inLobby) {
          const user = this.users.find(u => u._id === userId)
          this.lobby.users.push({
            _id: user._id,
            name: user.name,
          })
          userAdded = true
        }
      }

      if (userAdded) {
        await this.save()
      }
    },

    // Remove the specified player from the lobby.
    async removePlayer(id) {
      const user = this.lobby.users.find(u => u._id === id)
      if (user) {
        util.array.remove(this.lobby.users, user)
        this.save()
      }
    },
  },

  mounted() {
    this.fetchUsers()
  },
}
</script>
