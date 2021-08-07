<template>
<div class='create-user'>
  <h3>Create User</h3>

  <b-alert v-if="status == 'success'" variant="success" show>{{ message }}</b-alert>
  <b-alert v-if="status == 'submitting'" variant="warning" show>{{ message }}</b-alert>
  <b-alert v-if="status == 'error'" variant="danger" show>{{ message }}</b-alert>

  <b-form @submit="submit" @reset="reset">
    <b-form-group>
      <b-form-input v-model="name" placeholder="name" />
    </b-form-group>

    <b-form-group>
      <b-form-input v-model="password" placeholder="password" />
    </b-form-group>

    <b-form-group>
      <b-form-input v-model="slack" placeholder="slack" />
    </b-form-group>

    <b-button type="submit" variant="primary">create</b-button>
    <b-button type="reset" variant="warning">reset</b-button>
  </b-form>

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
