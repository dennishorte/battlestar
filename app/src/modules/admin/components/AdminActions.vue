<template>
  <div class="admin-actions">
    <h3>Admin Actions</h3>

    <div v-if="status == 'success'" class="alert alert-success">{{ message }}</div>
    <div v-if="status == 'waiting'" class="alert alert-warning">{{ message }}</div>
    <div v-if="status == 'error'" class="alert alert-danger">{{ message }}</div>

    <div class="buttons">
      <button class="btn btn-secondary" @click="updateGameStats">Update Game Stats</button>
      <button class="btn btn-secondary" @click="updateScryfall">Update Scryfall Data</button>
    </div>
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

    async updateScryfall() {
      this.status = 'waiting'
      this.message = 'Updating Scryfall data.\nThis can take a minute or two.'
      const result = await axios.post('/api/scryfall/update', {})
      this.status = result.data.status
      this.message = result.data.message
      console.log(result)
    },
  },
}
</script>


<style scoped>
</style>
