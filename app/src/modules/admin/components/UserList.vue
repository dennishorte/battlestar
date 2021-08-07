<template>
<div class='user-list'>
  <h3>User List</h3>

  <b-table
    :items="users"
    :fields="fields">

    <template #cell(_id)="row">
      <span class="monospace">
        <span class="text-secondary">{{ row.value.substr(0, row.value.length-3) }}</span>{{ row.value.substr(-3, 3) }}
      </span>
    </template>

    <template #cell(actions)="row">
      <b-dropdown right>
        <b-dropdown-item-button @click="deactivate(row.item._id)">
          deactivate
        </b-dropdown-item-button>
      </b-dropdown>
    </template>

  </b-table>

</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserList',
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
      const result = await axios.post('/api/user/deactivate', { id })
      if (result.data.status === 'success') {
        this.$emit('users-updated')
      }
      else {
        console.log('error deactivating user: ', result)
        alert("Error. See console for details.")
      }
    }
  },
}
</script>

<style>
.monospace {
    font-family: monospace;
}
</style>
