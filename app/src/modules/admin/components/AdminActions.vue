<template>
  <div class="admin-actions">
    <h3>Admin Actions</h3>

    <b-alert v-if="status == 'success'" variant="success" show>{{ message }}</b-alert>
    <b-alert v-if="status == 'waiting'" variant="warning" show>{{ message }}</b-alert>
    <b-alert v-if="status == 'error'" variant="danger" show>{{ message }}</b-alert>

    <b-button @click="updateGameStats">Update Game Stats</b-button>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'AdminActions',

  data() {
    return {
      status: 'idle',
      message: '',
    }
  },

  methods: {
    async updateGameStats() {
      this.status = 'waiting'
      this.message = 'Updating game stats.\nThis can take a minute or two.'
      const result = await axios.post('/api/game/updateStats', {})
      this.status = result.data.status
      this.message = result.data.message
      console.log(result)
    },
  },
}
</script>
