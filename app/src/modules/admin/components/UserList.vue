<template>
  <div class='user-list'>
    <h3>User List</h3>

    <table class="table table-sm">
      <thead>
        <tr class="table-light">
          <th>_id</th>
          <th>name</th>
          <th>slack</th>
          <th/>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <span class="monospace">
              <span class="text-secondary">{{ user._id.substr(0, user._id.length-3) }}</span>{{ user._id.substr(-3, 3) }}
            </span>
          </td>
          <td>{{ user.name }}</td>
          <td>{{ user.slack }}</td>
          <td>
            <DropdownMenu :notitle="true">
              <DropdownItem v-if="!isImpersonating && user.name !== currentUserName">
                <button @click="impersonate(user)">impersonate</button>
              </DropdownItem>
              <DropdownItem><button @click="clearImpersonation(user)">clear impersonation</button></DropdownItem>
              <DropdownItem><button @click="deactivate(user._id)">deactivate</button></DropdownItem>
              <DropdownItem><button @click="edit(user)">edit</button></DropdownItem>
            </DropdownMenu>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu.vue'
import DropdownItem from '@/components/DropdownItem.vue'

export default {
  name: 'UserList',

  components: {
    DropdownMenu,
    DropdownItem,
  },

  emits: ['users-updated'],

  props: {
    users: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      fields: [
        { key: '_id', label: 'ID', sortable: true },
        { key: 'name', sortable: true },
        { key: 'slack', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
    }
  },

  computed: {
    isImpersonating() {
      return this.$store.getters['auth/isImpersonating']
    },
    currentUserName() {
      return this.$store.getters['auth/user'].name
    },
  },

  methods: {
    async deactivate(id) {
      await this.$post('/api/user/deactivate', { id })
      this.$emit('users-updated')
    },

    edit(user) {
      alert(`Not implemented: Would edit user ${user.name}`)
    },

    async impersonate(user) {
      if (confirm(`Are you sure you want to impersonate ${user.name}?`)) {
        try {
          await this.$store.dispatch('auth/startImpersonation', user._id)
          // No need to reload - the store will handle switching to the impersonated user
        }
        catch (error) {
          const errorData = error.response?.data || {}
          const errorMessage = errorData.message || error.message

          // If user is already being impersonated, offer to clear it
          if (errorData.code === 'ALREADY_IMPERSONATED' || errorMessage.includes('already being impersonated')) {
            if (confirm(`${errorMessage}\n\nWould you like to clear the impersonation now?`)) {
              await this.clearImpersonation(user)
              // After clearing, try impersonating again
              try {
                await this.$store.dispatch('auth/startImpersonation', user._id)
              }
              catch (retryError) {
                alert(`Failed to impersonate after clearing: ${retryError.response?.data?.message || retryError.message}`)
              }
            }
          }
          else {
            alert(`Failed to impersonate user: ${errorMessage}`)
          }
        }
      }
    },

    async clearImpersonation(user) {
      if (confirm(`Are you sure you want to clear impersonation for ${user.name}?`)) {
        try {
          await this.$post('/api/admin/clear-impersonation', {
            targetUserId: user._id
          })
          alert(`Impersonation cleared for ${user.name}`)
          this.$emit('users-updated')
        }
        catch (error) {
          alert(`Failed to clear impersonation: ${error.message}`)
        }
      }
    },
  },
}
</script>

<style>
.monospace {
  font-family: monospace;
}
</style>
