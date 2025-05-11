<template>
  <div class="admin-actions">
    <h3>Admin Actions</h3>

    <div v-if="status == 'success'" class="alert alert-success">{{ message }}</div>
    <div v-if="status == 'waiting'" class="alert alert-warning">{{ message }}</div>
    <div v-if="status == 'error'" class="alert alert-danger">{{ message }}</div>

    <div class="buttons">
      <button class="btn btn-secondary" @click="updateScryfall">Update Scryfall Data</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'AdminActions',

  data() {
    return {
      status: 'idle',
      message: '',
    }
  },

  methods: {
    async updateScryfall() {
      this.status = 'waiting'
      this.message = 'Updating Scryfall data.\nThis can take a minute or two.'

      try {
        await this.$post('/api/magic/scryfall/update', {})
        this.message = 'Scryfall data updated'
        this.status = 'success'
      }
      catch (e) {
        this.status = 'error'
        this.message = 'Check console for details'
        throw e
      }
    },
  },
}
</script>


<style scoped>
</style>
