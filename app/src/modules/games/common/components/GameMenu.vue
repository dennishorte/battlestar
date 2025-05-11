<template>
  <div class="menu-wrapper">
    <Dropdown class="game-menu">
      <template #title>{{ game.settings.name }}</template>

      <DropdownButton @click="home" :disabled="disabled.includes('home')">home</DropdownButton>
      <DropdownButton @click="next" :disabled="disabled.includes('next')">next</DropdownButton>
      <DropdownDivider />
      <DropdownButton @click="debug" :disabled="disabled.includes('debug')">debug</DropdownButton>

      <slot/>
    </Dropdown>

    <button v-if="!disabled.includes('undo')" class="btn btn-secondary" @click="undo">undo</button>
  </div>
</template>


<script>
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
      default: () => [],
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
      const { gameId } = await this.$post('/api/user/next', {
        userId: this.actor._id,
        gameId: this.game._id,
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

    undo() {
      const result = this.game.undo()

      if (result === '__NO_MORE_ACTIONS__') {
        alert('There is nothing left to undo')
      }
      else if (result === '__NO_UNDO__') {
        alert('The previous action cannot be undone')
      }
      else if (result !== '__SUCCESS__') {
        alert('Unhandled undo result: ' + result)
      }
    }
  },
}
</script>


<style scoped>
.menu-wrapper {
  display: flex;
  flex-direction: row;
}

.game-menu {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  flex-grow: 2;

  height: 3em;
  padding: 0 .25em;
  text-align: center;
}
</style>
