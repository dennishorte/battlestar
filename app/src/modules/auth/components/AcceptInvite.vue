<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 mrgnbtm">
        <h2>Create Account</h2>

        <div v-if="loading">Validating invite…</div>

        <div v-else-if="!valid" class="alert alert-danger">
          {{ invalidMessage }}
        </div>

        <form v-else @submit.prevent="submit">
          <div class="row">
            <div class="form-group col-md-12">
              <label>Username</label>
              <input type="text"
                     class="form-control"
                     :value="username"
                     readonly />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label>Password</label>
              <input
                type="password"
                class="form-control"
                v-model="password"
                placeholder="At least 8 characters"
                autocomplete="new-password"
              />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label>Confirm password</label>
              <input
                type="password"
                class="form-control"
                v-model="confirmPassword"
                autocomplete="new-password"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary" :disabled="busy">
            Create account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AcceptInvite',

  data() {
    return {
      loading: true,
      valid: false,
      invalidMessage: '',
      username: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      busy: false,
    }
  },

  computed: {
    token() {
      return this.$route.params.token
    },
  },

  async mounted() {
    try {
      const resp = await this.$post('/api/guest/invite/validate', { token: this.token })
      if (resp.valid) {
        this.valid = true
        this.username = resp.username
      }
      else {
        this.invalidMessage = this.reasonMessage(resp.reason)
      }
    }
    catch (e) {
      console.error(e)
      this.invalidMessage = 'Unable to validate invite. Please try again later.'
    }
    finally {
      this.loading = false
    }
  },

  methods: {
    reasonMessage(reason) {
      if (reason === 'expired') {
        return 'This invite has expired.'
      }
      if (reason === 'used') {
        return 'This invite has already been used.'
      }
      return 'This invite is invalid.'
    },

    async submit() {
      this.errorMessage = ''

      if (this.password.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters.'
        return
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.'
        return
      }

      this.busy = true
      try {
        const resp = await this.$post('/api/guest/invite/accept', {
          token: this.token,
          password: this.password,
        })
        this.$store.commit('auth/auth_success', resp.user)
        this.$router.push('/')
      }
      catch (e) {
        this.errorMessage = e.response?.data?.message || 'Failed to create account.'
      }
      finally {
        this.busy = false
      }
    },
  },
}
</script>
