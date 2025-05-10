<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="header">

          <Dropdown class="float-start">
            <DropdownRouterLink to="/">home</DropdownRouterLink>
            <DropdownButton @click="nextGame">next game</DropdownButton>

            <DropdownRouterLink to="/lobby/create">new lobby</DropdownRouterLink>
            <DropdownRouterLink to="/data">data</DropdownRouterLink>
            <DropdownDivider/>
            <DropdownRouterLink to="/magic">magic</DropdownRouterLink>
            <DropdownDivider/>
            <DropdownRouterLink to="/admin">admin</DropdownRouterLink>
            <DropdownRouterLink to="/logout">logout</DropdownRouterLink>
          </Dropdown>

          <a href="/" class="link-unstyled">
            <h1>Game Center</h1>
          </a>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownButton from '@/components/DropdownButton'
import DropdownRouterLink from '@/components/DropdownRouterLink'

import modalWrapper from '@/util/modal.js'

export default {
  name: 'Header',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownButton,
    DropdownRouterLink,
  },

  computed: {
    actor() {
      return this.$store.getters['auth/user']
    },
  },

  methods: {
    async nextGame() {
      const { gameId } = await this.$post('/api/user/next', {
        userId: this.actor._id,
        gameId: null,
      })

      if (gameId) {
        if (this.$route.path === `/game/${gameId}`) {
          this.$router.go()
        }
        else {
          this.$router.push(`/game/${gameId}`)
        }
      }
      else {
        this.$router.push('/')
      }
    },
  },
}
</script>

<style scoped>
.header {
  text-align: center;
}

#header-dropdown {
  float: right;
  margin: .5em;
}
</style>
