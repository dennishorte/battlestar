<template>
  <div class='user-list'>
    <h3>User List</h3>

    <b-table
      :items="users"
      :fields="fields"
      :small="true"
      head-variant="light">

      <template #cell(_id)="row">
        <span class="monospace">
          <span class="text-secondary">{{ row.value.substr(0, row.value.length-3) }}</span>{{ row.value.substr(-3, 3) }}
        </span>
      </template>

      <template #cell(actions)="row">
        <div class="text-right">
          <b-dropdown right>
            <b-dropdown-item @click="deactivate(row.item._id)">
              deactivate
            </b-dropdown-item>

            <b-dropdown-item @click="edit(row.item)">
              edit
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>

    </b-table>


    <b-modal
      id="user-update-modal"
      title="Edit User"
      cancel-only>

      <EditUser :user="editingUser" @user-updated="$emit('users-updated')" />
    </b-modal>

  </div>
</template>

<script>
import axios from 'axios'

import EditUser from './EditUser'

export default {
  name: 'UserList',

  components: {
    EditUser,
  },

  props: {
    users: Array,
  },

  data() {
    return {
      editingUser: {},

      fields: [
        { key: '_id', label: 'ID', sortable: true },
        { key: 'name', sortable: true },
        { key: 'slack', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
    }
  },

  methods: {
    async deactivate(id) {
      const result = await axios.post('/api/user/deactivate', { id })
      if (result.data.status === 'success') {
        this.$emit('users-updated')
      }
      else {
        console.log('error deactivating user: ', result)
        alert("Error. See console for details.")
      }
    },

    edit(user) {
      this.editingUser = user
      this.$bvModal.show('user-update-modal')
    },
  },
}
</script>

<style>
.monospace {
  font-family: monospace;
}
</style>
