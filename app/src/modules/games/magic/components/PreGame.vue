<template>
  <div class="pre-game">
    <GameMenu :disabled="['debug', 'undo']" />

    Pre-Game
  </div>
</template>


<script>
import GameMenu from '@/modules/games/common/components/GameMenu'

export default {
  name: 'PreGame',

  components: {
    GameMenu,
  },

  inject: ['actor', 'game'],
}
</script>


<style scoped>
</style>
