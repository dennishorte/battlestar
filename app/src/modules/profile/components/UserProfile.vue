<template>
  <div class="profile">
    <GameHeader />

    <div class="container">
      <div class="row">
        <div class="col">
          <h2>Profile</h2>
        </div>
      </div>

      <!-- Notification Settings -->
      <form @submit.prevent="saveNotifications" autocomplete="off">
        <div class="row">
          <div class="col-6">
            <h3>Notification Settings</h3>

            <label class="form-label">Slack ID</label>
            <input class="form-control"
                   v-model="slack"
                   placeholder="Slack member ID"
                   autocomplete="one-time-code" />

            <label class="form-label mt-2">Telegram Chat ID</label>
            <input class="form-control"
                   v-model="telegram"
                   placeholder="Telegram chat ID"
                   autocomplete="one-time-code" />

            <button type="submit" class="btn btn-primary mt-3">save</button>
            <span v-if="notifMessage" class="ms-2" :class="notifSuccess ? 'text-success' : 'text-danger'">
              {{ notifMessage }}
            </span>
          </div>
        </div>
      </form>

      <!-- Change Password -->
      <form @submit.prevent="changePassword">
        <div class="row mt-4">
          <div class="col-6">
            <h3>Change Password</h3>

            <label class="form-label">Current Password</label>
            <input class="form-control"
                   type="password"
                   v-model="currentPassword"
                   autocomplete="one-time-code" />

            <label class="form-label mt-2">New Password</label>
            <input class="form-control"
                   type="password"
                   v-model="newPassword"
                   autocomplete="new-password" />

            <label class="form-label mt-2">Confirm New Password</label>
            <input class="form-control"
                   type="password"
                   v-model="confirmPassword"
                   autocomplete="new-password" />

            <button type="submit" class="btn btn-primary mt-3">change password</button>
            <span v-if="pwMessage" class="ms-2" :class="pwSuccess ? 'text-success' : 'text-danger'">
              {{ pwMessage }}
            </span>
          </div>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import GameHeader from '@/components/GameHeader.vue'

export default {
  name: 'UserProfile',

  components: {
    GameHeader,
  },

  data() {
    return {
      slack: '',
      telegram: '',
      notifMessage: '',
      notifSuccess: false,

      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      pwMessage: '',
      pwSuccess: false,
    }
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
  },

  mounted() {
    this.slack = this.user.slack || ''
    this.telegram = this.user.telegram || ''
  },

  methods: {
    async saveNotifications() {
      this.notifMessage = ''
      try {
        await this.$post('/api/user/update', {
          userId: this.user._id,
          name: this.user.name,
          slack: this.slack,
          telegram: this.telegram,
        })
        this.$store.commit('auth/updateUser', { slack: this.slack, telegram: this.telegram })
        this.notifMessage = 'Saved'
        this.notifSuccess = true
      }
      catch (err) {
        this.notifMessage = err.message || 'Error saving'
        this.notifSuccess = false
      }
    },

    async changePassword() {
      this.pwMessage = ''

      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        this.pwMessage = 'All fields are required'
        this.pwSuccess = false
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        this.pwMessage = 'New passwords do not match'
        this.pwSuccess = false
        return
      }

      try {
        await this.$post('/api/user/change-password', {
          userId: this.user._id,
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        })
        this.pwMessage = 'Password changed'
        this.pwSuccess = true
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
      }
      catch (err) {
        this.pwMessage = err.message || 'Error changing password'
        this.pwSuccess = false
      }
    },
  },
}
</script>

<style scoped>
.profile {
  padding-bottom: 2rem;
}
</style>
