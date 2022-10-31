<template>
  <Dropdown :text="game.settings.name" class="game-menu">
    <DropdownItem @click="home">home</DropdownItem>
    <DropdownItem @click="next">next</DropdownItem>
    <DropdownDivider />
    <DropdownItem @click="undo">undo</DropdownItem>
    <DropdownDivider />
    <DropdownItem @click="debug">debug</DropdownItem>

    <slot></slot>
  </Dropdown>
</template>


<script>
import axios from 'axios'

import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownItem from '@/components/DropdownItem'

export default {
  name: 'GameMenu',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownItem,
  },

  inject: ['game', 'actor'],

  methods: {
    debug() {
      this.$bvModal.show('debug-modal')
    },

    home() {
      this.$router.push('/')
    },

    async next() {
      const result = await axios.post('/api/user/next', {
        userId: this.actor._id,
        gameId: this.game._id,
      })

      if (result.data.status === 'success') {
        const gameId = result.data.gameId
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
      }

      else {
        console.log(result)
        this.$bvToast.toast('error: see console', {
          autoHideDelay: 999999,
          noCloseButton: false,
          solid: true,
          variant: 'danger',
        })
      }
    },

    undo() {
      this.game.undo()
    }
  },
}
</script>


<style scoped>
.game-menu {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  position: sticky;
  top: 0;
  height: 3em;
  padding: 0 .25em;
  text-align: center;
}
</style>
