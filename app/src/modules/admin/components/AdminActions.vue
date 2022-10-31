<template>
  <div class="admin-actions">
    <h3>Admin Actions</h3>

    <div v-if="status == 'success'" class="alert alert-succes">{{ message }}</div>
    <div v-if="status == 'waiting'" class="alert alert-warning">{{ message }}</div>
    <div v-if="status == 'error'" class="alert alert-danger">{{ message }}</div>

    <button class="btn btn-secondary" @click="updateGameStats">Update Game Stats</button>
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
