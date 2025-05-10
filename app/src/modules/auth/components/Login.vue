<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 mrgnbtm">
        <h2>Login</h2>
        <form>
          <div class="row">
            <div class="form-group col-md-6">
              <label>Name</label>
              <input type="text"
                     class="form-control"
                     v-model="username"
                     name="name"
                     id="name"
                     placeholder="Name" />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label>Password</label>
              <input type="password"
                     class="form-control"
                     v-model="password"
                     name="password"
                     id="password"
                     placeholder="Password" />
            </div>
          </div>
          <button type="button" @click='login()' class="btn btn-danger">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      const payload = {
        username: this.username,
        password: this.password,
      }
      this.$store
        .dispatch('auth/login', payload)
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
    },
  }
}
</script>
