<template>
  <div class="invite-links">
    <h3>Invite Links</h3>

    <div class="form-row">
      <input
        class="form-control"
        v-model="username"
        placeholder="username"
        @keyup.enter="generate"
      />
      <button class="btn btn-primary" :disabled="!username.trim() || busy" @click="generate">
        Generate
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>

    <div v-if="invites.length > 0" class="invite-list mt-3">
      <div v-for="invite in invites" :key="invite.token" class="invite-row">
        <div class="invite-info">
          <strong>{{ invite.username }}</strong>
          <span class="expires">expires {{ formatExpiry(invite.expiresAt) }}</span>
        </div>
        <div class="invite-url-row">
          <input class="form-control invite-url" readonly :value="urlFor(invite.token)" />
          <button class="btn btn-outline-secondary" @click="copy(invite.token)">
            {{ copiedToken === invite.token ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InviteLinks',

  data() {
    return {
      username: '',
      invites: [],
      busy: false,
      errorMessage: '',
      copiedToken: '',
    }
  },

  async mounted() {
    await this.refresh()
  },

  methods: {
    urlFor(token) {
      return `${window.location.origin}/invite/${token}`
    },

    formatExpiry(ts) {
      return new Date(ts).toLocaleString()
    },

    async refresh() {
      try {
        const { invites } = await this.$post('/api/admin/invite/list')
        this.invites = invites
      }
      catch (e) {
        console.error(e)
      }
    },

    async generate() {
      const trimmed = this.username.trim()
      if (!trimmed) {
        return
      }

      this.busy = true
      this.errorMessage = ''
      try {
        await this.$post('/api/admin/invite/create', { username: trimmed })
        this.username = ''
        await this.refresh()
      }
      catch (e) {
        this.errorMessage = e.response?.data?.message || 'Failed to create invite'
      }
      finally {
        this.busy = false
      }
    },

    async copy(token) {
      try {
        await navigator.clipboard.writeText(this.urlFor(token))
        this.copiedToken = token
        setTimeout(() => {
          if (this.copiedToken === token) {
            this.copiedToken = ''
          }
        }, 1500)
      }
      catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style scoped>
.form-row {
  display: flex;
  gap: .25em;
}

.invite-list {
  display: flex;
  flex-direction: column;
  gap: .5em;
}

.invite-row {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: .5em;
  background: #f8f9fa;
}

.invite-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: .25em;
}

.expires {
  color: #6c757d;
  font-size: .875em;
}

.invite-url-row {
  display: flex;
  gap: .25em;
}

.invite-url {
  font-family: monospace;
  font-size: .85em;
}
</style>
