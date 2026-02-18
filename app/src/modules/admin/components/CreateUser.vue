<template>
  <div class='create-user'>
    <h3>Create User</h3>

    <input class="form-control" v-model="name" placeholder="name" />
    <input class="form-control" v-model="password" placeholder="password" />
    <input class="form-control" v-model="slack" placeholder="slack" />
    <input class="form-control" v-model="telegram" placeholder="telegram" />

    <button @click="submit" class="btn btn-primary">create</button>
    <button @click="reset" class="btn btn-warning">reset</button>

  </div>
</template>

<script>
export default {
  name: 'CreateUser',
  emits: ['user-created'],
  data() {
    return {
      status: '',
      message: '',

      name: '',
      password: '',
      slack: '',
      telegram: '',
    }
  },
  methods: {
    async submit(event) {
      event.preventDefault()

      await this.$post('/api/user/create', {
        name: this.name,
        password: this.password,
        slack: this.slack,
        telegram: this.telegram,
      })

      this.$emit('user-created')
    },

    reset(event) {
      event.preventDefault()
      this.status = ''
      this.message = ''
      this.name = ''
      this.password = ''
      this.slack = ''
      this.telegram = ''
    },
  }
}
</script>

<style scoped>
input {
  margin-bottom: 2px;
}
</style>
