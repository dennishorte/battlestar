<template>
  <div v-if="isImpersonating" class="impersonation-status alert alert-warning">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <strong>Impersonating:</strong> {{ impersonatedUser.name }}
        <small class="text-muted">(as {{ originalUser.name }})</small>
      </div>
      <button @click="stopImpersonation" class="btn btn-sm btn-outline-danger">
        Stop Impersonation
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImpersonationStatus',

  computed: {
    isImpersonating() {
      return this.$store.getters['auth/isImpersonating']
    },
    originalUser() {
      return this.$store.getters['auth/originalUser']
    },
    impersonatedUser() {
      return this.$store.getters['auth/impersonatedUser']
    },
  },

  methods: {
    async stopImpersonation() {
      if (confirm('Are you sure you want to stop impersonating?')) {
        try {
          await this.$store.dispatch('auth/stopImpersonation')
          // Refresh the page to reload as the original user
          window.location.reload()
        }
        catch (error) {
          alert(`Failed to stop impersonation: ${error.message}`)
        }
      }
    },
  },
}
</script>

<style scoped>
.impersonation-status {
  margin-bottom: 1rem;
  border-left: 4px solid #ffc107;
}
</style>
