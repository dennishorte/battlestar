<template>
  <div class='user-list'>
    <h3>User List</h3>

    <table class="table table-sm">
      <thead>
        <tr class="table-light">
          <th>_id</th>
          <th>name</th>
          <th>slack</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users">
          <td>
            <span class="monospace">
              <span class="text-secondary">{{ user._id.substr(0, user._id.length-3) }}</span>{{ user._id.substr(-3, 3) }}
            </span>
          </td>
          <td>{{ user.name }}</td>
          <td>{{ user.slack }}</td>
          <td>
            <Dropdown :notitle="true">
              <DropdownItem><button @click="deactivate(user._id)">deactivate</button></DropdownItem>
              <DropdownItem><button @click="edit(user)">edit</button></DropdownItem>
            </Dropdown>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
import DropdownItem from '@/components/DropdownItem'

export default {
  name: 'UserList',

  components: {
    Dropdown,
    DropdownItem,
  },

  props: {
    users: Array,
  },

  data() {
    return {
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
      await this.$post('/api/user/deactivate', { id })
      this.$emit('users-updated')
    },

    edit(user) {
      alert('not implemented')
    },
  },
}
</script>

<style>
.monospace {
  font-family: monospace;
}
</style>
