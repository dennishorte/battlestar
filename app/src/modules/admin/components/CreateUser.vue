<template>
<div class='create-user'>
  <h3>Create User</h3>

  <div v-if="status == 'success'" class="alert alert-succes">{{ message }}</div>
  <div v-if="status == 'submitting'" class="alert alert-warning">{{ message }}</div>
  <div v-if="status == 'error'" class="alert alert-danger">{{ message }}</div>

  <input class="form-control" v-model="name" placeholder="name" />
  <input class="form-control" v-model="password" placeholder="password" />
  <input class="form-control" v-model="slack" placeholder="slack" />

  <button @click="submit" class="btn btn-primary">create</button>
  <button @click="reset" class="btn btn-warning">reset</button>

</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateUser',
  data() {
    return {
      status: '',
      message: '',

      name: '',
      password: '',
      slack: '',
    }
  },
  methods: {
    async submit(event) {
      event.preventDefault()
      this.status = 'submitting'
      this.message = 'submitting'

      const result = await axios.post('/api/user/create', {
        name: this.name,
        password: this.password,
        slack: this.slack,
      })
      console.log(result)

      this.status = result.data.status
      this.message = result.data.message

      if (this.status === 'success') {
        this.$emit('user-created')
      }
    },

    reset(event) {
      event.preventDefault()
      this.status = ''
      this.message = ''
      this.name = ''
      this.password = ''
      this.slack = ''
    },
  }
}
</script>

<style scoped>
input {
  margin-bottom: 2px;
}
</style>
