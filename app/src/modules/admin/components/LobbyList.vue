<template>
<div class='user-list'>
  <h3>Lobby List</h3>

  <b-table
    :items="lobbies"
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
          <b-dropdown-item-button @click="deactivate(row.item._id)">
            deactivate
          </b-dropdown-item-button>

          <b-dropdown-item-button @click="visit(row.item._id)">
            visit
          </b-dropdown-item-button>
        </b-dropdown>
      </div>
    </template>

  </b-table>

</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LobbyList',
  props: {
    lobbies: Array,
  },
  data() {
    return {
      fields: [
        { key: '_id', label: 'ID', sortable: true },
        { key: 'name', sortable: true },
        { key: 'status', sortable: true },
        { key: 'users', sortable: false },
        { key: 'actions', label: 'Actions' },
      ],
    }
  },
  methods: {
    async deactivate(id) {
      const result = await axios.post('/api/lobby/deactivate', { id })
      if (result.data.status === 'success') {
        this.$emit('lobbies-updated')
      }
      else {
        console.log('error deactivating lobby: ', result)
        alert("Error. See console for details.")
      }
    },

    visit(id) {
      this.$router.push(`/lobby/${id}`)
    },
  },
}
</script>

<style>
.monospace {
    font-family: monospace;
}
</style>
