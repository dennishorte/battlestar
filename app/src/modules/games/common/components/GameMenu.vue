<template>
  <Dropdown class="game-menu">
    <template #title>{{ game.settings.name }}</template>

    <DropdownButton @click="home" :disabled="disabled.includes('home')">home</DropdownButton>
    <DropdownButton @click="next" :disabled="disabled.includes('next')">next</DropdownButton>
    <DropdownDivider />
    <DropdownButton @click="undo" :disabled="disabled.includes('undo')">undo</DropdownButton>
    <DropdownDivider />
    <DropdownButton @click="debug" :disabled="disabled.includes('debug')">debug</DropdownButton>

    <slot></slot>
  </Dropdown>
</template>


<script>
import axios from 'axios'

import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'GameMenu',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownButton,
  },

  props: {
    disabled: {
      type: Array,
      default: [],
    },
  },

  inject: ['game', 'actor'],

  methods: {
    debug() {
      this.$modal('debug-modal').show()
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
        alert('error: see console')
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

  height: 3em;
  padding: 0 .25em;
  text-align: center;
}
</style>
